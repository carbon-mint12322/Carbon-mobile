import * as Sentry from "@sentry/react-native";
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from "./AsyncStorage";

async function getParsedQ() {
    let sentryQueue = await AsyncStorage.getItem('sentryQueue')
    try {
        sentryQueue = JSON.parse(sentryQueue)
    } catch (err) {
        sentryQueue = []
    }

    return sentryQueue || []
}

export async function writeLog(message, level) {
    try {
        let netInfo = await NetInfo.fetch()
        if ((netInfo.type !== 'unknown' && netInfo.isInternetReachable === false)) {
            return await setItem({ message: `${new Date}:  ${message}`, level, status: 0 })
        } else {
            return await Sentry.captureMessage(`${new Date}:  ${message}`, level)
        }
    } catch (error) {
        console.log(error)
        return Promise.reject(error)
    }
}

export async function setItem(payload) {
    let sentryQueue = await getParsedQ()

    sentryQueue = [payload, ...sentryQueue]
    await AsyncStorage.setItem('sentryQueue', JSON.stringify(sentryQueue))
    return sentryQueue
}

export async function getAllItems() {
    // const q = await getParsedQ()

    // AsyncStorage.setItem('sentryQueue', JSON.stringify(q.map(itm => ({ ...itm, status: 1 }))))
    return await getParsedQ()
}

export async function clearQ() {
    const sentryQueue = await getParsedQ()
    await AsyncStorage.setItem('sentryQueue', JSON.stringify(sentryQueue.filter(item => item.status !== 2)))
}

export async function getItem() {
    let sentryQueue = await getParsedQ()
    return { item: sentryQueue[sentryQueue.length - 1], index: sentryQueue.length - 1 }
}

export async function updateItem(index, payload) {
    let sentryQueue = await getParsedQ()
    sentryQueue[index] = payload
    await AsyncStorage.setItem('sentryQueue', JSON.stringify(sentryQueue))
    return sentryQueue
}

export async function popItem() {
    let sentryQueue = await getParsedQ()

    let item = sentryQueue.pop()
    await AsyncStorage.setItem('sentryQueue', JSON.stringify(sentryQueue))
    return item
}