import { urls } from "../config/urls"
import call from "./api"
import { clearCache } from "./cache"
import { clearQ, getAllItems, updateItem } from "./eventQueue"

export default async function networkListener(netInfo, setEventInfo) {
    await setEventInfo({
        currentEvent: null,
        status: null,
        completed: false
    })
    // console.log(info, ' <== I am info')
    if (!(netInfo.type !== 'unknown' && netInfo.isInternetReachable === false)) {
        let items = await getAllItems()
        for (let [index, item] of items.entries()) {
            if (!item.status || item.status == 1 || item.status == 4) {
                console.log(item.ts, ' <=== event is being uploaded..')
                try {
                    await updateItem(index, { ...item, status: 2, error: '' })
                    await setEventInfo({
                        currentEvent: index,
                        status: 2
                    })
                    const data = new FormData();

                    data.append('id', item.id)
                    data.append(item.type == 'landparcel' ? 'landParcelId' : 'cropId', item[item.type === 'landparcel' ? 'landParcelId' : 'cropId'])
                    data.append('type', item.type)
                    data.append('ts', item.ts)
                    data.append('uid', item.uid)
                    data.append('notes', item.notes)
                    data.append('lat', item.lat)
                    data.append('lng', item.lng)

                    if (item.audio && Object.keys(item.audio).length) {
                        data.append('audio', item.audio)
                    }

                    for (let image of item.image) {
                        data.append('image', image)
                    }
                    data.append('imageMeta', JSON.stringify(item.imageMeta))
                    data.append('audioMeta', JSON.stringify(item.audioMeta))
                    // await new Promise((resolve, reject) => {
                    //     setTimeout(() => resolve(true), 10000)
                    // })

                    await call(urls.createEvent, 'post', data, { 'content-type': 'multipart/form-data' }, {
                        transformRequest: (fdata, error) => {
                            return data;
                        }
                    })
                    await updateItem(index, { ...item, status: 3, error: '' })
                    await setEventInfo({
                        currentEvent: null,
                        status: null
                    })
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
            await clearCache()
            await setEventInfo({
                currentEvent: null,
                status: null,
                completed: true
            })
            await clearQ()

        }
    }
} 