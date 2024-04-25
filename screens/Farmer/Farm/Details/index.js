import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Modal from "react-native-modal";
import { useContext, useEffect, useState } from "react";
import CreateEvent from "../../Event/Create";
import colors from "../../../../styles/colors";
import { useNavigation } from "@react-navigation/native";
import FarmerHeader from "../../../../components/FarmerHeader";
import DetailsContainer from "../../../../components/DetailsContainer";
import Table from "../../../../components/Table";
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from "react-native-maps";
import Svg, { Path } from "react-native-svg";
import EventCard from "../../../../components/Cards/EventCard";
import common from "../../../../styles/common";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import MiniMapDetail from "../../../../components/Map/Common/Detail/MiniMapDetail";
import FullMapModal from "../../../../components/Modal/FullMapModal";
import NoDataComponent from "../../../../components/NoDataComponent";
import moment from "moment";
import networkContext from "../../../../contexts/NetworkContext";
import { useFarmerEventContext } from "../../../../contexts/FarmerEventsContext";
import React from "react";
import { getCropImage } from "../../Home";
import i18n from "../../../../i18n";

const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = 0.009;
const LATITUDE = 23.0245167;
const LONGITUDE = 72.5573282;

const getMapRegion = () => ({
  latitude: LATITUDE,
  longitude: LONGITUDE,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
});

