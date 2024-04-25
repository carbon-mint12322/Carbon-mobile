import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onIdTokenChanged, onAuthStateChanged } from 'firebase/auth'
import { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
// import * as SplashScreen from 'expo-splash-screen'
import { useNetInfo } from '@react-native-community/netinfo';
import * as Sentry from "@sentry/react-native";

import { auth } from '../config';
// import auth from '@react-native-firebase/auth';
import MapTrace from '../screens/MapTrace';
import LocationTrace from '../screens/LocationTrace';
import AuthNavigation from './Auth';
import isTokenExpired, { decodeToken } from '../utils/isTokenExpired';
import call from '../utils/api';
import { urls } from '../config/urls';
import { logout } from '../utils/logout';
import FarmerHome from '../screens/Farmer/Home';
import AgentHome, { pageLimit } from '../screens/Agent/Home';
import CropDetails from '../screens/Farmer/Crop/Details';
import NoInternet from '../screens/NoInternet';
import Notification from '../screens/Notification';
import FarmDetails from '../screens/Farmer/Farm/Details';
import colors from '../styles/colors';
import Profile from '../screens/Farmer/Profile';
import MapHistory from '../screens/MapTrace/History';
import networkListener from '../utils/networkListener';
import networkContext from '../contexts/NetworkContext';
import { FarmerEventProvider, useFarmerEventContext } from '../contexts/FarmerEventsContext';
import { getForceRefresh, setForceRefresh } from '../utils/forceRefresh';
import { ActivityIndicator } from 'react-native-paper';
import commonNetworkListener from '../utils/commonNetworkListener';
import Queue from '../screens/Queue';
import MapParams from '../components/MapParams';
import { useDeviceFcmTokenRegistration } from '../hooks/useDeviceFcmTokenRegistration';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NotificationProvider, useNotificationContext } from '../contexts/NotificationContext';
import { useFCMNotificationHandler } from '../hooks/useFCMNotificationHandler';
import { writeLog } from '../utils/sentryLogsQueue';
import i18n from '../i18n';
import LangTabs from '../components/LangTabs';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import ProuductionSystemsDetails from "../screens/Farmer/ProductionSystem/Details";
import { useContext } from "react";
import AsyncStorage from "../utils/AsyncStorage";
import ProcessingSystemDetails from '../screens/Farmer/ProcessingSystem/Details';

const Stack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const MapStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function CustomTab({ state, descriptors, navigation }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.primary, borderTopStartRadius: 20, borderTopEndRadius: 20, padding: 8 }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({ name: route.name, merge: true });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            {options.tabBarIcon && options.tabBarIcon({ focused: isFocused, size: 25, color: colors.properWhite })}
            <Text style={{ color: colors.properWhite, fontSize: 12 }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function TabNavigator(props) {
  useFCMNotificationHandler()
  const { isUnread, fetchNotifications } = useNotificationContext()

  useEffect(() => {
    fetchNotifications()
  }, [])

  const { route } = props
  return (
    <>
      <Tab.Navigator
        tabBar={props => <CustomTab {...props} />}
        screenOptions={() => ({
          headerShown: false,
          tabBarActiveTintColor: colors.properWhite,
          tabBarInactiveTintColor: colors.properWhite,
        })}
        {...props}
      >
        <Tab.Screen
          name={i18n.t('tabs.home')}
          component={HomeStackNavigator}
          initialParams={{ role: route?.params?.role }}
          options={{ tabBarIcon: ({ focused, size, color }) => <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} /> }}
          {...props}
        />
        {/* {route?.params?.role === 'AGENT' && ( */}
        <Tab.Screen
          name={i18n.t('tabs.map')}
          component={MapStackNavigator}
          options={{ tabBarIcon: ({ focused, size, color }) => <Ionicons name={focused ? 'map' : 'map-outline'} size={size} color={color} /> }}
          {...props}
        />
        {/* )} */}
        <Tab.Screen
          name={i18n.t('tabs.notification')}
          component={Notification}
          options={{
            tabBarIcon: ({ focused, size, color }) => <View >
              <Text style={{ position: "absolute", fontSize: 48, color: "red", bottom: 4, right: -7, display: `${isUnread ? 'flex' : 'none'}` }} >.</Text>
              <Ionicons name={focused ? 'notifications' : 'notifications-outline'} size={size} color={color} />
            </View>
          }}
          {...props}
        />
      </Tab.Navigator>
    </>
  );
}

