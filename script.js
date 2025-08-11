// 初始化 Google Map
function initMap() {
  const taiwan = { lat: 23.6978, lng: 120.9605 };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 7,
    center: taiwan,
  });

  // 範例標記
  new google.maps.Marker({
    position: { lat: 25.1276, lng: 121.7392 },
    map,
    title: "基隆鬼屋"
  });

  new google.maps.Marker({
    position: { lat: 22.9970, lng: 120.2026 },
    map,
    title: "台南赤崁樓"
  });
}

// 簡單的瀏覽次數計數器 (localStorage 模擬)
document.addEventListener("DOMContentLoaded", () => {
  let count = localStorage.getItem("viewCount") || 0;
  count++;
  localStorage.setItem("viewCount", count);
  document.getElementById("view-counter").textContent = `本站瀏覽次數：${count}`;
});
