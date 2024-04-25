import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator } from "react-native-paper";
import colors from "../../../styles/colors";
import common from "../../../styles/common";
import { useCallback, useContext, useEffect, useState } from "react";
import call from "../../../utils/api";
import Header from "../../../components/Header";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { logout } from "../../../utils/logout";
import NoDataComponent from "../../../components/NoDataComponent";
import { Ionicons } from "@expo/vector-icons";
import FarmerHeader from "../../../components/FarmerHeader";
import logoConfig from "../../../config/logo.config";
import appConfig from "../../../config/app.config";
import ProfilePicName from "../../../components/ProfilePicName";
import Loader from "../../../components/Loader";
import { useFarmerEventContext } from "../../../contexts/FarmerEventsContext";
import { SearchBar } from 'react-native-elements';
import i18n from "../../../i18n";
import debounce from 'lodash.debounce';
import usePrevState from "../../../hooks/usePrevState";
import { FlatList } from "react-native-gesture-handler";
import networkContext from "../../../contexts/NetworkContext";
import { TabView, TabBar } from 'react-native-tab-view';


export const pageLimit = 20

function AgentItemList({ miniLoading, context = 'farmers' }) {
  const navigation = useNavigation();

  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchTextDebounced, prevSearchTextDebounced, setSearchTextDebounced] = usePrevState('')
  const [page, setPage] = useState(1);
  const [visibleFarmers, setVisibleFarmers] = useState([])
  const [filteredFarmersCount, setFilteredFarmersCount] = useState(0)
  const { forceRefreshed } = useContext(networkContext)

  const icon = <Ionicons name="person" size={35} color="black" />;

  const {
    agentData
  } = useFarmerEventContext();

  useEffect(() => {
    if (forceRefreshed === 'finished') {
      setPage(1)
      setSearchTextDebounced('')
      setFarmers(agentData?.[context])
      // Calculate the start and end index for the current page
      const startIndex = 0;
      const endIndex = startIndex + pageLimit;
      // Extract the farmers for the current page
      const farmersForPage = agentData?.[context]?.slice(0, endIndex);
      // console.log(agentData, context, ' <=== visible farmers in force refresh....')
      setVisibleFarmers(farmersForPage)
      setFilteredFarmersCount(agentData?.[`${context}_count`])
    }
  }, [forceRefreshed])

  useEffect(() => {
    // Filter the farmers array based on the search criteria (case-insensitive)
    const filteredFarmers = farmers.filter((farmer) =>
      farmer?.firstName?.toLowerCase()?.includes(searchTextDebounced?.toLowerCase()) || farmer?.lastName?.toLowerCase()?.includes(searchTextDebounced?.toLowerCase()) || farmer?.address?.village?.toLowerCase()?.includes(searchTextDebounced?.toLowerCase())
    );

    // console.log(filteredFarmers, farmers, ' <=== I am filtered farmers.... hello ji hello')

    setFilteredFarmersCount(filteredFarmers?.length)

    // Calculate the start and end index for the current page
    const startIndex = (page - 1) * pageLimit;
    const endIndex = startIndex + pageLimit;

    // Extract the farmers for the current page
    const farmersForPage = filteredFarmers.slice(0, endIndex);

    // Update the visibleFarmers state
    setVisibleFarmers(farmersForPage);
  }, [page, searchTextDebounced])

  useEffect(() => {
    (Object.keys(agentData)?.length > 0) && setFarmers(agentData?.[context]);
    // agentData?.personalDetails &&
    //   setPersonalDetails(agentData?.personalDetails);
    // setFilteredFarmersCount(agentData?.farmers_count)
    // setVisibleFarmers(agentData?.farmers || [])
  }, [agentData])

  useEffect(() => {
    if (prevSearchTextDebounced != searchTextDebounced) {
      setPage(1)
    }
  }, [searchTextDebounced])

  useEffect(() => {
    // Call the debounced function, which will execute after the specified delay
    debouncedSearch(searchText);
  }, [searchText])

  // Create a debounced function for handling input changes
  const debouncedSearch = useCallback(debounce((text) => {
    setSearchTextDebounced(text)
  }, 500), []); // Adjust the delay as needed

  useEffect(() => {
    // Cleanup the debounced function on unmount
    return () => {
      debouncedSearch.cancel();
    };
  }, []);

  useEffect(() => {
    const count = agentData?.[`${context}_count`] || 0
    setFilteredFarmersCount(count)
    setVisibleFarmers(agentData?.[context] || [])
  }, [])
  return (
    <>
      <View style={{ marginHorizontal: 15 }} >
        <SearchBar
          placeholder={i18n.t(`agent.searchPlaceholder.${context}`)}
          lightTheme={true}
          containerStyle={{ backgroundColor: "transparent", outlineWidth: 0, borderTopWidth: 0, borderBottomWidth: 0, marginTop: 15 }}
          inputContainerStyle={{ backgroundColor: "white" }}
          value={searchText}
          onChangeText={(e) => setSearchText(e)}
        />
      </View>
      <View style={{ ...styles.ScrollView, marginBottom: 0 }}>
        <Text style={common.innerTitle}>{i18n.t(`agent.title.${context}`)} ({visibleFarmers?.length} / {filteredFarmersCount})</Text>
        {visibleFarmers?.length > 0 ? (
          <View style={styles.listPart}>
            <View style={{ ...common.listData, paddingBottom: 120, marginBottom: 0 }}>
              <FlatList
                style={{ height: '100%' }}
                data={visibleFarmers}
                keyExtractor={(item) => item.id}
                enableEmptySections={true}
                renderItem={({ item, index }) => {
                  const farmer = item
                  return (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("FARMER", {
                          userId: farmer.userId,
                          fromAgent: true,
                          farmer,
                          context
                        })
                      }
                      key={farmer.id}
                      style={common.listItem}
                    >
                      <ProfilePicName
                        firstName={farmer?.firstName}
                        lastName={farmer?.lastName}
                      />
                      <View style={common.listDetail}>
                        <View>
                          <Text style={common.listField}>{`${farmer?.firstName || ""
                            } ${farmer?.lastName || ""}`}</Text>
                          {farmer.fathersHusbandsName && <Text style={{ ...common.listName, maxWidth: 'auto' }}>{farmer.fathersHusbandsName}</Text>}
                          <Text
                            style={{ ...common.listName, maxWidth: "auto" }}
                          >{`${farmer?.address?.village || ""}, ${farmer?.address?.state || ""
                            }`}</Text>
                          <Text
                            style={{ ...common.listName, maxWidth: "auto" }}
                          >{farmer?.collectives?.length > 0 && farmer.collectives.map((item) => item.name).join(", ")}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )
                }}
                ListFooterComponent={() => !loading && (filteredFarmersCount > visibleFarmers?.length) && (
                  miniLoading ? (
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10, marginBottom: 20 }}>
                      <ActivityIndicator />
                      <Text style={{ marginLeft: 10, color: colors.gray }}>Please wait while we fetch the data in background...</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      disabled={miniLoading}
                      onPress={() => setPage(page + 1)}
                      style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10, backgroundColor: colors.primary, padding: 10, borderRadius: 8, marginBottom: 20 }}
                    >
                      <Text style={{ color: colors.white }}>{miniLoading ? 'Loading..' : 'Load More'}</Text>
                    </TouchableOpacity>
                  )
                )}
              />
            </View>
          </View>
        ) : (
          <NoDataComponent message={"No " + context + " avaliable"} icon={icon} />
        )}
        {/* <TouchableOpacity onPress={() => navigation.navigate("NoInternet")}>
            <Text>Go To No Internet</Text>
          </TouchableOpacity> */}
      </View>
    </>
  )
}



