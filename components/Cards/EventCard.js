import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import common from "../../styles/common";
import colors from "../../styles/colors";
import Modal from "react-native-modal";
import EventDetails from "../../screens/Farmer/Event/Details";
import { useContext, useState } from "react";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { ProgressBar } from "react-native-paper";
import networkListener from "../../utils/networkListener";
import { useNetInfo } from "@react-native-community/netinfo";
import networkContext from "../../contexts/NetworkContext";
import commonNetworkListener from "../../utils/commonNetworkListener";

export default function EventCard({
  title,
  image,
  subtitle = "",
  details,
  crop,
  isCached = false,
  landParcel
}) {
  const [showEventDetails, setShowEventDetails] = useState(false);
  const netInfo = useNetInfo();
  const {setEventInfo} = useContext(networkContext)
  
  const getEventIcon = () => {
    switch(details?.status) {
      case 1: {
        return (
          <Ionicons
            name="md-layers-sharp"
            size={30}
            color={colors.primary}
          />
        )
      }
      case 3: {
        return (
          <Image
            source={require("../../assets/uploaded.png")}
            style={styles.camera}
          />
        )
      }
      case 4: {
        return (
          // <TouchableOpacity onPress={() => networkListener(netInfo, setEventInfo)}>
          <TouchableOpacity onPress={() => commonNetworkListener(netInfo, setEventInfo)}>
            <MaterialIcons
              name="refresh"
              size={30}
              color={colors.red}
            />
          </TouchableOpacity>
        )
      }
      case undefined: {
        return (
          <Image
            source={require("../../assets/uploaded.png")}
            style={styles.camera}
          />
        )
      }
      default: {
        return <></>
      }
    }
  }

  // console.log(image, ' <== I image')

  return (
    <>
      <TouchableOpacity onPress={() => setShowEventDetails(!showEventDetails)}>
        <View style={{ ...common.eventCardContainer }}>
          <View style={styles.foodImgPart}>
            {image ? (
              <Image
                source={{ uri: image }}
                style={styles.farmFood}
                resizeMode={"cover"}
              />
            ) : (
              <MaterialIcons
                name="image-not-supported"
                size={24}
                color="#686868"
              />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <View style={common.listDetail}>
              <View style={styles.foodNamePart}>
                {title && <Text style={common.listField}>{title}</Text>}
                {subtitle && <Text style={common.listName}>{subtitle}</Text>}
                {details.error && <Text style={common.listName}>{details.error || ''}</Text>}
              </View>
              {getEventIcon()}
            </View>
            {details?.status && details?.status === 2 && (
              <ProgressBar
                style={styles.progressBar}
                progress={0.5}
                color={colors.primary}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
      <Modal
        isVisible={showEventDetails}
        style={common.modal}
        onRequestClose={() => {
            setShowEventDetails(false);
        }}
      >
        <EventDetails
          isCached={isCached}
          details={details}
          crop={crop}
          closeModal={() => setShowEventDetails(false)}
          landParcel={landParcel}
        />
      </Modal>
    </>
  );
}

const styles = StyleSheet.compose({
  foodImgPart: {
    marginRight: 16,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: colors.grayBorders,
    padding: 2,
    height: 54,
    width: 54,
    justifyContent: "center",
    alignItems: "center",
  },
  farmFood: {
    height: 50,
    width: 50,
    borderRadius: 99,
  },
  foodNamePart: {
    width: "85%",
  },
  listName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.gray,
    maxWidth: 180,
  },
  progressBar: {
    marginTop: 6,
    color: colors.orange,
    borderRadius: 4,
  },
});
