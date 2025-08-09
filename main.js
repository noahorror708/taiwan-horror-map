// 載入 HTML 模板
function loadHTML(url, selector) {
  fetch(url)
    .then(res => res.text())
    .then(html => document.querySelector(selector).innerHTML = html)
    .then(() => {
      if (url === 'header.html') initDrawer();
    });
}

// 初始化 Firebase
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXX",
  authDomain: "taiwan-horror-map-e257d.firebaseapp.com",
  projectId: "taiwan-horror-map-e257d",
};
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 抽屜功能
function initDrawer() {
  const toggleBtn = document.getElementById('drawer-toggle');
  const drawer = document.getElementById('drawer');
  toggleBtn.addEventListener('click', () => {
    drawer.classList.toggle('open');
  });
}

// 北到南縣市排序
const cityOrder = [
  "臺北市", "新北市", "基隆市", "新竹市", "桃園市", "新竹縣", "宜蘭縣",
  "臺中市", "苗栗縣", "彰化縣", "南投縣", "雲林縣",
  "高雄市", "臺南市", "嘉義市", "嘉義縣", "屏東縣", "澎湖縣",
  "花蓮縣", "臺東縣", "金門縣", "連江縣"
];

// 從 Firestore 抓資料
function loadArticles() {
  db.collection("articles")
    .orderBy("timestamp", "desc")
    .get()
    .then(snapshot => {
      const latestContainer = document.getElementById('latest-articles');
      const cityMap = {};

      snapshot.forEach(doc => {
        const data = doc.data();
        const city = cityOrder.find(c => data.locationName.includes(c));
        if (!cityMap[city]) cityMap[city] = [];
        cityMap[city].push(data);

        // 最新文章顯示
        const articleEl = document.createElement('div');
        articleEl.className = 'article-item';
        articleEl.innerHTML = `<a href="article.html?id=${doc.id}">${data.title}</a>`;
        latestContainer.appendChild(articleEl);
      });

      // 建立縣市分類
      const cityListEl = document.getElementById('city-list');
      cityOrder.forEach(city => {
        if (cityMap[city]) {
          const cityHeader = document.createElement('h3');
          cityHeader.textContent = city;
          cityListEl.appendChild(cityHeader);
          cityMap[city].forEach(article => {
            const link = document.createElement('a');
            link.href = `article.html?id=${article.id}`;
            link.textContent = article.title;
            cityListEl.appendChild(link);
          });
        }
      });
    });
}

document.addEventListener("DOMContentLoaded", loadArticles);
