import React from "react";
import { MenuProvider } from "react-native-popup-menu";
import Navigation from "./navigation";
import * as Sentry from "@sentry/react-native";
import packageJson from './package.json';
import { Text } from "react-native";
import { MapParamsProvider } from "./contexts/MapParamsContext";
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';

Sentry.init({
  dsn: "https://953009e3cc134946ad6cb7fec0eb5507@o4504796924411904.ingest.sentry.io/4504796926574592",
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      // style={styles.style}
      // contentContainerStyle={styles.contentContainerStyle}
      // text1Style={styles.text1Style}
      text1NumberOfLines={4}
      // text2Style={styles.text2Style}
      text2NumberOfLines={4}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      // style={[styles.style, styles.errorStyle]}
      // contentContainerStyle={styles.contentContainerStyle}
      // text1Style={styles.text1Style}
      text1NumberOfLines={4}
      // text2Style={styles.text2Style}
      text2NumberOfLines={4}
    />
  ),
};

class App extends React.Component {
  
  render() {
    return (
      <>
        <MapParamsProvider>
          <MenuProvider>
            <Navigation />
            <Toast config={toastConfig} /*ref={(ref) => Toast.setRef(ref)}*/ />
          </MenuProvider>
        </MapParamsProvider>
        <Text style={{ position: 'absolute', bottom: 0, color: '#ff000022' }}>Version: {packageJson.version}</Text>
      </>
    );
  }
}
export default Sentry.wrap(App);