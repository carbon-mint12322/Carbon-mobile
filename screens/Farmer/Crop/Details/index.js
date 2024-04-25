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
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import common from "../../../../styles/common";
import MiniMapDetail from "../../../../components/Map/Common/Detail/MiniMapDetail";
import FullMapModal from "../../../../components/Modal/FullMapModal";
import NoDataComponent from "../../../../components/NoDataComponent";
import moment from "moment";
import { useFarmerEventContext } from "../../../../contexts/FarmerEventsContext";
import React from "react";
import i18n from "../../../../i18n";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { writeLog } from "../../../../utils/sentryLogsQueue";
export default function CropDetails(props) {


  const {
    getEventsByCropId,
    eventInfo,
    eventLoading
  } = useFarmerEventContext();

  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [mapFullscreen, setMapFullscreen] = useState(false)
  const navigation = useNavigation();
  const [crop, setCrop] = useState({});
  const [address, setAddress] = useState({});
  const [cropEvents, setCropEvents] = useState([]);


  // Set farmer & land parcel ID 
  const getEvents = async () => {
    const cropId = props?.route?.params?.crop?._id;
    if (cropId) {
      setCropEvents(await getEventsByCropId(cropId));
    }
  }
  useEffect(() => {
    getEvents()

  }, [eventInfo, eventLoading]);

  useEffect(() => {
    if (!props?.route?.params?.crop?._id) {
      writeLog('Crop not found. Please contact your admin to check if the crop is added.', 'debug')
      Toast.show({
        type: 'error',
        text2: 'Crop not found. Please contact your admin to check if the crop is added.'
      })
      return navigation.goBack();
    }
    console.log(props?.route?.params?.crop?.name);
    setCrop(props?.route?.params?.crop || {});
    setAddress(props?.route?.params?.address || {});
    // setEventDetails(props?.route?.params?.eventDetails);
  }, []);

  // console.log(">>>>> Event Details???<<<<<<<");
  // console.log(eventDetails);

  var cropFields = []

  for (var field of (crop?.fields || [])) {
    let map = field.map || ""
    map = map.split(' ')
    map = map.map(m => ({ latitude: parseFloat(m.split(',')[1]), longitude: parseFloat(m.split(',')[0]) }))
    map = map.filter(m => !isNaN(m.latitude) && !isNaN(m.longitude))
    cropFields.push(map)
  }

  var land = props?.route?.params?.map || "";
  land = land.split(" ");
  land = land.map((m) => ({
    latitude: parseFloat(m.split(",")[1]),
    longitude: parseFloat(m.split(",")[0]),
  }));
  land = land.filter(m => !isNaN(m.latitude) && !isNaN(m.longitude))

  const getCoordinates = () => cropFields?.[0] || [];
  const getLandParcelCoordinates = () => land || [];


  return (
    <SafeAreaView>
      <StatusBar />
      <FarmerHeader
        hideDrawer={true}
        hideProfileImage={true}
        title={crop.name}
        subtitle={(crop.landParcel?.name || '') + ", " + (address.village || '')}
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

        <DetailsContainer title={i18n.t('farmer.cropsScreen.cropDetails')}>
          <Table
            rows={[
              {
                title: i18n.t('farmer.cropsScreen.detailsTable.title1'),
                value: `${crop.areaInAcres} Acres`,
                visible: !!crop.areaInAcres,
              },
              {
                title: i18n.t('farmer.cropsScreen.detailsTable.title2'),
                value: crop?.croppingSytemData?.name,
                visible: !!crop?.croppingSytemData?.name,
              },
              {
                title: i18n.t('farmer.cropsScreen.detailsTable.title3'),
                value: crop.category,
                visible: !!crop.category,
              },
              {
                title: i18n.t('farmer.cropsScreen.detailsTable.title4'),
                value: crop.cropType,
                visible: !!crop.cropType,
              },
              {
                title: i18n.t('farmer.cropsScreen.detailsTable.title5'),
                value: crop?.costOfCultivation,
                visible: !!crop?.costOfCultivation,
              },
              {
                title: i18n.t('farmer.cropsScreen.detailsTable.title6'),
                value: crop.estimatedYieldTonnes + " tonnes",
                visible: !!crop.estimatedYieldTonnes,
              },
              {
                title: i18n.t('farmer.cropsScreen.detailsTable.title7'),
                value: crop.seedSource,
                visible: !!crop.seedSource,
              },
              {
                title: i18n.t('farmer.cropsScreen.detailsTable.title8'),
                value: crop.seedVariety,
                visible: !!crop.seedVariety,
              },
              {
                title: i18n.t('farmer.cropsScreen.detailsTable.title9'),
                value: crop.plannedSowingDate,
                visible: !!crop.plannedSowingDate,
              },
              {
                title: i18n.t('farmer.cropsScreen.detailsTable.title0'),
                value: crop?.fbId,
                visible: !!crop?.fbId
              }
            ]}
          />
        </DetailsContainer>


        {(getCoordinates().length > 0 && getLandParcelCoordinates().length > 0) && (
          <MiniMapDetail
            title={i18n.t('farmer.cropsScreen.fieldAreaMap')}
            onPressMaximize={() => setMapFullscreen(true)}
            nestedPolylineCoordinates={[{ coords: getCoordinates(), from: "crops" }, { coords: getLandParcelCoordinates(), from: 'landparcel' }]}
          />
        )}

        <View style={{ marginBottom: 20 }}>
          <DetailsContainer title={i18n.t('farmer.cropsScreen.events')}>
            {cropEvents
              ?.map((details, index) => {

                if (index >= 5) return <React.Fragment key={details.id || index}></React.Fragment>;

                return (
                  <EventCard
                    key={details.id || index}
                    title={moment(details.ts).format('YYYY-MM-DD HH:mm:ss')}
                    details={details}
                    crop={crop}
                    image={details?.image?.[0]?.[details.isCached ? 'uri' : 'link']}
                    isCached={details.isCached}
                  />
                );
              })}

            {cropEvents && !cropEvents.length && (
              <NoDataComponent
                message={i18n.t('farmer.cropsScreen.noEventsText')}
                icon={<MaterialIcons name="event" size={35} color="black" />}
              />
            )}
          </DetailsContainer>
        </View>
      </ScrollView>

      <FullMapModal
        visible={mapFullscreen}
        nestedPolylineCoordinates={[{ coords: getCoordinates(), from: "crops" }, { coords: getLandParcelCoordinates(), from: 'landparcel' }]}
        onRequestClose={() => {
          setMapFullscreen(false)
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
          type={"crop"}
          details={props?.route?.params?.crop}
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
    height: '100%'
  },
  minimizeBtn: {
    top: 16,
    left: 16,
    position: 'absolute',
    zIndex: 99,
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 5
  }
});
