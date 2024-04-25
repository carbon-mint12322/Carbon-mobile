import { PermissionsAndroid } from 'react-native';
import Messaging from '@react-native-firebase/messaging'

import call from '../utils/api';
import { urls } from '../config/urls';
import { useEffect, useState } from 'react';

export function useDeviceFcmTokenRegistration(isUserAuthenticated) {

    const [isDeviceRegistered, setDeviceRegistered] = useState(false);

    useEffect(() => {

        if (!isUserAuthenticated) return;

        /** */
        const postDeviceTokenToApi = async (token) => {
            return call(urls.deviceToken, 'put', {
                "device": {
                    "info": "AndroidDevice",
                    "fcmToken": token
                }
            })
        };

        /** */
        const getFCMToken = async () => {

            try {
                const token = await Messaging().getToken();
                if (token) {
                    return token;
                }

            } catch (e) {
                console.error(e);
            }

            throw new Error("FCM token fetch failed.");
        };

        /** */
        const checkIfNotificationPermissionAllowed = async () => {

            const hasPermission = await Messaging().hasPermission();

            // if notification permission is available
            return hasPermission >= 1;
        }

        /** */
        const getPermission = async () => {

            try {

                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATION
                );

                return (granted === PermissionsAndroid.RESULTS.GRANTED);

            } catch (e) {
                console.error(e);
            }

            throw new Error("Getting permission failed.")
        }

        /** */
        const setupPushNotificationsForMobileDevice = async () => {

            try {

                // Getting permission from user for sending notifications
                await getPermission();

                // Check if notificaiton permission is granted
                if (!await checkIfNotificationPermissionAllowed()) return false;

                // Getting device token for sending notification via FCM
                const token = await getFCMToken();
                if (!(token && typeof token === "string" && token.length > 0)) return false;

                // Adding device token to user's devices array
                await postDeviceTokenToApi(token);

                // Returning true on all process completion
                return true;

            } catch (e) {
                console.error(e);
            }

            return false;
        }

        /** */
        const onSuccess = (res) => {
            console.log({ devicePushNotificationSetup: res });
            setDeviceRegistered(res);
        }

        /** */
        const onError = (err) => console.error({
            errorOnDevicePushNotificationSetup: err
        });

        /** */
        setupPushNotificationsForMobileDevice()
            .then(onSuccess)
            .catch(onError)

    }, [isUserAuthenticated]);

    return isDeviceRegistered;
}


