// ===== 載入 header 與 footer =====
Promise.all([
  fetch("header.html").then(res => res.text()),
  fetch("footer.html").then(res => res.text())
]).then(([headerHTML, footerHTML]) => {
  document.getElementById("header").innerHTML = headerHTML;
  document.getElementById("footer").innerHTML = footerHTML;

  // 初始化主程式
  initApp();
});

// ===== 主程式 =====
function initApp() {
  // ===== Firebase 初始化 =====
  const firebaseConfig = {
    apiKey: "AIzaSyCK8DBDjoj5pZg3vaGtktVyUuWOPUxDumU",
    authDomain: "taiwan-horror-map-e257d.firebaseapp.com",
    projectId: "taiwan-horror-map-e257d",
  };
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  // ===== Leaflet 地圖 =====
  const map = L.map("map").setView([23.7, 121], 7);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
  }).addTo(map);

  // ===== 縣市順序 =====
  const cityOrder = [
    "臺北市", "新北市", "基隆市", "新竹市", "桃園市", "新竹縣", "宜蘭縣",
    "臺中市", "苗栗縣", "彰化縣", "南投縣", "雲林縣",
    "高雄市", "臺南市", "嘉義市", "嘉義縣", "屏東縣", "澎湖縣",
    "花蓮縣", "臺東縣", "金門縣", "連江縣"
  ];

  // ===== 從 Firestore 抓資料 =====
  db.collection("articles").orderBy("timestamp", "desc").get().then(snapshot => {
    const latestList = document.getElementById("latest-articles");
    const cityMap = {};

    snapshot.forEach(doc => {
      const data = doc.data();

      // 最新文章清單
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.textContent = data.title;
      a.href = `article.html?id=${doc.id}`;
      li.appendChild(a);
      latestList.appendChild(li);

      // 地圖標記 + 半徑
      if (data.coordinates) {
        const marker = L.marker(data.coordinates).addTo(map);
        L.circle(data.coordinates, {
          radius: 500,
          color: "red",
          fillColor: "#f03",
          fillOpacity: 0.3
        }).addTo(map);
        marker.bindPopup(`<b>${data.title}</b><br>${data.locationName}`);
      }

      // 按縣市分類
      if (data.locationName) {
        const city = cityOrder.find(c => data.locationName.startsWith(c));
        if (city) {
          if (!cityMap[city]) cityMap[city] = [];
          cityMap[city].push({ title: data.title, id: doc.id });
        }
      }
    });

    // 產生抽屜縣市清單
    const cityListEl = document.getElementById("city-list");
    cityOrder.forEach(city => {
      if (cityMap[city]) {
        const li = document.createElement("li");
        li.textContent = city;
        const ul = document.createElement("ul");
        cityMap[city].forEach(article => {
          const ali = document.createElement("li");
          const a = document.createElement("a");
          a.textContent = article.title;
          a.href = `article.html?id=${article.id}`;
          ali.appendChild(a);
          ul.appendChild(ali);
        });
        li.appendChild(ul);
        cityListEl.appendChild(li);
      }
    });
  });

  // ===== 漢堡抽屜控制 =====
  const menuToggle = document.getElementById("menu-toggle");
  const cityDrawer = document.getElementById("city-drawer");
  menuToggle.addEventListener("click", () => {
    cityDrawer.classList.toggle("open");
  });
}

/*
  ===== CSS 提醒 =====
  - 想要背景黑色，在 style.css 加上：
    body {
      background-color: black;
      color: white; /* 讓文字可見 */
    }
*/
