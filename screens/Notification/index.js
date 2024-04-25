import { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  Dimensions,
  Image,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NoDataComponent from "../../components/NoDataComponent";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import colors from "../../styles/colors";
import FarmerHeader from "../../components/FarmerHeader";
import logoConfig from "../../config/logo.config";
import appConfig from "../../config/app.config";
import { useNotificationContext } from "../../contexts/NotificationContext";
import common from "../../styles/common";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import NotificationDetails from "./details";

import auth from "@react-native-firebase/auth";
import { decodeToken } from "../../utils/isTokenExpired";
import { useFarmerEventContext } from "../../contexts/FarmerEventsContext";
import moment from "moment";
import i18n from "../../i18n";

export default function Notification() {
  const [isAgent, setIsAgent] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const { fetchNotifications, notifications, setIsUnread, clearNotificatons } =
    useNotificationContext();
  const checkRole = async () => {
    const token = auth().currentUser
      ? await auth().currentUser.getIdToken()
      : "";
    let decodedToken = decodeToken(token);
    setIsAgent(decodedToken?.claims?.user?.roles?.[appConfig.appName || 'farmbook']?.includes("AGENT"));
  };
  const [farmerData, setFarmerData] = useState([]);

  const { farmer, agentData, from, isProcessor } = useFarmerEventContext();

  useEffect(() => {
    farmer && Object.keys(farmer).length > 0 && setFarmerData([farmer]);
  }, [farmer]);

  useEffect(() => {
    try {
      // fetchNotifications()
      setIsUnread(false);
      checkRole();
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      // Notification screen becomes visible
      fetchNotifications(true);
      setIsUnread(false);
    }
  }, [isFocused]);

  useEffect(() => {
    console.log(notifications.length);
  }, [notifications]);

  const icon = (
    <MaterialIcons
      name="notifications-none"
      size={100}
      color={colors.primary}
    />
  );

  const context = from.toLowerCase() === 'farmer' ? isProcessor ? 'processors' : 'farmers' : 'agent'

  return (
    <SafeAreaView>
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
        firstName={from?.toLowerCase() === 'farmer' ? farmer?.firstName : agentData?.personalDetails?.firstName}
        lastName={from?.toLowerCase() === 'farmer' ? farmer?.lastName : agentData?.personalDetails?.lastName}
        profileImage={farmer?.profilePicture}
        menuOptions={[
          {
            element: (
              <Text style={common.menuOptionText}>{i18n.t(context === 'agent' ? 'agent.agentProfileModal.profileText' : `farmer.farmerProfile.${context}`)}</Text>
            ),
            onSelect: () =>
              navigation.navigate("FarmerProfile", {
                details: context === 'agent' ? { ...agentData?.personalDetails } : {
                  ...farmer,
                  profileId: farmer?.orgDetails?.farmerID,
                  address:
                    `${farmer?.address?.village}` +
                    ", " +
                    `${farmer?.address?.state}` +
                    " " +
                    `${farmer?.address?.pincode}`,
                },
                type: context === 'agent' ? 'Agent' : "Farmer",
                context
              }),
          },
        ]}
      />
      <View>
        {notifications.length > 0 ? (
          <ScrollView style={styles.ScrollView}>
            <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
              <Text style={common.listField}>Notifications ({notifications?.length || 0})</Text>
              <TouchableOpacity
                style={{}}
                onPress={clearNotificatons}
              >
                <Text style={common.listField}>
                  {i18n.t("notificationScreen.clearAll")}
                </Text>
              </TouchableOpacity>
            </View>
            <NotificationDetails
              common={common}
              showNotification={showNotification}
              setShowNotification={setShowNotification}
              notificationMessage={notificationMessage}
              notificationTitle={notificationTitle}
            />
            <View style={styles.listPart}>
              <View style={common.listData}>
                {notifications.map((item, index) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setShowNotification(true);
                        setNotificationTitle(item.message.title);
                        setNotificationMessage(item.message.message);
                      }}
                      key={index}
                      style={{
                        ...common.listItem,
                        backgroundColor:
                          item.status === "Unread"
                            ? colors.whitebg
                            : colors.white,
                      }}
                    >
                      <View style={common.listDetail}>
                        <View>
                          <Text
                            style={common.listField}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                          >
                            {item?.message?.title}
                          </Text>
                          <Text
                            style={{
                              ...common.listName,
                              maxWidth: "auto",
                              marginTop: 2,
                              marginBottom: 2,
                            }}
                          >
                            {moment(item.createdAt).format(
                              "DD/MM/YYYY hh:mm A"
                            )}
                          </Text>
                          <Text
                            style={{ ...common.listName, maxWidth: "auto" }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                          >
                            {item?.message?.message}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>
        ) : (
          <View style={{ marginTop: Dimensions.get("window").height / 4 }}>
            <NoDataComponent
              icon={icon}
              message={i18n.t("notificationScreen.noNotificationsText")}
              textWeight={"800"}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listPart: {
    // marginTop: 20,
    width: "100%",
  },
  ScrollView: {
    // minHeight: '90%',
    marginTop: 20,
    paddingHorizontal: 16,
    marginBottom: 100,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 22,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 15,
  },
  modalText: {
    marginBottom: 15,
    fontSize: 15,
    textAlign: "center",
  },
  lineStyle: {
    borderWidth: 0.5,
    borderColor: "black",
    margin: 10,
  },
});
