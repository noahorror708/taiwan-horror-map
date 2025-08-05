// 初始化 Google Map
function initMap() {
  const taiwan = { lat: 23.6978, lng: 120.9605 };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    center: taiwan,
  });

  // 範例地點
  new google.maps.Marker({
    position: { lat: 25.1283, lng: 121.7416 },
    map: map,
    title: "基隆鬼屋"
  });

  new google.maps.Marker({
    position: { lat: 25.1737, lng: 121.4325 },
    map: map,
    title: "淡水紅毛城"
  });
}

// 瀏覽次數計數器 (使用 countapi)
fetch('https://api.countapi.xyz/hit/taiwan-horror-map/views')
  .then(res => res.json())
  .then(data => {
    document.getElementById("viewCount").innerText = data.value;
  });