function HomeStackNavigator(props) {
  const nav = useNavigation()
  const { user } = useContext(networkContext)
  useEffect(() => {
    nav.navigate('Home', { screen: user.role == 'PROCESSOR' ? 'FARMER' : user.role })
  }, [user])

  // const { route } = props
  console.log('AUTH REDIRECT DEBUG : ROLE IN HOME STACK NAVIGATOR ', user?.role)
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }} initialRouteName={(user.role == 'PROCESSOR' ? 'FARMER' : user?.role) || 'AGENT'} {...props}>
      <HomeStack.Screen name='AGENT' component={AgentHome}  {...props} />
      <HomeStack.Screen name='FARMER' component={FarmerHome} initialParams={{ loggedInAs: user?.role }} {...props} />
    </HomeStack.Navigator>
  )
}

function MapStackNavigator(props) {
  return (
    <MapStack.Navigator screenOptions={{ headerShown: false }} {...props}>
      <MapStack.Screen name='MapHistory' component={MapHistory}  {...props} />
      <MapStack.Screen name='MapTrace' component={MapTrace} {...props} />
      <MapStack.Screen name='LocationTrace' component={LocationTrace} {...props} />
    </MapStack.Navigator>
  )
}


export const userAllowedData = async (user, netInfo) => {
  user.accessToken = await user.getIdToken()
  let localUser = await AsyncStorage.getItem('user')
  try {
    localUser = JSON.parse(localUser)
  } catch (error) {
    localUser = null
  }
  if (localUser && localUser.userToken && localUser.uid) {
    let localToken = localUser.userToken || '';
    if ((netInfo.type !== 'unknown' && netInfo.isInternetReachable === false) || (!isTokenExpired(localToken) && user?.accessToken)) {
      console.log('Using cached data instead of auth api...')
      return {
        data: {
          allow: true
        },
      };
    }
  }
  try {
    console.log('Calling Auth api to get user data...')
    return await userAuth(user);
  } catch (error) {
    console.log(error.response, ' <== error while fetching custom token...')
    return null
  }
};

export const userAuth = async (user) => {
  return await call(urls.auth, 'get', {}, { authorization: `Bearer ${user?.accessToken}` }, {}, true)
};


const MainNavgator = (props) => {
  // const {route: {params: {currentUserState}}} = props
  const { setEventInfo } = props
  const { user } = useContext(networkContext)
  const [isAuthenticated, setIsAuthenticated] = useState(user && user.role)

  const netInfo = useNetInfo()
  const [isConnected, setIsConnected] = useState(!(netInfo.type !== 'unknown' && netInfo.isInternetReachable === false))
  useDeviceFcmTokenRegistration(isAuthenticated);
  useMemo(() => {
    if ((netInfo.type !== 'unknown' && netInfo.isInternetReachable === false)) {
      setIsConnected(false)
    } else {
      setIsConnected(true)
    }
  }, [netInfo.type, netInfo.isInternetReachable])

  useEffect(() => {
    if (user && user.role) {
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
    }
  }, [user])

  useEffect(() => {
    if (isConnected && isAuthenticated) {
      // networkListener(netInfo, setEventInfo)
      commonNetworkListener(netInfo, setEventInfo)
    }
  }, [isConnected])


  var initialRoute = 'Auth'
  if (isAuthenticated) {
    initialRoute = 'BottomTabs'
  }
  console.log("AUTH REDIRECT DEBUG : user role in nav change ", user.role, isAuthenticated ? 'authenticated' : 'not authenticated')
  // console.log(user.role, ' <== I am user in auth')
  return (
    <NotificationProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute} >
        {isAuthenticated ? (
          <>
            <Stack.Screen name='BottomTabs' component={TabNavigator} initialParams={{ isPublic: true, role: user.role }} />
            <Stack.Screen name='Mapp' component={MapTrace} initialParams={{ isPublic: true, }} />
            <Stack.Screen name="CropDetails" component={CropDetails} initialParams={{ isPublic: false, }} />
            <Stack.Screen
              name="ProductionSystemDetails"
              component={ProuductionSystemsDetails}
              initialParams={{
                isPublic: false,
              }}
            />
            <Stack.Screen
              name="ProcessingSystemDetails"
              component={ProcessingSystemDetails}
              initialParams={{
                isPublic: false,
              }}
            />
            <Stack.Screen name="FarmDetails" component={FarmDetails} initialParams={{ isPublic: false, }} />
            <Stack.Screen name='FarmerProfile' component={Profile} initialParams={{ isPublic: true, }} />
          </>
        ) : (
          <>
            <Stack.Screen name='Auth' component={AuthNavigation} initialParams={{ isPublic: true, }} />
            <Stack.Screen name='NoInternet' component={NoInternet} initialParams={{ isPublic: true, }} />
          </>
        )}

      </Stack.Navigator>
    </NotificationProvider>
  )
}

