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
  const [locations, setLocations] = useLocalStorage<LocationData[]>('locationData', [])

  useEffect(() => {
    if (isTracking) {
      navigator.serviceWorker.ready.then((registration) => {
        console.log('Service Worker is ready');
        registration.active?.postMessage({ type: 'START_TRACKING' });
        console.log('Start tracking message sent to Service Worker');
      });
    } else {
      navigator.serviceWorker.ready.then((registration) => {
        registration.active?.postMessage({ type: 'STOP_TRACKING' });
        console.log('Stop tracking message sent to Service Worker');
      });
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'GET_LOCATION') {
        navigator.geolocation.getCurrentPosition(
            (position) => {
              const locationData = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                timestamp: Date.now(),
              };
              navigator.serviceWorker.controller?.postMessage({
                type: 'LOCATION_DATA',
                locationData: locationData,
              });
            },
            (error) => {
              console.error('位置情報の取得に失敗しました:', error);
            }
        );
      } else if (event.data && event.data.type === 'NEW_LOCATION') {
        console.log('New location data received:', event.data.locationData);
        setLocations((prevLocations) => [...prevLocations, event.data.locationData]);
      }
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);

    return () => {
      navigator.serviceWorker.removeEventListener('message', handleMessage);
    };
  }, [isTracking, setLocations]);

  const toggleTracking = () => {
    setIsTracking(!isTracking);
  };

  const clearLocations = () => {
    setLocations([]);
  };

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
  );
}