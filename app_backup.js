import { SafeAreaView, StyleSheet, Text, View, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import Geolocation from '@react-native-community/geolocation';


export const getGeoLocationJS = () => {
  const getCurrentPosition = `
    navigator.geolocation.getCurrentPosition = (success, error, options) => {
      window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'getCurrentPosition', options: options }));

      window.addEventListener('message', (e) => {
        let eventData = {}
        try {
          eventData = JSON.parse(e.data);
        } catch (e) {}

        if (eventData.event === 'currentPosition') {
          success(eventData.data);
        } else if (eventData.event === 'currentPositionError') {
          error(eventData.data);
        }
      });
    };
    true;
  `;

  const watchPosition = `
    navigator.geolocation.watchPosition = (success, error, options) => {
      window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'watchPosition', options: options }));

      window.addEventListener('message', (e) => {
        let eventData = {}
        try {
          eventData = JSON.parse(e.data);
        } catch (e) {}

        if (eventData.event === 'watchPosition') {
          success(eventData.data);
        } else if (eventData.event === 'watchPositionError') {
          error(eventData.data);
        }
      });
    };
    true;
  `;

  const clearWatch = `
    navigator.geolocation.clearWatch = (watchID) => {
      window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'clearWatch', watchID: watchID }));
    };
    true;
  `;

  return `
    (function() {
      ${getCurrentPosition}
      ${watchPosition}
      ${clearWatch}
    })();
  `;
};


export default function App() {




  return (
    // <SafeAreaView style={{marginTop:StatusBar.currentHeight}} >
    //   <Text>Open up App.js to start working on your app!</Text>
    // </SafeAreaView>
    <SafeAreaView style={{ flex:1 }}>
      <StatusBar style="auto" />
      <WebView
        source={{
          uri: 'http://dev.reactml.carbonmint.com/public/draw-boundaries',
        }}
        geolocationEnabled={true}
        injectedJavaScript={ getGeoLocationJS() }
  javaScriptEnabled={ true }
  onMessage={ event => {
    let data = {}
    try {
      data = JSON.parse(event.nativeEvent.data);
    } catch (e) {
      console.log(e);
    }

    if (data?.event && data.event === 'getCurrentPosition') {
      Geolocation.getCurrentPosition((position) => {
        webview.postMessage(JSON.stringify({ event: 'currentPosition', data: position }));
      }, (error) => {
        webview.postMessage(JSON.stringify({ event: 'currentPositionError', data: error }));
      }, data.options);
    } else if (data?.event && data.event === 'watchPosition') {
      Geolocation.watchPosition((position) => {
        webview.postMessage(JSON.stringify({ event: 'watchPosition', data: position }));
      }, (error) => {
        webview.postMessage(JSON.stringify({ event: 'watchPositionError', data: error }));
      }, data.options);
    } else if (data?.event && data.event === 'clearWatch') {
      Geolocation.clearWatch(data.watchID);
    } 
  }}
  ref={ ref => {
    webview = ref;
    // if (onRef) {
    //   onRef(webview)
    // }
  }}
  startInLoadingState={ true }
      >
      </WebView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
