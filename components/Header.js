import { useState, useEffect } from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native'
import appConfig from '../config/app.config'
import logoConfig from '../config/logo.config'
import common from '../styles/common'
import HeaderMenu from './Header/HeaderMenu'
import { logout } from '../utils/logout'
import LogoutModal from './Modal/LogoutModal'
import UserContext from "../contexts/UserContext";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "../utils/AsyncStorage";


export default function Header({ profileImage, firstName, lastName, menuOptions }) {
  const [renderModal, setRenderModal] = useState(false);
  const [userData, setUserData] = useState({});
  const navigation = useNavigation();

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
      {(renderModal) && (<LogoutModal />)}
      <View style={{ ...common.logoPart }}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={40} style={{ marginRight: 10 }} />
        </TouchableOpacity>
        <View style={{ ...styles.logo, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Image resizeMode='contain' style={{ width: 103, height: 40 }} source={appConfig.config.logo ? { uri: appConfig.config.logo } : logoConfig()} />
        </View>
        <HeaderMenu
          image={profileImage}
          firstName={firstName || userData?.user?.personalDetails?.firstName}
          lastName={lastName || userData?.user?.personalDetails?.lastName}
          options={[
            ...(menuOptions),
            {
              element: <Text style={common.menuOptionText}>Logout</Text>,
              onSelect: () => setRenderModal(true),
            },
          ]}
        />
      </View>
    </UserContext.Provider>
  )
}


const styles = StyleSheet.create({

})