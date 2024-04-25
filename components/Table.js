import React from 'react'
import { StyleSheet, Text, View } from "react-native";
import colors from "../styles/colors";

export default function Table({ rows = [] }) {
    return (
        <View style={styles.tableCard}>
            {rows && rows.map((row, index) => (
                row.visible ?
                    <View style={styles.cardRow} key={index}>
                        <Text style={styles.cardHeading}>{row.title}</Text>
                        <Text style={styles.cardContent}>{row.value}</Text>
                    </View>
                    : <React.Fragment key={index}></React.Fragment>
            ))}
        </View>
    )
}

const styles = StyleSheet.compose({
    tableCard: {
        backgroundColor: colors.ligtGreen,
        borderWidth: 1.5,
        borderColor: colors.borderGray,
        borderRadius: 8,
    },
    cardRow: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: '#E8E8E8',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 100
    },
    cardHeading: {
        paddingRight: 12,
        width: '40%',
        fontSize: 12,
        fontWeight: '400',
        color: colors.cardText,
    },
    cardContent: {
        paddingHorizontal: 12,
        fontSize: 12,
        fontWeight: '600',
    },
})