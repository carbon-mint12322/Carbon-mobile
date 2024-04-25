import { callCommonQ } from "./api"
import { clearQ, getAllItems, updateItem } from "./commonQueue"
import { clearQ as clearSentryQ, getAllItems as getAllSentryItems, updateItem as updateStnryItems } from "./sentryLogsQueue"
import * as Sentry from "@sentry/react-native";

export default async function commonNetworkListener(netInfo, setEventInfo) {
    await setEventInfo({
        currentEvent: null,
        status: null,
        completed: false
    })
    if (!(netInfo.type !== 'unknown' && netInfo.isInternetReachable === false)) {
        let items = await getAllItems()
        for (let [index, item] of items.entries()) {
            if (!item.status || item.status == 1 || item.status == 4) {
                console.log(item.data.ts, ' <=== event is being uploaded..')
                try {
                    await updateItem(index, { ...item, status: 2, error: '' })
                    await setEventInfo({
                        currentEvent: index,
                        status: 2
                    })
                    console.log(item.data.ts, ' <=== updated event status to 2 (ongoing)..')

                    let data = {};
                    let itemData = item.data
                    let type = "";
                    if (itemData.type === "landparcel") {
                        type = "landParcelId";
                    } else if (itemData.type === "productionSystem") {
                        type = "productionSystemId";
                    } else if (itemData.type === "processingSystem") {
                        type = "processingSystemId";
                    } else {
                        type = "cropId";
                    }
                    if (item.type === 'event') {
                        data = new FormData();

                        data.append('id', itemData.id)
                        // data.append(itemData.type == 'landparcel' ? 'landParcelId' : 'cropId', itemData[itemData.type === 'landparcel' ? 'landParcelId' : 'cropId'])
                        data.append(type, itemData[type]);
                        data.append('type', itemData.type)
                        data.append('ts', itemData.ts)
                        data.append('uid', itemData.uid)
                        data.append('notes', itemData.notes)
                        data.append('lat', itemData.lat)
                        data.append('lng', itemData.lng)

                        if (itemData.audio && Object.keys(itemData.audio).length) {
                            data.append('audio', itemData.audio)
                        }

                        for (let image of itemData.image) {
                            data.append('image', image)
                        }
                        data.append('imageMeta', JSON.stringify(itemData.imageMeta))
                        data.append('audioMeta', JSON.stringify(itemData.audioMeta))
                    } else {
                        data = itemData
                    }
                    console.log(item.data.ts, ' <=== request body prepared....')
                    var result
                    if (item.isJson) {
                        result = await callCommonQ(item.url, item.method, data)
                    } else {
                        result = await callCommonQ(item.url, item.method, data, { 'content-type': 'multipart/form-data' }, {
                            transformRequest: (fdata, error) => {
                                return data;
                            }
                        })
                    }
                    console.log(item.data.ts, ' <=== uploaded event....')
                    await updateItem(index, { ...item, data: { ...item.data, id: result.data.insertedId }, status: 3, error: '' })
                    await setEventInfo({
                        currentEvent: null,
                        status: null
                    })
                    console.log(item.data.ts, ' <=== event status updated to 3 which is completed....')
                } catch (error) {
                    console.log(error?.response?.data || error, ' <=== Error while uploading file')
                    await updateItem(index, { ...item, status: 4, error: error?.response?.data?.message || error?.message })
                    await setEventInfo({
                        currentEvent: null,
                        status: null
                    })
                }
            }
        }
        if (items.filter(item => !item.status || item.status == 1 || item.status == 4).length > 0) {
            // await clearCache()
            await setEventInfo({
                currentEvent: null,
                status: null,
                completed: true
            })
            // await clearQ()

        }

        await handleSentryMessages()
    }
}

async function handleSentryMessages() {
    const items = await getAllSentryItems()
    for (let [index, item] of items.entries()) {
        if (!item.status || item.status == 0 || item.status == 3) {
            await updateStnryItems(index, { ...item, status: 1 })
            if (item.message) {
                try {
                    await Sentry.captureMessage(item.message, item.level || 'debug')
                    await updateStnryItems(index, { ...item, status: 2 })
                } catch (error) {
                    console.log(error)
                    await updateStnryItems(index, { ...item, status: 3, error: error.message })
                }
            }
        }
    }
    await clearSentryQ()
}