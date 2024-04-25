import { StyleSheet } from "react-native";
import colors from "../../styles/colors";

export default StyleSheet.create({
    policyText:{
        fontSize:14,
        fontWeight: '400',
        color: colors.gray,
    },
    policyLink:{
      fontSize:14,
      fontWeight: '500',
      color: colors.primary,
    },
    policyContent:{
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      textAlign:'center',
      justifyContent: 'center'
    },
    logo: {
      height: 100,
      width: '100%'
    },
})