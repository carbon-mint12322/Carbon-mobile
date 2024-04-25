import { StatusBar } from "expo-status-bar";
import { View,  StyleSheet, Image, TouchableOpacity} from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import FarmerHeader from "../../components/FarmerHeader";
import colors from "../../styles/colors";
import { Ionicons } from '@expo/vector-icons';

export default function NoInternet() {
    return (
        <SafeAreaView>
            <StatusBar />
            <FarmerHeader
                hideProfileImage={true}
                subtitle="Subtitle"
                title={'Title'}
            />
            <View style={styles.noInternetPart}>
                <View style={styles.loadingImage}>
                    <Image source={require('../../assets/farm.png')}  style={styles.farmImage}/>
                    <View style={styles.overLay}></View>
                </View>
                <View style={styles.noInternetContent}>
                    <View style={styles.contentPart}>
                        <View style={styles.noWifi}>
                            <Image source={require('../../assets/network-off.png')} style={styles.noWifiImage}/>
                        </View>
                        <Text style={styles.description}>No internet connection.</Text>
                        <View style={styles.content}>
                            <Text style={styles.paragraph}>
                                No internet connection. Please turn on WiFi or Mobile data.
                            </Text>
                        </View>
                        <TouchableOpacity>
                            <Text style={styles.retryText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.bottomPart}>
                    <View style={styles.loadingPart}>
                        <View style={styles.loadingProfile}></View>
                        <View style={styles.loadingContent}>
                            <View style={styles.shortText}></View>
                            <View style={styles.longText}></View>
                        </View>
                        <View style={styles.loadingCamera}></View>
                    </View>
                    <View style={styles.loadingPart}>
                        <View style={styles.loadingProfile}></View>
                        <View style={styles.loadingContent}>
                            <View style={styles.shortText}></View>
                            <View style={styles.longText}></View>
                        </View>
                        <View style={styles.loadingCamera}></View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    noInternetPart:{
        paddingHorizontal: 16,
        flexDirection: 'column',
        height: '90%'
    },
    loadingImage:{
        position: 'relative',
    },
    overLay:{
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: colors.properWhite,
        opacity: 0.6
    },
    farmImage:{
        width: '100%',
        borderRadius: 20,
    },
    noInternetContent:{
        flex: 1,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: -50,
    },
    description:{
        fontSize: 18,
        fontWeight: '700',
        color: colors.black,
        textAlign: 'center',
        marginBottom: 10,
    },
    content:{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    paragraph:{
        fontSize: 14,
        fontWeight: '400',
        color: colors.lightGray,
        textAlign: 'center',
        width: '85%',
        marginHorizontal: 'auto',
    },
    noWifi:{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
        marginBottom: 20,
    },
    noWifiImage:{
        width: 64,
    },
    retryText:{
        color: colors.primary,
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
        marginVertical: 20
    },
    loadingProfile:{
        width: 48,
        height: 48,
        backgroundColor: colors.placeholder,
        borderRadius: 16
    },
    loadingPart:{
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24
    },
    loadingContent:{
        flex: 1,
        paddingHorizontal: 24,
    },
    shortText:{
        width: 100,
        height: 12,
        backgroundColor: colors.placeholder,
        borderRadius: 8,
        marginBottom: 10,
    },
    longText:{
        width: '100%',
        height: 12,
        backgroundColor: colors.placeholder,
        borderRadius: 8,
    },
    loadingCamera:{
        width: 36,
        height: 36,
        backgroundColor: colors.placeholder,
        borderRadius: 25
    },
})