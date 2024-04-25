/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Dimensions,
  ScrollView,
  Image,
  Linking,
  Button,
  Pressable,
  ActivityIndicator,
} from "react-native";
import MapView, {
  Marker,
  AnimatedRegion,
  Polyline,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import haversine from "haversine";
import Geolocation from "@react-native-community/geolocation";
import ActionSheet from "react-native-actions-sheet";
import { Ionicons, Entypo, MaterialIcons } from "@expo/vector-icons";
import moment from "moment";
import Svg, { Path } from "react-native-svg";
import tokml from "geojson-to-kml";
import RNFS from "react-native-fs";
import * as FileSystem from "expo-file-system";
import { StorageAccessFramework } from "expo-file-system";
import colors from "../../styles/colors";
import common from "../../styles/common";
import { TextInput } from "react-native-paper";
import { Modal, Portal, Provider } from "react-native-paper";
import { kml } from "../../utils/createKml";
import call from "../../utils/api";
import { useFarmerEventContext } from "../../contexts/FarmerEventsContext";
import { setItem } from "../../utils/commonQueue";
import commonNetworkListener from "../../utils/commonNetworkListener";
import { useNetInfo } from '@react-native-community/netinfo';
import networkContext from "../../contexts/NetworkContext";
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import { useMapParamsContext } from "../../contexts/MapParamsContext";
import * as Sentry from "@sentry/react-native";
import { writeLog } from "../../utils/sentryLogsQueue";
import i18n from "../../i18n";
import { useKeepAwake } from 'expo-keep-awake';
import { Toast } from "react-native-toast-message/lib/src/Toast";
import appConfig from "../../config/app.config";
import AsyncStorage from "../../utils/AsyncStorage";

// import * as Permissions from 'expo-permissions';
// import * as MediaLibrary from 'expo-media-library';

// import * as Clipboard from 'expo-clipboard';

// import NetInfo from '@react-native-community/netinfo';

// const LATITUDE = 29.95539;
// const LONGITUDE = 78.07513;
const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = 0.009;
const LATITUDE = 23.0245167;
const LONGITUDE = 72.5573282;
const ALTITUDE = 0;

// const logo = require('./assets/logo.png');
// const google = require('./assets/google.png');
const navigator = { geolocation: Geolocation };

const makeFile = async (kml, filename) => {
  try {
    const permissions =
      await StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!permissions.granted) {
      return;
    }
    try {
      let response = await StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
        filename,
        "application/vnd"
      );
      await StorageAccessFramework.writeAsStringAsync(response, kml);
      return `${permissions.directoryUri}/${filename}.kml`
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
};

// const netInfo = useNetInfo();


class MapTraceClass extends React.Component {
  constructor(props) {
    super(props);

    let tempCoords = [
      {
        "latitude": 10.58920583802144,
        "longitude": 78.1562883003307,
        "altitude": 0
      },
      {
        "latitude": 10.58912469664045,
        "longitude": 78.15628350943541,
        "altitude": 0
      },
      {
        "latitude": 10.58912265771049,
        "longitude": 78.15635038104583,
        "altitude": 0
      },
      {
        "latitude": 10.58912070810682,
        "longitude": 78.15646212710503,
        "altitude": 0
      },
      {
        "latitude": 10.58911703918734,
        "longitude": 78.15660528894871,
        "altitude": 0
      },
      {
        "latitude": 10.58918321701669,
        "longitude": 78.15663484098299,
        "altitude": 0
      },
      {
        "latitude": 10.58928711342428,
        "longitude": 78.15668017278155,
        "altitude": 0
      },
      {
        "latitude": 10.58927821654065,
        "longitude": 78.15654382342558,
        "altitude": 0
      },
      {
        "latitude": 10.58927323103201,
        "longitude": 78.15644251670996,
        "altitude": 0
      },
      {
        "latitude": 10.58927253407507,
        "longitude": 78.15628928654259,
        "altitude": 0
      },
      {
        "latitude": 10.58920583802144,
        "longitude": 78.1562883003307,
        "altitude": 0
      }
    ]

    this.state = {
      mapType: 'standard',
      modalVisible: false,
      loading: true,
      errors: [],
      accuracy: 0,
      latitude: LATITUDE,
      longitude: LONGITUDE,
      altitude: ALTITUDE,
      routeCoordinates: [
        // { latitude: 37.421098333333335, longitude: -122.0849 },
        // { latitude: 37.422008333333335, longitude: -122.0842 },
        // { latitude: 37.423098333333335, longitude: -122.0849 },
        // ...tempCoords
      ],
      distanceTravelled: 0,
      fromLandparcel: false,
      landParcelInfo: {},
      prevLatLng: {},
      isGpsEnabled: false,
      coordinate: new AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: 0,
        longitudeDelta: 0,
      }),
    };
    this.handlePositionUpdate.bind(this);
  }

  count = 0

  handlePositionUpdate(position) {
    const { coordinate, routeCoordinates, distanceTravelled } = this.state;
    const { latitude, longitude, accuracy, altitude } = position.coords;
    this.count++
    writeLog(`${this.count} : COUNT OF LOCATION fetches`, "debug");
    writeLog(`${JSON.stringify(this.watchIDs)} : Watchers....`, "debug");
    console.log(latitude, longitude, accuracy, this.watchIDs, this.count, " ,=== accuracy in handle...");
    let loading = false;
    // if (accuracy <= 50) {
    //   loading = false;
    // }
    this.setState({
      accuracy,
      loading
    });

    const newCoordinate = {
      latitude,
      longitude,
      altitude
    };

    if (Platform.OS === "android") {
      if (this.marker && this.marker) {
        this.marker.animateMarkerToCoordinate(newCoordinate, 500);
      }
    } else {
      coordinate.timing(newCoordinate).start();
    }
    var newRouteCoordinates = routeCoordinates;
    if (this.state.start) {
      newRouteCoordinates = newRouteCoordinates.concat([newCoordinate]);
    }
    this.setState({
      latitude,
      longitude,
      altitude,
      routeCoordinates: newRouteCoordinates,
      distanceTravelled: distanceTravelled + this.calcDistance(newCoordinate),
      prevLatLng: newCoordinate,
      loading
    });
  }

  calculateAreaInSquareMeters(x1, x2, y1, y2) {
    return (y1 * x2 - x1 * y2) / 2;
  }

  calculateYSegment(latitudeRef, latitude, circumference) {
    return ((latitude - latitudeRef) * circumference) / 360.0;
  }

  calculateXSegment(longitudeRef, longitude, latitude, circumference) {
    return (
      ((longitude - longitudeRef) *
        circumference *
        Math.cos(latitude * (Math.PI / 180))) /
      360.0
    );
  }

  calcArea(locations) {
    if (!locations.length) {
      return 0;
    }
    if (locations.length < 3) {
      return 0;
    }
    let radius = 6371000;

    const diameter = radius * 2;
    const circumference = diameter * Math.PI;
    const listY = [];
    const listX = [];
    const listArea = [];
    // calculate segment x and y in degrees for each point

    const latitudeRef = locations[0].latitude;
    const longitudeRef = locations[0].longitude;
    for (let i = 1; i < locations.length; i++) {
      let latitude = locations[i].latitude;
      let longitude = locations[i].longitude;
      listY.push(this.calculateYSegment(latitudeRef, latitude, circumference));

      listX.push(
        this.calculateXSegment(longitudeRef, longitude, latitude, circumference)
      );
    }

    // calculate areas for each triangle segment
    for (let i = 1; i < listX.length; i++) {
      let x1 = listX[i - 1];
      let y1 = listY[i - 1];
      let x2 = listX[i];
      let y2 = listY[i];
      listArea.push(this.calculateAreaInSquareMeters(x1, x2, y1, y2));
    }

    // sum areas of all triangle segments
    let areasSum = 0;
    listArea.forEach((area) => (areasSum = areasSum + area));

    // get abolute value of area, it can't be negative
    let areaCalc = Math.abs(areasSum); // Math.sqrt(areasSum * areasSum);
    return (areaCalc / 4046.8564224).toFixed(2); // Acres
  }

  calcCenter(coordinates) {
    const numCoords = coordinates.length;
    let avgLat = 0;
    let avgLng = 0;

    coordinates.forEach((coord) => {
      avgLat += coord.latitude;
      avgLng += coord.longitude;
    });

    avgLat /= numCoords;
    avgLng /= numCoords;

    return {
      lat: avgLat,
      lng: avgLng,
    };
  }

  checkLocation() {
    // RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
    //   interval: 10000,
    //   fastInterval: 5000,
    // })
    //   .then((data) => {
    //     // The user has accepted to enable the location services
    //     // data can be :
    //     //  - "already-enabled" if the location services has been already enabled
    //     //  - "enabled" if user has clicked on OK button in the popup
    //     if ((data === "enabled") || (data === "already-enabled")) {
    //       this.setState({ isGpsEnabled: true })
    //     }

    //   })
    //   .catch((err) => {
    //     Toast.show({
    //       type: 'error',
    //       text2: 'Please enable location access to the app to use this feature.'
    //     });
    //     this.props.navigation.goBack()
    //   });
  }

  fetchCurrentLocation() {
    console.log('fetch loc called..')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { accuracy } = position.coords;
        console.log(accuracy, ' ,=== acc in parent')
        if (accuracy <= 50) {
          this.handlePositionUpdate(position);
        } else {
          this.fetchCurrentLocation();
        }
      },
      (error) => {
        this.setState({
          errors: [
            ...this.state.errors,
            { message: error.message, time: new Date() },
          ],
        });
        if (false && error.message === "Location request timed out") {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { accuracy } = position.coords;
              // console.log(accuracy, ' ,=== acc in child')
              if (accuracy <= 50) {
                this.handlePositionUpdate(position);
              } else {
                this.fetchCurrentLocation();
              }
            },
            (error) => {
              this.setState({
                errors: [
                  ...this.state.errors,
                  { message: error.message, time: new Date() },
                ],
              });
            },
            {
              enableHighAccuracy: false,
              timeout: 20000,
              maximumAge: 1000,
              distanceFilter: 10,
            }
          );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 1000,
        maximumAge: 1000,
        distanceFilter: 10,
        ...(this.props.params || {})
      }
    );
  }

  componentDidMount() {
    if (this.props?.route?.params?.type === "landparcel") {
      this.setState({ fromLandparcel: true, landParcelInfo: this.props?.route?.params?.landParcel })
    }
    this.setState({ loading: true });
    // this.fetchCurrentLocation();
    // this.checkLocation();
  }

  // componentDidUpdate() {
  //   console.log(this.watchIDs, ' <== I am watchers')
  // }

  componentWillUnmount() {
    // if(this.removeNetInfoSubscription) {
    //   this.removeNetInfoSubscription()
    // }
    if (this.watchIDs) {
      this.watchIDs.map((watchId) => {
        navigator.geolocation.clearWatch(watchId);
      });
    }
  }

  getMapRegion = () => ({
    latitude: this.state.latitude,
    longitude: this.state.longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  calcDistance = (newLatLng) => {
    const { prevLatLng } = this.state;
    return haversine(prevLatLng, newLatLng) || 0;
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.start !== this.state.start) {
      if (this.state.start) {
        if (!this.watchIDs) {
          this.watchIDs = [];
        }

        // this.setState({ loading: true });
        const watchId = navigator.geolocation.watchPosition(
          this.handlePositionUpdate.bind(this),
          (error) => {
            this.setState({
              errors: [
                ...this.state.errors,
                { message: error.message, time: new Date() },
              ],
            });
            if (
              false &&
              error.message === "Location request timed out" &&
              this.watchIDs.length < 2
            ) {
              var newWatchId = navigator.geolocation.watchPosition(
                this.handlePositionUpdate.bind(this),
                (error) =>
                  this.setState({
                    errors: [
                      ...this.state.errors,
                      { message: error.message, time: new Date() },
                    ],
                  }),
                {
                  enableHighAccuracy: false,
                  timeout: 20000,
                  maximumAge: 1000,
                  distanceFilter: 10,
                }
              );
              this.watchIDs.push(newWatchId);
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 10,
            maximumAge: 1000,
            distanceFilter: 10,
            ...(this.props.params || {})
          }
        );

        this.watchIDs.push(watchId);
      } else {
        const { routeCoordinates } = this.state;
        if (routeCoordinates && routeCoordinates.length > 1) {
          this.setState({
            routeCoordinates: routeCoordinates.concat([routeCoordinates[0]]),
          });
        }

        if (this.watchIDs) {
          this.watchIDs.map((watchId) => {
            navigator.geolocation.clearWatch(watchId);
          });
          this.watchIDs = []
        }
      }
    }
    if (!prevProps.isGpsEnabled && this.props.isGpsEnabled) {
      this.fetchCurrentLocation();
    }
  }

  handleStart = () => {
    this.setState({ start: true });
  };

  handleStop = () => {
    this.setState({ start: false });
  };

  handleClear = () => {
    this.setState({
      start: false,
      routeCoordinates: [],
      distanceTravelled: 0,
      prevLatLng: {},
      coordinate: new AnimatedRegion({
        latitude: this.state.LATITUDE,
        longitude: this.state.LONGITUDE,
        latitudeDelta: 0,
        longitudeDelta: 0,
      }),
    });
  };

  clearErrors = () => {
    this.setState({ errors: [] });
  };

  handleUndo = () => {
    var { routeCoordinates } = this.state;
    if (routeCoordinates && routeCoordinates.length > 1) {
      // delete routeCoordinates[routeCoordinates.length - 1]
      this.setState((state) => {
        var newCoordinates = state.routeCoordinates.filter(
          (item, index) => index !== state.routeCoordinates.length - 1
        );
        // console.log(state.routeCoordinates.length, ' <=== Before...')
        // delete newCoordinates[newCoordinates.length - 1]
        // newCoordinates.splice(-1)
        // console.log(newCoordinates.length, ' <=== after...')

        return {
          routeCoordinates: newCoordinates,
        };
      });
    }
  };

  onSavePress() {
    if (this.state.fromLandparcel) {
      this.saveLandparcel()
    } else {
      this.setState({ modalVisible: true })
    }
  }



  async saveLandparcel() {
    try {
      const context = this.props?.context || 'farmers'
      this.setState({ loading: true });
      if (Object.keys(this.state.landParcelInfo).length > 0) {
        let result = []
        this.state.routeCoordinates.forEach((coord) => {
          result.push(`${coord.longitude},${coord.latitude}`)
        })
        if (this.state.landParcelInfo?.status == 'Draft') {
          // let response = await call(`fb-mobile/landparcel/${this.state.landParcelInfo._id}`, 'post', {
          //   map: result.join(" ")
          // })

          let formattedData = {
            url: `fb-mobile/landparcel/${this.state.landParcelInfo._id}`,
            method: 'post',
            data: {
              map: result.join(" "),
              calculatedAreaInAcres: this.calcArea(this.state.routeCoordinates),
              location: this.calcCenter(this.state.routeCoordinates)
            },
            status: 1,
            isCached: true,
            type: 'landParcelMap',
            isJson: true
          }

          await setItem(formattedData)
          commonNetworkListener(this.props.netInfo, this.props.setEventInfo);

          if (this.props.from === 'agent') {

            let updatedFarmers = this.props.agentData?.[context].map((farmer) => {
              if (farmer.id === this.props?.route?.params?.farmerId) {
                farmer.landParcels
                let updatedLandParcels = farmer?.landParcels.map((landParcel) => {
                  if (landParcel._id === this.state.landParcelInfo._id) {
                    return {
                      ...landParcel,
                      map: result.join(" ")
                    }
                  } else {
                    return landParcel
                  }
                })
                return { ...farmer, landParcels: updatedLandParcels }
              } else {
                return farmer
              }
            })

            this.props.setAgentData({ ...this.props.agentData, [context]: updatedFarmers })

          }
          let updatedLandParcels = this.props.farmer?.landParcels.map((landParcel) => {
            if (landParcel._id === this.state.landParcelInfo._id) {
              return {
                ...landParcel,
                map: result.join(" ")
              }
            } else {
              return landParcel
            }
          })
          this.props.setFarmer({ ...this.props.farmer, landParcels: updatedLandParcels })

          this.props.navigation.navigate('FarmDetails', {
            farm: {
              ...this.state.landParcelInfo,
              map: result.join(" ")
            }
          })
        } else {
          this.setState({ modalVisible: false })
          Toast.show({
            type: 'error',
            text2: "The land parcel is not in 'Draft' status to make this change. Please contact your admin."
          });
        }
      } else {
        Toast.show({
          type: 'error',
          text2: "Land parcel not found. Please contact your admin to check if the land parcel is added."
        });
      }
    } catch (e) {
      writeLog(e?.message, 'debug')
      Toast.show({
        type: 'error',
        text2: e?.message
      });
      console.log(e)
    } finally {
      this.setState({ loading: false });
    }
  }

  async onSave() {

    const { name } = this.state
    if (name) {
      const kmlContent = kml(this.state.routeCoordinates, name)
      makeFile(kmlContent, name);
      var mapData = await AsyncStorage.getItem('mapData')
      if (!mapData) {
        mapData = '[]'
      }
      try {
        mapData = JSON.parse(mapData)
      } catch (error) {
        mapData = []
      }

      mapData.push({
        name,
        routeCoordinates: this.state.routeCoordinates,
        date: new Date
      })

      await AsyncStorage.setItem('mapData', JSON.stringify(mapData))
      this.setState({ modalVisible: false }, () => {
        this.handleClear()
      })
      setTimeout(() => {
        Toast.show({
          type: 'success',
          text2: "Map recorded successfully!"
        });
        this.props.navigation.navigate('MapHistory')
      }, 500)
    }
  }

  render() {
    const { start, routeCoordinates, loading, modalVisible, name } = this.state;

    return (
      <Provider>
        <Portal>
          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => this.setState({ modalVisible: false })}
          >
            <View style={{ margin: 16, padding: 16, backgroundColor: colors.properWhite, borderRadius: 20 }}>
              <TextInput
                autoComplete={Platform.OS === 'web' ? 'none' : 'off'}
                mode="outlined"
                placeholder="Name"
                label={"Name"}
                outlineColor={colors.grayBorders}
                activeOutlineColor={colors.primary}
                outlineStyle={{ borderWidth: 1 }}
                value={name}
                onChangeText={e => this.setState({ name: e })}
              />
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1, padding: 4 }}>
                  <TouchableOpacity
                    style={{ ...common.button, marginTop: 8 }}
                    onPress={() => this.onSave()}
                  >
                    <Text style={{ ...common.buttonText }}>Save</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1, padding: 4 }}>
                  <TouchableOpacity
                    style={{ ...common.button, ...common.buttonSecondary, marginTop: 8 }}
                    onPress={() => this.setState({ modalVisible: false })}
                  >
                    <Text style={{ ...common.buttonText, ...common.buttonTextSecondary }}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>

            </View>
          </Modal>
        </Portal>
        <View style={styles.container}>
          {loading && (
            <View
              style={{
                position: 'absolute',
                height: Dimensions.get('screen').height,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.white,
                zIndex: 99
              }}
            >
              <ActivityIndicator size={42} />
              <Text style={{ marginTop: 20 }}>
                {i18n.t('mapTraceBoundaries.loadingMessage')}
              </Text>
            </View>
          )}
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            showUserLocation
            followUserLocation
            region={this.getMapRegion()}
            ref={(MapView) => (this.MapView = MapView)}
            moveOnMarkerPress={false}
            showsUserLocation={true}
            followsUserLocation={true}
            showsCompass={true}
            showsPointsOfInterest={true}
            mapType={this.state.mapType}
          >
            <Polyline
              coordinates={this.state.routeCoordinates}
              strokeWidth={5}
              strokeColor={"red"}
              strokeColors={["red", "green", "blue", "pink"]}
              fillColor={colors.primary}
            // lineDashPattern={[ 1, 3, 2, 1 ]}
            />
            {/* {this.state.routeCoordinates.map((point, index) => (
              <Marker
                key={index}
                coordinate={point}
                anchor={{ x: 0.5, y: 0.5 }}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "visible",
                }}
              >
                <View
                  style={{
                    width: 15,
                    height: 15,
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "visible",
                  }}
                >
                  <Svg width="100%" height="100%" viewBox="-3 -3 6 6">
                    <Path
                      strokeWidth={3}
                      fill={colors.primary}
                      d="m -3, 0 a 3,3 0 1,0 6,0 a 3,3 0 1,0 -6,0"
                    />
                  </Svg>
                </View>
              </Marker>
            ))} */}
          </MapView>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {!start ? (
                <TouchableOpacity onPress={this.handleStart}>
                  <Ionicons
                    name="md-play-circle"
                    size={62}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={this.handleStop}>
                  <Ionicons name="ios-stop-circle" size={62} color={colors.primary} />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                disabled={routeCoordinates && routeCoordinates.length < 2}
                onPress={this.onSavePress.bind(this)}
              >
                <MaterialIcons
                  name="save"
                  size={62}
                  color={
                    routeCoordinates && routeCoordinates.length < 2
                      ? "gray"
                      : colors.primary
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.handleClear}
                disabled={routeCoordinates && routeCoordinates.length < 2}
              >
                <Ionicons
                  name="ios-trash-bin"
                  size={55}
                  color={
                    routeCoordinates && routeCoordinates.length < 2
                      ? "gray"
                      : colors.primary
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.handleUndo}
                disabled={routeCoordinates && routeCoordinates.length < 2}
              >
                <Ionicons
                  name="arrow-undo-circle"
                  size={55}
                  color={
                    routeCoordinates && routeCoordinates.length < 2
                      ? "gray"
                      : colors.primary
                  }
                />
              </TouchableOpacity>
            </View>

            {/* Bottom drawer icon */}
            <View
              style={{
                justifyContent: "flex-start",
                alignSelf: "flex-end",
                margin: 10,
                marginBottom: 80
              }}
            >
              <TouchableOpacity onPress={() => this?.actionSheetRef?.show()}>
                <Entypo name="info-with-circle" size={42} color="blue" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this?.setState({ mapType: this.state.mapType === 'standard' ? 'satellite' : 'standard' })}>
                <Ionicons name="md-logo-buffer" size={42} color="blue" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this?.errorDrawer?.show()}>
                <MaterialIcons name="error" size={42} color="red" />
              </TouchableOpacity>
            </View>
          </View>
          {/* Bottom drawer */}
          <ActionSheet ref={(ref) => (this.actionSheetRef = ref)}>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-around",
                paddingVertical: 20,
                borderBottomWidth: 1,
                borderBottomColor: "#ccc",
              }}
            >
              <Text style={{ flex: 1, textAlign: "center" }}>{i18n.t('mapTraceBoundaries.i.length')}</Text>
              <Text style={{ flex: 1, textAlign: "center" }}>
                {parseFloat(this.state.distanceTravelled).toFixed(2)} km
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-around",
                paddingVertical: 20,
                borderBottomWidth: 1,
                borderBottomColor: "#ccc",
              }}
            >
              <Text style={{ flex: 1, textAlign: "center" }}>{i18n.t('mapTraceBoundaries.i.area')} </Text>
              <Text style={{ flex: 1, textAlign: "center" }}>
                {this.calcArea(this.state.routeCoordinates)} {i18n.t('mapTraceBoundaries.i.acres')}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-around",
                paddingVertical: 20,
                borderBottomWidth: 1,
                borderBottomColor: "#ccc",
              }}
            >
              <Text style={{ flex: 1, textAlign: "center" }}>{i18n.t('mapTraceBoundaries.i.accuracy')} </Text>
              <Text style={{ flex: 1, textAlign: "center" }}>
                {parseFloat(this.state.accuracy).toFixed(2)} {i18n.t('mapTraceBoundaries.i.meters')}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-around",
                paddingVertical: 20,
                borderBottomWidth: 1,
                borderBottomColor: "#ccc",
              }}
            >
              <Text style={{ flex: 1, textAlign: "center" }}>
                {i18n.t('mapTraceBoundaries.i.lastLatitude')}{" "}
              </Text>
              <Text style={{ flex: 1, textAlign: "center" }}>
                {this.state.latitude}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-around",
                paddingVertical: 20,
                borderBottomWidth: 1,
                borderBottomColor: "#ccc",
              }}
            >
              <Text style={{ flex: 1, textAlign: "center" }}>
                {i18n.t('mapTraceBoundaries.i.lastLongitude')}{" "}
              </Text>
              <Text style={{ flex: 1, textAlign: "center" }}>
                {this.state.longitude}
              </Text>
            </View>
          </ActionSheet>

          {/* Bottom log drawer */}
          <ActionSheet ref={(ref) => (this.logDrawer = ref)}>
            <TouchableOpacity
              onPress={() => {
                // Clipboard.setStringAsync(JSON.stringify(this.state))
              }}
              style={{
                margin: 10,
                borderWidth: 1,
                padding: 10,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 8,
              }}
            >
              <Text>Copy</Text>
            </TouchableOpacity>
            <ScrollView style={{ height: 200, width: "100%", padding: 10 }}>
              <Text>{JSON.stringify(this.state, 2, 2)}</Text>
              <Text></Text>
            </ScrollView>
          </ActionSheet>

          {/* Bottom Error drawer */}
          <ActionSheet ref={(ref) => (this.errorDrawer = ref)}>
            <TouchableOpacity
              onPress={this.clearErrors.bind(this)}
              style={{
                margin: 10,
                borderWidth: 1,
                padding: 10,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 8,
              }}
            >
              <Text>{i18n.t('mapTraceBoundaries.queue.clear')}</Text>
            </TouchableOpacity>
            <ScrollView style={{ height: 200, width: "100%", padding: 10 }}>
              {this.state.errors.map((error, index) => (
                <View key={index}>
                  <Text style={{ color: "red" }}>{error.message}</Text>
                  <Text>
                    {moment(error.time).format("DD/MM/YYYY HH:mm:ss")}
                  </Text>
                </View>
              ))}
              {this.state.errors.length <= 0 && <Text>{i18n.t('mapTraceBoundaries.queue.noErrorText')}</Text>}
              <Text></Text>
            </ScrollView>
          </ActionSheet>
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: "stretch",
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: "center",
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    marginVertical: 20,
    marginRight: 50,
    backgroundColor: "transparent",
  },
  // splash-page design start here
  splashPage: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },

  // login page design start here
  loginPage: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
  },
  loginPageImage: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  loginContent: {
    flex: 1,
    marginHorizontal: 24,
  },
  loginTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#363537",
    marginBottom: 10,
  },
  loginDescription: {
    fontSize: 15,
    fontWeight: "400",
    color: "#79787A",
  },
  authBtn: {
    padding: 14,
    backgroundColor: "#2B9348",
    borderRadius: 8,
    marginBottom: 16,
  },
  authBtnText: {
    fontSize: 16,
    fontWeight: "700",
    textTransform: "uppercase",
    color: "#F9F9F9",
    letterSpacing: 1,
    textAlign: "center",
  },
  authGoogleBtn: {
    padding: 16,
    backgroundColor: "#E8F7E1",
    borderRadius: 8,
    marginBottom: 38,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  authBtnGoogleText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#173D07",
    textAlign: "center",
    marginLeft: 10,
  },
  policyContent: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    textAlign: "center",
    justifyContent: "center",
  },
  policyText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#79787A",
  },
  policyLink: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2B9348",
  },
  policyLinkRed: {
    color: "#EF2D56",
  },
  loginForm: {
    marginVertical: 40,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  passwordForm: {
    marginVertical: 40,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  loginDropBtn: {
    width: "25%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 45,
  },
  loginInput: {
    borderWidth: 1,
    borderColor: "#BCBCBC",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    width: "70%",
    height: 45,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: "#BCBCBC",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    width: "15%",
    height: 45,
  },
  buttonOpen: {
    borderWidth: 1,
    borderColor: "#BCBCBC",
    borderRadius: 8,
    paddingVertical: 12,
    width: "100%",
    height: 45,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    marginHorizontal: 20,
  },
  modalNo: {
    fontSize: 14,
    fontWeight: "500",
    color: "#363537",
    marginRight: 10,
  },
  modalTitle: {
    marginVertical: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  modalTitleText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#363537",
    marginLeft: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#BCBCBC",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    paddingLeft: 45,
    width: "100%",
    height: 45,
  },
  searchBox: {
    position: "relative",
  },
  searchIcon: {
    position: "absolute",
    left: 12,
    top: 12,
  },
  countryList: {
    marginVertical: 30,
  },
  country: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },
  countryText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#363537",
    marginLeft: 25,
  },
  countryFlag: {
    width: 30,
  },
});

