import axios from "axios";
import { baseURL } from "../config/urls";
import cache from "./cache";
import getLocalUser from "./getLocalUser";
import { writeLog } from "./sentryLogsQueue";
import AsyncStorage from './AsyncStorage';

export default async function call(url, method, body, headers, options = {}, forceRefresh = false) {
    console.log('API CALL STARTED..', url)
    var user = await AsyncStorage.getItem('user');
    var token = ''
    if (user) {
        try {
            user = JSON.parse(user)
        } catch (error) {
            console.log(error)
        }
        token = user.userToken
    }
    try {
        let localResponse = forceRefresh ? false : await cache.get(url)

        if (localResponse) {
            console.log('FOUND CACHED DATA...')
            return Promise.resolve({ data: localResponse })
        }

        console.log('CALLING ACTUAL API FOR DATA...')
        const response = await axios({
            method,
            url,
            baseURL,
            data: { ...(body || {}) },
            headers: token ? { authorization: `Bearer ${token}`, ...headers } : { ...headers },
            ...options
        })
        if (method.toLowerCase() === 'get') {
            console.log('CACHING API RESPONSE...')
            await cache.store(url, response.data)
        }

        console.log('SENDING RESPONSE FROM API...')
        return Promise.resolve(response)
    } catch (error) {
        console.log('ERROR IN : ', url, ' Method: ', method)
        writeLog('ERROR IN : ' + url + ' Method: ' + method, 'debug')
        writeLog(error?.response?.data ? JSON.stringify(error?.response?.data) : error.message)
        return Promise.reject(error)
    }
}

export const callCommonQ = async (url, method, body, headers, options = {}, fromCall = false) => {
    console.log('API CALL STARTED..', url)
    // const auth = getAuth(app)
    let localUser = await getLocalUser()
    try {

        // var newToken
        // if(url !== '/auth' && localUser?.userToken) {
        //     console.log('RENEWING TOKEN AS IT IS EXPIRED')
        //     const token = await auth.currentUser.getIdToken(true)
        //     const userAllowed = await userAuth({ accessToken: token })
        //     newToken = userAllowed?.data?.token
        //     if(userAllowed?.data?.token && localUser) {
        //         localUser.userToken = userAllowed?.data?.token
        //     }
        //     console.log(`I AM NEW TOKEN `, newToken)
        // }
        console.log('CALLING ACTUAL API FOR DATA...')
        const response = await axios({
            method,
            url,
            baseURL,
            data: { ...(body || {}) },
            headers: localUser ? { authorization: `Bearer ${localUser?.userToken}`, ...headers } : { ...headers },
            ...options
        })

        console.log('SENDING RESPONSE FROM API...')
        return Promise.resolve(response)
    } catch (error) {
        console.log('ERROR IN : ', url, ' Method: ', method)
        return Promise.reject(error)
    }
}