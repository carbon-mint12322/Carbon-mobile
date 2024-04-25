// import auth from '@react-native-firebase/auth';
import { getAuth } from "firebase/auth";
import app from "../config";
import AsyncStorage from "./AsyncStorage";
import Cookies from '@react-native-cookies/cookies';


const auth = getAuth(app)
export async function logout(setUser) {
    console.log('Clearing async storage...')
    await AsyncStorage.clear();
    await auth.signOut()
    setUser({})
    await Cookies.flush()
    await Cookies.clearAll();
    console.log('logout success')
    // await AsyncStorage.removeItem('user')
    // await AsyncStorage.getAllKeys()
    //     .then(keys => AsyncStorage.multiRemove(keys))
    //     .then(() => console.log('logout success'));
}