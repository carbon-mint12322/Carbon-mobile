import { useEffect } from "react";
import Messaging from '@react-native-firebase/messaging'
import { useNotificationContext } from "../contexts/NotificationContext";
import { useNavigation } from "@react-navigation/native";

export function useFCMNotificationHandler() {

    const nc = useNotificationContext()
    const { setIsUnread, fetchNotifications } = nc
    const navigation = useNavigation();

    const handler = () => {
        navigation.navigate('Notification')
    }

    useEffect(() => {
        console.log('Setting up message listeners...')
        Messaging().onMessage(async remoteMessage => {
            console.log("Received message");
            console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
            setIsUnread(true)
            fetchNotifications()
        });

        Messaging().setBackgroundMessageHandler(async remoteMessage => {
            console.log('Message handled in the background!', remoteMessage);
            setIsUnread(true)
            fetchNotifications()
        });

        const unsubscribe = Messaging().onNotificationOpenedApp(handler);

        return unsubscribe      
    }, [])
}