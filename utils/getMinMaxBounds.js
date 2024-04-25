export const getMinMaxBounds = (polygon) => {
  
    const lat = polygon?.map((coordinate) => coordinate?.latitude).sort();
    const lng = polygon?.map((coordinate) => coordinate?.longitude).sort();
  
    const minLat = lat[0];
    const maxLat = lat[lat.length - 1];
    const minLng = lng[0];
    const maxLng = lng[lng.length - 1];
  
    return {
      minLat,
      maxLat,
      minLng,
      maxLng,
    };
  };