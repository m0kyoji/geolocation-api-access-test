'use client'

import { useState, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

interface LocationData {
  latitude: number
  longitude: number
  timestamp: number
}

export default function LocationList() {
  const [locations, setLocations] = useState<LocationData[]>([])

  useEffect(() => {
    const updateLocations = () => {
      const storedLocations = JSON.parse(localStorage.getItem('locationData') || '[]')
      setLocations(storedLocations)
    }

    updateLocations() // 初回読み込み
    const interval = setInterval(updateLocations, 5000) // 5秒ごとに更新

    return () => clearInterval(interval)
  }, [])

  return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">保存された位置情報</h2>
        <ul>
          {locations.map((location, index) => (
              <li key={index} className="mb-2">
                緯度: {location.latitude.toFixed(6)}, 経度: {location.longitude.toFixed(6)},
                時刻: {new Date(location.timestamp).toLocaleString()}
              </li>
          ))}
        </ul>
      </div>
  )
}