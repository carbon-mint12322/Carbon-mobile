import { getMinMaxBounds } from "./getMinMaxBounds";
  
export const polygonToMapCenter = (polygon) => {
    const { minLat, maxLat, minLng, maxLng } = getMinMaxBounds(polygon);
  
    // const centerX = minLat + (maxLat - minLat) / 2;
    // const centerY = minLng + (maxLng - minLng) / 2;

    const paddingFactor = 1.2; // Increase padding by 20%
  
    return {
      latitude: (maxLat + minLat) / 2,
      longitude: (maxLng + minLng) / 2,
      latitudeDelta: (maxLat - minLat) * paddingFactor,
      longitudeDelta: (maxLng - minLng) * paddingFactor,
    };
  };
  