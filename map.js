// 500 公尺隨機偏移 (經緯度換算)
function addRandomOffset(lat, lng) {
  const earthRadius = 6378137; // 地球半徑 (m)
  const dLat = (Math.random() - 0.5) * (1000 / earthRadius); // ±500m
  const dLng = (Math.random() - 0.5) * (1000 / (earthRadius * Math.cos((lat * Math.PI) / 180)));
  return {
    lat: lat + (dLat * 180) / Math.PI,
    lng: lng + (dLng * 180) / Math.PI
  };
}

// 全域變數
let map;

function initMap() {
  const taiwan = { lat: 23.6978, lng: 120.9605 };
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 7,
    center: taiwan,
  });

  // 讀取文章資料並加標記
  fetch("posts.json")
    .then(res => res.json())
    .then(posts => {
      posts.forEach(post => {
        if (!post.lat || !post.lng) return;

        // 模糊位置
        const blurred = addRandomOffset(post.lat, post.lng);

        const marker = new google.maps.Marker({
          position: blurred,
          map: map,
          title: post.title
        });

        const info = new google.maps.InfoWindow({
          content: `<h3>${post.title}</h3><p>${post.desc || ""}</p>`
        });

        marker.addListener("click", () => info.open(map, marker));

        // 周邊記事
        if (post.nearby && Array.isArray(post.nearby)) {
          post.nearby.forEach(nb => {
            const nbBlurred = addRandomOffset(nb.lat, nb.lng);
            new google.maps.Marker({
              position: nbBlurred,
              map: map,
              icon: {
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
              },
              title: nb.title
            });
          });
        }
      });
    })
    .catch(err => console.error("讀取 posts.json 失敗", err));
}
