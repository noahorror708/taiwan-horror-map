// 初始化 Leaflet 地圖
const map = L.map('map').setView([23.6978, 120.9605], 8); // 台灣中心點

// 載入 OpenStreetMap 圖磚
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap 貢獻者'
}).addTo(map);

// TODO: 這裡可以改成從 Firestore 讀取地點資料
// 範例：先放一個 marker
L.marker([25.0330, 121.5654]).addTo(map)
  .bindPopup('台北 101<br>恐怖事件範例')
  .openPopup();