const MainStackNavigator = () => {

  const [authChange, setAuthChange] = useState(false)
  const [user, setUser] = useState({})
  const [forceRefreshed, setForceRefresh] = useState('finished')

  const netInfo = useNetInfo()
  const [loading, setLoading] = useState(true)
  const [eventInfo, setEventInfo] = useState({
    currentEvent: null,
    status: null
  })
  const [currentLang, setCurrentLang] = useState('en');

  const startUploadQueue = async () => {
    console.log('Refreshing upload queue')
    await commonNetworkListener(netInfo, setEventInfo)
    console.log('upload queue completed')
  }

  const getUser = async () => {
    try {
      setLoading(true)
      var user = await AsyncStorage.getItem('user')
      console.log("AUTH REDIRECT DEBUG : got this user in async storage ", user)
      if (user) {
        user = JSON.parse(user)
        setUser(user)
      }
    } catch (error) {
      setUser({})
      console.log(error, ' <=== error while checking auth')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // SplashScreen.preventAutoHideAsync();
    // onAuthStateChanged(auth, (user) => {
    //   if (!getForceRefresh()) {
    //     triggerAuthChange(user)
    //   } else {
    //     setForceRefresh(false)
    //   }
    // })
    getUser()
  }, [])

  const DrawerOptions = () => {
    const {
      homeApi,
    } = useFarmerEventContext();
    const [loading, setLoading] = useState(false)
    return (
      <SafeAreaView>
        <View
          style={{
            display: "flex",
            backgroundColor: "white",
            padding: 10,
            borderRadius: 15,
            justifyContent: "flex-start",
            alignItems: "center",
            // position: "absolute",
            // bottom: 80,
            // right: 20,
            zIndex: 999,
            height: "100%",
            position: 'relative'
          }}
        >
          <Queue />
          <TouchableOpacity onPress={async () => {
            if (!loading) {
              setForceRefresh('started')
              setLoading(true)
              try {
                await startUploadQueue()
                if (user?.role && user?.role?.toLowerCase() === 'agent') {
                  const data = await homeApi('agent', true, 1, pageLimit, 0)
                  const farmers_count = data?.farmers_count || 0
                  const processors_count = data?.processors_count || 0
                  await homeApi('agent', true, 2, farmers_count > processors_count ? farmers_count : processors_count, pageLimit)
                } else if (user?.role) {
                  await homeApi('farmer', true)
                }
              } catch (error) {
                console.log(error)
              } finally {
                setLoading(false)
                setForceRefresh('finished')
              }
            }
          }} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '100%', marginTop: 10 }}>
            <Ionicons name={"refresh"} size={30} />
            <Text style={{ marginLeft: 10 }}> {loading ? i18n.t('drawerScreen.loading') : i18n.t('drawerScreen.refreshData')}</Text>
          </TouchableOpacity>
          <MapParams />
          <View style={{ position: 'absolute', bottom: 25, width: '100%' }} >
            <LangTabs currentLang={currentLang} setCurrentLang={setCurrentLang} />
          </View>
        </View>
      </SafeAreaView>
    )
  }

  if (loading) {
    return <></>
  }

  return (
    <>
      <networkContext.Provider value={{ eventInfo, setEventInfo, authChange, setAuthChange, user, setUser, forceRefreshed, setForceRefresh }}>
        <FarmerEventProvider>
          <Drawer.Navigator screenOptions={{ headerShown: false }} drawerContent={DrawerOptions}>
            <Drawer.Screen
              // component={MainNavgator}
              // initialParams={{currentUserState}}
              name="drawer"
            >
              {(props) => <MainNavgator setEventInfo={setEventInfo} {...props} />}
            </Drawer.Screen>
          </Drawer.Navigator>
        </FarmerEventProvider>
      </networkContext.Provider>
    </>
  )
}

export default function Navigation() {
  return (
    <>
      <NavigationContainer>
        <MainStackNavigator />
      </NavigationContainer>
    </>
  )
}