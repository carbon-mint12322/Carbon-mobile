export default {
  welcome: "வணக்கம்",
  auth: {
    login: {
      title: "உள்நுழைய",
      description: "உள்நுழைய உங்கள் மொபைல் எண்ணை உள்ளிடவும்",
      form: {
        mobileNumber: "கைபேசி எண்",
        signInBtn: "உள்நுழை",
        signInOtpBtn: 'Otp மூலம் உள்நுழையவும்',
        signInPinBtn: 'பின் மூலம் உள்நுழைக'
      },
      bottomDescription: {
        textPart1:
          "உள்நுழைவைத் தட்டுவதன் மூலம், நான் கார்பன் மிண்ட்க்கு ஒப்புக்கொள்கிறேன்",
        textPart2: "சேவை விதிமுறைகள்",
        textPart3: " & ",
        textPart4: "தனியுரிமைக் கொள்கை",
      },
    },
    otp: {
      title: "OTP",
      description:
        "நாங்கள் எஸ்எம்எஸ் மூலம் OTP அனுப்பியுள்ளோம். செயலாக்க OTP ஐ உள்ளிடவும்",
      form: {
        btn: "தொடரவும்",
      },
      bottomTextPart: {
        resend: "மீண்டும் அனுப்பு",
        otp: " OTP",
      },
    },
    pin: {
      title: "PIN",
      description: "We have configured a PIN while creating your account. Please contact admin if you do not have one.",
      form: {
        btn: "Continue"
      }
    }
  },
  agent: {
    searchPlaceholder: { farmers: "விவசாயிகளைத் தேடுங்கள்...", processors: "தேடல் செயலிகள்..." },
    title: { farmers: "உழவர்", processors: 'செயலிகள்' },
    agentProfileModal: {
      profileText: "முகவர் சுயவிவரம்",
      logout: "வெளியேறு",
    },
  },
  farmer: {
    navbarSubtitle: { farmers: "உழவர்", processors: 'செயலிகள்' },
    farmerProfile: { farmers: "விவசாயி சுயவிவரம்", processors: 'செயலி சுயவிவரம்' },
    crops: "பயிர்கள்",
    events: "நிகழ்வுகள்",
    noEventsText: "நிகழ்வுகள் எதுவும் இல்லை",
    cropsScreen: {
      details: "விவரங்கள்",
      detailsTable: {
        title1: "பகுதி",
        title2: "பயிர் முறை",
        title3: "பயிர் வகை",
        title4: "பயிர் வகை",
        title5: "பயிரிடுவதற்கான செலவு (ரூ)",
        title6: "மதிப்பிடப்பட்ட மகசூல்",
        title7: "விதை ஆதாரம்",
        title8: "விதை வகை",
        title9: "விதைக்கும் தேதி",
      },
      fieldAreaMap: "களப் பகுதி வரைபடம்",
      events: "நிகழ்வுகள்",
      noEventsText: "நிகழ்வுகள் எதுவும் இல்லை",
    },
    eventDetailsScreen: {
      headerCropTitle: "பயிர் - தலையீடு",
      headerLandparcelTitle: "நிலப்பரப்பு - தலையீடு",
      photos: "புகைப்படங்கள்",
      voiceRecording: "குரல் பதிவு",
      notes: "குறிப்புகள்",
      noNotesAvailable: "குறிப்புகள் எதுவும் கிடைக்கவில்லை",
    },
    eventCreateScreen: {
      headerCropTitle: "பயிர் - தலையீடு",
      headerLandparcelTitle: "நிலப்பரப்பு - தலையீடு",
      capturePhotosLabel: "புகைப்படங்களைப் பிடிக்க கேமரா ஐகானைத் தட்டவும்",
      notesLabel: "தயவுசெய்து கீழே குறிப்புகளை எழுதவும்",
      notesPlaceholder: "குறிப்புகள் இங்கே..",
      voiceRecordingLabel: "குரல் பதிவு",
      voiceRecordingDescription: "தட்டி குரல் பதிவு",
      submitBtn: "சமர்ப்பி",
    },
    farmDetailsScreen: {
      details: "விவரங்கள்",
      detailsTable: {
        title1: "பகுதி",
        title2: "சர்வே எண்",
        title3: "நில உரிமை",
      },
      fieldAreaMap: "நிலம் பார்சல் வரைபடம்",
      events: "நிகழ்வுகள்",
      crops: "பயிர்கள்",
      noEventsText: "நிகழ்வுகள் எதுவும் இல்லை",
    },
    profileScreen: {
      phoneNumber: "தொலைபேசி எண்",
      emailId: "மின்னஞ்சல் முகவரி",
      address: "முகவரி",
    },
  },
  mapTraceHistory: {
    title: "எனது சேமித்த எல்லைகள்/இருப்பிடங்கள்",
    noSavedDataText: "சேமிக்கப்பட்ட எல்லைகள்/இருப்பிடங்கள் இல்லை",
    traceLocationBtn: "ட்ரேஸ் லொகேஷன்",
    traceBoundariesBtn: "சுவடு எல்லைகள்",
  },
  mapTraceBoundaries: {
    loadingMessage: "துல்லியமான இடத்தைப் பெறும் வரை காத்திருக்கவும்",
    i: {
      length: "நீளம்",
      area: "பகுதி",
      acres: "ஏக்கர்",
      accuracy: "துல்லியம்",
      meters: "மீட்டர்கள்",
      lastLatitude: "கடைசி அட்சரேகை",
      lastLongitude: "கடைசி தீர்க்கரேகை",
    },
    queue: {
      clear: "தெளிவு",
      noErrorText: "பிழைகள் இல்லை",
    },
  },
  mapTraceLocation: {
    floatingMessage:
      "இருப்பிடத்தைப் பிடிக்க வரைபடத்தில் எங்கு வேண்டுமானாலும் தட்டவும்",
    loadingMessage: "துல்லியமான இடத்தைப் பெறும் வரை காத்திருக்கவும்",
    queue: {
      clear: "தெளிவு",
      noErrorText: "பிழைகள் இல்லை",
    },
  },
  notificationScreen: {
    header: {
      farmerProfile: "விவசாயி விவரக்குறிப்பு",
      agentProfile: "முகவர் சுயவிவரம்",
    },
    clearAll: "அனைத்தையும் அழி",
    noNotificationsText: "அறிவிப்புகள் இல்லை",
  },
  tabs: {
    home: "வீடு",
    map: "வரைபடம்",
    notification: "அறிவிப்பு",
  },
  logoutModel: {
    title: "வெளியேறு",
    description1:
      "இந்தச் சாதனத்திலிருந்து நிச்சயமாக வெளியேற விரும்புகிறீர்களா?",
    description2:
      "வெளியேறுதல் உள்ளூர் தரவை அழிக்கும், அதை மீட்டெடுக்க முடியாது",
    btn1: "ஆம்",
    btn2: "இல்லை",
  },
  drawerScreen: {
    uploadQueue: "பதிவேற்ற வரிசை",
    refreshData: "தரவைப் புதுப்பிக்கவும்",
    loading: "ஏற்றுகிறது...",
    locationSettings: "இருப்பிட அமைப்புகள்",
  },
};
