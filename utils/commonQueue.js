import AsyncStorage from "./AsyncStorage"

async function getParsedQ() {
    let commonQ = await AsyncStorage.getItem('commonQ')
    try {
        commonQ = JSON.parse(commonQ)
    } catch (err) {
        commonQ = []
    }

    return commonQ || []
}

export async function setItem(payload) {
    let commonQ = await getParsedQ()

    commonQ = [payload, ...commonQ]
    await AsyncStorage.setItem('commonQ', JSON.stringify(commonQ))
    return commonQ
}

export async function getAllItems() {
    // const q = await getParsedQ()

    // AsyncStorage.setItem('commonQ', JSON.stringify(q.map(itm => ({ ...itm, status: 1 }))))
    return await getParsedQ()
}

export async function getAllItemsByType(type) {
    const q = await getParsedQ()

    // AsyncStorage.setItem('commonQ', JSON.stringify(q.map(itm => ({ ...itm, status: 1 }))))
    return q.filter(item => item.type === type)
    // return await getParsedQ() 
}

export async function getAllItemsDataByType(type) {
    const q = await getParsedQ()

    // AsyncStorage.setItem('commonQ', JSON.stringify(q.map(itm => ({ ...itm, status: 1 }))))
    return q.filter(item => item.type === type).map((item) => {
        return {
            ...item.data,
            isCached: item.isCached,
            status: item.status
        }
    })

    // return await getParsedQ() 
}

export async function clearQ() {
    const commonQ = await getParsedQ()
    await AsyncStorage.setItem('commonQ', JSON.stringify(commonQ.filter(item => item.status !== 3)))
}

export async function getItem() {
    let commonQ = await getParsedQ()
    return { item: commonQ[commonQ.length - 1], index: commonQ.length - 1 }
}

export async function updateItem(index, payload) {
    let commonQ = await getParsedQ()
    commonQ = commonQ.map((qItem, qindex) => qindex === index ? { ...qItem, ...payload } : qItem)
    // commonQ[index] = payload
    await AsyncStorage.setItem('commonQ', JSON.stringify(commonQ))
    return commonQ
}

export async function popItem() {
    let commonQ = await getParsedQ()

    let item = commonQ.pop()
    await AsyncStorage.setItem('commonQ', JSON.stringify(commonQ))
    return item
}