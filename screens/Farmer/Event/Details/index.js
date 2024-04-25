import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import ImageView from "react-native-image-viewing";

import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import common from "../../../../styles/common";
import FarmerHeader from "../../../../components/FarmerHeader";
import EventStatus from "../../../../components/EventStatus";
import Player from "../Create/components/Player";
import moment from "moment";
import DetailsContainer from "../../../../components/DetailsContainer";
import i18n from "../../../../i18n";
import { changeBaseUrlToApiBaseUrl } from "../../../../utils/modifyUrls";

const CALC_WIDTH = Dimensions.get("screen").width / 3 - 18;
export default function EventDetails({ details, crop, closeModal, isCached, landParcel }) {
  const [imageViewerVisible, setImageViewerVisible] = useState(false)
  const [imageIndex, setImageIndex] = useState(0)

  const closeIcon = (
    <TouchableOpacity
      style={{ padding: 8, paddingLeft: 0 }}
      onPress={closeModal}
    >
      <Ionicons name="close" size={30} />
    </TouchableOpacity>
  );
  // console.log(details, ' <== I am cached flag')
  // console.log(JSON.stringify(props, 2, 2), ' <== I am details inside details component')

  const getTitle = () => {
    if (details.isProductionSystem) {
      return i18n.t('farmer.eventCreateScreen.headerProductionSystemTitle')
    }
    if (details.landParcelId) {
      return i18n.t('farmer.eventDetailsScreen.headerLandparcelTitle')
    }
    if (details.isProcessingSystem) {
      return i18n.t('farmer.eventCreateScreen.headerProcessingSystemTitle')
    }
    return i18n.t('farmer.eventDetailsScreen.headerCropTitle')
  }

  return (
    <SafeAreaView>
      <StatusBar />
      <FarmerHeader
        hideDrawer={true}
        // title={moment(details?.ts).format('YYYY-MM-DD HH:mm:ss')}
        title={getTitle()}
        subtitle={details.landParcelId || details.isProductionSystem || details.isProcessingSystem ? (landParcel?.name || '') : crop?.name + ", " + crop?.landParcel?.name}
        leftIcon={closeIcon}
        hideProfileImage={true}
      />

      {/* uploading pending photos */}

      <ScrollView style={styles.container}>
        <Text style={{ fontSize: 18, fontWeight: '600' }}>
          {moment(details?.ts).format('YYYY-MM-DD HH:mm:ss')}
        </Text>
        <View style={styles.status}>
          <EventStatus status={details.status} />
        </View>

        <DetailsContainer title={i18n.t('farmer.eventDetailsScreen.photos')}>
          <View style={styles.imagesContainer}>
            {!isCached && (details?.isProductionSystem || details?.isProcessingSystem) ?
              (
                details?.['photoRecords']?.map((img, index) => {
                  return (
                    <TouchableOpacity key={index} onPress={() => { setImageViewerVisible(true); setImageIndex(index) }}>
                      <Image style={styles.imageStyles} source={{ uri: isCached ? img?.uri : changeBaseUrlToApiBaseUrl(img?.link) }} key={index} />
                    </TouchableOpacity>
                  );
                })
              )
              :
              details?.['image']?.map((img, index) => {
                return (
                  <TouchableOpacity key={index} onPress={() => { setImageViewerVisible(true); setImageIndex(index) }}>
                    <Image style={styles.imageStyles} source={{ uri: isCached ? img?.uri : changeBaseUrlToApiBaseUrl(img?.link) }} key={index} />
                  </TouchableOpacity>
                );
              })
            }

            {details?.['image']?.length <= 0 && details?.photoRecords?.length <= 0 && (
              <Text>No Images</Text>
            )}
          </View>
        </DetailsContainer>

        <DetailsContainer title={i18n.t('farmer.eventDetailsScreen.voiceRecording')}>
          {isCached ?
            ((Object.keys(details?.audio).length > 0) ?
              (<Player name="something" uri={details?.audio?.uri} />)
              :
              (<Text style={common.description} >{i18n.t('farmer.eventDetailsScreen.noRecordingsText')}</Text>))
            : (
              (details?.audio?.[0]) || (details?.audioRecords?.[0]) ?
                (<Player name="something" uri={changeBaseUrlToApiBaseUrl(details?.audio?.[0]?.link || details?.audioRecords?.[0]?.link || '')} />)
                :
                (<Text style={common.description} >{i18n.t('farmer.eventDetailsScreen.noRecordingsText')}</Text>)
            )
          }
        </DetailsContainer>

        <DetailsContainer title={i18n.t('farmer.eventDetailsScreen.notes')}>
          <Text style={common.description}>
            {details?.notes || i18n.t('farmer.eventDetailsScreen.noNotesAvailable')}
          </Text>
        </DetailsContainer>
      </ScrollView>
      <ImageView
        images={!isCached && (details?.isProductionSystem || details?.isProcessingSystem) ? details?.['photoRecords']?.map(image => ({ uri: changeBaseUrlToApiBaseUrl(image.link) })) : details?.['image']?.map(image => ({ uri: isCached ? image.uri : changeBaseUrlToApiBaseUrl(image.link) }))}
        imageIndex={imageIndex}
        visible={imageViewerVisible}
        onRequestClose={() => { setImageViewerVisible(false); }}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.compose({
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  photos: {
    marginTop: 15
  },
  voiceRecording: {
    marginTop: 15,
  },
  icon: {
    width: 30,
    height: 36,
  },
  successIcon: {
    width: 36,
    height: 36,
  },
  imagesContainer: {
    marginTop: 8,
    marginBottom: 20,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  notesArea: {
    marginTop: 15
  },
  imageStyles: {
    width: CALC_WIDTH,
    height: CALC_WIDTH,
    borderRadius: 8,
    margin: 2,
  },
});
