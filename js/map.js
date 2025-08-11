// 初始化 Google Map
function initMap() {
  const taiwan = { lat: 23.6978, lng: 120.9605 };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    center: taiwan,
  });

  // 範例地點資料
  const locations = [
    { lat: 25.1283, lng: 121.7416, title: "基隆鬼屋" },
    { lat: 25.1737, lng: 121.4325, title: "淡水紅毛城" }
  ];

  locations.forEach(loc => {
    // 加地標
    new google.maps.Marker({
      position: { lat: loc.lat, lng: loc.lng },
      map: map,
      title: loc.title
    });

    // 加模糊半徑 500 公尺
    new google.maps.Circle({
      strokeColor: "#FF0000",    // 外框顏色
      strokeOpacity: 0.3,        // 外框透明度
      strokeWeight: 1,           // 外框粗細
      fillColor: "#FF0000",      // 填充顏色
      fillOpacity: 0.15,         // 填充透明度
      map: map,
      center: { lat: loc.lat, lng: loc.lng },
      radius: 500                // 半徑（公尺）
    });
  });
}

window.initMap = initMap; // 必須掛到全域才能給 Google Maps API 呼叫
