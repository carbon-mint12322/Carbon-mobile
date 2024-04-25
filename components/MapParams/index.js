import React, { useContext, useRef, useState, useEffect } from 'react'
import { ScrollView, TouchableOpacity, Text, Platform } from 'react-native'
import ActionSheet from 'react-native-actions-sheet'
import { View } from 'react-native-animatable'
import networkContext from '../../contexts/NetworkContext'
import colors from '../../styles/colors'
import { getAllItems } from '../../utils/commonQueue'
import { Ionicons } from '@expo/vector-icons';
import { useMapParamsContext } from '../../contexts/MapParamsContext'
import { TextInput, Switch } from 'react-native-paper'
import i18n from '../../i18n'

const MapParams = (props) => {
  const { params, values, onChange, apply, reset } = useMapParamsContext()
  const errorDrawer = useRef()
  return (
    <>
    {/* <View style={{ display: "flex", backgroundColor: "white", padding: 10, borderRadius: 15,  justifyContent: "center", alignItems: "center", position: 'absolute', bottom: 80, right: 20, zIndex: 999 }} > */}
    <TouchableOpacity onPress={() => errorDrawer.current.show()}  style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '100%', marginTop: 10, }}>
        <Ionicons name={'settings'} size={30}  />
        <Text style={{ marginLeft: 10 }}>{i18n.t('drawerScreen.locationSettings')}</Text>
      </TouchableOpacity>
    {/* </View> */}
      <ActionSheet ref={errorDrawer}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={apply}
            style={{
              margin: 10,
              // borderWidth: 1,
              padding: 10,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 8,
              flex: 1,
              backgroundColor: colors.primary
            }}
          >
            <Text style={{ color: colors.properWhite }}>Apply</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={reset}
            style={{
              flex: 1,
              margin: 10,
              borderWidth: 1,
              padding: 10,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 8,
            }}
          >
            <Text>Reset</Text>
          </TouchableOpacity>
      </View>
            <ScrollView style={{ height: 200, width: "100%", padding: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Switch value={values.enableHighAccuracy} onValueChange={() => onChange('enableHighAccuracy', !values.enableHighAccuracy)} />
                <Text>GPS?</Text>
              </View>
              <TextInput
                autoComplete={ Platform.OS === 'web' ? 'none' : 'off' }
                mode="outlined"
                placeholder="Timeout"
                label={"Timeout"}
                outlineColor={colors.grayBorders}
                activeOutlineColor={colors.primary}
                outlineStyle={{ borderWidth: 1 }}
                value={values.timeout+''}
                defaultValue={values.timeout+''}
                onChangeText={e => onChange('timeout', parseInt(e) || 0)}
                keyboardType={'number-pad'}
              />
              <TextInput
                autoComplete={ Platform.OS === 'web' ? 'none' : 'off' }
                mode="outlined"
                placeholder="Maximum Age"
                label={"Maximum Age"}
                outlineColor={colors.grayBorders}
                activeOutlineColor={colors.primary}
                outlineStyle={{ borderWidth: 1 }}
                value={values.maximumAge+''}
                defaultValue={values.maximumAge+''}
                onChangeText={e => onChange('maximumAge', parseInt(e) || 0)}
                keyboardType={'number-pad'}
              />
              <TextInput
                autoComplete={ Platform.OS === 'web' ? 'none' : 'off' }
                mode="outlined"
                placeholder="Distance Filter"
                label={"Distance Filter"}
                outlineColor={colors.grayBorders}
                activeOutlineColor={colors.primary}
                outlineStyle={{ borderWidth: 1 }}
                value={values.distanceFilter+''}
                defaultValue={values.distanceFilter+''}
                onChangeText={e => onChange('distanceFilter', parseInt(e) || 0)}
                keyboardType={'number-pad'}
              />
              <TextInput
                autoComplete={ Platform.OS === 'web' ? 'none' : 'off' }
                mode="outlined"
                placeholder="Number Of Tries"
                label={"Number Of Tries"}
                outlineColor={colors.grayBorders}
                activeOutlineColor={colors.primary}
                outlineStyle={{ borderWidth: 1 }}
                value={values.numberOfTries+''}
                defaultValue={values.numberOfTries+''}
                onChangeText={e => onChange('numberOfTries', parseInt(e) || 0)}
                keyboardType={'number-pad'}
              />

              <Text>Current Values</Text>
              <Text>
                {JSON.stringify(params, undefined, 2)}
              </Text>
            </ScrollView>
      </ActionSheet>
    </>
  )
}

export default MapParams