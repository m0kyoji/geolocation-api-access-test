self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

let intervalId = null;

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'START_TRACKING') {
    startTracking();
  } else if (event.data && event.data.type === 'STOP_TRACKING') {
    stopTracking();
  }
});

function startTracking() {
  if (intervalId) return;
  
  intervalId = setInterval(() => {
    self.registration.sync.register('get-location')
        .then(() => console.log('Background sync registered'))
        .catch(err => console.error('Background sync registration failed:', err));
  }, 10000); // 1分ごとに実行
}

function stopTracking() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

self.addEventListener('sync', (event) => {
  if (event.tag === 'get-location') {
    event.waitUntil(getAndSaveLocation());
  }
});

function getAndSaveLocation() {
  return new Promise((resolve, reject) => {
    self.clients.matchAll().then(clients => {
      if (clients.length > 0) {
        clients[0].postMessage({type: 'GET_LOCATION'});
      }
    });
    resolve();
  });
}

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'LOCATION_DATA') {
    saveLocationData(event.data.locationData);
  }
});

function saveLocationData(locationData) {
  // ここでIndexedDBなどを使用してデータを保存する
  console.log('Location data saved:', locationData);
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'NEW_LOCATION',
        locationData: locationData
      });
    });
  });
}