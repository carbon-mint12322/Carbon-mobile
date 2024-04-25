import { MaterialIcons } from "@expo/vector-icons";
import { Modal, TouchableOpacity } from "react-native";
import colors from "../../styles/colors";
import common from "../../styles/common";
import CommonPolylineMapWrapper from "../Map/Common/CommonPolylineMapWrapper";

export default function FullMapModal({
    visible,
    onRequestClose,
    polylineCoordinates,
    nestedPolylineCoordinates,
    from
}) {

    return <Modal
        visible={visible}
        style={common.modal}
        onRequestClose={onRequestClose}
    >

        <CommonPolylineMapWrapper
            polylineCoordinates={polylineCoordinates}
            nestedPolylineCoordinates={nestedPolylineCoordinates}
            from={from}
        />

        <TouchableOpacity
            style={{
                top: 16,
                left: 16,
                position: 'absolute',
                zIndex: 99,
                backgroundColor: colors.white,
                borderRadius: 8,
                padding: 5
            }}
            onPress={onRequestClose}
        >
            <MaterialIcons name="arrow-back" size={32} color={colors.black} />
        </TouchableOpacity>
    </Modal>
}