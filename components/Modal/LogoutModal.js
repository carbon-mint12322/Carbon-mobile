import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useContext } from "react";
import UserContext from "../../contexts/UserContext";
import { logout } from "../../utils/logout";
import colors from "../../styles/colors";
import i18n from "../../i18n";
import { useNavigation, useRoute } from "@react-navigation/native";
import networkContext from "../../contexts/NetworkContext";

export default function LogoutModal() {
  const user = useContext(UserContext);
  const navigation = useNavigation()
  const { setUser } = useContext(networkContext)
  const router = useRoute()
  return (
    <>
      <View style={styles.container}>
        <View style={styles.modal}>
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>{i18n.t('logoutModel.title')}</Text>
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={{ color: "#909090" }}>
              {i18n.t('logoutModel.description1')}
            </Text>
          </View>
          <View style={styles.logoutMessage}>
            <View style={{ flex: 1 }}>
              <MaterialIcons name="delete" size={24} color={colors.primary} />
            </View>
            <View style={{ flex: 6 }}>
              <Text style={{ color: "#909090" }}>
                {i18n.t('logoutModel.description2')}
              </Text>
            </View>
          </View>
          <View style={styles.bottomButtons}>
            <TouchableOpacity
              style={{
                ...styles.buttons,
                borderWidth: 0.5,
                borderColor: "#B8B8B8",
              }}
              onPress={async () => {
                user(false)
                // console.log('drawer2..')
                // console.log(router);
                // navigation.navigate('AGENT')
                // await navigation.navigate('BottomTabs')
                await logout(setUser);
                navigation.navigate('Auth', { screen: 'Logout' })
              }}
            >
              <Text style={{ fontWeight: "bold", color: colors.primary }}>{i18n.t('logoutModel.btn1')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                ...styles.buttons,
                backgroundColor: colors.primary,
                marginLeft: 18,
              }}
              onPress={() => user(false)}
            >
              <Text style={{ fontWeight: "bold", color: "white" }}>{i18n.t('logoutModel.btn2')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    height: Dimensions.get("window").height + 50,
    zIndex: 1,
  },
  modal: {
    height: 230,
    width: Dimensions.get("window").width - 64,
    borderRadius: 16,
    padding: 15,
    backgroundColor: "white",
  },
  logoutMessage: {
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: "center",
    borderRadius: 8,
    flexDirection: "row",
    marginTop: 10,
    padding: 10,
    backgroundColor: "#FAEEE9",
  },
  bottomButtons: {
    flexDirection: "row",
    marginTop: 18,
    justifyContent: "flex-end",
  },
  buttons: {
    borderRadius: 8,
    height: 35,
    width: 57,
    alignItems: "center",
    justifyContent: "center",
  },
});
