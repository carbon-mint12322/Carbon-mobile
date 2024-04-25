import { Polyline, Geojson, Marker } from "react-native-maps";

import colors from "../../styles/colors";

const defaultProps = {
  strokeWidth: 1,
  // strokeColor : "red",
  strokeColors: ["red", "green", "blue", "pink"],
  fillColor: colors.primaryTransparent
}


export default function PolylineWrapper(props) {

  const { polylineCoordinates: coordinates, from } = props;
  const feature = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          "type": "Polygon",
          coordinates: [coordinates.map(coord => ([coord.longitude, coord.latitude]))],
        }
      }
    ]

  }

  if (coordinates.length == 1) {
    return <Marker
      coordinate={coordinates[0]}
    />
  } else {
    return <Geojson
      {...defaultProps}
      {...props}
      geojson={feature}
      coordinates={coordinates}
      strokeWidth={3}
      strokeColor={from == "landparcel" ? "#7fff00" : "blue"}
      fillColor={from == "landparcel" ? "transparent" : "blue"}
    />
  }
}