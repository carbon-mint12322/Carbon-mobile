import * as React from 'react';
import app from '../../../config'
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';


import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useState } from 'react'
import { StyleSheet, View, Image, Text, Pressable, Modal, TouchableOpacity, Linking } from 'react-native';
import { ActivityIndicator, TextInput } from 'react-native-paper';
import common from '../../../styles/common';
import authStyles from '../Styles';
import colors from '../../../styles/colors';
import config from '../../../config/app.config'
import logoConfig from '../../../config/logo.config';
import { StatusBar } from 'expo-status-bar';
import { signInWithPhoneNumber } from 'firebase/auth/react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import auth from '@react-native-firebase/auth';
import { getAuth, PhoneAuthProvider } from 'firebase/auth';
import OTP from '../Otp';
import i18n from '../../../i18n';
import { useNetInfo } from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';
import { writeLog } from '../../../utils/sentryLogsQueue';
import Pin from '../Pin';
import { useEffect } from 'react';

const auth = getAuth(app);

const google = require('../../../assets/google.png');
const closeIcon = require('../../../assets/close-square.png')

WebBrowser.maybeCompleteAuthSession();

//WEB: 653187827135-ugo6br3pggcfjoodhkpmak7hlvnvvjtu.apps.googleusercontent.com
//ANDROID:  653187827135-giq70vau5ul7o3o9ivosoaesolhjv8j7.apps.googleusercontent.com
export default function Login(props) {
  try {

    const isFocused = useIsFocused();
    const [showModal, setShowModal] = useState(false)
    const navigation = useNavigation()
    const netInfo = useNetInfo();
    const [confirmation, setConfirm] = useState(false)
    const [pin, setPin] = useState(false)
    const [loading, setLoading] = useState(false)

    const recaptchaVerifier = React.useRef(null);
    const [phoneNumber, setPhoneNumber] = React.useState('');

    const firebaseConfig = app ? app.options : undefined;

    const sendOTP = async (resend = false) => {
      if (!(netInfo.type !== 'unknown' && netInfo.isInternetReachable === false)) {
        setLoading(true)
        try {
          auth.settings.appVerificationDisabledForTesting = true
          const phoneProvider = new PhoneAuthProvider(auth);
          console.log(phoneProvider, ' <=== vf id before')
          const verificationId = await phoneProvider.verifyPhoneNumber(
            `+91${phoneNumber}`,
            recaptchaVerifier.current
          );
          console.log(verificationId, ' <=== vf id')
          if (!resend) {
            setConfirm(verificationId)
            // navigation.navigate('OTP', { verificationId })
          }
        } catch (err) {
          console.log(err, ' <=== error')
          writeLog(err.message, 'debug')
          Toast.show({
            type: 'error',
            text2: err.message
          })
        }
        finally {
          setLoading(false)
        }
      } else {
        Toast.show({
          type: 'error',
          // text1: 'Hello',
          text2: 'We are unable to access the network right now, please check your wifi and mobile data settings and try again.'
        });
      }
    }

    if (confirmation) {
      return <OTP confirmation={confirmation} phoneNumber={`+91${phoneNumber}`} setConfirm={setConfirm} />
    }

    if (pin) {
      return <Pin confirmation={pin} phoneNumber={`+91${phoneNumber}`} setConfirm={setPin} />
    }

    return (
      <SafeAreaView style={styles.loginPage}>
        <StatusBar />
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={firebaseConfig}
        // attemptInvisibleVerification={true}
        // appVerificationDisabledForTesting={true}
        />
        <View style={{ ...styles.loginPageImage }}>
          <Image
            resizeMode='contain'
            style={{ ...authStyles.logo, ...(config?.config?.logoStyles || {}) }}
            source={config?.config?.logo ? { uri: config.config.logo } : logoConfig()}
          />
        </View>
        <View style={styles.loginContent}>
          <View>
            <Text style={common.title}>{i18n.t('auth.login.title')}</Text>
            <Text style={common.description}>{i18n.t('auth.login.description')}</Text>
            <View style={styles.loginForm}>
              <View style={styles.loginDropBtn}>
                <Pressable
                  style={[styles.buttonOpen]} onPress={() => setShowModal(false)}>
                  <Text style={styles.modalNo}>+91</Text>
                  <Image source={require('../../../assets/down.png')} />
                </Pressable>
              </View>
              <Modal
                animationType="slide"
                visible={showModal}
                onRequestClose={() => {
                  setShowModal(!showModal);
                }}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalTitle}>
                    <Pressable
                      style={styles.buttonClose}
                      onPress={() => setShowModal(!showModal)}
                    >
                      <Image source={require('../../../assets/close.png')} />
                    </Pressable>
                    <Text style={styles.modalTitleText}>Select country</Text>
                  </View>
                  <View style={styles.modalContent}>
                    <View style={styles.searchBox}>
                      <Image source={require('../../../assets/search.png')} style={styles.searchIcon} />
                      <TextInput
                        mode='outlined'
                        placeholder="Search country"
                        label={'Search country'}
                        outlineColor={colors.grayBorders}
                        activeOutlineColor={colors.primary}
                        outlineStyle={{ borderWidth: 1 }}
                        style={{ ...common.inputField, ...styles.searchInput }}
                      />
                    </View>
                    <View style={styles.countryList}>
                      <TouchableOpacity style={styles.country}>
                        <View style={styles.countryFlag}>
                          <Image source={require('../../../assets/iceland.png')} />
                        </View>
                        <Text style={styles.countryText}>Iceland	354	IS / ISL	</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.country}>
                        <Image source={require('../../../assets/india.png')} />
                        <Text style={styles.countryText}>India	91	IN / IND	</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.country}>
                        <Image source={require('../../../assets/indonesia.png')} />
                        <Text style={styles.countryText}>Indonesia	62	ID / IDN</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.country}>
                        <Image source={require('../../../assets/iran.png')} />
                        <Text style={styles.countryText}>Iran	98	IR / IRN</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.country}>
                        <Image source={require('../../../assets/iraq.png')} />
                        <Text style={styles.countryText}>Iraq	964	IQ / IRQ</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.country}>
                        <Image source={require('../../../assets/ireland.png')} />
                        <Text style={styles.countryText}>Ireland	353	IE / IRL</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.country}>
                        <Image source={require('../../../assets/israel.png')} />
                        <Text style={styles.countryText}>Israel	972	IL / ISR</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.country}>
                        <Image source={require('../../../assets/italy.png')} />
                        <Text style={styles.countryText}>Italy	39	IT / ITA	</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.country}>
                        <Image source={require('../../../assets/ivoryCoast.png')} />
                        <Text style={styles.countryText}>Ivory Coast	225	CI / CIV</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
              <View style={styles.loginTnputField}>
                <TextInput
                  label={i18n.t('auth.login.form.mobileNumber')}
                  mode='outlined'
                  outlineColor={colors.grayBorders}
                  activeOutlineColor={colors.primary}
                  outlineStyle={{ borderWidth: 1 }}
                  keyboardType={'phone-pad'}
                  onChangeText={setPhoneNumber}
                  value={phoneNumber}
                  style={{ ...common.inputField }}
                />
                <TouchableOpacity style={styles.closeIcon} onPress={() => setPhoneNumber('')}>
                  <Image
                    style={styles.closeIcon}
                    source={closeIcon}
                  />
                </TouchableOpacity>
              </View>

            </View>
            <TouchableOpacity
              style={{ ...common.button, ...(loading || !phoneNumber ? { backgroundColor: colors.gray } : {}) }}
              disabled={loading || !phoneNumber}
              onPress={() => sendOTP()}
            >
              {loading ?
                <ActivityIndicator color='white' />
                :
                <Text style={common.buttonText}>{i18n.t('auth.login.form.signInOtpBtn')}</Text>
              }
            </TouchableOpacity>

            <TouchableOpacity
              style={{ ...common.button, ...(loading || !phoneNumber ? { backgroundColor: colors.gray } : {}) }}
              disabled={loading || !phoneNumber}
              onPress={() => setPin(true)}
            >
              <Text style={common.buttonText}>{i18n.t('auth.login.form.signInPinBtn')}</Text>
            </TouchableOpacity>
          </View>
          {/* <TouchableOpacity
              style={styles.authGoogleBtn}
              disabled={!request}
              onPress={() => {
                promptAsync();
              }}
            >
              <Image
                style={styles.google}
                source={google}
              />
              <Text style={styles.authBtnGoogleText}>Sign in with Google</Text>
            </TouchableOpacity> */}
          <View style={authStyles.policyContent}>
            <Text style={authStyles.policyText}>{i18n.t('auth.login.bottomDescription.textPart1')}</Text>
            <Text style={authStyles.policyLink} onPress={() => Linking.openURL('https://dev.reactml.carbonmint.com')}>{i18n.t('auth.login.bottomDescription.textPart2')}</Text>
            <Text style={authStyles.policyText}>{i18n.t('auth.login.bottomDescription.textPart3')}</Text>
            <Text style={authStyles.policyLink} onPress={() => Linking.openURL('https://dev.reactml.carbonmint.com')}>{i18n.t('auth.login.bottomDescription.textPart4')}</Text>
            <Text style={authStyles.policyText}>.</Text>
          </View>
        </View>
      </SafeAreaView>
    )
  } catch (error) {
    console.log(error, ' <=== error wehile rendering .....')

    return <Text>Something went wrong..</Text>
  }

}



