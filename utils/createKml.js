import tokml from "geojson-to-kml";
import colors from "../styles/colors";

export const kml = (routeCoordinates, name) => {

  let geoJson = {}

  if(routeCoordinates.length === 1){
    geoJson = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: 
            routeCoordinates.map((coord) => [
              coord.longitude,
              coord.latitude,
              coord.altitude || 0
            ])
      },
      properties: {
        name
        // "fill": "#2B9348",
        // "fill-opacity": 0.6
      }
    }
  }else{
    geoJson = {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          routeCoordinates.map((coord) => [
            coord.longitude,
            coord.latitude,
            coord.altitude || 0
          ]),
        ]
      },
      properties: {
        name
        // "fill": "#2B9348",
        // "fill-opacity": 0.6
      }
    }
  }

    return jsontokml(geoJson) // tokml(geoJson, { simplestyle: false });
}

export const jsontokml = (geojson_data) => {
  // Create KML file and write header
  var kml_string = '<?xml version="1.0" encoding="UTF-8"?>\n';
  kml_string += '<kml xmlns="http://www.opengis.net/kml/2.2">\n';

  // Check if GeoJSON data has features
  // if (geojson_data.features) {
    // Iterate over features and create KML placemarks
    // for (const feature of geojson_data.features) {
      if (geojson_data.geometry) {
        kml_string += '<Placemark>\n';
        kml_string += `<name>${geojson_data.properties.name || ''}</name>\n`;
        kml_string += `<description>${geojson_data.properties.description || ''}</description>\n`;
        kml_string += '<styleUrl>#icon</styleUrl>\n'; // Add any style you want to use

        // Convert GeoJSON geometry to KML format
        const geometry = geojson_data.geometry;
        console.log(geometry, ' <== I am geometry...')
        console.log(geometry.coordinates[0].join(' ').split(',').join(', '), ' <== I am geometry string...')
        let kml_geometry = '';
        if (geometry.type === 'Point') {
          kml_geometry = `<Point><coordinates>${geometry.coordinates.join(', ')}</coordinates></Point>\n`;
        } else if (geometry.type === 'LineString') {
          kml_geometry = `<LineString><coordinates>${geometry.coordinates.join(' ')}</coordinates></LineString>\n`;
        } else if (geometry.type === 'Polygon') {
          kml_geometry = `<Polygon><outerBoundaryIs><LinearRing><coordinates>${geometry.coordinates[0].join(' ')}</coordinates></LinearRing></outerBoundaryIs></Polygon>\n`;
        }
        kml_string += kml_geometry;

        kml_string += '</Placemark>\n';
      }
    // }
  // }

  // Write KML footer and return string
  kml_string += '</kml>\n';
  return kml_string;
}