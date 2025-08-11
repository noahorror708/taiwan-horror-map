// 搜尋文章
document.addEventListener('DOMContentLoaded', async () => {
  const posts = await fetch('data/posts.json').then(r=>r.json());

  // 最新文章
  const latest = [...posts].sort((a,b)=> new Date(b.date) - new Date(a.date)).slice(0,5);
  const list = document.getElementById('latest-posts-list');
  latest.forEach(p => {
    const li = document.createElement('li');
    li.innerHTML = `<a href="${p.file}">${p.title}</a>`;
    list.appendChild(li);
  });

  // 搜尋功能
  document.getElementById('search-input').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    list.innerHTML = '';
    posts.filter(p => p.title.toLowerCase().includes(q))
      .forEach(p => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="${p.file}">${p.title}</a>`;
        list.appendChild(li);
      });
  });
});
