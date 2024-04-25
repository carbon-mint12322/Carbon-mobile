import { Image, View } from "react-native"
import appConfig from "../config/app.config"
import logoConfig from "../config/logo.config"


export default function Loader() {
    
    return (
        <View style={{ backgroundColor: 'white', zIndex: 2, height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}>
            <Image source={appConfig?.config?.logo ? {uri: appConfig?.config?.logo } : logoConfig()} style={{ ...(appConfig?.config?.logoStyles || {}), height: 150, width: 200 }} resizeMode="contain" />
        </View>
    )
}