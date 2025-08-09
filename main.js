// Firestore REST API 設定
const PROJECT_ID = "你的專案ID";
const COLLECTION = "posts";
const API_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}`;

// Leaflet 地圖初始化
let map = L.map('map').setView([23.6978, 120.9605], 8);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

let markers = [];

// 讀取文章列表
async function fetchPosts() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    if (!data.documents) return;

    const listContainer = document.querySelector(".article-list");
    listContainer.innerHTML = "";

    data.documents.forEach(doc => {
      const fields = doc.fields;
      const item = document.createElement("div");
      item.className = "article-item";
      item.innerHTML = `
        <div class="article-title">${fields.title.stringValue}</div>
        <div class="article-location">${fields.locationName.stringValue}</div>
      `;
      item.addEventListener("click", () => showArticle(fields));
      listContainer.appendChild(item);

      // 標記地圖範圍（500m 半徑）
      const coords = fields.coordinates.geoPointValue;
      const lat = coords.latitude;
      const lng = coords.longitude;

      const circle = L.circle([lat, lng], {
        color: '#ff4444',
        fillColor: '#ff6666',
        fillOpacity: 0.3,
        radius: 500
      }).addTo(map);

      markers.push(circle);
    });
  } catch (err) {
    console.error("讀取文章錯誤：", err);
  }
}

// 顯示文章內容
function showArticle(fields) {
  document.querySelector(".article-list").style.display = "none";
  const articleContainer = document.querySelec
