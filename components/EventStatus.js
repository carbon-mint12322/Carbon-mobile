import React, { useState } from "react";
import { View, Text, Image, StyleSheet,TouchableOpacity } from "react-native";
import common from "../styles/common";
import colors from "../styles/colors";
import { ProgressBar } from "react-native-paper";

export default function EventStatus({status}) {
  const [check,setCheck] = useState(false);
  return (
    <>
      {status === 1 && 
      <View style={{ ...styles.uploadedPhoto, ...styles.progressBox }}>
        <View style={styles.iconPart}>
          <Image source={require("../assets/layer.png")} />
        </View>
        <View style={styles.progressContent}>
          <Text style={styles.progressTitle}>
            Photos waiting to be uploaded
          </Text>
          <Text style={styles.progressInfo}>
            No internet connection. Photos will be uploaded when internet
            connection is stable.
          </Text>
        </View>
      </View>}

      {status===2 && <View style={{ ...styles.uploadedProgress, ...styles.progressBox }}>
        <View style={styles.iconPart}>
          <Image source={require("../assets/upload.png")} />
        </View>
        <View style={styles.progressContent}>
          <Text style={styles.progressTitle}>Photo upload in progress...</Text>
          <View style={styles.percentText}>
            <Text style={styles.progressInfo}>Photo upload in progress...</Text>
            <Text style={styles.percent}>70%</Text>
          </View>
          <ProgressBar
            style={styles.progressBar}
            progress={0.5}
            color={colors.orange}
          />
        </View>
      </View>}

      {status ===3 && <View style={{ ...styles.sucessPhoto, ...styles.progressBox }}>
        <View style={styles.iconPart}>
          <Image source={require("../assets/check_circle.png")} />
        </View>
        <View style={styles.progressContent}>
          <Text style={styles.progressTitle}>Success</Text>
          <Text style={styles.progressInfo}>
            Crop photos have been uploaded successfully.
          </Text>
        </View>
      </View>}

      {status ===4 && <></>}
    </>
  );
}

const styles = StyleSheet.create({

  progressBox: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 16,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginVertical: 18,
  },
  uploadedPhoto: {
    backgroundColor: colors.lightRed,
    borderColor: colors.redBorder,
  },
  progressContent: {
    paddingLeft: 16,
    width: "85%",
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 6,
  },
  progressInfo: {
    fontSize: 14,
    fontWeight: "400",
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
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  percent: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
  },
  progressBar: {
    marginTop: 6,
    color: colors.orange,
    borderRadius: 4,
  },
});