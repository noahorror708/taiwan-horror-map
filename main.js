document.addEventListener("DOMContentLoaded", function () {
  // 初始化 Firebase (v8)
  const firebaseConfig = {
    apiKey: "AIzaSyCK8DBDjoj5pZg3vaGtktVyUuWOPUxDumU",
    authDomain: "taiwan-horror-map-e257d.firebaseapp.com",
    projectId: "taiwan-horror-map-e257d",
  };
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  // Leaflet 地圖
  const map = L.map("map").setView([23.7, 121], 7);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
  }).addTo(map);

  // 漢堡抽屜功能
  const menuToggle = document.getElementById("menu-toggle");
  const cityDrawer = document.getElementById("city-drawer");
  menuToggle.addEventListener("click", () => {
    cityDrawer.classList.toggle("open");
    setTimeout(() => map.invalidateSize(), 300); // 修正地圖顯示
  });

  // 縣市排序
  const cityOrder = [
    "臺北市", "新北市", "基隆市", "新竹市", "桃園市", "新竹縣", "宜蘭縣",
    "臺中市", "苗栗縣", "彰化縣", "南投縣", "雲林縣",
    "高雄市", "臺南市", "嘉義市", "嘉義縣", "屏東縣", "澎湖縣",
    "花蓮縣", "臺東縣", "金門縣", "連江縣"
  ];

  // 讀取 Firestore
  db.collection("articles").orderBy("timestamp", "desc").get().then(snapshot => {
    const cityMap = {};

    snapshot.forEach(doc => {
      const data = doc.data();

      // 地圖標記
      if (data.coordinates) {
        const marker = L.marker(data.coordinates).addTo(map);
        L.circle(data.coordinates, {
          radius: 500,
          color: "red",
          fillColor: "#f03",
          fillOpacity: 0.3
        }).addTo(map);
        marker.bindPopup(`<b>${data.title}</b><br>${data.locationName || ""}`);
      }

      // 城市 + 區域分類
      if (data.locationName) {
        const city = cityOrder.find(c => data.locationName.startsWith(c));
        if (city) {
          if (!cityMap[city]) cityMap[city] = { __count: 0, __districts: {} };
          cityMap[city].__count++;

          // 區域名稱處理
          let district = data.locationName.replace(city, "").trim();
          if (!district) district = "未分類區";

          if (!cityMap[city].__districts[district]) {
            cityMap[city].__districts[district] = [];
          }
          cityMap[city].__districts[district].push({ title: data.title, id: doc.id });
        }
      }
    });

    // 抽屜城市清單
    const cityListEl = document.getElementById("city-list");
    cityOrder.forEach(city => {
      if (cityMap[city]) {
        const cityData = cityMap[city];
        const li = document.createElement("li");

        // 縣市名稱 + 投稿數量
        const cityHeader = document.createElement("div");
        cityHeader.textContent = `${city} (${cityData.__count})`;
        cityHeader.style.cursor = "pointer";
        cityHeader.style.fontWeight = "bold";
        li.appendChild(cityHeader);

        // 區域清單 (預設隱藏)
        const ulDistrict = document.createElement("ul");
        ulDistrict.style.display = "none";

        for (const district in cityData.__districts) {
          const districtData = cityData.__districts[district];
          const dli = document.createElement("li");

          // 區名 + 數量
          const districtHeader = document.createElement("div");
          districtHeader.textContent = `${district} (${districtData.length})`;
          districtHeader.style.cursor = "pointer";
          districtHeader.style.marginLeft = "10px";
          dli.appendChild(districtHeader);

          // 文章清單 (預設隱藏)
          const ulArticles = document.createElement("ul");
          ulArticles.style.display = "none";
          ulArticles.style.marginLeft = "20px";

          districtData.forEach(article => {
            const ali = document.createElement("li");
            const a = document.createElement("a");
            a.textContent = article.title;
            a.href = `article.html?id=${article.id}`;
            ali.appendChild(a);
            ulArticles.appendChild(ali);
          });

          // 區手風琴切換
          districtHeader.addEventListener("click", () => {
            ulArticles.style.display = ulArticles.style.display === "none" ? "block" : "none";
          });

          dli.appendChild(ulArticles);
          ulDistrict.appendChild(dli);
        }

        // 縣市手風琴切換
        cityHeader.addEventListener("click", () => {
          ulDistrict.style.display = ulDistrict.style.display === "none" ? "block" : "none";
        });

        li.appendChild(ulDistrict);
        cityListEl.appendChild(li);
      }
    });
  });
});
