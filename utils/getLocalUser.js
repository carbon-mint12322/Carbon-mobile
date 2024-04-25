import AsyncStorage from "./AsyncStorage"

export default async function getLocalUser() {
    let localUser = await AsyncStorage.getItem('user')
    try {
        localUser = JSON.parse(localUser)
    } catch (error) {
        localUser = null
    }

    return localUser
}