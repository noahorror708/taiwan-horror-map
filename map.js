let map;
let markers = [];

async function initMap() {
  const locations = await fetch('data/locations.json').then(r=>r.json());
  map = L.map('map').setView([23.6978, 120.9605], 7);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  locations.forEach(loc => {
    const marker = L.marker([loc.lat, loc.lng]).addTo(map)
      .bindPopup(`<b>${loc.name}</b><br><button onclick="showNearby(${loc.id})">附近文章</button>`);
    markers.push(marker);
  });
}

async function showNearby(locationId) {
  const posts = await fetch('data/posts.json').then(r=>r.json());
  const nearPosts = posts.filter(p => p.locationId === locationId);
  const list = document.getElementById('latest-posts-list');
  list.innerHTML = '';
  nearPosts.forEach(p => {
    const li = document.createElement('li');
    li.innerHTML = `<a href="${p.file}">${p.title}</a>`;
    list.appendChild(li);
  });
}

document.addEventListener('DOMContentLoaded', initMap);
