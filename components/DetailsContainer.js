import { StyleSheet, Text, View } from "react-native";
import colors from "../styles/colors";

export default function DetailsContainer({ children, title }) {
    return (
        <View style={styles.detailsTable}>
            <Text style={styles.detailsTitle}>{title}</Text>
            {children}
        </View>
    )
}

const styles = StyleSheet.compose({
    detailsTitle:{
        fontSize: 16,
        fontWeight: '700',
        color: colors.black,
        marginTop: 20,
        marginBottom: 10
    },
})