export default function FarmDetails(props) {

  const {
    getEventByLandparcelId,
    eventInfo,
    eventLoading,
    getAggregatedEventsByLandparcelId
  } = useFarmerEventContext();

  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [mapFullscreen, setMapFullscreen] = useState(false);
  const navigation = useNavigation();
  const [farm, setFarm] = useState({});
  const [eventData, setEventData] = useState([]);
  const [createEventData, setCreateEventData] = useState();
  const [eventType, setEventType] = useState();
  const eventCacheData = useContext(networkContext);
  const [landParcelEvents, setLandParcelEvents] = useState([]);


  // Set farmer & land parcel ID 
  const getEvents = async () => {
    const landParcelId = props?.route?.params?.farm?._id;

    if (landParcelId) {
      setLandParcelEvents(await getEventByLandparcelId(landParcelId));
    }
  }
  useEffect(() => {

    getEvents()

  }, [eventInfo, eventLoading]);
  const updateEventDataAsPerCache = async () => {
    // console.log(JSON.stringify(await getAggregatedEventsByLandparcelId(props?.route?.params?.farm?._id), 2, 2), ' <======')
    if (!props?.route?.params?.farm?._id) {
      Toast.show({
        type: 'error',
        text2: 'Landparcel not found. Please contact your admin to check if the landparcel is added.'
      })
      return navigation.goBack();
    }
    console.log(props?.route?.params?.farm?.name);
    setFarm(props?.route?.params?.farm || {});
    setEventData(props?.route?.params?.eventDetails || (await getAggregatedEventsByLandparcelId(props?.route?.params?.farm?._id)) || []);
  }
  useEffect(() => {
    updateEventDataAsPerCache()
  }, [eventCacheData]);
  // console.log(">>>>>> Farm Ddetails<<<<<<<<<")
  // console.log(farm);

  var map = props?.route?.params?.farm?.map || "";
  map = map.split(" ");
  map = map.map((m) => ({
    latitude: parseFloat(m.split(",")[1]),
    longitude: parseFloat(m.split(",")[0]),
  }));
  map = map.filter(m => !isNaN(m.latitude) && !isNaN(m.longitude))

  // console.log(map, ' <== I am map')

  // const Map = () => (
  //   <MapView
  //     mapType="satellite"
  //     style={styles.map}
  //     provider={PROVIDER_GOOGLE}
  //     showUserLocation={false}
  //     followUserLocation={false}
  //     region={{
  //       ...getMapRegion(),
  //       latitude: map?.[0]?.latitude,
  //       longitude: map?.[0]?.longitude,
  //     }}
  //     // ref={MapView => (this.MapView = MapView)}

  //     moveOnMarkerPress={false}
  //     showsUserLocation={false}
  //     followsUserLocation={false}
  //     showsCompass={false}
  //     showsPointsOfInterest={false}
  //   >
  //     <Polyline
  //       coordinates={map}
  //       strokeWidth={5}
  //       strokeColor={"red"}
  //       strokeColors={["red", "green", "blue", "pink"]}
  //       fillColor={colors.primary}
  //     />
  //     {/* {map.map((point, index) => (
  //           <Marker
  //           key={index}
  //           coordinate={point}
  //           anchor={{ x: 0.5, y: 0.5 }}
  //           style={{
  //               justifyContent: "center",
  //               alignItems: "center",
  //               overflow: "visible",
  //           }}
  //           >
  //           <View
  //               style={{
  //               width: 15,
  //               height: 15,
  //               justifyContent: "center",
  //               alignItems: "center",
  //               overflow: "visible",
  //               }}
  //           >
  //               <Svg width="100%" height="100%" viewBox="-3 -3 6 6">
  //               <Path
  //                   strokeWidth={3}
  //                   fill={colors.primary}
  //                   d="m -3, 0 a 3,3 0 1,0 6,0 a 3,3 0 1,0 -6,0"
  //               />
  //               </Svg>
  //           </View>
  //           </Marker>
  //       ))} */}
  //   </MapView>
  // );

  const getCoordinates = () => map || [];

  const showCreateEventModal = (data = props?.route?.params?.farm, type = 'landparcel') => {
    setCreateEventData(data);
    setEventType(type)
    setShowCreateEvent(!showCreateEvent)
  }

  return (
    <SafeAreaView>
      <StatusBar />
      <FarmerHeader
        hideProfileImage={true}
        title={farm.name}
        subtitle={farm.address?.village + ", " + farm.address?.state}
      />
      <TouchableOpacity
        style={common.fabIcon}
        onPress={() => showCreateEventModal()}
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

        <DetailsContainer title={i18n.t('farmer.farmDetailsScreen.details')}>
          <Table
            rows={[
              {
                title: "Area",
                value: `${farm.areaInAcres} Acres`,
                visible: !!farm.areaInAcres,
              },
              {
                title: "Survey Number",
                value: farm.surveyNumber,
                visible: !!farm.surveyNumber,
              },
              {
                title: "Land ownership",
                value: farm.own ? "Own" : "Leased",
                visible: !!farm.id,
              },
            ]}
          />
        </DetailsContainer>

        <MiniMapDetail
          title={i18n.t('farmer.farmDetailsScreen.fieldAreaMap')}
          onPressMaximize={() => setMapFullscreen(true)}
          polylineCoordinates={getCoordinates()}
          from={"landparcel"}
        />

        <View style={{ marginBottom: 20 }}>
          <DetailsContainer title={i18n.t('farmer.farmDetailsScreen.crops')}>
            <View style={common.listData}>
              {farm?.crops &&
                farm?.crops?.map((crop, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      style={common.listItem}
                      onPress={() =>
                        navigation.navigate("CropDetails", {
                          crop: crop,
                          address: farm?.address,
                          eventDetails: eventData.filter(function (item) {
                            return item.cropId === crop._id;
                          }),
                          map: farm.map || []
                        })
                      }
                    >
                      <View style={styles.foodImgPart}>
                        <Image
                          source={getCropImage(crop.name)}
                          style={styles.farmFood}
                          resizeMode={"contain"}
                        />
                      </View>
                      <View style={common.listDetail}>
                        <View style={styles.foodNamePart}>
                          <Text style={common.listField}>{crop.name}</Text>
                          <Text style={common.listName}>{crop.cropType}</Text>
                        </View>
                        <TouchableOpacity
                          style={styles.cameraPart}
                          onPress={() => showCreateEventModal(crop, 'crop')}
                        >
                          <FontAwesome
                            name="camera"
                            size={24}
                            color={colors.primary}
                          />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  );
                })}
            </View>
          </DetailsContainer>

          <DetailsContainer title={i18n.t('farmer.farmDetailsScreen.events')}>
            {landParcelEvents
              ?.map((event, index) => {

                if (index >= 5) return <React.Fragment key={event.id || index}></React.Fragment>;

                return <EventCard
                  isCached={event.isCached}
                  landParcel={farm}
                  details={event}
                  title={moment(event.ts).format('YYYY-MM-DD HH:mm:ss')}
                  image={event?.image?.[0]?.[event.isCached ? 'uri' : 'link']}
                  key={event.id || index}
                />
              })}
            {!landParcelEvents.length && <NoDataComponent message={i18n.t('farmer.farmDetailsScreen.noEventsText')} icon={<MaterialIcons name="event" size={35} color="black" />} />}
          </DetailsContainer>
        </View>
      </ScrollView>

      <FullMapModal
        visible={mapFullscreen}
        polylineCoordinates={getCoordinates()}
        onRequestClose={() => {
          setMapFullscreen(false)
        }}
        from={"landparcel"}
      />

      <Modal
        isVisible={showCreateEvent}
        style={common.modal}
        onRequestClose={() => {
          setShowCreateEvent(false);
        }}
      >
        <CreateEvent
          type={eventType}
          details={createEventData}
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

  // duplicate style
  foodImgPart: {
    width: 64,
    marginRight: 16,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: colors.grayBorders,
    padding: 5,
    height: 60,
    width: 60,
  },
  cameraPart: {
    height: 56,
    width: 56,
    backgroundColor: colors.darkGray,
    borderRadius: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  foodImgPart: {
    width: 64,
    marginRight: 16,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: colors.grayBorders,
    padding: 5,
    height: 60,
    width: 60,
  },
  farmFood: {
    height: 50,
    width: 50,
  },
});
