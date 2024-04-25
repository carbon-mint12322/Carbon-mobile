import { StatusBar } from "expo-status-bar";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Modal from "react-native-modal";
import { useEffect, useState } from "react";
import CreateEvent from "../../Event/Create";
import colors from "../../../../styles/colors";
import { useNavigation } from "@react-navigation/native";
import FarmerHeader from "../../../../components/FarmerHeader";
import DetailsContainer from "../../../../components/DetailsContainer";
import Table from "../../../../components/Table";
import EventCard from "../../../../components/Cards/EventCard";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import common from "../../../../styles/common";
import MiniMapDetail from "../../../../components/Map/Common/Detail/MiniMapDetail";
import FullMapModal from "../../../../components/Modal/FullMapModal";
import NoDataComponent from "../../../../components/NoDataComponent";
import moment from "moment";
import { useFarmerEventContext } from "../../../../contexts/FarmerEventsContext";
import React from "react";
import i18n from "../../../../i18n";
import { changeBaseUrlToApiBaseUrl } from "../../../../utils/modifyUrls";
export default function ProcessingSystemDetails(props) {
  const { getEventsByCropId, eventInfo, eventLoading, getEventByprocessingSystemId } =
    useFarmerEventContext();

  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [mapFullscreen, setMapFullscreen] = useState(false);
  const navigation = useNavigation();
  const [crop, setCrop] = useState({});
  const [processingSystems, setProcessingSystems] = useState([]);
  const [address, setAddress] = useState({});
  const [cropEvents, setCropEvents] = useState([]);

  // Set farmer & land parcel ID
  useEffect(() => {
    const processingSystemId = props?.route?.params?.processingSystem?._id;
    (async () => {
      if (processingSystemId) {
        setCropEvents(await getEventByprocessingSystemId(processingSystemId))
      }
    })()
  }, [eventInfo, eventLoading]);

  useEffect(() => {
    // if (!props?.route?.params?.crop?._id) {
    //   alert("Invalid Data");
    //   return navigation.goBack();
    // }
    setCrop(props?.route?.params?.crop || {});
    setAddress(props?.route?.params?.address || {});
    setProcessingSystems(props?.route?.params?.processingSystem);
    // setEventDetails(props?.route?.params?.eventDetails);
  }, []);

  // console.log(">>>>> Event Details???<<<<<<<");
  // console.log(eventDetails);

  var cropFields = [];
  for (var field of processingSystems?.fieldDetails || []) {
    let map = field.map || "";
    map = map.split(" ");
    map = map.map((m) => ({
      latitude: parseFloat(m.split(",")[1]),
      longitude: parseFloat(m.split(",")[0]),
    }));
    map = map.filter((m) => !isNaN(m.latitude) && !isNaN(m.longitude));
    cropFields.push(map);
  }
  var land = props?.route?.params?.map || "";
  land = land.split(" ");
  land = land.map((m) => ({
    latitude: parseFloat(m.split(",")[1]),
    longitude: parseFloat(m.split(",")[0]),
  }));
  land = land.filter((m) => !isNaN(m.latitude) && !isNaN(m.longitude));
  const getCoordinates = () => cropFields?.[0] || [];
  const getLandParcelCoordinates = () => land || [];
  return (
    <SafeAreaView>
      <StatusBar />
      <FarmerHeader
        hideDrawer={true}
        hideProfileImage={true}
        title={processingSystems?.name}
        subtitle={
          (processingSystems?.name || "") +
          ", " +
          (processingSystems?.category || "")
        }
      />
      <TouchableOpacity
        style={common.fabIcon}
        onPress={() => setShowCreateEvent(!showCreateEvent)}
      >
        <FontAwesome name="camera" size={24} color="white" />
      </TouchableOpacity>
      <ScrollView style={{ padding: 16, height: "90%" }}>
        {/* <View style={styles.farmImagePart}>
          <Image
            source={require("../../../../assets/farm.png")}
            style={styles.farmImage}
          />
        </View> */}

        <DetailsContainer title={i18n.t("farmer.cropsScreen.details")}>
          <Table
            rows={[
              {
                title: i18n.t("farmer.cropsScreen.detailsTable.title10"),
                value: processingSystems.name,
                visible: !!processingSystems.name,
              },
              {
                title: i18n.t("farmer.cropsScreen.detailsTable.title1"),
                value: `${processingSystems?.fieldDetails?.[0]?.areaInAcres} Acres`,
                visible: !!processingSystems?.fieldDetails?.[0]?.areaInAcres,
              },
              {
                title: i18n.t("farmer.cropsScreen.detailsTable.title11"),
                value: processingSystems.category,
                visible: !!processingSystems.category,
              },
            ]}
          />
        </DetailsContainer>

        {getCoordinates().length > 0 && getLandParcelCoordinates().length > 0 && (
          <MiniMapDetail
            title={i18n.t("farmer.cropsScreen.fieldAreaMap")}
            onPressMaximize={() => setMapFullscreen(true)}
            nestedPolylineCoordinates={[
              { coords: getCoordinates(), from: "crops" },
              { coords: getLandParcelCoordinates(), from: "landparcel" },
            ]}
          />
        )}

        <View style={{ marginBottom: 20 }}>
          <DetailsContainer title={i18n.t("farmer.cropsScreen.events")}>
            {(cropEvents || [])?.map((details, index) => {
              if (index >= 5)
                return (
                  <React.Fragment key={details.id || index}></React.Fragment>
                );
              // console.log(details, ' <=== processing system detail')
              return (
                <EventCard
                  key={details.id || index}
                  title={moment(details.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                  details={{ ...details, isProcessingSystem: true }}
                  crop={crop}
                  image={
                    details?.isCached ?
                      details?.image?.[0]?.uri
                      :
                      changeBaseUrlToApiBaseUrl(details?.photoRecords?.[0]?.link)
                  }
                  isCached={details.isCached}
                />
              );
            })}

            {cropEvents && !cropEvents.length && (
              <NoDataComponent
                message={i18n.t("farmer.cropsScreen.noEventsText")}
                icon={<MaterialIcons name="event" size={35} color="black" />}
              />
            )}
          </DetailsContainer>
        </View>
      </ScrollView>

      <FullMapModal
        visible={mapFullscreen}
        nestedPolylineCoordinates={[
          { coords: getCoordinates(), from: "crops" },
          { coords: getLandParcelCoordinates(), from: "landparcel" },
        ]}
        onRequestClose={() => {
          setMapFullscreen(false);
        }}
      />

      <Modal
        isVisible={showCreateEvent}
        style={common.modal}
        onRequestClose={() => {
          setShowCreateEvent(false);
        }}
      >
        <CreateEvent
          type={"processingSystem"}
          details={props?.route?.params?.processingSystem}
          closeModal={() => setShowCreateEvent(false)}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.compose({
  farmImage: {
    borderRadius: 20,
    width: Dimensions.get("screen").width - 32,
  },
  map: {
    height: "100%",
  },
  minimizeBtn: {
    top: 16,
    left: 16,
    position: "absolute",
    zIndex: 99,
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 5,
  }
});