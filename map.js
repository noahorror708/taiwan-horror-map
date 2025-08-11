// 初始化地圖
const map = L.map('map').setView([23.6978, 120.9605], 8);

// 加載地圖圖層（OpenStreetMap）
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// 從 posts.json 讀取資料
fetch('posts.json')
  .then(res => res.json())
  .then(posts => {
    posts.forEach(post => {
      // 原始經緯度
      const lat = post.lat;
      const lng = post.lng;

      // 模糊處理 (±500公尺)
      const offsetLat = (Math.random() - 0.5) * 0.009; // 約±500公尺
      const offsetLng = (Math.random() - 0.5) * 0.009;

      const blurredLat = lat + offsetLat;
      const blurredLng = lng + offsetLng;

      // 標記
      const marker = L.marker([blurredLat, blurredLng])
        .addTo(map)
        .bindPopup(`<b>${post.title}</b><br>${post.description}`);

      // 加入周邊記事
      const noteList = document.getElementById('note-list');
      const noteItem = document.createElement('div');
      noteItem.className = 'note';
      noteItem.innerHTML = `<strong>${post.title}</strong> - ${post.description}`;
      noteList.appendChild(noteItem);
    });
  })
  .catch(err => console.error('讀取 posts.json 失敗', err));
