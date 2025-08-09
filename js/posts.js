// Firebase 初始化
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBml-6f_zdAQQil96A-2QkuXv-M2hwcZnI",
  authDomain: "maptest-f6f6c.firebaseapp.com",
  projectId: "maptest-f6f6c",
  storageBucket: "maptest-f6f6c.appspot.com",
  messagingSenderId: "44071789693",
  appId: "1:44071789693:web:fd28bdbd62a71938e8b56e",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM 元素
const latestPostsEl = document.getElementById("latestPosts");
const postListView = document.getElementById("postListView");
const postDetailView = document.getElementById("postDetailView");
const postDetailContent = document.getElementById("postDetailContent");
const currentPostTitle = document.getElementById("currentPostTitle");
const searchBox = document.getElementById("searchBox");

// 回到列表並重新載入最新文章
window.goBack = function () {
  postDetailView.style.display = "none";
  postListView.style.display = "block";
  loadLatestPosts();

  const latestEl = document.getElementById("latest");
  if (latestEl) {
    latestEl.scrollIntoView({ behavior: 'smooth' });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

// 載入最新文章
async function loadLatestPosts() {
  latestPostsEl.innerHTML = "<p>⏳ 載入中...</p>";
  const q = query(collection(db, "posts"), orderBy("timestamp", "desc"), limit(10));
  const querySnapshot = await getDocs(q);

  latestPostsEl.innerHTML = "";
  querySnapshot.forEach(docSnap => {
    const data = docSnap.data();
    const card = document.createElement("div");
    card.className = "postCard";
    card.innerHTML = `
      <h3>${data.title}</h3>
      <p>${data.content.substring(0, 80)}...</p>
      <button onclick="viewPost('${docSnap.id}')">閱讀更多</button>
    `;
    latestPostsEl.appendChild(card);
  });
}

// 顯示單篇文章
window.viewPost = async function (id) {
  const docRef = doc(db, "posts", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    currentPostTitle.textContent = data.title;
    postDetailContent.innerHTML = `<h2>${data.title}</h2><p>${data.content}</p>`;
    postListView.style.display = "none";
    postDetailView.style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

// 搜尋文章
searchBox.addEventListener("input", async () => {
  const keyword = searchBox.value.trim();
  if (!keyword) return loadLatestPosts();

  latestPostsEl.innerHTML = "<p>⏳ 搜尋中...</p>";
  const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
  const querySnapshot = await getDocs(q);

  latestPostsEl.innerHTML = "";
  querySnapshot.forEach(docSnap => {
    const data = docSnap.data();
    if (data.title.includes(keyword) || data.content.includes(keyword)) {
      const card = document.createElement("div");
      card.className = "postCard";
      card.innerHTML = `
        <h3>${data.title}</h3>
        <p>${data.content.substring(0, 80)}...</p>
        <button onclick="viewPost('${docSnap.id}')">閱讀更多</button>
      `;
      latestPostsEl.appendChild(card);
    }
  });
});

// 頁面載入後執行
window.addEventListener("load", loadLatestPosts);
