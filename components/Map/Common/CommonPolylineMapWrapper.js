import MapViewWrapper from "../MapViewWrapper";
import PolylineWrapper from "../PolylineMapWrapper";

export default function CommonPolylineMapWrapper(props) {

    const {
        polylineCoordinates,
        nestedPolylineCoordinates,
        ...otherProps
    } = props;

    // if nestes polyline coordinates 
    // Selecting first polylineCoordinates for centering the map
    if (nestedPolylineCoordinates && nestedPolylineCoordinates.length) {
        otherProps['polylineCoordinates'] = nestedPolylineCoordinates[0].coords;
    } else {
        // if only one coord is available make sure
        //to merge before passing it to map view 
        otherProps['polylineCoordinates'] = polylineCoordinates;
    }

    const SingleCoordinatesPolyline = () => {

        if (!nestedPolylineCoordinates &&
            polylineCoordinates &&
            polylineCoordinates.length) {
            
            return <PolylineWrapper {...props} />
        }

        return <></>;
    }

    const NestedCoordinatesPolyline = () => {

        if (nestedPolylineCoordinates &&
            nestedPolylineCoordinates.length) {

            return nestedPolylineCoordinates.map((polyCoord, index) => {
                return <PolylineWrapper {...{
                    ...otherProps,
                    from: polyCoord?.from,
                    key: index,
                    polylineCoordinates: polyCoord?.coords
                }} />
            })
        }

        return <></>;
    }

    return <MapViewWrapper {...otherProps}>

        {/* If nested co ordinates are added for multi polyline views */}
        <NestedCoordinatesPolyline />

        {/* If only polylines are passed to display a single polyline area  */}
        <SingleCoordinatesPolyline />

    </MapViewWrapper>
}