import React, { useCallback, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { View, Text } from 'react-native'
import i18n from '../i18n'
import colors from '../styles/colors'
import { useNavigation } from '@react-navigation/native'
import DropDownPicker from "react-native-dropdown-picker";

const LangTabs = ({ currentLang, setCurrentLang }) => {
  const navigation = useNavigation();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)

  const langs = [
    { label: "English", value: "en" },
    { label: "Tamil", value: "ta" },
    { label: "Telugu", value: "te" },
    { label: "Kannada", value: "ka" },
    { label: "Hindi", value: "hi" }
  ]

  const [currentDropdownLang, setCurrentDropdownLang] = useState(currentLang)

  const onLangChange = (item) => {
    // console.log(currentLang, item, ' <== I am item...')
    setCurrentDropdownLang(item)
    changeLanguage(item)
  }

  const changeLanguage = (lang = 'en') => {
    i18n.locale = lang;
    setCurrentLang(lang)
    // navigation.goBack();
  }

  return (
    <View style={{ display: 'flex', flexDirection: 'row', width: "100%" }} >
      <DropDownPicker
        style={{}}
        open={langDropdownOpen}
        value={currentDropdownLang}
        items={langs}
        setOpen={setLangDropdownOpen}
        setValue={setCurrentDropdownLang}
        // setItems={langs}
        placeholder="Select Langugage"
        placeholderStyle={{}}
        onChangeValue={onLangChange}
        zIndex={3000}
        zIndexInverse={1000}
      />
    </View>
  )
}

export default LangTabs