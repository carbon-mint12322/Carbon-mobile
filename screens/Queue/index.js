import React, { useContext, useRef, useState, useEffect } from "react";
import { ScrollView, TouchableOpacity, Text } from "react-native";
import ActionSheet from "react-native-actions-sheet";
import { View } from "react-native-animatable";
import networkContext from "../../contexts/NetworkContext";
import colors from "../../styles/colors";
import { getAllItems } from "../../utils/commonQueue";
import { Ionicons } from "@expo/vector-icons";
import i18n from "../../i18n";

const Queue = (props) => {
  const { eventInfo } = useContext(networkContext);

  const [list, setList] = useState([]);

  const errorDrawer = useRef();

  useEffect(() => {
    getAllItems().then((res) => {
      setList(res);
    });
  }, [eventInfo]);

  return (
    <>
      <TouchableOpacity onPress={() => errorDrawer.current.show()} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '100%', marginTop: 10, }}>
        <Ionicons name={"file-tray-stacked"} size={30} />
        <Text style={{ marginLeft: 10 }}>{i18n.t('drawerScreen.uploadQueue')}</Text>
      </TouchableOpacity>
      <ActionSheet ref={errorDrawer}>
        <TouchableOpacity
          onPress={() => {
            getAllItems().then((res) => {
              setList(res);
            });
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
          <Text>Refresh</Text>
        </TouchableOpacity>
        <ScrollView style={{ height: 200, width: "100%", padding: 10 }}>
          {list.length > 0 ? (
            list.map((item, index) => {
              return (
                <View key={index} style={{ marginBottom: 12 }}>
                  <Text style={{ color: "red" }}> {`index: ${index}`}</Text>
                  <Text style={{ color: "red" }}> {`type: ${item?.type}`}</Text>
                  <Text style={{ color: "red" }}>
                    {" "}
                    {`status: ${item?.status}`}
                  </Text>
                  <Text style={{ color: "red" }}>
                    {" "}
                    {`error: ${item?.error}`}
                  </Text>
                </View>
              );
            })
          ) : (
            <Text> No items in queue </Text>
          )}
        </ScrollView>
      </ActionSheet>
    </>
  );
};

export default Queue;
