function cleanChapter() {
    let html = document.getElementById("chapterInput").value;
    let text = html.replace(/<[^>]*>/g, "\n") // bỏ thẻ HTML
        .replace(/\n\s*\n+/g, "\n\n") // gom dòng trống
        .trim();
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
