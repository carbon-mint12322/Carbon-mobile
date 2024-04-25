export default {
    welcome: 'హలో ',
    auth: {
        login: {
            title: 'లాగిన్ ',
            description: 'లాగిన్ చేయడానికి మీ మొబైల్ నంబర్ నమోదు చేయండి ',
            form: {
                mobileNumber: "మొబైల్ నెంబరు ",
                signInBtn: 'సైన్ ఇన్ ',
                signInOtpBtn: 'Otpతో సైన్ ఇన్ చేయండి',
                signInPinBtn: 'పిన్‌తో సైన్ ఇన్ చేయండి'
            },
            bottomDescription: {
                textPart1: "లాగిన్ మీద ట్యాప్ చేయడం ద్వారా, నేను కార్బన్ మింట్ యొక్క ",
                textPart2: "సేవల నిబంధనలు ",
                textPart3: "& ",
                textPart4: "గోప్యతా విధానం అంగీకరిస్తున్నాను "
            }
        },
        otp: {
            title: "ఒటిపి ",
            description: "మేము ఎస్ఎంఎస్ ద్వారా ఓటిపిని పంపాము. ముందలకి చేయడం కొరకు దయచేసి ఒటిపి ని నమోదు చేయండి ",
            form: {
                btn: "కొనసాగించు "
            },
            bottomTextPart: {
                resend: 'రీసెండ్ ',
                otp: 'ఒటిపి '
            }
        },
        pin: {
            title: "PIN",
            description: "మేము మీ ఖాతాను సృష్టించేటప్పుడు PINని కాన్ఫిగర్ చేసాము. మీకు ఒకటి లేకుంటే దయచేసి నిర్వాహకుడిని సంప్రదించండి.",
            form: {
                btn: "కొనసాగించు "
            }
        }
    },
    agent: {
        searchPlaceholder: { farmers: "రైతులను శోధించండి...", processors: "శోధన ప్రాసెసర్లు..." },
        title: { farmers: "రైతులు", processors: 'ప్రాసెసర్లు' },
        agentProfileModal: {
            profileText: "ఏజెంట్ ప్రొఫైల్",
            logout: "లాగ్అవుట్"
        }
    },
    farmer: {
        navbarSubtitle: { farmers: "రైతులు", processors: 'ప్రాసెసర్లు' },
        farmerProfile: { farmers: "రైతు ప్రొఫైల్", processors: 'ప్రాసెసర్ ప్రొఫైల్' },
        crops: "పంటలు ",
        events: "సంఘటనలు ",
        noEventsText: "ఈవెంట్‌లు ఏవీ అందుబాటులో లేవు",
        cropsScreen: {
            details: "వివరాలు",
            detailsTable: {
                title1: "ప్రాంతం",
                title2: "పంట విధానం ",
                title3: "పంటల వర్గం ",
                title4: "పంట రకం ",
                title5: "సాగు వ్యయం (రూ)",
                title6: "అంచనా దిగుబడి",
                title7: "విత్తన మూలం ",
                title8: "విత్తన రకం ",
                title9: "విత్తే తేదీ ",
            },
            fieldAreaMap: "ఫీల్డ్ ఏరియా మ్యాప్ ",
            events: "సంఘటనలు ",
            noEventsText: "ఈవెంట్ లు ఏవీ అందుబాటులో లేవు "
        },
        eventDetailsScreen: {
            headerCropTitle: 'పంట - జోక్యం',
            headerLandparcelTitle: 'ల్యాండ్ పార్శిల్ - జోక్యం ',
            photos: "ఫోటోలు ",
            voiceRecording: "వాయిస్ రికార్డింగ్ ",
            noRecordingsText: "రికార్డింగ్‌లు ఏవీ అందుబాటులో లేవు",
            notes: "గమనికలు ",
            noNotesAvailable: "నో నోట్స్ లభ్యం కావడం లేదు "
        },
        eventCreateScreen: {
            headerCropTitle: 'పంట - జోక్యం',
            headerLandparcelTitle: 'ల్యాండ్ పార్శిల్ - జోక్యం',
            capturePhotosLabel: "ఫోటోలను క్యాప్చర్ చేయడానికి కెమెరా ఐకాన్ మీద ట్యాప్ చేయండి ",
            notesLabel: "దయచేసి క్రింద గమనికలు రాయండి ",
            notesPlaceholder: "గమనికలు ఇక్కడ..",
            voiceRecordingLabel: "వాయిస్ రికార్డింగ్ ",
            voiceRecordingDescription: "వాయిస్ ను ట్యాప్ చేయండి మరియు రికార్డ్ చేయండి ",
            submitBtn: "సమర్పించు "
        },
        farmDetailsScreen: {
            details: 'వివరాలు',
            detailsTable: {
                title1: "ప్రాంతం",
                title2: "సర్వే నంబర్ ",
                title3: "భూ యాజమాన్యం "
            },
            fieldAreaMap: "ల్యాండ్ పార్సెల్ మ్యాప్",
            events: "సంఘటనలు ",
            crops: "పంటలు ",
            noEventsText: "ఈవెంట్ లు ఏవీ అందుబాటులో లేవు "
        },
        profileScreen: {
            phoneNumber: "ఫోన్ నెంబరు ",
            emailId: "ఇమెయిల్ ఐడి ",
            address: "చిరునామా "
        },
    },
    mapTraceHistory: {
        title: " నేను సేవ్ చేసిన సరిహద్దులు /స్థానాలు ",
        noSavedDataText: 'సేవ్ చేయబడ్డ సరిహద్దులు/స్థానాలు లేవు',
        traceLocationBtn: 'ట్రేస్ లొకేషన్',
        traceBoundariesBtn: "ట్రేస్ బౌండరీస్ "
    },
    mapTraceBoundaries: {
        loadingMessage: "మేము ఖచ్చితమైన స్థానాన్ని పొందేటప్పుడు దయచేసి వేచి ఉండండి ",
        i: {
            length: "పొడవు ",
            area: "ప్రాంతం ",
            acres: "ఎకరాలు ",
            accuracy: "ఖచ్చితత్వం ",
            meters: "మీటర్లు ",
            lastLatitude: 'చివరి అక్షాంశం',
            lastLongitude: 'లాస్ట్ లాంగిట్యూడ్'
        },
        queue: {
            clear: "క్లియర్ ",
            noErrorText: "దోషాలు లేవు "
        }
    },
    mapTraceLocation: {
        floatingMessage: "స్థానాన్ని క్యాప్చర్ చేయడానికి మ్యాప్ లో ఎక్కడైనా ట్యాప్ చేయండి ",
        loadingMessage: "మేము ఖచ్చితమైన స్థానాన్ని పొందేటప్పుడు దయచేసి వేచి ఉండండి ",
        queue: {
            clear: "క్లియర్ ",
            noErrorText: "దోషాలు లేవు "
        }
    },
    notificationScreen: {
        header: {
            farmerProfile: "ఫార్మర్ ప్రొఫైల్ ",
            agentProfile: "ఏజెంట్ ప్రొఫైల్"
        },
        clearAll: 'క్లియర్ ఆల్',
        noNotificationsText: "నోటిఫికేషన్‌లు అందుబాటులో లేవు"
    },
    tabs: {
        home: "హోమ్",
        map: "మ్యాప్",
        notification: "నోటిఫికేషన్"
    },
    logoutModel: {
        title: "లాగ్అవుట్",
        description1: "మీరు ఖచ్చితంగా ఈ పరికరం నుండి లాగ్ అవుట్ చేయాలనుకుంటున్నారా?",
        description2: "లాగ్అవుట్ స్థానిక డేటాను క్లియర్ చేస్తుంది, ఇది పునరుద్ధరించబడదు",
        btn1: "అవును",
        btn2: "నం"
    },
    drawerScreen: {
        uploadQueue: "అప్‌లోడ్ క్యూ",
        refreshData: "డేటాను రిఫ్రెష్ చేయండి",
        loading: "లోడ్...",
        locationSettings: "స్థాన సెట్టింగ్‌లు"
    }
}
