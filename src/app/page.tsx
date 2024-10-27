'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import LocationTracker from '../components/LocationTracker'

const LocationList = dynamic(() => import('../components/LocationList'), {
  ssr: false,
})

export default function Home() {
  const [isTracking, setIsTracking] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(
          (registration) => {
            console.log('Service Worker registered with scope:', registration.scope)
            // Service Workerの更新を強制
            registration.update().then(() => {
              console.log('Service Worker updated')
            }).catch((error) => {
              console.error('Service Worker update failed:', error)
            })
          },
          (error) => {
            console.error('Service Worker registration failed:', error)
          }
      )
    }
  }, [])

  return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">位置情報トラッカー</h1>
        <LocationTracker isTracking={isTracking} setIsTracking={setIsTracking} />
        <LocationList />
      </div>
  )
}