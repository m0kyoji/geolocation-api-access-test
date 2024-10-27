let intervalId;

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);
  if (event.data && event.data.type === 'START_TRACKING') {
    console.log('Service Worker starting tracking');
    startTracking();
  } else if (event.data && event.data.type === 'STOP_TRACKING') {
    console.log('Service Worker stopping tracking');
    stopTracking();
  } else if (event.data && event.data.type === 'LOCATION_DATA') {
    console.log('Service Worker received location data:', event.data.locationData);
    saveLocationData(event.data.locationData);
  }
});

function startTracking() {
  console.log('Service Worker: startTracking called');
  intervalId = setInterval(() => {
    console.log('Service Worker: Requesting current position');
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({type: 'GET_LOCATION'});
      });
    });
  }, 10000); // 10秒ごとに実行（テスト用）
}

function stopTracking() {
  if (intervalId) {
    clearInterval(intervalId);
  }
}

function saveLocationData(locationData) {
  console.log('Service Worker: Saving location data', locationData);
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      console.log('Service Worker: Sending location data to client');
      client.postMessage({
        type: 'NEW_LOCATION',
        locationData: locationData,
      });
    });
  });
}