export default function AgentHome() {
  const navigation = useNavigation();

  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [personalDetails, setPersonalDetails] = useState({});
  const [miniLoading, setMiniLoading] = useState(false);
  const [filteredFarmersCountParent, setFilteredFarmersCount] = useState(0)
  const [visibleFarmersParent, setVisibleFarmers] = useState([])

  const [filteredProcessorsCountParent, setFilteredProcessorsCount] = useState(0)
  const [visibleProcessorsParent, setVisibleProcessors] = useState([])

  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'farmers', title: 'Farmers' },
    { key: 'processors', title: 'Processors' },
  ]);

  const {
    homeApi,
    agentData
  } = useFarmerEventContext();

  useEffect(() => {
    setLoading(true);
    homeApi('agent', false, 1, pageLimit, 0)
      .then((data) => {
        const farmers_count = data?.farmers_count || 0
        const processors_count = data?.processors_count || 0

        setFilteredProcessorsCount(processors_count)
        setVisibleProcessors(data?.processors || [])

        setFilteredFarmersCount(farmers_count)
        setVisibleFarmers(data?.farmers || [])
        setMiniLoading(true);
        homeApi('agent', false, 2, farmers_count > processors_count ? farmers_count : processors_count, pageLimit)
          .finally(() => {
            setMiniLoading(false)
          })
      })
      .finally(() => {
        setLoading(false);
      })
  }, []);

  useEffect(() => {
    (Object.keys(agentData).length > 0) && setFarmers(agentData.farmers);
    agentData?.personalDetails &&
      setPersonalDetails(agentData?.personalDetails);
  }, [agentData])


  if (loading) {
    return <View style={{ height: '100%', justifyContent: 'center' }}>
      <ActivityIndicator />
    </View>
  }

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'farmers':
        return <AgentItemList
          miniLoading={miniLoading}
          filteredFarmersCountParent={filteredFarmersCountParent}
          visibleFarmersParent={visibleFarmersParent}
          context="farmers"
        />;
      case 'processors':
        return <AgentItemList
          miniLoading={miniLoading}
          filteredFarmersCountParent={filteredProcessorsCountParent}
          visibleFarmersParent={visibleProcessorsParent}
          context="processors"
        />;
      default:
        return null;
    }
  };



  return (
    <>
      <SafeAreaView style={{ ...common.homeScreen, paddingBottom: 0 }}>
        <StatusBar />
        {/* <Header /> */}
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
          firstName={personalDetails?.firstName}
          lastName={personalDetails?.lastName}
          menuOptions={[
            {
              element: <Text style={common.menuOptionText}>{i18n.t('agent.agentProfileModal.profileText')}</Text>,
              onSelect: () =>
                navigation.navigate("FarmerProfile", {
                  details: personalDetails,
                  type: "Agent",
                }),
            },
          ]}
        />

        <TabView
          renderTabBar={props => <TabBar
            {...props}
            style={{ backgroundColor: colors.white }}
            indicatorStyle={{ backgroundColor: colors.primary }}
            renderLabel={({ route, focused, color }) => (
              <Text style={{ color: colors.black, margin: 8 }}>
                {route.title}
              </Text>
            )}
          />}
          lazy={false}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  listPart: {
    // marginTop: 20,
    width: "100%",
  },
  ScrollView: {
    minHeight: '73%',
    marginTop: 20,
    paddingHorizontal: 16,
    // marginBottom: 70
  },
});
