// js/common.js
async function loadHTML(id, file) {
  try {
    const res = await fetch(file);
    const text = await res.text();
    document.getElementById(id).innerHTML = text;
  } catch (err) {
    console.error(`載入 ${file} 失敗`, err);
  }
}

// 頁面載入後執行
document.addEventListener("DOMContentLoaded", () => {
  loadHTML("header", "header.html");
  loadHTML("footer", "footer.html");
});
