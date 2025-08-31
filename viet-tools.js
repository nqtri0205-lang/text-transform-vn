/* viet-tools.js - xử lý từng dòng và copy từng dòng khi click */

function removeVietnameseTones(str) {
  return str.normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d").replace(/Đ/g, "D");
}

/* fallback copy nếu navigator.clipboard không hỗ trợ */
function copyTextToClipboard(text) {
  if (!text && text !== "") return Promise.resolve();
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }
  // fallback: textarea + execCommand
  return new Promise((resolve, reject) => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      resolve();
    } catch (err) {
      reject(err);
    } finally {
      ta.remove();
    }
  });
}

/* render mỗi dòng thành một `.result-line` riêng trong container */
function renderLinesInto(containerId, lines) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = ''; // clear
  lines.forEach((line, i) => {
    const row = document.createElement('div');
    row.className = 'result-line';
    row.tabIndex = 0;              // để có thể focus + Enter
    row.dataset.text = line;       // lưu text để copy
    row.textContent = line === '' ? '\u00A0' : line; // preserve height nếu rỗng
    row.title = 'Click hoặc nhấn Enter để copy dòng này';
    container.appendChild(row);
  });
}

/* xử lý input per-line */
function processVietnamese() {
  const input = document.getElementById("vietInput").value;
  const lines = input.split(/\r?\n/); // giữ từng dòng

  // 1) Viết HOA toàn bộ (mỗi dòng)
  const upperLines = lines.map(l => l.toUpperCase());
  renderLinesInto('vietUpper', upperLines);

  // 2) Hoa chữ cái đầu mỗi từ (per-line)
  const titleLines = lines.map(line =>
    line.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
  );
  renderLinesInto('vietTitle', titleLines);

  // 3) Thường + không dấu + không khoảng trắng (per-line)
  const noAccentLines = lines.map(line =>
    removeVietnameseTones(line).toLowerCase().replace(/\s+/g, '')
  );
  renderLinesInto('vietNoAccent', noAccentLines);
}

/* Delegation: click vào một .result-line => copy đúng dòng đó */
document.addEventListener('click', (e) => {
  const el = e.target.closest('.result-line');
  if (!el) return;
  const txt = el.dataset.text ?? '';
  copyTextToClipboard(txt).then(() => showToast('📋 Đã copy dòng'), () => showToast('❌ Copy thất bại'));
});

/* Hỗ trợ nhấn Enter khi focus vào dòng */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && document.activeElement && document.activeElement.classList.contains('result-line')) {
    const txt = document.activeElement.dataset.text ?? '';
    copyTextToClipboard(txt).then(() => showToast('📋 Đã copy dòng'), () => showToast('❌ Copy thất bại'));
  }
});

/* Toast nhẹ hiển thị ở góc (tạo DOM nếu chưa có) */
function showToast(message, duration = 1400) {
  let toast = document.getElementById('vt-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'vt-toast';
    toast.className = 'vt-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), duration);
}
