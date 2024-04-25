import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { Image, Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Share from 'react-native-share'
import { SafeAreaView } from "react-native-safe-area-context";
import NoDataComponent from "../../components/NoDataComponent";
import common from "../../styles/common";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import colors from "../../styles/colors";
import FarmerHeader from "../../components/FarmerHeader";
import appConfig from "../../config/app.config";
import logoConfig from "../../config/logo.config";
import DetailsContainer from "../../components/DetailsContainer";
import tapIcon from '../../assets/tap.png'
import walkIcon from '../../assets/walking.png'
import FullMapModal from "../../components/Modal/FullMapModal";
import RNFS from "react-native-fs"
import { kml } from "../../utils/createKml";
import i18n from "../../i18n";
import { useFarmerEventContext } from "../../contexts/FarmerEventsContext";
import AsyncStorage from "../../utils/AsyncStorage";

export default function MapHistory(props) {
    const navigation = useNavigation();
    const [mapItems, setMapItems] = useState([])
    const [mapFullscreen, setMapFullscreen] = useState(false)
    const [routeCoords, setRouteCoords] = useState([])
    const {
        agentData,
        farmer,
        from,
        isProcessor
    } = useFarmerEventContext();

    const syncMapData = async () => {
        var mapData = await AsyncStorage.getItem('mapData')
        try {
            // console.log(mapData)
            mapData = JSON.parse(mapData)
            setMapItems(mapData)

        } catch (error) {
            setMapItems([])
        }
    }

    navigation.addListener('focus', () => {
        syncMapData()
    })

    useEffect(() => {
        syncMapData()
    }, [])

    const onShareKml = useCallback(function (Field) {
        console.log(Field)

        const kmlContent = kml(Field?.routeCoordinates || [Field.locationCoordinates], Field.name)

        var path = RNFS.DocumentDirectoryPath + `/${Field.name}.kml`;

        RNFS.writeFile(path, kmlContent, 'utf8')
            .then((success) => {
                console.log('FILE WRITTEN!');
                Share.open({
                    url: `file://${path}`,
                    type: 'application/vnd'

                }).then((res) => console.log(res)).catch((e) => console.log(e?.message));
            })
            .catch((err) => {
                console.log(err.message);
            });


    }, []);

    const context = from.toLowerCase() === 'farmer' ? isProcessor ? 'processors' : 'farmers' : 'agent'

    return (
        <SafeAreaView>
            <StatusBar />
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
            <ScrollView style={{ paddingHorizontal: 16, height: '95%' }}>
                <View style={{ marginTop: 20 }}>


                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly" }} >
                        <TouchableOpacity onPress={() => navigation.navigate('LocationTrace')}>
                            <View style={{ backgroundColor: colors.primary, height: 150, width: 120, display: "flex", alignItems: "center", justifyContent: "space-evenly", borderRadius: 8 }} >
                                <Image
                                    resizeMode="contain"
                                    source={tapIcon}
                                    style={{ width: 100, height: 50 }}

                                />
                                <Text style={{ ...common.buttonText, textTransform: 'capitalize' }}>
                                    {i18n.t('mapTraceHistory.traceLocationBtn')}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('MapTrace')}>
                            <View style={{ backgroundColor: colors.primary, height: 150, width: 120, display: "flex", alignItems: "center", justifyContent: "space-evenly", borderRadius: 8 }} >
                                <Image
                                    resizeMode="contain"
                                    source={walkIcon}
                                    style={{ width: 100, height: 55 }}
                                />
                                <Text style={{ ...common.buttonText, textTransform: 'capitalize' }}>
                                    {i18n.t('mapTraceHistory.traceBoundariesBtn')}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <DetailsContainer title={i18n.t('mapTraceHistory.title')}>
                    <View style={{ marginBottom: 100 }}>
                        {/* {
                                mapItems && mapItems.map((map, index) => {
                                    console.log("MAP", index, map)
                                })
                            } */}

                        {/* {mapItems && console.log("<------- MAP ITEMS -------->", mapItems[0], mapItems[1])} */}
                        {mapItems && mapItems.map((map, index) => (
                            <TouchableOpacity key={index} style={{ ...common.listItem, justifyContent: "space-between" }} >
                                <View style={{ flex: 1 }}>
                                    <Text style={common.listField}>{map.name}</Text>
                                    <Text style={common.listName}>{moment(map.date).format('DD/MM/YYYY HH:mm:ss')}</Text>
                                </View>
                                <View style={{ display: "flex", flexDirection: "row" }} >
                                    <TouchableOpacity style={{ marginRight: 25 }} onPress={() => { setRouteCoords(map?.routeCoordinates || [map.locationCoordinates]); setMapFullscreen(true) }} >
                                        <FontAwesome
                                            name="eye"
                                            size={24}
                                            color={colors.primary}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => { setRouteCoords(map?.routeCoordinates || [map.locationCoordinates]); onShareKml(map) }} >
                                        <FontAwesome
                                            name="share"
                                            size={24}
                                            color={colors.primary}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        ))}

                        {
                            <FullMapModal
                                visible={mapFullscreen}
                                polylineCoordinates={routeCoords}
                                onRequestClose={() => { setMapFullscreen(false); setRouteCoords([]) }}
                            />
                        }

                        {(!mapItems || !mapItems.length) && (
                            <NoDataComponent
                                message={i18n.t('mapTraceHistory.noSavedDataText')}
                                icon={
                                    <Ionicons name={'map'} size={32} color={colors.black} />
                                }
                            />
                        )}
                    </View>
                </DetailsContainer>


            </ScrollView>
        </SafeAreaView >
    )
}