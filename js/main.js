// 載入 header & footer
async function loadPart(id, file) {
  try {
    const res = await fetch(file);
    const html = await res.text();
    document.getElementById(id).innerHTML = html;
  } catch (e) {
    console.error(`載入 ${file} 失敗`, e);
  }
}

loadPart("header", "header.html");
loadPart("footer", "footer.html");

// --- 以下是原本 main.js 內容 ---
const NAMESPACE = "taiwan-horror-map";
const today = new Date();
const todayKey = `${today.getFullYear()}${today.getMonth()+1}${today.getDate()}`;

// 訪客累積
fetch(`https://api.countapi.xyz/hit/${NAMESPACE}/totalVisitors`)
  .then(r => r.json())
  .then(d => document.getElementById("totalCount").innerText = d.value);

// 今日訪客
fetch(`https://api.countapi.xyz/hit/${NAMESPACE}/visitors_${todayKey}`)
  .then(r => r.json())
  .then(d => document.getElementById("todayCount").innerText = d.value);

// 動態讀取文章列表 + 分地區
async function loadArticles() {
  let posts = [];
  try {
    const res = await fetch("posts.json");
    posts = await res.json();
  } catch(e) {
    console.error("讀取 posts.json 失敗", e);
  }

  // 分組
  const grouped = {};
  posts.forEach(post => {
    if (!grouped[post.region]) grouped[post.region] = [];
    grouped[post.region].push(post);
  });

  const container = document.getElementById("articleList");
  container.innerHTML = "";

  Object.keys(grouped).forEach(region => {
    const h3 = document.createElement("h3");
    h3.textContent = region;
    container.appendChild(h3);

    const ul = document.createElement("ul");
    grouped[region].forEach(p => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="${p.url}" target="_blank">${p.title}</a>`;
      ul.appendChild(li);
    });
    container.appendChild(ul);
  });

  // 熱門排行
  loadRanking(posts);
}

async function loadRanking(posts) {
  let results = [];
  for (let post of posts) {
    let res = await fetch(`https://api.countapi.xyz/get/${NAMESPACE}/${post.id}_${todayKey}`)
      .then(r => r.json()).catch(() => null);
    results.push({
      title: post.title,
      url: post.url,
      count: res && res.value ? res.value : 0
    });
  }
  results.sort((a, b) => b.count - a.count);
  const top3 = results.slice(0, 3);
  const list = document.getElementById("ranking");
  list.innerHTML = "";
  top3.forEach(p => {
    let li = document.createElement("li");
    li.innerHTML = `<a href="${p.url}" target="_blank">${p.title}</a> - ${p.count} 次觀看`;
    list.appendChild(li);
  });
}

loadArticles();

// 回到頂端按鈕
const btn = document.getElementById("backToTop");
window.onscroll = () => {
  if (document.documentElement.scrollTop > 200) {
    btn.style.display = "block";
  } else {
    btn.style.display = "none";
  }
};
btn.onclick = () => window.scrollTo({top:0, behavior:"smooth"});
