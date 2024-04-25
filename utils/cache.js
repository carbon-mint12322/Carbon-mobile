import moment from 'moment';
import NetInfo, { useNetInfo } from '@react-native-community/netinfo';
import axios from 'axios';
import { baseURL, urls } from '../config/urls';
import AsyncStorage from "./AsyncStorage";

const prefix = 'cache';
const expiryInMinutes = 30;

export async function clearCache() {
  const keys = await AsyncStorage.getAllKeys()

  for (let key of keys) {
    if (key.startsWith(prefix)) {
      await AsyncStorage.removeItem(key)
    }
  }
}

const store = async (key, value) => {
  const item = {
    value,
    timeStamp: Date.now(),
  };

  try {
    await AsyncStorage.setItem(prefix + key, JSON.stringify(item));
  } catch (err) {
    console.log(err);
  }
};

const isExpired = item => {
  const now = moment(Date.now());
  const storedTime = moment(item.timeStamp);
  return now.diff(storedTime, 'minutes') > expiryInMinutes;
};

const get = async key => {
  try {
    let netInfo = await NetInfo.fetch()
    const value = await AsyncStorage.getItem(prefix + key);
    const item = JSON.parse(value || 'null');

    if (!item) return null;

    if ((netInfo.type !== 'unknown' && netInfo.isInternetReachable === false)) {
      return item.value;
    }

    let isOurServerLive = false
    try {
      const resp = await axios.get(urls.echo, { baseURL })
      console.log(resp.data, ' <== ECHO API RESPONSE')
      isOurServerLive = true
    } catch (error) {
      console.log(error?.response || error)
    }

    if (!isOurServerLive) {
      console.debug('SERVER IS DOWN')
      return item.value;
    }

    if (isExpired(item)) {
      // await AsyncStorage.removeItem(prefix + key);
      return null;
    }
    return item.value;
  } catch (err) {
    console.log(err, ' <== error in cache get');
  }
};

export default { store, get };
