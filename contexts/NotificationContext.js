import { createContext, useContext, useEffect, useState } from "react";
import call from "../utils/api";
import auth from '@react-native-firebase/auth';
import { urls } from "../config/urls";


let NotificationContextDefaultValues = {
    
}
const NotificationContext = createContext(NotificationContextDefaultValues)

export const NotificationProvider = ({ children }) => {

    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(false)
    const [isUnread, setIsUnread] = useState(false)

    const clearNotificatons = async () => {
        // return "TEST"
        try{
            setLoading(true)
            const resp = await call(`${urls.updateNotification}`, 'put', { operation: 'clear' }, {}, {}, true)
            console.log(resp, ' <===  I am response')
            setNotifications([])
            return true
        }catch(e){
            console.log(e?.response?.data || e)
            // Promise.reject(e)
            return e
        }finally{
            setLoading(false)
        }
    }

    const fetchNotifications = async (markRead = false) => {
        // return "TEST"
        try{
            setLoading(true)
            let result = await call(`${urls.fetchNotification}`, 'get', {}, {}, {}, true)
            if(markRead) {
                await call(urls.updateNotification, 'put', { operation: 'read' }, {}, {})
            }
            setNotifications(result?.data || [])
            result?.data?.find((item) => {
                if(item.status === "Unread" && !markRead){
                    setIsUnread(true)
                    return item
                }
            })
            // Promise.resolve()
            return true
        }catch(e){
            console.log(e)
            // Promise.reject(e)
            return e
        }finally{
            setLoading(false)
        }
    }

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                fetchNotifications,
                isUnread,
                setIsUnread,
                clearNotificatons
            }}
        >
            {children}
        </NotificationContext.Provider>
    )

}

export const useNotificationContext = () => useContext(NotificationContext);