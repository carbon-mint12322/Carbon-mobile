import { StyleSheet, Dimensions } from "react-native";
import colors from "./colors";

export default StyleSheet.create({
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: colors.black,
        marginBottom: 10,
    },
    description: {
        fontSize: 15,
        fontWeight: '400',
        color: colors.gray,
    },
    button: {
        padding: 14,
        backgroundColor: colors.primary,
        borderRadius: 8,
        marginBottom: 16,
    },
    buttonSecondary: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary,

    },
    buttonText: {
        fontSize: 16,
        fontWeight: '700',
        textTransform: 'uppercase',
        color: colors.white,
        letterSpacing: 1,
        textAlign: 'center',
    },
    buttonTextSecondary: {
        color: colors.black
    },
    inputField: {
        width: '100%',
        backgroundColor: 'transperent',
        borderColor: colors.grayBorders,
        borderRadius: 8,
        padding: 0,
        backgroundColor: colors.screenBg,
    },
    innerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.black,
    },
    homeScreen: {
        minHeight: '100%',
        background: colors.white,
        paddingBottom: 60,
    },
    logoPart: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8
    },
    listField: {
        fontSize: 17,
        fontWeight: '600',
        color: colors.darkBlack,
    },
    listName: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.gray,
        maxWidth: 180,
    },
    listItem: {
        backgroundColor: colors.white,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 8,
        shadowColor: colors.white,
        shadowOffset: { width: 14, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
    },
    listDetail: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
    },
    listData: {
        marginTop: 10,
    },
    profilePic: {
        height: 40,
        width: 40,
        borderRadius: 99,
        backgroundColor: colors.primary,
    },
    fabIcon: {
        position: 'absolute',
        zIndex: 1, top: Dimensions.get('screen').height - 120,
        left: Dimensions.get('screen').width - 70,
        backgroundColor: colors.primary,
        padding: 15,
        borderRadius: 50
    },
    eventCardContainer: {
        backgroundColor: colors.screenBg,
        borderColor: colors.grayBorders,
        borderWidth: 1,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 8,
        shadowColor: colors.white,
        shadowOffset: { width: 14, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 3
    },
    profilePicPart: {
        height: 48,
        width: 48,
        borderRadius: 24,
        backgroundColor: colors.primary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    profilePicText: {
        fontSize: 16,
        color: colors.white
    },
    navProfilePicPart: {
        height: 40,
        width: 40,
        borderRadius: 20,
        backgroundColor: colors.primary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    navProfilePicText: {
        fontSize: 14,
        color: colors.white
    },
    label: {
        fontSize: 16,
        color: colors.lightGray
    },
    modal: {
        // borderWidth: 1,
        justifyContent: 'flex-start',
        padding: 0,
        margin: 0,
        backgroundColor: colors.white
    },
    menuOptionText: {
        paddingVertical: 5,
        paddingHorizontal: 10
    }
})