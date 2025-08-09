// 載入 header & footer
fetch("header.html").then(res => res.text()).then(html => {
  document.getElementById("header").innerHTML = html;
  document.getElementById("siteTitle").onclick = () => location.reload();
  document.getElementById("homeLink").onclick = () => showLatest();
});
fetch("footer.html").then(res => res.text()).then(html => {
  document.getElementById("footer").innerHTML = html;
});

// 初始化 Firebase
firebase.initializeApp({
  apiKey: "AIzaSy....", // 你的 API Key
  authDomain: "taiwan-horror-map-e257d.firebaseapp.com",
  projectId: "taiwan-horror-map-e257d"
});
const db = firebase.firestore();

// Leaflet 地圖
const map = L.map("map").setView([23.6978, 120.9605], 8);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

let markers = [];

// 顯示最新文章
function showLatest() {
  document.getElementById("breadcrumb").innerHTML = `<a href="#latest">最新文章</a>`;
  document.getElementById("content").innerHTML = `<h2>最新文章</h2><ul id="postList"></ul>`;
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  db.collection("posts").orderBy("createdAt", "desc").get().then(snapshot => {
    const list = document.getElementById("postList");
    snapshot.forEach(doc => {
      const post = doc.data();
      const li = document.createElement("li");
      li.textContent = post.title;
      li.onclick = () => showPost(post);
      list.appendChild(li);

      // 標記點位 + 半徑
      const marker = L.marker(post.coordinates).addTo(map);
      const circle = L.circle(post.coordinates, {
        radius: 500,
        color: "red",
        fillColor: "#f03",
        fillOpacity: 0.2
      }).addTo(map);
      markers.push(marker, circle);
    });
  });
}

// 顯示單篇文章
function showPost(post) {
  document.getElementById("breadcrumb").innerHTML =
    `<a href="#latest" onclick="showLatest()">最新文章</a> > ${post.title}`;
  document.getElementById("content").innerHTML = `
    <h2>${post.title}</h2>
    <p><em>${post.locationName}</em></p>
    <p>${post.content}</p>
  `;

  markers.forEach(m => map.removeLayer(m));
  markers = [];

  const marker = L.marker(post.coordinates).addTo(map);
  const circle = L.circle(post.coordinates, {
    radius: 500,
    color: "red",
    fillColor: "#f03",
    fillOpacity: 0.2
  }).addTo(map);
  markers.push(marker, circle);
  map.setView(post.coordinates, 15);
}

showLatest();
