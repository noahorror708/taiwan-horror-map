// Firestore REST API 設定
const PROJECT_ID = "你的專案ID";
const COLLECTION = "posts";
const API_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}`;

// 頁面初始化
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("articleList")) {
    loadLatestArticles();
  }
  if (document.getElementById("map")) {
    initMap();
  }
});

// 載入最新文章
function loadLatestArticles() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      const listContainer = document.getElementById("articleList");
      listContainer.innerHTML = "";

      if (!data.documents) {
        listContainer.innerHTML = "<p>目前沒有文章。</p>";
        return;
      }

      data.documents.forEach(doc => {
        const fields = doc.fields;
        const card = document.createElement("div");
        card.className = "article-card";
        card.innerHTML = `
          <h3>${fields.title.stringValue}</h3>
          <p>${fields.locationName.stringValue}</p>
        `;
        card.addEventListener("click", () => {
          showArticle(fields);
        });
        listContainer.appendChild(card);
      });
    })
    .catch(err => {
      console.error(err);
    });
}

// 顯示單篇文章
function showArticle(fields) {
  const listContainer = document.getElementById("articleList");
  listContainer.innerHTML = `
    <div class="breadcrumb">
      <a href="#" onclick="loadLatestArticles(); return false;">最新文章</a> &gt; ${fields.title.stringValue}
    </div>
    <h2>${fields.title.stringValue}</h2>
    <p><em>${fields.locationName.stringValue}</em></p>
    <p>${fields.content.stringValue}</p>
    <div id="map"></div>
  `;

  // 初始化地圖並顯示範圍
  setTimeout(() => {
    in
