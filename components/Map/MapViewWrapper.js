import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import {
    StyleSheet
} from "react-native";
import { polygonToMapCenter } from "../../utils/polygonToMapCenter";
  
const styles = StyleSheet.compose({
    map: {
        height: '100%',
        width: '100%'
    },
});

const defaultRegion = {
    latitude: 23.0245167,
    longitude: 72.5573282,
    latitudeDelta: 0.007,
    longitudeDelta: 0.007,
};

const defaultProps = {
    mapType : "satellite",
    style : styles.map,
    provider : PROVIDER_GOOGLE,
    region: defaultRegion,
    moveOnMarkerPress : false,
    showsUserLocation : false,
    followsUserLocation : false,
    showsCompass : false,
    showsPointsOfInterest: false,
    zoomControlEnabled : true
}

const getPolygonCenterCoordinates = (polygon) => {

    if (!(polygon?.length)) {
      return {
        latitude: defaultRegion.latitude,
        longitude: defaultRegion.longitude
      }
    }
  
    return polygonToMapCenter(polygon);
  }

export default function MapViewWrapper(props) {

    const { children, ...otherProps } = {...defaultProps, ...props};

    if ('polylineCoordinates' in props) {
        otherProps['region'] = {
            ...defaultRegion,
            ...getPolygonCenterCoordinates(props.polylineCoordinates),
        };
    }

    return <MapView
        {...otherProps}
    >
        {children}
    </MapView>;
}