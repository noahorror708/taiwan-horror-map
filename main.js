import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCK8DBDjoj5pZg3vaGtktVyUuWOPUxDumU",
  authDomain: "taiwan-horror-map-e257d.firebaseapp.com",
  projectId: "taiwan-horror-map-e257d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loadPosts() {
  const snap = await getDocs(collection(db, "posts"));
  let groups = {};
  let allPosts = [];

  snap.forEach(doc => {
    const data = doc.data();
    let region = data.locationName || "未分類";
    if (!groups[region]) groups[region] = [];
    groups[region].push({ id: doc.id, ...data });
    allPosts.push({ id: doc.id, ...data });
  });

  renderSidebar(groups);
  renderLatest(allPosts);
}

function renderSidebar(groups) {
  const sidebar = document.getElementById("sidebar");
  sidebar.innerHTML = `
    <input type="text" id="searchBox" placeholder="搜尋文章...">
    <button onclick="window.location.href='submit.html'">✍️ 我要投稿</button>
  `;

  for (let region in groups) {
    let h3 = document.createElement("h3");
    h3.innerText = region;
    sidebar.appendChild(h3);

    let ul = document.createElement("ul");
    groups[region].forEach(post => {
      let li = document.createElement("li");
      let a = document.createElement("a");
      a.innerText = post.title;
      a.href = "#";
      a.onclick = () => showPost(post);
      li.appendChild(a);
      ul.appendChild(li);
    });
    sidebar.appendChild(ul);
  }

  document.getElementById("searchBox").addEventListener("input", e => {
    const keyword = e.target.value.toLowerCase();
    const links = sidebar.querySelectorAll("a");
    links.forEach(link => {
      link.style.display = link.innerText.toLowerCase().includes(keyword) ? "block" : "none";
    });
  });
}

function renderLatest(posts) {
  posts.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  const latest = posts.slice(0,3);
  const latestDiv = document.getElementById("latestPosts");
  latestDiv.innerHTML = "";

  latest.forEach(post => {
    let card = document.createElement("div");
    card.className = "postCard";
    card.style.cursor = "pointer";
    card.innerHTML = `<h3>${post.title}</h3><p>${post.content.substring(0,100)}...</p>`;
    card.onclick = () => showPost(post);
    latestDiv.appendChild(card);
  });
}

function showPost(post) {
  document.getElementById("postListView").style.display = "none";
  document.getElementById("postDetailView").style.display = "block";
  document.getElementById("currentPostTitle").innerText = post.title;

  const detail = document.getElementById("postDetailContent");
  detail.innerHTML = `
    <div class="postCard">
      <h3>${post.title}</h3>
      <p>${post.content}</p>
      <p><b>地點：</b>${post.locationName}</p>
    </div>
  `;

  if (post.coordinates) {
    let pos = {
      lat: post.coordinates.latitude,
      lng: post.coordinates.longitude
    };
    map.setCenter(pos);
    map.setZoom(14);
    new google.maps.Marker({ position: pos, map: map, title: post.title });
  } else {
    alert("此文章尚未提供座標");
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goBack() {
  document.getElementById("postDetailView").style.display = "none";
  document.getElementById("postListView").style.display = "block";
  document.getElementById("map").scrollIntoView({ behavior: 'smooth' });
}

loadPosts();

// 讓 goBack 在全域可用
window.goBack = goBack;
