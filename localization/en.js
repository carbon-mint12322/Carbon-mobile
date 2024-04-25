export default {
    welcome: 'Hello',
    auth: {
        login: {
            title: 'Login',
            description: 'Enter your mobile number to login',
            form: {
                mobileNumber: "Mobile number",
                signInBtn: 'Sign In',
                signInOtpBtn: 'Sign In with Otp',
                signInPinBtn: 'Sign In with Pin'
            },
            bottomDescription: {
                textPart1: "By tapping on login, I agree to Carbon Mint's",
                textPart2: "terms of services",
                textPart3: " & ",
                textPart4: "privacy policy"
            }
        },
        otp: {
            title: "OTP",
            description: "We have sent an OTP over SMS. Please enter the OTP to proced",
            form: {
                btn: "Continue"
            },
            bottomTextPart: {
                resend: 'Resend',
                otp: ' OTP'
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
        searchPlaceholder: { farmers: "Search farmers...", processors: "Search processors..." },
        title: { farmers: "Farmers", processors: 'Processors' },
        agentProfileModal: {
            profileText: "Agent Profile",
            logout: "Logout"
        }
    },
    farmer: {
        navbarSubtitle: { farmers: "Farmer", processors: 'Processor' },
        farmerProfile: { farmers: "Farmer Profile", processors: 'Processor Profile' },
        crops: "Crops",
        productionSystem: "Production Systems",
        processingSystem: "Processing Systems",
        events: "Events",
        noEventsText: "No events available",
        cropsScreen: {
            cropDetails: "Crop Details",
            details: "Details",
            detailsTable: {
                title1: "Area",
                title2: "Cropping System",
                title3: "Cropping Category",
                title4: "Crop Type",
                title5: "Cost of cultivation (Rs)",
                title6: "Estimated Yield",
                title7: "Seed Source",
                title8: "Seed Variety",
                title9: "Sowing Date",
                title0: "Crop Tag Name",
                title10: "Name",
                title11: "Category",
            },
            fieldAreaMap: "Field area map",
            events: "Events",
            noEventsText: "No events available"
        },
        eventDetailsScreen: {
            headerCropTitle: 'Crop - Intervention',
            headerLandparcelTitle: 'LandParcel - Intervention',
            photos: "Photos",
            voiceRecording: "Voice Recording",
            noRecordingsText: "No recordings available",
            notes: "Notes",
            noNotesAvailable: "No notes avaliable"
        },
        eventCreateScreen: {
            headerCropTitle: 'Crop - Intervention',
            headerLandparcelTitle: 'LandParcel - Intervention',
            headerProductionSystemTitle: "Production System - Intervention",
            headerProcessingSystemTitle: "Processing System - Intervention",
            capturePhotosLabel: "Tap on camera icon to capture photos",
            notesLabel: "Please write notes below",
            notesPlaceholder: "Notes here..",
            voiceRecordingLabel: "Voice recording",
            voiceRecordingDescription: "Tap and record the voice",
            submitBtn: "Submit"
        },
        farmDetailsScreen: {
            details: 'Landparcel Details',
            detailsTable: {
                title1: "Area",
                title2: "Survey Number",
                title3: "Land ownership"
            },
            fieldAreaMap: "Landparcel map",
            events: "Events",
            crops: "Crops",
            noEventsText: "No events available"
        },
        profileScreen: {
            phoneNumber: "Phone number",
            emailId: "Email ID",
            address: "Address"
        },
    },
    mapTraceHistory: {
        title: "My saved boundaries/locations",
        noSavedDataText: 'No saved boundaries/locations',
        traceLocationBtn: 'Trace Location',
        traceBoundariesBtn: "Trace Boundaries"
    },
    mapTraceBoundaries: {
        loadingMessage: "Please wait while we're fetching accurate location",
        i: {
            length: "Length ",
            area: "Area ",
            acres: "Acres ",
            accuracy: "Accuracy ",
            meters: "Meters ",
            lastLatitude: 'Last Latitude',
            lastLongitude: 'Last Longitude'
        },
        queue: {
            clear: "Clear",
            noErrorText: "No Errors"
        }
    },
    mapTraceLocation: {
        floatingMessage: "Tap anywhere on map to capture the location",
        loadingMessage: "Please wait while we're fetching accurate location",
        queue: {
            clear: "Clear",
            noErrorText: "No Errors"
        }
    },
    notificationScreen: {
        header: {
            farmerProfile: "Farmer Profile",
            agentProfile: "Agent Profile"
        },
        clearAll: 'Clear All',
        noNotificationsText: "No notifications available"
    },
    tabs: {
        home: "Home",
        map: "Map",
        notification: "Notification"
    },
    logoutModel: {
        title: "Logout",
        description1: "Are you sure you want to logout from this device?",
        description2: "Logout will clear local data, which is not recoverable",
        btn1: "YES",
        btn2: "NO"
    },
    drawerScreen: {
        uploadQueue: "Upload Queue",
        refreshData: "Refresh Data",
        loading: "Loading...",
        locationSettings: "Location Settings"
    }
}