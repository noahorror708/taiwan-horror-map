// 載入 header 和 footer
document.addEventListener("DOMContentLoaded", () => {
  fetch("header.html")
    .then(res => res.text())
    .then(data => document.body.insertAdjacentHTML("afterbegin", data));

  fetch("footer.html")
    .then(res => res.text())
    .then(data => document.body.insertAdjacentHTML("beforeend", data));
});

// 訪問統計
fetch('https://api.countapi.xyz/hit/taiwan-horror-map/views')
  .then(res => res.json())
  .then(data => {
    const el = document.getElementById("viewCount");
    if (el) el.innerText = data.value;
  });
