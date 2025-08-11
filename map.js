// 500 公尺模糊處理
function addLocationNoise(lat, lng, meters = 500) {
  const earthRadius = 6378137; // 地球半徑（公尺）
  const dLat = (Math.random() - 0.5) * 2 * meters / earthRadius;
  const dLng = (Math.random() - 0.5) * 2 * meters / (earthRadius * Math.cos(Math.PI * lat / 180));
  const newLat = lat + (dLat * 180 / Math.PI);
  const newLng = lng + (dLng * 180 / Math.PI);
  return { lat: newLat, lng: newLng };
}

// 初始化地圖
let map;

function initMap() {
  const taiwan = { lat: 23.6978, lng: 120.9605 };
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 7,
    center: taiwan,
  });

  // 從 posts.json 載入資料並加標記
  fetch("posts.json")
    .then(res => res.json())
    .then(posts => {
      posts.forEach(post => {
        if (!post.lat || !post.lng) return;

        // 加上位置模糊
        const noisyPos = addLocationNoise(post.lat, post.lng);

        // 設置標記
        const marker = new google.maps.Marker({
          position: noisyPos,
          map: map,
          title: post.title || "未命名地點",
        });

        // 周邊記事：找 1 公里內的其他文章
        const nearbyPosts = posts.filter(p => {
          if (p === post || !p.lat || !p.lng) return false;
          const dist = getDistance(post.lat, post.lng, p.lat, p.lng);
          return dist <= 1000;
        });

        // InfoWindow 內容
        let infoContent = `<h3>${post.title}</h3>`;
        if (post.link) {
          infoContent += `<p><a href="${post.link}" target="_blank">閱讀文章</a></p>`;
        }
        if (nearbyPosts.length > 0) {
          infoContent += `<h4>周邊記事</h4><ul>`;
          nearbyPosts.forEach(nb => {
            infoContent += `<li><a href="${nb.link || '#'}" target="_blank">${nb.title}</a></li>`;
          });
          infoContent += `</ul>`;
        }

        const infowindow = new google.maps.InfoWindow({
          content: infoContent
        });

        // 點擊標記顯示
        marker.addListener("click", () => {
          infowindow.open(map, marker);
        });
      });
    })
    .catch(err => console.error("載入 posts.json 錯誤：", err));
}

// 計算兩點距離（公尺）
function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6378137; // 地球半徑（公尺）
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
