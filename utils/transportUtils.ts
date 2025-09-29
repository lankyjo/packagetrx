// utils/transportUtils.ts

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
};

const toRad = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};

/**
 * Determine transport mode based on distance
 * @param distance - Distance in kilometers
 * @returns Transport mode: 'truck' | 'plane' | 'ship'
 */
export const getTransportMode = (distance: number): 'truck' | 'plane' | 'ship' => {
  // Less than 500km - Truck (short distance)
  if (distance < 500) {
    return 'truck';
  }
  // Less than 3000km - Plane (medium/long distance)
  else if (distance < 3000) {
    return 'plane';
  }
  // Over 3000km - Could be plane or ship
  else {
    return 'plane';
  }
};

/**
 * Format distance for display
 */
export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} meters`;
  } else if (distance < 100) {
    return `${distance.toFixed(1)} km`;
  } else {
    return `${Math.round(distance)} km`;
  }
};

/**
 * Get transport mode details (icon, color, label)
 */
export const getTransportDetails = (mode: 'truck' | 'plane' | 'ship') => {
  const details = {
    truck: {
      label: 'Ground Transport',
      color: '#10B981', // green
      speedKmH: 80,
      description: 'Delivered by truck'
    },
    plane: {
      label: 'Air Transport',
      color: '#8B5CF6', // purple
      speedKmH: 800,
      description: 'Delivered by air freight'
    },
    ship: {
      label: 'Sea Transport',
      color: '#3B82F6', // blue
      speedKmH: 40,
      description: 'Delivered by sea freight'
    }
  };
  
  return details[mode];
};

/**
 * Estimate delivery time based on distance and transport mode
 */
export const estimateDeliveryTime = (
  distance: number,
  mode: 'truck' | 'plane' | 'ship'
): { hours: number; days: number } => {
  const details = getTransportDetails(mode);
  const hours = distance / details.speedKmH;
  const days = Math.ceil(hours / 24);
  
  return { hours, days };
};