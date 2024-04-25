import { useCallback, useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import call from "../../../utils/api";
import common from "../../../styles/common";
import colors from "../../../styles/colors";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator } from "react-native-paper";
import Header from "../../../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import FarmerHeader from "../../../components/FarmerHeader";
import EventCard from "../../../components/Cards/EventCard";
import NoDataComponent from "../../../components/NoDataComponent";
import { MaterialIcons, FontAwesome, Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import CreateEvent from "../Event/Create";
import moment from "moment";
import networkContext from "../../../contexts/NetworkContext";
import { getAllItems } from "../../../utils/eventQueue";
import React from "react";
import { useFarmerEventContext } from "../../../contexts/FarmerEventsContext";
import { isoToLocal } from "../../../utils/isToLocal";
import appConfig from "../../../config/app.config";
import i18n from "../../../i18n";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { urls } from "../../../config/urls";

export const getCropImage = (name) => {
  name = name.toLowerCase().replace(' ', '_')
  return { uri: urls.externalImages(`${name}.png`) }
}

export const getProductionSystemImage = (category) => {
  category = category.toLowerCase().replace(' ', '_')
  return { uri: urls.externalImages(`${category}.png`) };
};

const LandParcelDetails = (props) => {

  const {
    eventLoading,
    getAggregatedEventsByLandparcelId,
    getProductionSystemByLandparcelId,
    getProcessingSystemByLandparcelId,
    isProcessor
  } = useFarmerEventContext();

  const { farmerData, allCrops, setEventType, setCreateEventData, setShowCreateEvent } = props

  const [item, setItem] = useState();
  const [finalEvents, setFinalEvents] = useState();
  const [productionSystems, setProductionSystems] = useState([]);
  const [processingSystems, setProcessingSystems] = useState([]);
  const eventIcon = <MaterialIcons name="event" size={35} color="black" />;
  const cropIcon = <MaterialIcons name="grass" size={35} color="black" />;
  const eventCacheData = useContext(networkContext);
  const navigation = useNavigation();

  const updateEventDataAsPerCache = async () => {
    setItem(props?.item || {});
    // Here added filter if user is processor, remove the events which are not for processing systems
    setFinalEvents((await getAggregatedEventsByLandparcelId(props?.item?.id))?.filter(event => isProcessor || props.context === 'processors' ? event.processingSystemId : true))
    setProductionSystems(await getProductionSystemByLandparcelId(props?.item?.id));
    setProcessingSystems(await getProcessingSystemByLandparcelId(props?.item?.id));
  }

  useEffect((...pp) => {
    updateEventDataAsPerCache()
    return () => { setItem({}); }
  }, [props.item, eventCacheData, eventLoading])

  return <>
    <View
      style={{ ...styles.listPart, ...styles.listPartFlatList }}
    >
      {appConfig.appName == 'farmbook' && !isProcessor && props.context !== 'processors' && (
        <>
          <Text style={common.innerTitle}>{i18n.t('farmer.crops')}</Text>
          {
            (item?.crops?.length || 0) > 0
              ? (
                <View style={common.listData}>
                  {(item?.crops || []).map((crop, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={common.listItem}
                        onPress={() =>
                          navigation.navigate("CropDetails", {
                            crop: crop,
                            address:
                              farmerData?.[0]?.landParcels?.[index]
                                ?.address || "",
                            eventDetails: finalEvents.filter(function (
                              item
                            ) {
                              return item.cropId === crop._id;
                            }),
                            map: props?.item?.map
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
                            <Text style={common.listField}>
                              {crop.name}
                            </Text>
                            {crop?.fbId && <Text style={common.listName}>
                              {crop?.fbId}
                            </Text>}
                            <Text style={common.listName}>
                              Area: {crop?.areaInAcres || 0} acres
                            </Text>
                          </View>
                          <TouchableOpacity
                            style={styles.cameraPart}
                            onPress={() => {
                              setEventType("crop");
                              setCreateEventData(crop);
                              setShowCreateEvent(true);
                            }}
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
              ) : <NoDataComponent
                message={"No crops found"}
                icon={cropIcon}
              />
          }
        </>
      )}
    </View>


    {/* Add Production System */}
    {productionSystems?.length > 0 && !isProcessor && props.context !== 'processors' && (
      <View style={{ ...styles.listPart, ...styles.listPartFlatList }}>
        <Text style={common.innerTitle}>
          {i18n.t("farmer.productionSystem")}
        </Text>
        {(productionSystems?.length || 0) > 0 ? (
          <View style={common.listData}>
            {(productionSystems || []).map((productionSystem, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={common.listItem}
                  onPress={() =>
                    navigation.navigate("ProductionSystemDetails", {
                      productionSystem: productionSystem,
                      address:
                        farmerData?.[0]?.landParcels?.[index]?.address || "",
                      // eventDetails: finalEvents.filter(function (item) {
                      //   return item.cropId === crop._id;
                      // }),
                      map: farmerData?.[0]?.landParcels?.[0]?.map,
                    })
                  }
                >
                  {/* There is no image of production system as of now */}
                  <View style={{ ...styles.foodImgPart, overflow: 'hidden' }}>
                    <Image
                      source={getProductionSystemImage(
                        productionSystem.category
                      )}
                      style={styles.farmFood}
                    // resizeMode={"contain"}
                    />
                  </View>
                  <View style={common.listDetail}>
                    <View style={{ flex: 1 }}>
                      <Text style={common.listField}>
                        {`${productionSystem.name} - ${productionSystem.category} `}
                      </Text>
                      {/* <Text style={common.listName}>
                        Area: {crop?.areaInAcres || 0} acres
                      </Text> */}
                    </View>
                    <TouchableOpacity
                      style={styles.cameraPart}
                      onPress={() => {
                        setEventType("productionSystem");
                        setCreateEventData(productionSystem);
                        setShowCreateEvent(true);
                      }}
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
        ) : (
          <NoDataComponent
            message={"No Production System found"}
            icon={cropIcon}
          />
        )}
      </View>
    )}
    {/* Add Production System */}


    {/* Add processing System */}
    {processingSystems?.length > 0 && (
      <View style={{ ...styles.listPart, ...styles.listPartFlatList }}>
        <Text style={common.innerTitle}>
          {i18n.t("farmer.processingSystem")}
        </Text>
        {(processingSystems?.length || 0) > 0 ? (
          <View style={common.listData}>
            {(processingSystems || []).map((processingSystem, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={common.listItem}
                  onPress={() =>
                    navigation.navigate("ProcessingSystemDetails", {
                      processingSystem: processingSystem,
                      address:
                        farmerData?.[0]?.landParcels?.[index]?.address || "",
                      // eventDetails: finalEvents.filter(function (item) {
                      //   return item.cropId === crop._id;
                      // }),
                      map: farmerData?.[0]?.landParcels?.[0]?.map,
                    })
                  }
                >
                  {/* There is no image of processing system as of now */}
                  <View style={{ ...styles.foodImgPart, overflow: 'hidden', borderWidth: 0 }}>
                    <Image
                      source={require('../../../assets/settings.png')}
                      style={{ height: 40, width: 40 }}
                    // resizeMode={"contain"}
                    />
                  </View>
                  <View style={common.listDetail}>
                    <View style={{ flex: 1 }}>
                      <Text style={common.listField}>
                        {`${processingSystem.name} - ${processingSystem.category} `}
                      </Text>
                      {/* <Text style={common.listName}>
                        Area: {crop?.areaInAcres || 0} acres
                      </Text> */}
                    </View>
                    <TouchableOpacity
                      style={styles.cameraPart}
                      onPress={() => {
                        setEventType("processingSystem");
                        setCreateEventData(processingSystem);
                        setShowCreateEvent(true);
                      }}
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
        ) : (
          <NoDataComponent
            message={"No Processing System found"}
            icon={cropIcon}
          />
        )}
      </View>
    )}
    {/* Add Processing System */}


    <View style={{ paddingHorizontal: 16 }}>
      <View style={styles.listPart}>
        <Text style={common.innerTitle}>{i18n.t('farmer.events')}</Text>
        <View style={{ ...common.listData, marginBottom: 10 }}>
          {/* While events are being fetched */}
          {(eventLoading) && (
            <>
              <ActivityIndicator />
            </>
          )}

          {/* events are fetched and has valid response */}
          {(!eventLoading) &&
            finalEvents?.length ?
            finalEvents.map((event, index) => (
              index < 5 ?
                <EventCard
                  isCached={event.isCached}
                  key={event.id || index}
                  title={isoToLocal(event.ts)}
                  image={event?.image?.[0]?.[event.isCached ? 'uri' : 'link']}
                  details={{ ...event, isProductionSystem: !!event.productionSystemId, isProcessingSystem: !!event.processingSystemId }}
                  landParcel={(farmerData?.[0]?.landParcels || []).find(landparcel => landparcel._id === event.cropId || landparcel._id === event.landParcelId)}
                  crop={
                    allCrops.find((crop) => crop._id === event.cropId) ||
                    {}
                  }
                />
                : <React.Fragment key={index}></React.Fragment>
            ))
            : <></>
          }

          {/* No events found */}
          {(!eventLoading) && (!finalEvents || !finalEvents.length) && (
            <NoDataComponent
              message={i18n.t('farmer.noEventsText')}
              icon={eventIcon}
            />
          )}
        </View>
      </View>
    </View>
  </>
}


export default function FarmerHome(props) {

  const navigation = useNavigation();

  const {
    eventLoading,
    setFarmer,
    homeApi,
    farmer
  } = useFarmerEventContext();
  const [loading, setLoading] = useState(false);

  const [farmerData, setFarmerData] = useState([]);
  const [allCrops, setAllCrops] = useState([]);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [createEventData, setCreateEventData] = useState();
  const [eventType, setEventType] = useState();
  const [finalEvents, setFinalEvents] = useState([])

  // Set farmer ID 
  if (props?.route?.params?.loggedInAs === "FARMER" || props?.route?.params?.loggedInAs === "PROCESSOR") {
    useEffect(() => {
      setLoading(true);

      homeApi('farmer').then(() => {

      }).finally(() => setLoading(false));

    }, []);
  } else {
    useEffect(() => {
      if (props?.route?.params?.farmer) {
        setFarmer(props?.route?.params?.farmer)
        // setFarmerData([props?.route?.params?.farmer]);
      } else {
        Toast.show({
          type: 'error',
          text2: 'Farmer not found. Please contact your admin to check if the farmer is assigned.'
        })
        navigation.goBack();
      }
    }, []);
  }

  useEffect(() => {
    (farmer && Object.keys(farmer).length > 0) && setFarmerData([farmer])
  }, [farmer])

  useEffect(() => {
    if (farmerData.length) {
      let crops = [];
      farmerData[0].landParcels.map((land) => {
        land.crops.map((crop) => {
          crops.push(crop);
        });
      });
      setAllCrops(crops);
    }
  }, [farmerData]);

  // const farmer = farmerData

  // Listen to scroll
  const {
    onScroll,
    currentScrolledIndex
  } = useOnFlatListScrolled();


  // On scroll change land parcel details
  const [selectedLandparcel, setSelectedLandparcel] = useState();

  useEffect(() => {

    const landParcel = (farmerData?.[0]?.landParcels || [])[currentScrolledIndex];

    setSelectedLandparcel(landParcel);

  }, [farmerData, currentScrolledIndex])

  var context = props?.route?.params?.context || 'farmers'
  if (props?.route?.params?.loggedInAs === "FARMER" || props?.route?.params?.loggedInAs === "PROCESSOR") {
    context = props?.route?.params?.loggedInAs === "FARMER" ? 'farmers' : 'processors'
  }
  return (
    <>
      <SafeAreaView style={common.homeScreen}>
        <StatusBar />
        {props?.route?.params?.fromAgent ? (
          <FarmerHeader
            title={`${farmerData?.[0]?.firstName || ""} ${farmerData?.[0]?.lastName || ""}`}
            subtitle={i18n.t(`farmer.navbarSubtitle.${context}`)}
            profileImage={farmerData?.[0]?.profilePicture}
            firstName={farmerData?.[0]?.firstName}
            lastName={farmerData?.[0]?.lastName}
            menuOptions={[
              {
                element: (
                  <Text style={common.menuOptionText}>{i18n.t(`farmer.farmerProfile.${context}`)}</Text>
                ),
                onSelect: () =>
                  navigation.navigate("FarmerProfile", {
                    details: {
                      ...farmerData?.[0],
                      profileId: farmerData?.[0]?.orgDetails?.farmerID,
                      address:
                        `${farmerData?.[0]?.address?.village}` +
                        ", " +
                        `${farmerData?.[0]?.address?.state}` +
                        " " +
                        `${farmerData?.[0]?.address?.pincode}`,
                    },
                    type: "Farmer",
                    context
                  }),
              },
            ]}
          />
        ) : (
          <FarmerHeader
            leftIcon={
              <Image
                resizeMode="contain"
                style={{ width: 100, height: 30, marginLeft: -20 }}
                source={
                  appConfig.config.logo
                    ? { uri: appConfig.config.logo }
                    : logoConfig()
                }
              />
            }
            // title={`${farmerData?.[0]?.firstName || ""} ${farmerData?.[0]?.lastName || ""}`}
            // subtitle={"Farmer"}
            profileImage={farmerData?.[0]?.profilePicture}
            firstName={farmerData?.[0]?.firstName}
            lastName={farmerData?.[0]?.lastName}
            menuOptions={[
              {
                element: (
                  <Text style={common.menuOptionText}>{i18n.t(`farmer.farmerProfile.${context}`)}</Text>
                ),
                onSelect: () =>
                  navigation.navigate("FarmerProfile", {
                    details: {
                      ...farmerData?.[0],
                      profileId: farmerData?.[0]?.orgDetails?.farmerID,
                      address:
                        `${farmerData?.[0]?.address?.village}` +
                        ", " +
                        `${farmerData?.[0]?.address?.state}` +
                        " " +
                        `${farmerData?.[0]?.address?.pincode}`,
                    },
                    type: "Farmer",
                  }),
              },
            ]}
          />
        )}
        {!loading && (
          <ScrollView style={{}}>
            <FlatList
              viewabilityConfig={{
                waitForInteraction: true,
                itemVisiblePercentThreshold: 65
              }}
              showsHorizontalScrollIndicator={false}
              horizontal
              contentContainerStyle={{ paddingRight: 24 }}
              style={{ marginRight: 0, paddingLeft: 8 }}
              data={farmerData?.[0]?.landParcels || []}
              onViewableItemsChanged={onScroll}
              renderItem={({ item }) => (
                <View>
                  <TouchableOpacity
                    style={styles.farmImagePart}
                    onPress={() =>
                      navigation.navigate("FarmDetails", {
                        farm: item,
                        eventDetails: finalEvents,
                      })
                    }
                  >
                    <Image
                      source={require("../../../assets/farm.png")}
                      style={styles.farmImage}
                    />
                    <View style={styles.textOnImage}>
                      <LinearGradient
                        colors={[
                          "rgba(249, 249, 249, 0.94) 64.87%",
                          "rgba(255, 255, 255, 0) 76.52%",
                        ]}
                        start={{ x: 0.4, y: 0 }}
                        end={{ x: 0.8, y: 0 }}
                        style={styles.imageText}
                      >
                        <Text style={styles.cityName} numberOfLines={1}>{item.name}</Text>
                        <Text style={styles.stateName} numberOfLines={1}>
                          {item?.address?.village}, {item?.address?.state}
                        </Text>
                      </LinearGradient>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          marginTop: 20,
                        }}
                      >
                        <TouchableOpacity
                          style={{
                            padding: 10,
                            marginRight: 18,
                            backgroundColor: "rgba(0,0,0,0.6)",
                            borderRadius: 5,
                          }}
                          onPress={() => {
                            setEventType("landparcel");
                            setCreateEventData(item);
                            setShowCreateEvent(true);
                          }}
                        >
                          <FontAwesome name="camera" size={18} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            padding: 10,
                            backgroundColor: "rgba(0,0,0,0.6)",
                            borderRadius: 5,
                          }}
                          onPress={() => { navigation.navigate("Mapp", { type: "landparcel", landParcel: item, farmerId: farmerData?.[0]?.id, context }) }}
                        >
                          <Ionicons name="map" size={18} color="white" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>

                </View>
              )}
            // keyExtractor={({ item }) => item.id}
            />

            <LandParcelDetails
              allCrops={allCrops}
              farmerData={farmerData}
              item={selectedLandparcel}
              setFinalEvents={setFinalEvents}
              eventLoading={eventLoading}
              setEventType={setEventType}
              setCreateEventData={setCreateEventData}
              setShowCreateEvent={setShowCreateEvent}
              context={context}
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
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  );
}

const useOnFlatListScrolled = () => {

  // To listen on scroll items
  const [currentScrolledIndex, setCurrentScrolledIndex] = useState(0);

  const onScroll = useCallback((scroll) => {

    if (!scroll?.viewableItems?.length > 0) return

    const [{ index }] = scroll?.viewableItems;

    return setCurrentScrolledIndex(index);

  }, []);

  return { onScroll, currentScrolledIndex }
};

const styles = StyleSheet.create({
  listPartFlatList: {
    width: Dimensions.get("screen").width - 32,
    marginLeft: 16,
  },
  listPart: {
    marginTop: 20,
    width: "100%",
  },
  farmFood: {
    height: 50,
    width: 50,
  },
  homeScreen: {
    background: colors.white,
    padding: 16,
  },
  logoPart: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  farmImage: {
    borderRadius: 20,
    width: Dimensions.get("screen").width - 32,
  },
  foodNamePartfull: {
    maxWidth: 240,
  },
  lightText: {
    fontSize: 11,
    color: colors.gray,
    opacity: 0.2,
  },
  eventItem: {
    borderWidth: 1,
    borderColor: colors.borderColor,
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
    overflow: 'hidden'
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
  farmImagePart: {
    // position:'relative'
    paddingLeft: 8,
  },
  textOnImage: {
    position: "absolute",
    top: 36,
    width: "100%",
    paddingLeft: 8,
  },
  imageText: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    width: "100%",
  },
  cityName: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.black,
  },
  stateName: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.black,
  },
});
