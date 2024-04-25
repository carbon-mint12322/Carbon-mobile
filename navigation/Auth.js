import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Auth/Login';
import OTP from '../screens/Auth/Otp';

const Stack = createNativeStackNavigator();

export default function AuthNavigation(props) {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login} initialParams={{ isPublic: true, ...(props?.route?.params || {}) }} />
            <Stack.Screen name="OTP" component={OTP} initialParams={{ isPublic: true }} />
        </Stack.Navigator>
    )
}