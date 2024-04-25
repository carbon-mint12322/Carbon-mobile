import React, { useState, useCallback, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Slider } from '@miblanchard/react-native-slider';
import FarmerHeader from '../../../../components/FarmerHeader';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import colors from '../../../../styles/colors';
import { TextInput, ProgressBar, ActivityIndicator } from 'react-native-paper';
import { Audio } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
// import RangeSlider from 'rn-range-slider';
import Player from './components/Player';
// import RangeSlider, { Slider } from 'react-native-range-slider-expo';
import common from '../../../../styles/common';
import { fetchCurrentLocation } from '../../../../utils/fetchCurrentLocation';
import call from '../../../../utils/api';
import { urls } from '../../../../config/urls';
import axios from 'axios';
import Loader from '../../../../components/Loader';
import { useNavigation } from '@react-navigation/native';
// import { setItem } from '../../../../utils/eventQueue';
import { useNetInfo } from '@react-native-community/netinfo';
import networkListener from '../../../../utils/networkListener';
import networkContext from '../../../../contexts/NetworkContext';
import { useFarmerEventContext } from '../../../../contexts/FarmerEventsContext';
import uuid from 'react-native-uuid';
import { setItem } from '../../../../utils/commonQueue';
import commonNetworkListener from '../../../../utils/commonNetworkListener';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import { useMapParamsContext } from '../../../../contexts/MapParamsContext';
import i18n from '../../../../i18n';
// import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { writeLog } from '../../../../utils/sentryLogsQueue';
import authStyles from '../../../Auth/Styles';
import Geolocation from "@react-native-community/geolocation";
import { PermissionsAndroid } from 'react-native';
import appConfig from '../../../../config/app.config';

// import * as ImagePicker from 'expo-image-picker';
const CALC_WIDTH = (Dimensions.get('screen').width / 3) - 16

