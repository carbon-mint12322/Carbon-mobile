import { Toast } from 'react-native-toast-message/lib/src/Toast'
import { urls } from '../config/urls'
import call from './api'
import { writeLog } from './sentryLogsQueue'
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from './AsyncStorage';
import appConfig from '../config/app.config';

export async function getNextAuthToken(idToken, mobile, pin) {
  try {
    const { data } = await call(urls.csrf, 'get', {}, {}, {}, true)
    const { csrfToken } = data
    const requestData = ({ firebaseToken: idToken, csrfToken, mobile, pin, json: true })
    const tokenresp = await call(urls.callback, 'post', requestData, { 'Content-Type': 'application/x-www-form-urlencoded' }, {})
    const cookies = tokenresp.headers['set-cookie'] || {}
    var token = ''
    for (let cookie of cookies) {
      if (cookie.startsWith('next-auth.session-token') || cookie.startsWith('__Secure-next-auth.session-token')) {
        token = cookie = cookie.substring(
          cookie.indexOf("=") + 1,
          cookie.indexOf(";")
        );

      }
    }
    if (token) {
      return token
    } else {
      return Promise.reject(false)
    }
  } catch (error) {
    console.log(error)
    return Promise.reject(error?.response?.data?.message || error?.message)
  }
}
export async function getSession(token) {
  const { data } = await call(urls.session, 'get', {}, { headers: { authorization: `Bearer ${token}` } }, {}, false)
  return data
}

export const userAllowedData = async (token) => {
  const netInfo = await NetInfo.fetch()
  let localUser = await AsyncStorage.getItem('user')
  try {
    localUser = JSON.parse(localUser)
  } catch (error) {
    localUser = null
  }
  if (localUser && localUser.userToken && localUser.uid) {
    if ((netInfo.type !== 'unknown' && netInfo.isInternetReachable === false)) {
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
    return await userAuth(token);
  } catch (error) {
    console.log(error.response, ' <== error while fetching custom token...')
    return null
  }
};

export const userAuth = async (token) => {
  return await call(urls.auth, 'get', {}, { authorization: `Bearer ${token}` }, {}, true)
};

export const triggerAuthChange = async (token, user) => {
  writeLog("There is an Auth change occured", "debug");
  console.log('There is an Auth change occured')
  // setAuthLoading(true);
  // setCurrentUserState({ prevState: currentUserState.state, state: 'Loading', initialScreen: 'Auth', initialParams: { screen: 'Login' } })
  try {
    if (token) {
      // const token = await user.getIdToken();
      const userAllowed = await userAllowedData(token);
      if (userAllowed?.data?.allow) {
        console.log(userAllowed.data, ' <== I am decoded token')
        let role = ''
        if (user?.roles?.[appConfig.appName || 'farmbook']) {
          if (user?.roles?.[appConfig.appName || 'farmbook']?.includes('AGENT')) {
            role = 'AGENT'
          } else if (user?.roles?.[appConfig.appName || 'farmbook']?.includes('FARMER')) {
            role = 'FARMER'
          } else if (user?.roles?.[appConfig.appName || 'farmbook']?.includes('PROCESSOR')) {
            role = 'PROCESSOR'
          }
        }
        const usr = { userToken: token, uid: user.email, user, role }
        await AsyncStorage.setItem("user", JSON.stringify(usr))
        writeLog("LOGGED IN : " + token, "debug");
        console.debug(' LOGGED IN ');
        //   if (currentUserState.prevState !== 'Logged in') {
        // setCurrentUserState({ state: 'Logged in', initialScreen: role, initialParams: {} })
        //   }

        // ON user logged in
        //   setUserAuthenticated(true);
        return usr

      } else {
        writeLog("NOT allowed", "debug");
        writeLog(JSON.stringify(userAllowed), "error");
        console.debug(' NOT allowed ');
        //   setCurrentUserState({ state: 'Not allowed', initialScreen: 'Auth', initialParams: { screen: 'Login' } })
        Toast.show({
          type: 'error',
          text2: 'You do not have the permission to login to this app. Please contact your admin.'
        })
        // await logout();
        return Promise.reject(new Error('You do not have the permission to login to this app. Please contact your admin.'))
      }
    } else {
      writeLog("NOT LOGGED IN", "debug");
      console.debug(' NOT LOGGED IN ');
      return Promise.reject(false)
      // setCurrentUserState({ state: 'Not logged in', initialScreen: 'Auth', initialParams: { screen: 'Login' } })
      // await logout()
      // if (navigation?.getCurrentRoute() && !navigation?.getCurrentRoute()?.params?.isPublic) {
      // navigation.navigate('Auth', { screen: 'Login' })
      // }
    }
  } catch (error) {
    console.log(error)
    return Promise.reject(error)
  } finally {
    //   setAuthLoading(false);
    //   SplashScreen.hideAsync();
  }
};