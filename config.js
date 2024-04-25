import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth'
import { getReactNativePersistence } from "firebase/auth/react-native"
import AsyncStorage from './utils/AsyncStorage';


export const firebaseConfig = {
    apiKey: "AIzaSyCoIXNo-EN01spUc7qL0cZNq9PyMnpyGDo",
    authDomain: "carbon-mint-app.firebaseapp.com",
    projectId: "carbon-mint-app",
    storageBucket: "carbon-mint-app.appspot.com",
    messagingSenderId: "957981352555",
    appId: "1:957981352555:web:a51be1eeaf92320806872e",
    measurementId: "G-EY47BVD1MG",
}

// export const firebaseConfig = {
//     apiKey: "AIzaSyDgG-qAghT_gh8fR3CpVmg-4s4_K9E-0k8",
//     authDomain: "portfolio-5d038.firebaseapp.com",
//     databaseURL: "https://portfolio-5d038.firebaseio.com",
//     projectId: "portfolio-5d038",
//     storageBucket: "portfolio-5d038.appspot.com",
//     messagingSenderId: "653187827135",
//     appId: "1:653187827135:web:d504048ca59b70478b4d0a",
//     measurementId: "G-JCY0GDSPQ4"
// }

const apps = getApps()
var app = apps[0]
if (!apps.length) {
    app = initializeApp(firebaseConfig)
    initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
    })
}

export var auth = getAuth(app)
export default app