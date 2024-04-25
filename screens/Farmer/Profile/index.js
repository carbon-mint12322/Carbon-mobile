import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Image, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FarmerHeader from "../../../components/FarmerHeader";
import colors from "../../../styles/colors";
import common from "../../../styles/common";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import Loader from "../../../components/Loader";
import { useNavigation } from "@react-navigation/native";
import i18n from "../../../i18n";

export default function Profile(props) {
  const [profileDetails, setProfileDetails] = useState({});
  const [profileType, setProfileType] = useState();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  useEffect(() => {
    if (!props?.route?.params?.details) {
      return navigation.goBack();
    }
    setProfileDetails(props?.route?.params?.details);
    setProfileType(props?.route?.params?.type);
    setLoading(false);
  }, [props?.route?.params]);

  const context = props?.route?.params?.context || 'farmers'

  return (
    <>
      {loading && <Loader />}
      <SafeAreaView style={{ zIndex: 1 }}>
        <StatusBar />
        <View>
          <FarmerHeader
            title={profileType == "Farmer" ? i18n.t(`farmer.farmerProfile.${context}`) : i18n.t('agent.agentProfileModal.profileText')}
            firstName={profileDetails?.firstName?.charAt(0)}
            lastName={profileDetails?.lastName?.charAt(0)}
            rightIcon={<></>
              // <View style={{ padding: 5, paddingRight: 0 }}>
              //   <SimpleLineIcons
              //     name="options-vertical"
              //     size={18}
              //     color={colors.black}
              //   />
              // </View>
            }
          />
        </View>
        <View style={styles.profilePart}>
          <View style={styles.profileImage}>
            <View style={styles.imagePart}>
              {profileDetails?.profilePicture ? (
                <Image
                  source={{ uri: profileDetails?.profilePicture }}
                  style={styles.imageStyle}
                />
              ) : (
                profileDetails?.profileImage ? (
                  <Image
                    source={{ uri: profileDetails?.profileImage }}
                    style={styles.imageStyle}
                  />
                ) :
                  <View
                    style={{
                      backgroundColor: colors.primary,
                      opacity: 0.4,
                      borderRadius: 80,
                      height: 120,
                      width: 120,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="ios-person" size={70} color="white" />
                  </View>
              )}
            </View>
            <Text style={{ ...styles.farmerName, paddingHorizontal: 16 }}>
              {(profileDetails?.firstName || '') + " " + (profileDetails?.lastName || '')}
            </Text>
            <Text style={styles.farmerID}>
              {profileDetails?.profileId || ""}
            </Text>
          </View>
          <View style={styles.profileDetails}>
            <View style={styles.profileData}>
              <View style={styles.profileRow}>
                <View style={styles.iconPart}>
                  <MaterialIcons
                    name="phone-iphone"
                    size={24}
                    style={styles.iconStyle}
                  />
                </View>
                <View style={styles.data}>
                  <Text style={styles.label}>{i18n.t('farmer.profileScreen.phoneNumber')}</Text>
                  <Text style={styles.information}>
                    {profileDetails?.primaryPhone}
                  </Text>
                </View>
              </View>
              <View style={styles.profileRow}>
                <View style={styles.iconPart}>
                  <MaterialIcons
                    name="alternate-email"
                    size={24}
                    style={styles.iconStyle}
                  />
                </View>
                <View style={styles.data}>
                  <Text style={styles.label}>{i18n.t('farmer.profileScreen.emailId')}</Text>
                  <Text style={styles.information}>{profileDetails?.email}</Text>
                </View>
              </View>
              {profileDetails?.address && (
                <View style={styles.profileRow}>
                  <View style={styles.iconPart}>
                    <Ionicons
                      name="ios-location-outline"
                      size={18}
                      style={styles.iconStyle}
                    />
                  </View>
                  <View style={styles.data}>
                    <Text style={styles.label}>{i18n.t('farmer.profileScreen.address')}</Text>
                    <Text style={styles.information}>
                      {typeof profileDetails?.address === 'string' ? profileDetails?.address :
                        profileDetails?.address?.village || ''} {profileDetails?.address?.state || ''} {profileDetails?.address?.pincode || ''
                      }
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
const styles = StyleSheet.create({
  imageStyle: {
    height: 120,
    width: 120,
    borderRadius: 99,
    backgroundColor: colors.primary
  },
  profilePart: {
    height: "90%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  imagePart: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  farmerName: {
    fontSize: 20,
    fontWeight: "500",
    color: colors.black,
    textAlign: "center",
  },
  farmerID: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
    textAlign: "center",
  },
  profileDetails: {
    marginTop: 80,
    marginBottom: 20,
  },
  profileData: {
    paddingHorizontal: 16,
  },
  profileRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
  },
  iconPart: {
    paddingRight: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.black,
  },
  data: {
    width: "88%",
  },
  information: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.black,
  },
  iconStyle: {
    color: colors.gray,
  },
});
