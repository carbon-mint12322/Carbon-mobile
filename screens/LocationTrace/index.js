/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from "react";
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
// import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
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
import { useMapParamsContext } from "../../contexts/MapParamsContext";
import i18n from "../../i18n";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import appConfig from "../../config/app.config";
import { useState } from "react";
import { useEffect } from "react";
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
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
};

class MapTraceClass extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mapType: 'standard',
      modalVisible: false,
      loading: true,
      errors: [],
      accuracy: 0,
      latitude: LATITUDE,
      longitude: LONGITUDE,
      routeCoordinates: [
        // { latitude: 37.421098333333335, longitude: -122.0849 },
        // { latitude: 37.422008333333335, longitude: -122.0842 },
        // { latitude: 37.423098333333335, longitude: -122.0849 },
      ],
      currentMarkerCoord: {},
      initialCoord: {},
      distanceTravelled: 0,
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

  handlePositionUpdate(position) {
    const { coordinate, routeCoordinates, distanceTravelled } = this.state;
    const { latitude, longitude, accuracy } = position.coords;

    console.log(latitude, longitude, accuracy, " ,=== accuracy in handle...");
    let loading = true;
    if (accuracy <= 50) {
      loading = false;
    }
    this.setState({
      accuracy,
      loading
    });

    const newCoordinate = {
      latitude,
      longitude,
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
        console.log(position.coords)
        const { accuracy } = position.coords;
        console.log(accuracy, ' ,=== acc in parent')
        if (accuracy <= 50) {
          this.handlePositionUpdate(position);
        } else {
          this.fetchCurrentLocation();
        }
      },
      (error) => {
        console.log("THIS IS ERROR", error)
        this.setState({
          errors: [
            ...this.state.errors,
            { message: error.message, time: new Date() },
          ],
        });
        if (false && error.message === "Location request timed out") {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              console.log(position.coords)
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
    this.setState({ loading: true });
    // this.checkLocation();
    // this.fetchCurrentLocation();
  }

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
            timeout: 20000,
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
        }
      }
    }
    if (!prevProps.isGpsEnabled && this.props.isGpsEnabled) {
      this.fetchCurrentLocation();
    }
  }


  clearErrors = () => {
    this.setState({ errors: [] });
  };


  onSavePress() {
    if (this.state.currentMarkerCoord) {
      this.setState({ modalVisible: true })
    }
  }

  handleClear = () => {
    this.setState({
      currentMarkerCoord: {}
    });
  };

  async onSave() {
    const { name } = this.state
    if (name) {
      const kml = tokml({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [this.state.currentMarkerCoord.longitude, this.state.currentMarkerCoord.latitude],
        },
        properties: {
          name,
        },
      });
      makeFile(kml, name);
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
        locationCoordinates: this.state.currentMarkerCoord,
        date: new Date
      })

      await AsyncStorage.setItem('mapData', JSON.stringify(mapData))
      this.setState({ modalVisible: false }, () => {
        this.handleClear()
      })
      setTimeout(() => {
        Toast.show({
          type: 'success',
          text2: 'Map recorded successfully!'
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
                {i18n.t('mapTraceLocation.loadingMessage')}
              </Text>
            </View>
          )}
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            showUserLocation
            onPress={(e) => { console.log(e.nativeEvent.coordinate); this.setState({ currentMarkerCoord: e.nativeEvent.coordinate }) }}
            region={this.getMapRegion()}
            ref={(MapView) => (this.MapView = MapView)}
            initialRegion={this.state.region}
            moveOnMarkerPress={false}
            showsUserLocation={true}
            followsUserLocation={true}
            showsCompass={true}
            showsPointsOfInterest={true}
            mapType={this.state.mapType}
          >
            {(Object.keys(this.state.currentMarkerCoord).length > 0) && (
              <Marker
                draggable
                position={this.state.currentMarkerCoord}
                coordinate={this.state.currentMarkerCoord}
                onDragEnd={(e) => { console.log("DRAGGED"); this.setState({ currentMarkerCoord: e.nativeEvent.coordinate }) }}
                anchor={{ x: 0.5, y: 0.5 }}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "visible",
                }}
              >
              </Marker>
            )}
          </MapView>
          <View style={{
            position: "absolute",
            top: 100
          }} >
            <Text style={{ fontSize: 20, textAlign: "center" }} >{i18n.t('mapTraceLocation.floatingMessage')}</Text>
          </View>
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

              <TouchableOpacity
                onPress={this.onSavePress.bind(this)}
              >
                <MaterialIcons
                  name="save"
                  size={62}
                  color={Object.keys(this.state.currentMarkerCoord).length > 0 ? colors.primary : "gray"}
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
              {/* <TouchableOpacity onPress={() => this?.actionSheetRef?.show()}>
                <Entypo name="info-with-circle" size={42} color="blue" />
              </TouchableOpacity> */}

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
              <Text style={{ flex: 1, textAlign: "center" }}>Length </Text>
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
              <Text style={{ flex: 1, textAlign: "center" }}>Area </Text>
              <Text style={{ flex: 1, textAlign: "center" }}>
                {this.calcArea(this.state.routeCoordinates)} Acres
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
              <Text style={{ flex: 1, textAlign: "center" }}>Accuracy </Text>
              <Text style={{ flex: 1, textAlign: "center" }}>
                {parseFloat(this.state.accuracy).toFixed(2)} Meters
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
                Last Latitude{" "}
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
                Last Longitude{" "}
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
              <Text>{i18n.t('mapTraceLocation.queue.clear')}</Text>
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
              {this.state.errors.length <= 0 && <Text>{i18n.t('mapTraceLocation.queue.noErrorText')}</Text>}
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
  const { params } = useMapParamsContext()

  const [mounted, setMounted] = useState(false)
  const [isGpsEnabled, setIsGpsEnabled] = useState(false)
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

  return <MapTraceClass {...props} params={params} isGpsEnabled={isGpsEnabled} />
}

export default MapTrace;
