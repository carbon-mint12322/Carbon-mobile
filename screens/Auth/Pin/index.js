import app from '../../../config'
import { getAuth, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';

import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react'
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input'
import {
  getOtp,
  removeListener,
  addListener
} from 'react-native-otp-verify';

import colors from '../../../styles/colors';
import common from '../../../styles/common';
import authStyles from '../Styles';
import config from '../../../config/app.config'
import logoConfig from '../../../config/logo.config';
import { ActivityIndicator } from 'react-native-paper';
// import auth from '@react-native-firebase/auth';
import i18n from '../../../i18n';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { writeLog } from '../../../utils/sentryLogsQueue';
import { getNextAuthToken, getSession, triggerAuthChange } from '../../../utils/getNextAuthToken';
import FarmerHeader from '../../../components/FarmerHeader';
import { Ionicons } from '@expo/vector-icons';
import { BackHandler } from 'react-native';
import md5 from 'md5';
import { useContext } from 'react';
import networkContext from '../../../contexts/NetworkContext';
export default function Pin(props) {

  const [verificationCode, setVerificationCode] = useState();
  const [autofillOtp, setAutofillOtp] = useState();
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)

  const { setUser } = useContext(networkContext)

  useEffect(() => {

    const backhandler = BackHandler.addEventListener('hardwareBackPress', () => {
      props?.setConfirm(false);
      return false;
    })

    const listenAndSetAutoFillOtp = (message) => {

      try {

        if (
          !message || (
            typeof message === "string"
            && message.toLowerCase().includes('timeout')
          )
        ) return;

        setAutofillOtp(message.slice(0, 6));

      } catch (e) {
        console.error(e.message)
      }
    }

    const listenForOtp = () => {
      addListener(listenAndSetAutoFillOtp)
    }

    getOtp()
      .then(listenForOtp)
      .catch(console.log)

    return () => { removeListener(); backhandler.remove(); props?.setConfirm(false); };
  }, []);

  const handleOTPsubmit = async () => {
    try {
      setLoading(true)
      const nextAuthToken = await getNextAuthToken('', props.phoneNumber, md5(verificationCode))
      console.log("AUTH REDIRECT DEBUG : fetched next auth token")
      const sessionInfo = await getSession(nextAuthToken)
      console.log("AUTH REDIRECT DEBUG : fetched session info")
      const response = await triggerAuthChange(nextAuthToken, sessionInfo.user)
      setUser(response)
      console.log("AUTH REDIRECT DEBUG : auth change triggered")
      props?.setConfirm(false)
      navigation.navigate('BottomTabs')
      console.log("AUTH REDIRECT DEBUG : redirection done")
      // console.log(response, ' <=== trigger auth change response')
      // await AsyncStorage.setItem(constants.NEXT_AUTH_TOKEN_KEY, nextAuthToken)
    } catch (err) {
      setUser({})
      writeLog(err?.message, 'debug')
      Toast.show({
        type: 'error',
        text2: err.message || 'You do not have the permission to login to this app. Please contact your admin.'
      })
      props?.setConfirm(false)
      // showMessage({ text: `Error: ${err.message}`, color: 'red' });
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <View style={styles.loginPage}>
        <FarmerHeader
          hideDrawer={true}
          leftIcon={(
            <TouchableOpacity
              style={{ ...styles.backbtn }}
              onPress={() => props?.setConfirm(false)}
            >
              <Ionicons name="arrow-back" size={30} />
            </TouchableOpacity>
          )}
          rightIcon={<></>}
        />
        <View style={styles.loginPageImage}>
          <Image
            resizeMode='contain'
            style={{ ...authStyles.logo, ...(config?.config?.logoStyles || {}) }}
            source={config?.config?.logo ? { uri: config.config.logo } : logoConfig()}
          />
        </View>
        <View style={styles.loginContent}>
          <Text style={common.title}>{i18n.t('auth.pin.title')}</Text>
          <Text style={common.description}>{i18n.t('auth.pin.description')}</Text>
          <View style={styles.passwordForm}>
            <OTPInputView
              style={{ height: 80, width: '100%' }}
              pinCount={4}
              autoFocusOnLoad={false}
              codeInputFieldStyle={styles.passwordInputField || {}}
              codeInputHighlightStyle={{ borderColor: '#BCBCBC' }}
              onCodeChanged={setVerificationCode}
              value={verificationCode}
              code={autofillOtp}
            />
          </View>
          <TouchableOpacity
            style={common.button}
            disabled={loading}
            onPress={handleOTPsubmit}
          >
            {loading ?
              <ActivityIndicator color='white' />
              :
              <Text style={common.buttonText}>{i18n.t('auth.pin.form.btn')}</Text>
            }
          </TouchableOpacity>

          {/* {loading ?
            <ActivityIndicator color='white' />
            :
            <View style={authStyles.policyContent}>
            </View>
          } */}


        </View>
      </View>
    </>
  )
}



const styles = StyleSheet.create({
  loginPage: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  loginPageImage: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  loginContent: {
    flex: 1,
    marginHorizontal: 24,
  },
  policyContent: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    textAlign: 'center',
    justifyContent: 'center'
  },
  policyLink: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2B9348',
  },
  policyLinkRed: {
    color: '#EF2D56'
  },
  passwordForm: {
    marginVertical: 40,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#BCBCBC',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    width: '15%',
    height: 45,
  },
  passwordInputField: {
    borderWidth: 1,
    borderRadius: 8,
    width: 52,
    height: 52,
    color: colors.black,
    fontWeight: '700',
    backgroundColor: colors.white,
    fontSize: 14,
  },
});