import { MaterialIcons } from "@expo/vector-icons";
import { Dimensions, TouchableOpacity, View } from "react-native";
import colors from "../../../../styles/colors";
import DetailsContainer from "../../../DetailsContainer";
import CommonPolylineMapWrapper from "../CommonPolylineMapWrapper";

export default function MiniMapDetail({
    title,
    onPressMaximize,
    polylineCoordinates,
    nestedPolylineCoordinates,
    from
}) {
    return <DetailsContainer title={title}>
        <View
            style={{
                height: 150,
                width: Dimensions.get("screen").width - 32,
                borderRadius: 20,
                overflow: "hidden",
            }}
        >
            <CommonPolylineMapWrapper
                polylineCoordinates={polylineCoordinates}
                nestedPolylineCoordinates={nestedPolylineCoordinates}
                from={from}
                />
        </View>
        <TouchableOpacity
            style={{
                top: 66,
                left: 16,
                position: "absolute",
                zIndex: 99,
                backgroundColor: colors.white,
                borderRadius: 8,
            }}
            onPress={onPressMaximize}
        >
            <MaterialIcons name="fullscreen" size={32} color={colors.black} />
        </TouchableOpacity>
    </DetailsContainer>
}