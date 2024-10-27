self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

let intervalId

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'START_TRACKING') {
    startTracking()
  } else if (event.data && event.data.type === 'STOP_TRACKING') {
    stopTracking()
  }
})

function startTracking() {
  intervalId = setInterval(() => {
    if ('geolocation' in self) {
      self.geolocation.getCurrentPosition(
          (position) => {
            const locationData = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              timestamp: Date.now(),
            }
            saveLocationData(locationData)
          },
          (error) => {
            console.error('位置情報の取得に失敗しました:', error)
          }
      )
    }
  }, 10000) // 10秒ごとに実行
}

function stopTracking() {
  if (intervalId) {
    clearInterval(intervalId)
  }
}

function saveLocationData(locationData) {
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: 'NEW_LOCATION',
        locationData: locationData,
      })
    })
  })
}