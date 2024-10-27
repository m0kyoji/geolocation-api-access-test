'use client'

import { useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

interface LocationData {
  latitude: number
  longitude: number
  timestamp: number
}

interface LocationTrackerProps {
  isTracking: boolean
  setIsTracking: (isTracking: boolean) => void
}

export default function LocationTracker({ isTracking, setIsTracking }: LocationTrackerProps) {
  const [, setLocations] = useLocalStorage<LocationData[]>('locationData', [])

  useEffect(() => {
    if (isTracking) {
      navigator.serviceWorker.controller?.postMessage({ type: 'START_TRACKING' })
    } else {
      navigator.serviceWorker.controller?.postMessage({ type: 'STOP_TRACKING' })
    }

    const handleNewLocation = (event: MessageEvent) => {
      if (event.data && event.data.type === 'NEW_LOCATION') {
        const newLocationData = event.data.locationData as LocationData;
        setLocations((prevLocations: LocationData[]) => [...prevLocations, newLocationData]);
      }
    }

    navigator.serviceWorker.addEventListener('message', handleNewLocation)

    return () => {
      navigator.serviceWorker.removeEventListener('message', handleNewLocation)
    }
  }, [isTracking, setLocations])

  const toggleTracking = () => {
    setIsTracking(!isTracking)
  }

  const clearLocations = () => {
    setLocations([])
  }

  return (
      <div className="mb-4">
        <button
            className={`px-4 py-2 rounded ${isTracking ? 'bg-red-500' : 'bg-green-500'} text-white mr-4`}
            onClick={toggleTracking}
        >
          {isTracking ? '追跡を停止' : '追跡を開始'}
        </button>
        <button
            className="px-4 py-2 rounded bg-gray-500 text-white"
            onClick={clearLocations}
        >
          位置情報をクリア
        </button>
      </div>
  )
}