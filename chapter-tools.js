function cleanChapter() {
    let html = document.getElementById("chapterInput").value;

    // 1. Xóa toàn bộ <script>...</script> và các đoạn new Image().src
    html = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
    html = html.replace(/new Image\(\)\.src\s*=\s*".*?";/g, "");

    // 2. Bỏ tất cả thẻ HTML còn lại
    let text = html.replace(/<[^>]*>/g, "\n");

    // 3. Gom dòng trống, trim gọn
    text = text.replace(/\n\s*\n+/g, "\n\n").trim();

    // 4. Xuất ra màn hình
    document.getElementById("chapterOutput").innerText = text;
} 
function copyChapter() {
    let output = document.getElementById("chapterOutput").innerText;
    if (!output.trim()) {
        showToast("Không có nội dung để sao chép");
        return;
    }
    navigator.clipboard.writeText(output).then(() => {
        showToast("Đã sao chép nội dung");
    });
}

function downloadChapter() {
    let text = document.getElementById("chapterOutput").innerText;
    if (!text.trim()) {
        showToast("Không có nội dung để tải");
        return;
    }
    let blob = new Blob([text], { type: "text/plain" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "chapter.txt";
    link.click();
    showToast("Đã tải xuống file .txt");
}

function printChapter() {
    let text = document.getElementById("chapterOutput").innerHTML;
    if (!text.trim()) {
        showToast("Không có nội dung để in");
        return;
    }
    let printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`<pre>${text}</pre>`);
    printWindow.document.close();
    printWindow.print();
    showToast("Đã gửi lệnh in");
}

