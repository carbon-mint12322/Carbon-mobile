import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';
import en from './localization/en';
import ta from './localization/ta';
import te from './localization/te';
import ka from './localization/ka';
import hi from './localization/hi'
// Set the key-value pairs for the different languages you want to support.
const i18n = new I18n({
  en, te, ta, ka, hi
});

i18n.enableFallback = true;

// Set the locale once at the beginning of your app.
i18n.locale = getLocales()[0].languageCode;

console.log(i18n.t('welcome'), getLocales()[0].languageCode);

export default i18n