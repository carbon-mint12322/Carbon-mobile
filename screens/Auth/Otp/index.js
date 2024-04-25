import app from '../../../config'
import { getAuth, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';

import { useNavigation } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react'
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
import networkContext from '../../../contexts/NetworkContext';

const auth = getAuth(app);


export default function OTP(props) {

  const [verificationCode, setVerificationCode] = useState();
  const [autofillOtp, setAutofillOtp] = useState();
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const { setUser } = useContext(networkContext)

  useEffect(() => {
    if (!props?.confirmation) {
      navigation.goBack();
    }
  }, [])

  const resendCode = async () => {
    try {
      setOtpLoading(true)
      const confirmation = await auth.signInWithPhoneNumber(props.phoneNumber, true)
      props?.setConfirm(confirmation)
    } catch (e) {
      console.log(e)
      writeLog(e?.message || 'We are unable to resend the OTP right now, please try again later.', 'debug')
      Toast.show({
        type: 'error',
        text2: e?.message || 'We are unable to resend the OTP right now, please try again later.'
      })
    } finally {
      setOtpLoading(false)
    }
  }

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

    return () => { removeListener(); backhandler.remove(); };
  }, []);

  const handleOTPsubmit = async () => {
    try {
      setLoading(true)
      const credential = PhoneAuthProvider.credential(props?.confirmation, verificationCode);
      let resp = await signInWithCredential(auth, credential);
      console.log("AUTH REDIRECT DEBUG : signed in with credentials from the firebase")
      const token = await resp.user.getIdToken()
      console.log("AUTH REDIRECT DEBUG : fetched firebase id token")
      const nextAuthToken = await getNextAuthToken(token)
      console.log("AUTH REDIRECT DEBUG : fetched next auth token")
      const sessionInfo = await getSession(nextAuthToken)
      console.log("AUTH REDIRECT DEBUG : fetched session info")
      const response = await triggerAuthChange(nextAuthToken, sessionInfo.user)
      setUser(response)
      console.log("AUTH REDIRECT DEBUG : auth change triggered")
      props?.setConfirm(false)
      navigation.navigate('BottomTabs', { role: response.role })
      console.log(response, ' <=== trigger auth change response')
      console.log("AUTH REDIRECT DEBUG : redirection done")
    } catch (err) {
      setUser({})
      writeLog(err?.message, 'debug')
      Toast.show({
        type: 'error',
        text2: err.message
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
          <Text style={common.title}>{i18n.t('auth.otp.title')}</Text>
          <Text style={common.description}>{i18n.t('auth.otp.description')}</Text>
          <View style={styles.passwordForm}>
            <OTPInputView
              style={{ height: 100 }}
              pinCount={6}
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
            disabled={loading || otpLoading}
            onPress={handleOTPsubmit}
          >
            {loading ?
              <ActivityIndicator color='white' />
              :
              <Text style={common.buttonText}>{i18n.t('auth.otp.form.btn')}</Text>
            }
          </TouchableOpacity>

          {otpLoading ?
            <ActivityIndicator color='white' />
            :
            <View style={authStyles.policyContent}>
              <TouchableOpacity disabled={otpLoading || loading} style={{ display: 'flex', flexDirection: 'row' }} onPress={() => { resendCode() }}>
                <Text style={authStyles.policyText}>{i18n.t('auth.otp.bottomTextPart.resend')}</Text>
                <Text style={[authStyles.policyLink, styles.policyLinkRed]} >{i18n.t('auth.otp.bottomTextPart.otp')}</Text>
              </TouchableOpacity>
            </View>
          }


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