export default function Add({ type, details, closeModal }) {

  const navigator = { geolocation: Geolocation };

  const [images, setImages] = useState([])
  const [note, setNote] = useState('')
  const [recording, setRecording] = useState();
  const [recordedAudio, setRecordedAudio] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [currentSec, setCurrentSec] = useState(0)
  const [startPlay, setStartPlay] = useState(false)
  const [stopPlay, setStopPlay] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const [eventSubmitInprogress, setEventSubmitInprogress] = useState(false)
  const [recordingLoading, setRecordingLoading] = useState(false)
  const [isGpsEnabled, setIsGpsEnabled] = useState(false)
  const [locationFetchOngoing, setLocationFetchOngoing] = useState(false)
  const [locationMeta, setLocationMeta] = useState({})

  const [isCounting, setIsCounting] = useState(false)
  const [sliderValue, setSliderValue] = useState(0)
  const [audioMeta, setAudioMeta] = useState({})
  const netInfo = useNetInfo();

  const { setEventInfo } = useContext(networkContext)
  const { params } = useMapParamsContext()

  const [mounted, setMounted] = useState(false)

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

  const CALC_WIDTH = (Dimensions.get('screen').width / 3) - 16
  // console.log(type, ' <== I am event type')
  const checkLocation = () => {
    RNAndroidLocationEnabler?.promptForEnableLocationIfNeeded({
      interval: 10000,
      fastInterval: 5000,
    })
      .then((data) => {
        // The user has accepted to enable the location services
        // data can be :
        //  - "already-enabled" if the location services has been already enabled
        //  - "enabled" if user has clicked on OK button in the popup
        if ((data === "enabled") || (data === "already-enabled")) {
          setIsGpsEnabled(true)
        }

      })
      .catch((err) => {
        Toast.show({
          type: 'error',
          text2: "Please enable location access to the app to use this feature."
        })
        closeModal()
      });
  }

  useEffect(() => {
    let watchId
    if (!isGpsEnabled) {
      // checkLocation()
    } else {
      watchId = keepWatchingLocation()
    }
    return () => navigator.geolocation.clearWatch(watchId)
  }, [isGpsEnabled])

  function keepWatchingLocation() {
    const watchId = navigator.geolocation.watchPosition(
      handlePositionUpdate,
      (error) => {
        console.log(error, ' <== error while watching location')
        // this.setState({
        //   errors: [
        //     ...this.state.errors,
        //     { message: error.message, time: new Date() },
        //   ],
        // });
      },
      {
        enableHighAccuracy: true,
        timeout: 10,
        maximumAge: 1000,
        distanceFilter: 10,
        ...(params || {})
      }
    );
    return watchId;
  }

  async function handlePositionUpdate(position) {
    // const { latitude, longitude, accuracy, altitude } = position.coords;
    console.log(position, " ,=== accuracy in handle...");
    setLocationMeta(position);
  }

  async function startRecording() {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log('Starting recording..');
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recording.startAsync();
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecordingLoading(true)
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    let position = null
    try {
      setAudioMeta({ timestamp: new Date().toISOString() })
      position = locationMeta //await fetchCurrentLocation(params)
      setRecordedAudio(uri)
      setAudioMeta({ location: { lat: position?.coords?.latitude, lng: position?.coords?.longitude } })
      console.log('Recording stopped and stored at', uri);
    } catch (error) {
      // setRecordedAudio('')
      // setAudioMeta({})
      Toast.show({
        type: 'error',
        text2: 'We are having trouble to access your location right now. Please check if you have GPS enabled on your phone.'
      })
    } finally {
      setRecordingLoading(false)
    }
  }



  const pickFromCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Toast.show({
        type: 'error',
        text2: 'Please enable camera access to the app to proceed.'
      })
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    // Explore the result
    // console.log(result.assets.length);

    if (result && result?.assets?.length > 0) {
      // REMOVED IMAGE COMPRESSION FLOW
      // let imgs = []
      // for(let image of result.assets) {
      //   const newImage = await manipulateAsync(
      //     image.localUri || image.uri,
      //     [
      //       // { rotate: 90 },
      //       // { flip: FlipType.Vertical }
      //     ],
      //     { compress: 0.5 }
      //   );
      //   imgs.push({ ...image, ...newImage })
      // }
      // result.assets = imgs
      console.log('Image picked...')
      console.log('Loader started...')
      let uid = uuid.v4()
      await setImages([...images, ...(result.assets.map(asset => ({ ...asset, ts: new Date().toISOString(), uid })))]);
      // setTimeout(() => {
      //   console.log(images, ' <=== I am images before update')
      //   fetchAndSaveLocation(uid)
      // }, 1000)
    }
  }

  const updateImageLocations = async () => {
    const items = images.filter(image => !image.position)
    if (items.length > 0 && Object.keys(locationMeta).length > 0) {
      setLocationFetchOngoing(true)
      setLocationLoading(true)
      try {
        let position = locationMeta
        console.log(position, 'Location fetched...')
        setImages(images.map(image => !image.position ? { ...image, position } : image));
        // console.log(images, ' <=== I am images after update....')
      }
      catch (error) {
        // setImages([...images, ...(result.assets.map(asset => ({ ...asset, position: {}, ts: new Date().toISOString() })))]);
        console.log(error, ' <=== error while fetching location')
        Toast.show({
          type: 'error',
          text2: 'We are having trouble to access your location right now. Please check if you have GPS enabled on your phone.'
        })
      }
      finally {
        setLocationLoading(false)
        setLocationFetchOngoing(false)
      }
    }
  }

  useEffect(() => {
    // console.log(images, ' <=== iamges updatd...')
    updateImageLocations()
  }, [images, locationMeta])

  const closeIcon = (
    <TouchableOpacity style={{ padding: 8, paddingLeft: 0 }} onPress={closeModal}>
      <Ionicons name='close' size={30} />
    </TouchableOpacity>
  )



  useEffect(() => {
    if (isRecording) {
      const myInterval = setInterval(() => {
        setCurrentSec((prevTime) => { if (prevTime < 60) { return parseInt(prevTime) + 1 } else { setIsRecording(false); stopRecording(); setSliderValue(0); return parseInt(prevTime) } })
      }, 1000)
      return () => clearInterval(myInterval)
    }
  }, [isRecording])

  useEffect(() => {
    if (isCounting) {
      const secInt = setInterval(() => {
        setSliderValue((prevValue) => {
          if (prevValue < currentSec) { return (Number.parseInt(prevValue) + 1) } else {
            setStopPlay(true)
            setStartPlay(false)
            setIsPlaying(false)
            setIsCounting(false)
            return 0
          }
        })
      }, 1000)
      return () => clearInterval(secInt)
    }
  }, [isCounting])

  const getIdColumn = (type) => {
    switch (type) {
      case 'productionSystem': {
        return 'productionSystemId'
      }
      case 'landparcel': {
        return 'landParcelId'
      }
      case 'crop': {
        return 'cropId'
      }
      case 'processingSystem': {
        return 'processingSystemId'
      }
      default: {
        return 'cropId'
      }
    }
  }

  const createEvent = async () => {
    try {
      if (!images.length) {
        return Toast.show({
          type: 'error',
          text2: 'Please add at least 1 photo to submit an event.'
        })
      }
      setEventSubmitInprogress(true)

      const metadata = []
      const imgs = []
      for (let image of images) {
        let filename = image.uri.split('/').pop();
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;
        metadata.push({ location: { lat: image?.position?.coords?.latitude || null, lng: image?.position?.coords?.longitude || null }, timestamp: image.ts })
        imgs.push({ uri: image.uri, name: filename, type, size: image.size })
      }


      let position = {}

      try {
        position = locationMeta //await fetchCurrentLocation(params)
      } catch (error) {
        return Toast.show({
          type: 'error',
          text2: 'We are having trouble to access your location right now. Please check if you have GPS enabled on your phone.'
        })
      }

      const payload = {
        id: uuid.v4(),
        [getIdColumn(type)]: details._id,
        // landParcelId: details._id,
        type: type,
        ts: new Date().toISOString(),
        uid: '',
        notes: note,
        lat: position?.coords?.latitude,
        lng: position?.coords?.longitude,
        audio: recordedAudio ? { uri: recordedAudio, name: 'Audio.m4a', type: 'audio/m4a' } : {},
        image: imgs,
        audioMeta,
        imageMeta: metadata,
        // status: 1,
        // isCached: true
      }

      // await setItem(payload)

      let formattedData = {
        url: urls.createEvent,
        method: 'post',
        data: payload,
        status: 1,
        isCached: true,
        type: 'event'
      }

      await setItem(formattedData)
      // console.log('Calling network listener from create event'.toUpperCase())
      // networkListener(netInfo, setEventInfo);
      commonNetworkListener(netInfo, setEventInfo);
      await setImages([])
      await setNote('')
      await setRecordedAudio(null)
      await setAudioMeta({})
      Toast.show({
        type: 'success',
        text2: 'Event submitted successfully!'
      })
      await closeModal();
      await setEventSubmitInprogress(false)
    } catch (error) {
      console.log(error)
      writeLog(error?.response?.data?.message || error?.message, 'debug')
      Toast.show({
        type: 'error',
        text2: error?.response?.data?.message || error?.message
      })
    } finally {
      await setEventSubmitInprogress(false)
    }
  }

  const deleteImage = (index) => {
    setImages(images.filter((item, key) => key !== index))
  }

  // console.log(' <=== audoi')

  const getTitle = (type) => {
    if (type.localeCompare('crop') === 0) {
      return i18n.t('farmer.eventCreateScreen.headerCropTitle')
    } else if (type.localeCompare('productionSystem') === 0) {
      return i18n.t('farmer.eventCreateScreen.headerProductionSystemTitle')
    } else if (type.localeCompare('processingSystem') === 0) {
      return i18n.t('farmer.eventCreateScreen.headerProcessingSystemTitle')
    } else {
      return i18n.t('farmer.eventCreateScreen.headerLandparcelTitle')
    }
  }

  return <SafeAreaView>
    <StatusBar />
    {/* {locationLoading && <View style={{ height: Dimensions.get('screen').height, width: '100%', backgroundColor: 'white', zIndex: 99, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator /></View>} */}
    <FarmerHeader
      hideDrawer={true}
      title={getTitle(type)}
      subtitle={type.localeCompare('crop') === 0 ? (details.name + ", " + (details?.landParcel?.name || '')) : details?.name + ", " + (details?.address?.village || '')}
      leftIcon={closeIcon}
      hideProfileImage={true}
    />

    <ScrollView style={styles.container} contentContainerStyle={{ justifyContent: 'space-between', flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Text style={common.label}>{i18n.t('farmer.eventCreateScreen.capturePhotosLabel')}</Text>

        {/* Images */}
        <View style={styles.imagesContainer}>
          {images && images.map((image, index) => (
            <View style={styles.imageView} key={index}>
              <Image source={{ uri: image.uri }} style={styles.imageStyles} />
              <TouchableOpacity
                style={{ backgroundColor: colors.redBorder, padding: 5, borderRadius: 8, position: 'absolute', left: 6, top: 6 }}
                onPress={() => deleteImage(index)}
              >
                <Ionicons name='close' size={20} color={colors.black} />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity disabled={images.length >= 5} onPress={() => pickFromCamera()} style={{ ...styles.cameraView, ...({ opacity: images.length >= 5 ? 0.5 : 1 }) }}>
            <Ionicons name='camera' size={35} color={colors.primary} />
          </TouchableOpacity>
        </View>


        {/* Notes */}
        <Text style={common.label}>{i18n.t('farmer.eventCreateScreen.notesLabel')}</Text>

        <TextInput
          mode='outlined'
          multiline={true}
          numberOfLines={5}
          placeholder={i18n.t('farmer.eventCreateScreen.notesPlaceholder')}
          outlineStyle={styles.notesOutline}
          style={styles.inputStyles}
          onChangeText={e => setNote(e)}
          value={note}
        />
        <Text style={styles.inputMsg}>Max 500</Text>

        <Text style={styles.label}>{i18n.t('farmer.eventCreateScreen.voiceRecordingLabel')}</Text>

        {(!isRecording && !recordedAudio) && (<View style={styles.voiceRecorder}>
          <TouchableOpacity onPress={() => { setIsRecording(true); startRecording() }} >
            <View style={styles.recorderButton}>
              <Ionicons name='mic' size={24} style={styles.micIcon} />
            </View>
          </TouchableOpacity>
          <Text style={styles.recoedText}>{i18n.t('farmer.eventCreateScreen.voiceRecordingDescription')}</Text>
        </View>)}

        {(!recordingLoading && isRecording) && (<View style={styles.voiceRecorderArea}>
          <Text style={styles.recordTime}>0:{currentSec}</Text>
          <Ionicons name='ios-mic-outline' size={18} style={styles.microphoneIcon} />
          <View style={{
            width: "70%",
            marginRight: 8
          }} >
            <Slider
              minimumValue={0}
              maximumValue={60}
              value={currentSec}
              minimumTrackTintColor={colors.black}
              maximumTrackTintColor={colors.gray} te={(value) => { setCurrentPosition(parseInt(value)); setStartPlay(true); setStopPlay(false); setIsPlaying(true); setIsCounting(true); }}
              thumbStyle={{
                height: 0,
                width: 0
              }}
              disabled={true}
            />
          </View>
          <TouchableOpacity onPress={() => { stopRecording().then(() => { setIsRecording(false); setSliderValue(0) }) }} >
            <Ionicons name='stop-circle-outline' size={20} />
          </TouchableOpacity>
        </View>)}
        {/* {recordingLoading && (
            <ActivityIndicator />
          )} */}
        {(!recordingLoading && recordedAudio) && (<View style={styles.voiceRecorderArea}>
          <View style={{ width: "92%" }} >
            <Player uri={recordedAudio} />
          </View>
          <TouchableOpacity onPress={() => { setRecordedAudio(''); setAudioMeta({}); setCurrentSec(0); setStopPlay(true); setStartPlay(false) }} >
            <Ionicons name='close-outline' size={20} />
          </TouchableOpacity>
        </View>)}
      </View>
      {/* <Player name="something" uri={recordedAudio} start={startPlay} stop={stopPlay} currentPosition={currentPosition} /> */}
      <TouchableOpacity style={{ ...common.button, backgroundColor: eventSubmitInprogress || locationLoading || recordingLoading ? colors.gray : colors.primary }} onPress={createEvent} disabled={eventSubmitInprogress || locationLoading || recordingLoading}>
        {!eventSubmitInprogress ?
          <Text style={{ ...common.buttonText }}>{i18n.t('farmer.eventCreateScreen.submitBtn')}</Text>
          :
          <ActivityIndicator color={colors.white} />
        }
      </TouchableOpacity>
      {(eventSubmitInprogress || locationLoading || recordingLoading) && (
        <View style={{ flexDirection: 'row' }}>
          <ActivityIndicator size={20} />
          <Text style={{ ...authStyles.policyText, marginLeft: 10 }}>Please wait while we're trying to fetch your accurate location</Text>
        </View>
      )}
    </ScrollView>
  </SafeAreaView>
}

const styles = StyleSheet.create({
  inputMsg: {
    fontSize: 10,
    color: colors.gray,
    marginTop: 4,
    marginBottom: 24
  },
  inputStyles: {
    marginTop: 16,
    borderRadius: 8,
    fontSize: 14,
    backgroundColor: colors.white
  },
  notesOutline: {
    borderColor: colors.grayBorders,
    borderRadius: 8,
    borderWidth: 1
  },
  cameraView: {
    marginLeft: 8,
    marginTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    backgroundColor: colors.darkGray,
    borderColor: colors.grayBorders,
    width: CALC_WIDTH,
    height: CALC_WIDTH,
    borderRadius: 8
  },
  imageStyles: {
    width: CALC_WIDTH,
    height: CALC_WIDTH,
    borderRadius: 8
  },
  imageView: {
    marginLeft: 8,
    borderColor: 'red',
    marginTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    backgroundColor: colors.darkGray,
    borderColor: colors.grayBorders,
    width: CALC_WIDTH,
    height: CALC_WIDTH,
    borderRadius: 8
  },
  imagesContainer: {
    marginTop: 8,
    marginBottom: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: -8
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
    height: '90%'
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1,
  },
  button: {
    flex: 0.1,
    padding: 10,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: colors.lightGray
  },
  voiceRecorder: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  recorderButton: {
    width: 40,
    height: 40,
    backgroundColor: colors.primary,
    borderRadius: 25,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  micIcon: {
    color: colors.white,
  },
  recoedText: {
    marginLeft: 12,
    fontSize: 14,
    color: colors.properBlack,
    fontWeight: '500'
  },
  voiceRecorderArea: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    backgroundColor: colors.properWhite,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: colors.darkGray,
    padding: 10
  },
  recordTime: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.red,
    width: 30,
    marginRight: 8,
  },
  microphoneIcon: {
    color: colors.gray,
    marginRight: 8,
  },
  progressBar: {
    flex: 1,

  },

  // details table design
  detailsTable: {},
  detailsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.black,
    marginTop: 20,
    marginBottom: 10
  },
  tableCard: {
    backgroundColor: colors.ligtGreen,
    borderWidth: 1,
    borderColor: colors.borderGray,
    borderRadius: 8,
  },
  cardRow: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: colors.borderGray,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardHeading: {
    paddingRight: 12,
    width: '40%',
    fontSize: 12,
    fontWeight: '400',
    color: colors.cardText,
  },
  cardContent: {
    paddingHorizontal: 12,
    fontSize: 12,
    fontWeight: '600',
  },

  // threee progress block
  progressBox: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginVertical: 18,
  },
  uploadedPhoto: {
    backgroundColor: colors.lightRed,
    borderColor: colors.redBorder,
  },
  progressContent: {
    paddingLeft: 16,
    width: '85%',
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 6,
  },
  progressInfo: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.lightText,
    lineHeight: 22,
  },
  uploadedProgress: {
    backgroundColor: colors.lightGreen,
    borderColor: colors.greenBorder,
  },
  sucessPhoto: {
    backgroundColor: colors.lightGreen,
    borderColor: colors.greenBorder,
  },
  percentText: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  percent: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  progressBar: {
    marginTop: 6,
    color: colors.orange,
    borderRadius: 4,
  },
});