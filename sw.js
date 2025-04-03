const CACHE_NAME = 'acesso-medico-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  'https://i.imgur.com/BzIGz3X.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
  'https://www.gstatic.com/firebasejs/9.0.2/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore-compat.js',
  'https://www.gstatic.com/firebasejs/9.0.2/firebase-storage-compat.js',
  'https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('message', event => {
  if (event.data.type === 'SCHEDULE_NOTIFICATION') {
    const { alarmData } = event.data;
    const now = new Date().getTime();
    const timeUntilAlarm = alarmData.timestamp - now;
    
    if (timeUntilAlarm > 0) {
      setTimeout(() => {
        self.registration.showNotification('Lembrete de Medicação', {
          body: `Hora de tomar ${alarmData.medicamento} (${alarmData.dose}) - ${alarmData.posologia}`,
          icon: 'https://i.imgur.com/BzIGz3X.png',
          vibrate: [200, 100, 200]
        });
      }, timeUntilAlarm);
    }
  }
});
