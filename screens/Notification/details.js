import React from "react";
import {
  Text,
  StyleSheet,
  Dimensions,
  View,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
export default function NotificationDetails({
  common,
  setShowNotification,
  showNotification,
  notificationMessage,
  notificationTitle,
}) {
  var { width } = Dimensions.get("window");
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        screenOptions={{ presentation: "fullScreenModal" }}
        visible={showNotification}
        onRequestClose={() => {
          setShowNotification(!showNotification);
        }}
      >
        <Pressable
          onPress={() => setShowNotification(!showNotification)}
          style={styles.arrowButton}
        >
          <AntDesign name="left" size={24} color="black" />
        </Pressable>
        <View style={{ ...styles.divider, width: width - 10 }}></View>
        <ScrollView style={styles.ScrollView}>
          <View style={{ ...styles.centeredView, marginTop: 0 }}>
            <View style={styles.modalView}>
              <Text style={styles.modalHeader}>{notificationTitle}</Text>
              <Pressable onPress={() => setShowNotification(!showNotification)}>
                <View>
                  <View>
                    <Text
                      style={{
                        ...common.listName,
                        maxWidth: "auto",
                        ...styles.modalText,
                      }}
                    >
                      {notificationMessage}
                    </Text>
                  </View>
                </View>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  divider: {
    borderBottomColor: "#D3D3D3",
    borderBottomWidth: 0.3,
    marginTop: 50,
  },
  arrowButton: {
    position: "relative",
    left: "5%",
    top: "3%",
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
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    // padding: 35,
    alignItems: "flex-start",
  },
  modalHeader: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "left",
    marginBottom: 15,
  },
  modalText: {
    marginBottom: 15,
    fontSize: 18,
    textAlign: "left",
  },
});
