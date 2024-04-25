import {
    Modal,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

import colors from "../../styles/colors";
import PolylineWrapper from "../Map/PolylineMapWrapper";
import MapViewWrapper from "../Map/MapViewWrapper";
import { useState } from "react";

const styles = StyleSheet.create({
    top: 16,
    left: 16,
    position: 'absolute',
    zIndex: 99,
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 5
})

export default function PolylineDetailMapModal(props) {

    const { children, ...otherProps } = props;

    return <Modal
        {...otherProps}
    >
        <MapViewWrapper {...otherProps}>
             <PolylineWrapper {...otherProps} />
        </MapViewWrapper>
        <TouchableOpacity
                style={styles}
                onPress={props.onRequestClose}
        >
            <MaterialIcons name="arrow-back" size={32} color={colors.black} />
        </TouchableOpacity>
    </Modal>
}