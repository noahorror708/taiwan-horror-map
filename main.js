document.addEventListener("DOMContentLoaded", () => {
  // 載入 header & footer
  fetch("header.html").then(res => res.text()).then(html => {
    document.getElementById("header-container").innerHTML = html;
    document.getElementById("site-title").addEventListener("click", () => {
      location.href = "index.html";
    });
  });
  fetch("footer.html").then(res => res.text()).then(html => {
    document.getElementById("footer-container").innerHTML = html;
  });

  // 麵包屑點擊
  document.getElementById("breadcrumb-home").addEventListener("click", (e) => {
    e.preventDefault();
    showLatestPosts();
  });

  // 初始化地圖
  const map = L.map("map").setView([23.5, 121], 7);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19
  }).addTo(map);

  // 假資料（之後可改 Firestore 撈）
  const posts = [
    { title: "鬼屋事件", location: "台北市", lat: 25.03, lng: 121.56, content: "故事內容..." },
    { title: "山中怪聲", location: "南投縣", lat: 23.96, lng: 120.97, content: "故事內容..." }
  ];

  // 加 marker & 500m 半徑
  posts.forEach(post => {
    const marker = L.marker([post.lat, post.lng]).addTo(map);
    const circle = L.circle([post.lat, post.lng], { radius: 500, color: "red", fillOpacity: 0.2 }).addTo(map);
    marker.on("click", () => {
      showPostDetail(post);
      map.setView([post.lat, post.lng], 15);
    });
  });

  // 顯示最新文章清單
  function showLatestPosts() {
    document.getElementById("post-detail").classList.add("hidden");
    const listEl = document.getElementById("latestList");
    listEl.innerHTML = "";
    posts.forEach(post => {
      const div = document.createElement("div");
      div.textContent = `${post.title} - ${post.location}`;
      div.addEventListener("click", () => {
        showPostDetail(post);
        map.setView([post.lat, post.lng], 15);
      });
      listEl.appendChild(div);
    });
  }

  // 顯示單篇文章
  function showPostDetail(post) {
    document.getElementById("post-detail").classList.remove("hidden");
    document.getElementById("detail-title").textContent = post.title;
    document.getElementById("detail-location").textContent = post.location;
    document.getElementById("detail-body").textContent = post.content;

    document.getElementById("post-breadcrumb").innerHTML = `
      <a href="#" id="breadcrumb-latest">最新文章</a> &gt; ${post.title}
    `;
    document.getElementById("breadcrumb-latest").addEventListener("click", (e) => {
      e.preventDefault();
      showLatestPosts();
    });
  }

  showLatestPosts();
});
