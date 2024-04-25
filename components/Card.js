import React from 'react'
import { TouchableOpacity, View, Image, Text } from 'react-native'

const Card = () => {
    return (
        <TouchableOpacity key={index} style={common.listItem} onPress={() => navigation.navigate('CropDetails')}>
            <View style={styles.foodImgPart}>
                <Image source={require('../../../assets/farmFood.png')} style={styles.farmFood} resizeMode={'contain'} />
            </View>
            <View>
                <View>
                    <Text style={common.listField}>{crop.name}</Text>
                    <Text style={common.listName}>{crop.cropType}</Text>
                </View>
                <TouchableOpacity style={styles.cameraPart}>
                    <Image source={require('../../../assets/cameraOrange.png')} style={styles.camera} />
                </TouchableOpacity>
            </View>

        </TouchableOpacity>
    )
}

export default Card