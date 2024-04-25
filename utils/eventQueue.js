import AsyncStorage from "./AsyncStorage"


async function getParsedQ() {
    let eventQ = await AsyncStorage.getItem('eventQ')
    try {
        eventQ = JSON.parse(eventQ)
    } catch (err) {
        eventQ = []
    }

    return eventQ || []
}

export async function setItem(payload) {
    let eventQ = await getParsedQ()

    eventQ = [payload, ...eventQ]
    await AsyncStorage.setItem('eventQ', JSON.stringify(eventQ))
    return eventQ
}

export async function getAllItems() {
    // const q = await getParsedQ()

    // AsyncStorage.setItem('eventQ', JSON.stringify(q.map(itm => ({ ...itm, status: 1 }))))
    return await getParsedQ()
}

export async function clearQ() {
    const eventQ = await getParsedQ()
    await AsyncStorage.setItem('eventQ', JSON.stringify(eventQ.filter(item => item.status !== 3)))
}

export async function getItem() {
    let eventQ = await getParsedQ()
    return { item: eventQ[eventQ.length - 1], index: eventQ.length - 1 }
}

export async function updateItem(index, payload) {
    let eventQ = await getParsedQ()
    eventQ[index] = payload
    await AsyncStorage.setItem('eventQ', JSON.stringify(eventQ))
    return eventQ
}

export async function removeItem(indexInput) {
    let eventQ = await getParsedQ()
    eventQ = eventQ.filter((item, index) => {
        return index !== indexInput
    })
    await AsyncStorage.setItem('eventQ', JSON.stringify(eventQ))
    return eventQ
}

export async function popItem() {
    let eventQ = await getParsedQ()

    let item = eventQ.pop()
    await AsyncStorage.setItem('eventQ', JSON.stringify(eventQ))
    return item
}