function MapTrace(props) {
  const netInfo = useNetInfo()
  const { setEventInfo } = useContext(networkContext)
  const { from, farmer, setFarmer, agentData, setAgentData } = useFarmerEventContext()
  const { params } = useMapParamsContext()
  const [isGpsEnabled, setIsGpsEnabled] = useState(false)
  const [mounted, setMounted] = useState(false)

  const context = props?.route?.params?.context || 'farmers'

  async function requestLocationPermission() {
    try {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': appConfig.config.name,
          'message': 'This app collects location data to enable Trace Boundaries and Trace Location & Event Creation features when the app is in use.'
        }
      )
      const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      if (granted) {
        console.log("You can use the location")
        // alert("You can use the location");
        setIsGpsEnabled(true)
      } else {
        console.log("location permission denied")
        Toast.show({
          type: 'error',
          text2: "Please enable location access to the app to use this feature."
        })
      }
    } catch (err) {
      console.warn(err)
    }
  }


  if (!mounted) {
    // component will mount
    requestLocationPermission()
  }

  useEffect(() => {
    setMounted(true);
  }, [])

  useKeepAwake();
  return <MapTraceClass
    {...props}
    netInfo={netInfo}
    from={from}
    agentData={agentData}
    setAgentData={setAgentData}
    farmer={farmer}
    setFarmer={setFarmer}
    setEventInfo={setEventInfo}
    params={params}
    isGpsEnabled={isGpsEnabled}
    context={context}
  />
}

export default MapTrace;
