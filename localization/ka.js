export default {
  welcome: "ನಮಸ್ಕಾರ",
  auth: {
    login: {
      title: "ಲಾಗಿನ್ ಮಾಡಿ",
      description: "ಲಾಗಿನ್ ಮಾಡಲು ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ",
      form: {
        mobileNumber: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
        signInBtn: "ಸೈನ್ ಇನ್ ಮಾಡಿ",
        signInOtpBtn: 'Otp ನೊಂದಿಗೆ ಸೈನ್ ಇನ್ ಮಾಡಿ',
        signInPinBtn: 'ಪಿನ್‌ನೊಂದಿಗೆ ಸೈನ್ ಇನ್ ಮಾಡಿ'
      },
      bottomDescription: {
        textPart1: "ಲಾಗಿನ್ ಅನ್ನು ಟ್ಯಾಪ್ ಮಾಡುವ ಮೂಲಕ, ನಾನು ಕಾರ್ಬನ್ ಮಿಂಟ್‌ಗೆ ಒಪ್ಪುತ್ತೇನೆ",
        textPart2: "ಸೇವೆಗಳ ನಿಯಮಗಳು",
        textPart3: " & ",
        textPart4: "ಗೌಪ್ಯತಾ ನೀತಿ",
      },
    },
    otp: {
      title: "OTP",
      description:
        "ನಾವು ಎಸ್ಎಂಎಸ್ ಮೂಲಕ OTP ಕಳುಹಿಸಿದ್ದೇವೆ. ದಯವಿಟ್ಟು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲು OTP ನಮೂದಿಸಿ",
      form: {
        btn: "ಮುಂದುವರಿಸಿ",
      },
      bottomTextPart: {
        resend: "ಮರುಕಳುಹಿಸಿ",
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
    searchPlaceholder: { farmers: "ರೈತರನ್ನು ಹುಡುಕಿ...", processors: "ಹುಡುಕಾಟ ಸಂಸ್ಕಾರಕಗಳು..." },
    title: { farmers: "ರೈತರು", processors: 'ಸಂಸ್ಕಾರಕಗಳು' },
    agentProfileModal: {
      profileText: "ಏಜೆಂಟ್ ಪ್ರೊಫೈಲ್",
      logout: "ಲಾಗ್ ಔಟ್",
    },
  },
  farmer: {
    navbarSubtitle: { farmers: "ರೈತರು", processors: 'ಸಂಸ್ಕಾರಕಗಳು' },
    farmerProfile: { farmers: "ರೈತರ ವಿವರ", processors: 'ಪ್ರೊಸೆಸರ್ ಪ್ರೊಫೈಲ್' },
    crops: "ಬೆಳೆಗಳು",
    events: "ಕಾರ್ಯಕ್ರಮಗಳು",
    noEventsText: "ಯಾವುದೇ ಕಾರ್ಯಕ್ರಮಗಳು ಲಭ್ಯವಿಲ್ಲ",
    cropsScreen: {
      details: "ವಿವರಗಳು",
      detailsTable: {
        title1: "ಪ್ರದೇಶ",
        title2: "ಕ್ರಾಪಿಂಗ್ ವ್ಯವಸ್ಥೆ",
        title3: "ಕ್ರಾಪಿಂಗ್ ವರ್ಗ",
        title4: "ಬೆಳೆ ಪ್ರಕಾರ",
        title5: "ಕೃಷಿ ವೆಚ್ಚ (ರೂ)",
        title6: "ಅಂದಾಜು ಇಳುವರಿ",
        title7: "ಬೀಜ ಮೂಲ",
        title8: "ಬೀಜ ವೈವಿಧ್ಯ",
        title9: "ಬಿತ್ತನೆ ದಿನಾಂಕ",
      },
      fieldAreaMap: "ಕ್ಷೇತ್ರ ಪ್ರದೇಶದ ನಕ್ಷೆ",
      events: "ಕಾರ್ಯಕ್ರಮಗಳು ",
      noEventsText: "ಯಾವುದೇ ಕಾರ್ಯಕ್ರಮಗಳು ಲಭ್ಯವಿಲ್ಲ",
      noCropsText: "ಯಾವುದೇ ಬೆಳೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ",
    },
    eventDetailsScreen: {
      headerCropTitle: "ಬೆಳೆ - ಹಸ್ತಕ್ಷೇಪ",
      headerLandparcelTitle: "ಭೂಮಿಯ ಭಾಗ - ಮಧ್ಯಸ್ಥಿಕೆ",
      photos: "ಫೋಟೋಗಳು",
      voiceRecording: "ಧ್ವನಿ ರೆಕಾರ್ಡಿಂಗ್",
      noRecordingsText: "ಯಾವುದೇ ರೆಕಾರ್ಡಿಂಗ್‌ಗಳು ಲಭ್ಯವಿಲ್ಲ",
      notes: "ಟಿಪ್ಪಣಿಗಳು",
      noNotesAvailable: "ಯಾವುದೇ ಟಿಪ್ಪಣಿಗಳು ಲಭ್ಯವಿಲ್ಲ ",
    },
    eventCreateScreen: {
      headerCropTitle: "ಬೆಳೆ - ಹಸ್ತಕ್ಷೇಪ,",
      headerLandparcelTitle: "ಭೂಮಿಯ ಭಾಗ - ಮಧ್ಯಸ್ಥಿಕೆ",
      capturePhotosLabel: "ಫೋಟೋಗಳನ್ನು ಸೆರೆಹಿಡಿಯಲು ಕ್ಯಾಮರಾ ಐಕಾನ್ ಮೇಲೆ ಟ್ಯಾಪ್ ಮಾಡಿ",
      notesLabel: "ದಯವಿಟ್ಟು ಕೆಳಗೆ ಟಿಪ್ಪಣಿಗಳನ್ನು ಬರೆಯಿರಿ",
      notesPlaceholder: "ಟಿಪ್ಪಣಿಗಳು ಇಲ್ಲಿ..",
      voiceRecordingLabel: "ಧ್ವನಿ ರೆಕಾರ್ಡಿಂಗ್",
      voiceRecordingDescription: "ಧ್ವನಿಯನ್ನು ಟ್ಯಾಪ್ ಮಾಡಿ ಮತ್ತು ರೆಕಾರ್ಡ್ ಮಾಡಿ",
      submitBtn: "ಸಲ್ಲಿಸು",
    },
    farmDetailsScreen: {
      details: "Details",
      detailsTable: {
        title1: "ಪ್ರದೇಶ",
        title2: "ಸರ್ವೆ ಸಂಖ್ಯೆ",
        title3: "ಭೂ ಮಾಲೀಕತ್ವ",
      },
      fieldAreaMap: "ಲ್ಯಾಂಡ್ ಪಾರ್ಸೆಲ್ ನಕ್ಷೆ",
      events: "ಕಾರ್ಯಕ್ರಮಗಳು",
      crops: "ಬೆಳೆಗಳು",
      noEventsText: "ಯಾವುದೇ ಕಾರ್ಯಕ್ರಮಗಳು ಲಭ್ಯವಿಲ್ಲ",
    },
    profileScreen: {
      phoneNumber: "ದೂರವಾಣಿ ಸಂಖ್ಯೆ",
      emailId: "",
      address: "",
    },
  },
  mapTraceHistory: {
    title: "ನನ್ನ ಉಳಿಸಿದ ಗಡಿಗಳು/ಸ್ಥಳಗಳು",
    noSavedDataText: "ಯಾವುದೇ ಉಳಿಸಿದ ಗಡಿಗಳು/ಸ್ಥಳಗಳಿಲ್ಲ",
    traceLocationBtn: "ಸ್ಥಳವನ್ನು ಪತ್ತೆಹಚ್ಚಿ",
    traceBoundariesBtn: "ಗಡಿಗಳು ಪತ್ತೆಹಚ್ಚಿ",
  },
  mapTraceBoundaries: {
    loadingMessage: "ನಾವು ನಿಖರವಾದ ಸ್ಥಳವನ್ನು ಪಡೆದುಕೊಳ್ಳುತ್ತಿರುವಾಗ ದಯವಿಟ್ಟು ನಿರೀಕ್ಷಿಸಿ",
    i: {
      length: "ಉದ್ದ ",
      area: "ಪ್ರದೇಶ ",
      acres: "ಎಕರೆ ",
      accuracy: "ನಿಖರತೆ ",
      meters: "ಮೀಟರ್ ",
      lastLatitude: "ಕೊನೆಯ ಅಕ್ಷಾಂಶ",
      lastLongitude: "ಕೊನೆಯ ರೇಖಾಂಶ",
    },
    queue: {
      clear: "ಸ್ಪಷ್ಟ",
      noErrorText: "ಯಾವುದೇ ದೋಷಗಳಿಲ್ಲ",
    },
  },
  mapTraceLocation: {
    floatingMessage: "ಸ್ಥಳವನ್ನು ಸೆರೆಹಿಡಿಯಲು ನಕ್ಷೆಯಲ್ಲಿ ಎಲ್ಲಿಯಾದರೂ ಟ್ಯಾಪ್ ಮಾಡಿ",
    loadingMessage: "ನಾವು ನಿಖರವಾದ ಸ್ಥಳವನ್ನು ಪಡೆದುಕೊಳ್ಳುತ್ತಿರುವಾಗ ದಯವಿಟ್ಟು ನಿರೀಕ್ಷಿಸಿ",
    queue: {
      clear: "ಸ್ಪಷ್ಟ",
      noErrorText: "ಯಾವುದೇ ದೋಷಗಳಿಲ್ಲ",
    },
  },
  notificationScreen: {
    header: {
      farmerProfile: "ರೈತರ ವಿವರ",
      agentProfile: "ಏಜೆಂಟ್ ಪ್ರೊಫೈಲ್",
    },
    clearAll: "ಎಲ್ಲವನ್ನೂ ತೆಗೆ",
    noNotificationsText: "ಯಾವುದೇ ಅಧಿಸೂಚನೆಗಳು ಲಭ್ಯವಿಲ್ಲ",
  },
  tabs: {
    home: "ಮನೆ",
    map: "ನಕ್ಷೆ",
    notification: "ಅಧಿಸೂಚನೆ",
  },
  logoutModel: {
    title: "ಲಾಗ್ ಔಟ್",
    description1: "ಈ ಸಾಧನದಿಂದ ಲಾಗ್‌ಔಟ್ ಮಾಡಲು ನೀವು ಖಚಿತವಾಗಿ ಬಯಸುವಿರಾ?",
    description2: "ಲಾಗ್‌ಔಟ್ ಸ್ಥಳೀಯ ಡೇಟಾವನ್ನು ತೆರವುಗೊಳಿಸುತ್ತದೆ, ಅದನ್ನು ಮರುಪಡೆಯಲಾಗುವುದಿಲ್ಲ",
    btn1: "ಹೌದು",
    btn2: "ಇಲ್ಲ",
  },
  drawerScreen: {
    uploadQueue: "ಅಪ್ಲೋಡ್ ಸರದಿ",
    refreshData: "ಡೇಟಾವನ್ನು ರಿಫ್ರೆಶ್ ಮಾಡಿ",
    loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    locationSettings: "ಸ್ಥಳ ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
  },
};