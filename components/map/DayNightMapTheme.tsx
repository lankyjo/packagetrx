'use client';

import { useEffect, useState } from 'react';
import { TileLayer } from 'react-leaflet';

interface DayNightMapThemeProps {
  userLat?: number;
  userLng?: number;
}

const DayNightMapTheme = ({ userLat, userLng }: DayNightMapThemeProps) => {
  const [isDaytime, setIsDaytime] = useState(true);
  const [currentTheme, setCurrentTheme] = useState<'day' | 'night' | 'auto'>('auto');

  // Calculate if it's day or night based on location and time
  useEffect(() => {
    const calculateDayNight = () => {
      const now = new Date();
      const hour = now.getHours();
      
      if (userLat && userLng) {
        // More sophisticated calculation based on sunrise/sunset
        // This is a simplified version - you could use a library like 'suncalc' for precise calculations
        const sunrise = 6;
        const sunset = 18;
        
        // Adjust for timezone and location (simplified)
        const localHour = hour;
        setIsDaytime(localHour >= sunrise && localHour < sunset);
      } else {
        // Simple time-based calculation
        setIsDaytime(hour >= 6 && hour < 18);
      }
    };

    calculateDayNight();
    
    // Update every hour
    const interval = setInterval(calculateDayNight, 3600000);
    
    return () => clearInterval(interval);
  }, [userLat, userLng]);

  const getMapTileUrl = () => {
    if (currentTheme === 'day' || (currentTheme === 'auto' && isDaytime)) {
      // Day theme - standard OpenStreetMap
      return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    } else {
      // Night theme - dark CartoDB tiles
      return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    }
  };

  const getAttribution = () => {
    if (currentTheme === 'day' || (currentTheme === 'auto' && isDaytime)) {
      return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    } else {
      return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
    }
  };

  // Theme toggle controls
  const ThemeControls = () => (
    <div className="fixed bottom-4 right-4 z-[1000]">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className="flex">
          <button
            onClick={() => setCurrentTheme('day')}
            className={`p-2 text-xs transition-colors ${
              currentTheme === 'day' ? 'bg-yellow-100 text-yellow-800' : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Day Theme"
          >
            ☀️
          </button>
          <button
            onClick={() => setCurrentTheme('auto')}
            className={`p-2 text-xs transition-colors border-x border-gray-200 ${
              currentTheme === 'auto' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Auto Theme"
          >
            🌅
          </button>
          <button
            onClick={() => setCurrentTheme('night')}
            className={`p-2 text-xs transition-colors ${
              currentTheme === 'night' ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Night Theme"
          >
            🌙
          </button>
        </div>
        <div className="px-2 py-1 text-xs text-gray-500 text-center border-t border-gray-200">
          {currentTheme === 'auto' ? (isDaytime ? 'Day' : 'Night') : currentTheme}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <TileLayer
        key={`${currentTheme}-${isDaytime}`} // Force re-render when theme changes
        url={getMapTileUrl()}
        attribution={getAttribution()}
        maxZoom={18}
        className={`transition-opacity duration-1000 ${
          currentTheme === 'night' || (currentTheme === 'auto' && !isDaytime) 
            ? 'brightness-75' 
            : 'brightness-100'
        }`}
      />
      <ThemeControls />
    </>
  );
};

export default DayNightMapTheme;