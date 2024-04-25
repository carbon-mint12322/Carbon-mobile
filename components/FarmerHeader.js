import { useState, useEffect } from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import appConfig from "../config/app.config";
import logoConfig from "../config/logo.config";
import { useRoute } from '@react-navigation/native';
import common from "../styles/common";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import HeaderMenu from "./Header/HeaderMenu";
import { logout } from "../utils/logout";
import colors from "../styles/colors";
import LogoutModal from "./Modal/LogoutModal";
import UserContext from "../contexts/UserContext";
import i18n from "../i18n";
import AsyncStorage from "../utils/AsyncStorage";

export default function FarmerHeader({
  title,
  subtitle,
  profileImage,
  hideProfileImage,
  leftIcon = false,
  rightIcon = false,
  firstName,
  lastName,
  menuOptions,
  hideDrawer = false
}) {
  const navigation = useNavigation();
  const [renderModal, setRenderModal] = useState(false);
  const [userData, setUserData] = useState({});
  const route = useRoute();

  const getUser = async () => {
    let localUser = await AsyncStorage.getItem("user");
    try {
      localUser = JSON.parse(localUser);
      setUserData(localUser);
    } catch (error) {
      localUser = null;
    }
  };

  useEffect(() => {
    getUser();
  }, []);


  return (
    <UserContext.Provider value={setRenderModal}>
      {renderModal && <LogoutModal />}
      <View style={{ ...common.logoPart, paddingBottom: 0 }}>
        <View style={{ ...styles.headerPart, flex: 2, justifyContent: 'flex-start' }}>
          {leftIcon && !hideDrawer && <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
            <Ionicons name="menu" size={40} style={{ marginRight: 10 }} />
          </TouchableOpacity>}
          {leftIcon || (
            <TouchableOpacity
              style={{ ...styles.backbtn }}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={30} />
            </TouchableOpacity>
          )}
          <View style={{ padding: 8, flex: 1 }}>
            <Text style={styles.headerText} numberOfLines={1}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        </View>
        {!hideProfileImage && (
          <View style={styles.headerPart}>
            <HeaderMenu
              image={profileImage}
              firstName={firstName || userData?.user?.personalDetails?.firstName}
              lastName={lastName || userData?.user?.personalDetails?.lastName}
              triggerComponent={rightIcon}
              options={[
                ...(menuOptions || (route.name != 'FarmerProfile' && (
                  [{
                    element: <Text style={common.menuOptionText}>{i18n.t('agent.agentProfileModal.profileText')}</Text>,
                    onSelect: () =>
                      navigation.navigate("FarmerProfile", {
                        details: userData?.user?.personalDetails,
                        type: "Agent",
                      }),
                  }]
                ) || [])),
                {
                  element: <Text style={common.menuOptionText}>{i18n.t('agent.agentProfileModal.logout')}</Text>,
                  onSelect: () => setRenderModal(true),
                },
              ]}
            />
          </View>
        )}
      </View>
    </UserContext.Provider>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    color: colors.gray,
  },
  headerPart: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  backbtn: {
    padding: 10,
    paddingLeft: 0,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
  },
});