const styles = StyleSheet.create({
  loginPage: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    zIndex: 1,
    paddingBottom: 10
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
    justifyContent: 'space-between'
  },
  authGoogleBtn: {
    padding: 16,
    backgroundColor: colors.whitebg,
    borderRadius: 8,
    marginBottom: 38,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  authBtnGoogleText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.greenGoogle,
    textAlign: 'center',
    marginLeft: 10,
  },
  loginForm: {
    marginVertical: 40,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  loginDropBtn: {
    width: '25%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginTnputField: {
    width: '70%',
    marginTop: -5,
    position: 'relative'
  },
  closeIcon: {
    position: 'absolute',
    right: 5,
    top: 10,
  },
  buttonOpen: {
    borderWidth: 1,
    borderColor: colors.grayBorders,
    borderRadius: 5,
    paddingVertical: 12,
    width: '100%',
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    marginHorizontal: 20,
  },
  modalNo: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.black,
    marginRight: 10,
  },
  modalTitle: {
    marginVertical: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitleText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.black,
    marginLeft: 20,
  },
  searchInput: {
    width: '100%',
    backgroundColor: '#fff',
    paddingLeft: 24,
  },
  searchBox: {
    position: 'relative'
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: 22,
    zIndex: 2,
  },
  countryList: {
    marginVertical: 30
  },
  country: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  countryText: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.black,
    marginLeft: 25,
  },
  countryFlag: {
    width: 30,
  },
});