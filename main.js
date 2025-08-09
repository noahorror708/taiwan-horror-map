// ===================== Firebase 初始化 =====================
const firebaseConfig = {
  apiKey: "AIzaSyCK8DBDjoj5pZg3vaGtktVyUuWOPUxDumU",
  authDomain: "taiwan-horror-map-e257d.firebaseapp.com",
  projectId: "taiwan-horror-map-e257d",
  storageBucket: "taiwan-horror-map-e257d.firebasestorage.app",
  messagingSenderId: "59145752144",
  appId: "1:59145752144:web:1f6ccc6fecd280defc8b55"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ===================== 地圖初始化 =====================
let map = L.map("map").setView([23.5, 121], 7);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap 貢獻者"
}).addTo(map);

// ===================== 抽屜控制 =====================
const menuToggle = document.getElementById("menu-toggle");
const cityDrawer = document.getElementById("city-drawer");

// 建立背景遮罩
const backdrop = document.createElement("div");
backdrop.classList.add("drawer-backdrop");
document.body.appendChild(backdrop);

menuToggle.addEventListener("click", () => {
  cityDrawer.classList.toggle("open");
  backdrop.classList.toggle("show");
});

backdrop.addEventListener("click", () => {
  cityDrawer.classList.remove("open");
  backdrop.classList.remove("show");
});

// ===================== 讀取最新文章 =====================
async function loadLatestArticles() {
  const latestList = document.getElementById("latest-articles");
  latestList.innerHTML = "<li>載入中...</li>";

  try {
    const snapshot = await db.collection("posts")
      .orderBy("createdAt", "desc")
      .limit(5)
      .get();

    latestList.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      const li = document.createElement("li");
      li.innerHTML = `<a href="post.html?id=${doc.id}">${data.title || "未命名文章"}</a>`;
      latestList.appendChild(li);
    });
  } catch (error) {
    latestList.innerHTML = `<li>讀取失敗：${error.message}</li>`;
  }
}

// ===================== 讀取地圖標記 =====================
async function loadMapMarkers() {
  try {
    const snapshot = await db.collection("posts").get();
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.lat && data.lng) {
        L.marker([data.lat, data.lng])
          .addTo(map)
          .bindPopup(`<b>${data.title}</b><br>${data.locationName}`);
      }
    });
  } catch (error) {
    console.error("載入地圖標記失敗：", error);
  }
}

// ===================== 啟動 =====================
document.addEventListener("DOMContentLoaded", () => {
  loadLatestArticles();
  loadMapMarkers();
});
