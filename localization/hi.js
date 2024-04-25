export default {
    welcome: 'नमस्ते',
    auth: {
        login: {
            title: 'लॉग इन करें',
            description: 'लॉगिन करने के लिए अपना मोबाइल नंबर दर्ज करें',
            form: {
                mobileNumber: "मोबाइल नंबर",
                signInBtn: 'दाखिल करना',
                signInOtpBtn: 'ओटीपी से साइन इन करें',
                signInPinBtn: 'पिन से साइन इन करें'
            },
            bottomDescription: {
                textPart1: "लॉगिन पर टैप करके, मैं कार्बन मिंट की",
                textPart2: "सेवा की शर्तों",
                textPart3: " और ",
                textPart4: "गोपनीयता नीति से सहमत हूं"
            }
        },
        otp: {
            title: "ओटीपी",
            description: "हमने एसएमएस पर एक ओटीपी भेजा है। कृपया आगे बढ़ने के लिए ओटीपी दर्ज करें",
            form: {
                btn: "जारी रखें"
            },
            bottomTextPart: {
                resend: 'पुन: भेजें',
                otp: ' ओटीपी'
            }
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
        searchPlaceholder: { farmers: "किसानों को खोजें...", processors: "प्रोसेसर खोजें..." },
        title: { farmers: "किसानों", processors: 'प्रोसेसर' },
        agentProfileModal: {
            profileText: "एजेंट प्रोफाइल",
            logout: "लॉग आउट"
        }
    },
    farmer: {
        navbarSubtitle: { farmers: "किसानों", processors: 'प्रोसेसर' },
        farmerProfile: { farmers: "किसान प्रोफाइल", processors: 'प्रोसेसर प्रोफ़ाइल' },
        crops: "फसलें",
        events: "आयोजन",
        noEventsText: "कोई इवेंट उपलब्ध नहीं है",
        cropsScreen: {
            details: "विवरण",
            detailsTable: {
                title1: "क्षेत्र",
                title2: "फसल प्रणाली",
                title3: "फसल श्रेणी",
                title4: "फसल का प्रकार",
                title5: "खेती की लागत (रुपये)",
                title6: "अनुमानित उपज",
                title7: "बीज स्रोत",
                title8: "बीज किस्म",
                title9: "बुवाई की तारीख",
            },
            fieldAreaMap: "क्षेत्र का नक्शा",
            events: "आयोजन",
            noEventsText: "कोई इवेंट उपलब्ध नहीं है"
        },
        eventDetailsScreen: {
            headerCropTitle: 'फसल - हस्तक्षेप',
            headerLandparcelTitle: 'भूमि भाग - हस्तक्षेप',
            photos: "तस्वीरें",
            voiceRecording: "आवाज की रिकॉर्डिंग",
            noRecordingsText: "कोई रिकॉर्डिंग उपलब्ध नहीं है",
            notes: "टिप्पणियाँ",
            noNotesAvailable: "कोई नोट उपलब्ध नहीं है"
        },
        eventCreateScreen: {
            headerCropTitle: 'फसल - हस्तक्षेप',
            headerLandparcelTitle: 'भूमि भाग - हस्तक्षेप',
            capturePhotosLabel: "फोटो खींचने के लिए कैमरा आइकन पर टैप करें",
            notesLabel: "कृपया नीचे नोट्स लिखें",
            notesPlaceholder: "नोट्स यहाँ..",
            voiceRecordingLabel: "आवाज की रिकॉर्डिंग",
            voiceRecordingDescription: "टैप करें और आवाज रिकॉर्ड करें",
            submitBtn: "जमा करें"
        },
        farmDetailsScreen: {
            details: 'विवरण',
            detailsTable: {
                title1: "क्षेत्र",
                title2: "सर्वेक्षण संख्या",
                title3: "भूमि का स्वामित्व"
            },
            fieldAreaMap: "भूमि पार्सल मानचित्र",
            events: "आयोजन",
            crops: "फसलें",
            noEventsText: "कोई इवेंट उपलब्ध नहीं है"
        },
        profileScreen: {
            phoneNumber: "फ़ोन नंबर",
            emailId: "ईमेल आईडी",
            address: "पता"
        },
    },
    mapTraceHistory: {
        title: "मेरी सहेजी गई सीमाएं/स्थान",
        noSavedDataText: 'कोई सहेजी गई सीमाएँ/स्थान नहीं',
        traceLocationBtn: 'ट्रेस स्थान',
        traceBoundariesBtn: "ट्रेस सीमाएं"
    },
    mapTraceBoundaries: {
        loadingMessage: "जब तक हम सटीक स्थान प्राप्त कर रहे हैं कृपया प्रतीक्षा करें",
        i: {
            length: "लंबाई ",
            area: "क्षेत्र ",
            acres: "एकड़ ",
            accuracy: "शुद्धता ",
            meters: "मीटर ",
            lastLatitude: 'अंतिम अक्षांश',
            lastLongitude: 'अंतिम देशांतर'
        },
        queue: {
            clear: "साफ़",
            noErrorText: "त्रुटियाँ नहीं"
        }
    },
    mapTraceLocation: {
        floatingMessage: "लोकेशन कैप्चर करने के लिए मैप पर कहीं भी टैप करें",
        loadingMessage: "जब तक हम सटीक स्थान प्राप्त कर रहे हैं कृपया प्रतीक्षा करें",
        queue: {
            clear: "साफ़",
            noErrorText: "त्रुटियाँ नहीं"
        }
    },
    notificationScreen: {
        header: {
            farmerProfile: "किसान प्रोफाइल",
            agentProfile: "एजेंट प्रोफाइल"
        },
        clearAll: 'सभी साफ करें',
        noNotificationsText: "कोई सूचना उपलब्ध नहीं है"
    },
    tabs: {
        home: "घर",
        map: "नक्शा",
        notification: "अधिसूचना"
    },
    logoutModel: {
        title: "लॉग आउट",
        description1: "क्या आप वाकई इस डिवाइस से लॉगआउट करना चाहते हैं?",
        description2: "लॉग आउट करने से स्थानीय डेटा साफ़ हो जाएगा, जो पुनर्प्राप्त करने योग्य नहीं है",
        btn1: "हाँ",
        btn2: "नहीं"
    },
    drawerScreen: {
        uploadQueue: "अपलोड कतार",
        refreshData: "डेटा रिफ्रेश करें",
        loading: "लोड हो रहा है...",
        locationSettings: "स्थान सेटिंग्स"
    }
}