'use client'

import { useState, useEffect } from 'react'
import LocationTracker from '../components/LocationTracker'
import LocationList from '../components/LocationList'

export default function Home() {
  const [isTracking, setIsTracking] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(
          (registration) => {
            console.log('Service Worker registered with scope:', registration.scope)
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