// 模糊化座標（500公尺左右）
function blurLocation(lat, lng) {
  const r = 0.005; // 約500公尺
  const randomLat = lat + (Math.random() - 0.5) * r;
  const randomLng = lng + (Math.random() - 0.5) * r;
  return { lat: randomLat, lng: randomLng };
}

function initMap() {
  const taiwan = { lat: 23.6978, lng: 120.9605 };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 7,
    center: taiwan,
  });

  // 載入 posts.json
  fetch("posts.json")
    .then(res => res.json())
    .then(posts => {
      posts.forEach(post => {
        if (post.lat && post.lng) {
          const blurred = blurLocation(post.lat, post.lng);
          const marker = new google.maps.Marker({
            position: blurred,
            map: map,
            title: post.title
          });

          const info = new google.maps.InfoWindow({
            content: `<h3>${post.title}</h3><p>${post.description || ""}</p>`
          });

          marker.addListener("click", () => {
            info.open(map, marker);
          });
        }
      });
    })
    .catch(err => console.error("載入 posts.json 失敗", err));
}
