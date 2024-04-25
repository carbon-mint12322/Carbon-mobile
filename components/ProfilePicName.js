import React from 'react'
import { Text, View } from 'react-native'
import common from '../styles/common'

const ProfilePicName = ({ firstName, lastName, isAtNavbar = false }) => {
    return (
        <View style={isAtNavbar ? common.navProfilePicPart : common.profilePicPart}>
            <Text style={isAtNavbar ? common.navProfilePicText : common.profilePicText} >{firstName?.charAt(0)}{lastName?.charAt(0)}</Text>
        </View>
    )
}

export default ProfilePicName