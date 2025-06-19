
import { Language } from '../types/language';

export const languages: Language[] = [
  // Auto-detect option
  { code: 'auto', name: 'Auto-detect', nativeName: 'Auto-detect', region: 'Universal', hasSTT: true, hasTTS: false, quality: 5, popularity: 1 },
  
  // Major World Languages
  { code: 'en', name: 'English', nativeName: 'English', region: 'Europe/Americas', hasSTT: true, hasTTS: true, quality: 5, popularity: 2 },
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '中文 (简体)', region: 'Asia', hasSTT: true, hasTTS: true, quality: 5, popularity: 3 },
  { code: 'es', name: 'Spanish', nativeName: 'Español', region: 'Europe/Americas', hasSTT: true, hasTTS: true, quality: 5, popularity: 4 },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', region: 'Asia', hasSTT: true, hasTTS: true, quality: 5, popularity: 5 },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', region: 'Middle East/Africa', direction: 'rtl', hasSTT: true, hasTTS: true, quality: 5, popularity: 6 },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', region: 'Europe/Americas', hasSTT: true, hasTTS: true, quality: 5, popularity: 7 },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', region: 'Asia', hasSTT: true, hasTTS: true, quality: 4, popularity: 8 },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', region: 'Europe/Asia', hasSTT: true, hasTTS: true, quality: 5, popularity: 9 },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', region: 'Asia', hasSTT: true, hasTTS: true, quality: 5, popularity: 10 },
  
  // European Languages
  { code: 'fr', name: 'French', nativeName: 'Français', region: 'Europe', hasSTT: true, hasTTS: true, quality: 5, popularity: 11 },
  { code: 'de', name: 'German', nativeName: 'Deutsch', region: 'Europe', hasSTT: true, hasTTS: true, quality: 5, popularity: 12 },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', region: 'Europe', hasSTT: true, hasTTS: true, quality: 5, popularity: 13 },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', region: 'Europe', hasSTT: true, hasTTS: true, quality: 4, popularity: 14 },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', region: 'Europe', hasSTT: true, hasTTS: true, quality: 4, popularity: 15 },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', region: 'Europe', hasSTT: true, hasTTS: true, quality: 4, popularity: 16 },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', region: 'Europe', hasSTT: true, hasTTS: true, quality: 4, popularity: 17 },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', region: 'Europe', hasSTT: true, hasTTS: true, quality: 4, popularity: 18 },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', region: 'Europe', hasSTT: true, hasTTS: true, quality: 4, popularity: 19 },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', region: 'Europe', hasSTT: true, hasTTS: true, quality: 4, popularity: 20 },
  
  // Asian Languages
  { code: 'ko', name: 'Korean', nativeName: '한국어', region: 'Asia', hasSTT: true, hasTTS: true, quality: 5, popularity: 21 },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', region: 'Asia', hasSTT: true, hasTTS: true, quality: 4, popularity: 22 },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', region: 'Asia', hasSTT: true, hasTTS: true, quality: 4, popularity: 23 },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', region: 'Asia', hasSTT: true, hasTTS: true, quality: 4, popularity: 24 },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', region: 'Asia', hasSTT: true, hasTTS: true, quality: 4, popularity: 25 },
  { code: 'tl', name: 'Filipino', nativeName: 'Filipino', region: 'Asia', hasSTT: true, hasTTS: true, quality: 3, popularity: 26 },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', region: 'Asia', direction: 'rtl', hasSTT: true, hasTTS: true, quality: 4, popularity: 27 },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', region: 'Middle East', direction: 'rtl', hasSTT: true, hasTTS: true, quality: 4, popularity: 28 },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', region: 'Middle East', direction: 'rtl', hasSTT: true, hasTTS: true, quality: 4, popularity: 29 },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', region: 'Europe/Asia', hasSTT: true, hasTTS: true, quality: 4, popularity: 30 },
  
  // African Languages
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', region: 'Africa', hasSTT: true, hasTTS: true, quality: 3, popularity: 31 },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', region: 'Africa', hasSTT: true, hasTTS: false, quality: 3, popularity: 32 },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa', region: 'Africa', hasSTT: false, hasTTS: false, quality: 2, popularity: 33 },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', region: 'Africa', hasSTT: false, hasTTS: false, quality: 2, popularity: 34 },
  { code: 'ig', name: 'Igbo', nativeName: 'Igbo', region: 'Africa', hasSTT: false, hasTTS: false, quality: 2, popularity: 35 },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', region: 'Africa', hasSTT: false, hasTTS: false, quality: 2, popularity: 36 },
  { code: 'xh', name: 'Xhosa', nativeName: 'isiXhosa', region: 'Africa', hasSTT: false, hasTTS: false, quality: 2, popularity: 37 },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', region: 'Africa', hasSTT: true, hasTTS: true, quality: 3, popularity: 38 },
  
  // Indigenous and Low-Resource Languages
  { code: 'qu', name: 'Quechua', nativeName: 'Runasimi', region: 'Americas', hasSTT: false, hasTTS: false, quality: 1, popularity: 39 },
  { code: 'gn', name: 'Guarani', nativeName: 'Avañe\'ẽ', region: 'Americas', hasSTT: false, hasTTS: false, quality: 1, popularity: 40 },
  { code: 'ay', name: 'Aymara', nativeName: 'Aymar aru', region: 'Americas', hasSTT: false, hasTTS: false, quality: 1, popularity: 41 },
  { code: 'nv', name: 'Navajo', nativeName: 'Diné bizaad', region: 'Americas', hasSTT: false, hasTTS: false, quality: 1, popularity: 42 },
  { code: 'chr', name: 'Cherokee', nativeName: 'ᏣᎳᎩ', region: 'Americas', hasSTT: false, hasTTS: false, quality: 1, popularity: 43 },
  { code: 'haw', name: 'Hawaiian', nativeName: 'ʻŌlelo Hawaiʻi', region: 'Oceania', hasSTT: false, hasTTS: false, quality: 2, popularity: 44 },
  { code: 'mi', name: 'Māori', nativeName: 'Te Reo Māori', region: 'Oceania', hasSTT: true, hasTTS: true, quality: 3, popularity: 45 },
  { code: 'sm', name: 'Samoan', nativeName: 'Gagana Sāmoa', region: 'Oceania', hasSTT: false, hasTTS: false, quality: 2, popularity: 46 },
  { code: 'to', name: 'Tongan', nativeName: 'Lea Fakatonga', region: 'Oceania', hasSTT: false, hasTTS: false, quality: 2, popularity: 47 },
  { code: 'fj', name: 'Fijian', nativeName: 'Na Vosa Vakaviti', region: 'Oceania', hasSTT: false, hasTTS: false, quality: 2, popularity: 48 },
  
  // Additional Languages for Comprehensive Coverage
  { code: 'cy', name: 'Welsh', nativeName: 'Cymraeg', region: 'Europe', hasSTT: true, hasTTS: true, quality: 3, popularity: 49 },
  { code: 'ga', name: 'Irish', nativeName: 'Gaeilge', region: 'Europe', hasSTT: true, hasTTS: true, quality: 3, popularity: 50 },
  { code: 'gd', name: 'Scottish Gaelic', nativeName: 'Gàidhlig', region: 'Europe', hasSTT: false, hasTTS: false, quality: 2, popularity: 51 },
  { code: 'eu', name: 'Basque', nativeName: 'Euskera', region: 'Europe', hasSTT: true, hasTTS: true, quality: 3, popularity: 52 },
  { code: 'ca', name: 'Catalan', nativeName: 'Català', region: 'Europe', hasSTT: true, hasTTS: true, quality: 4, popularity: 53 },
  { code: 'gl', name: 'Galician', nativeName: 'Galego', region: 'Europe', hasSTT: true, hasTTS: true, quality: 3, popularity: 54 },
  { code: 'mt', name: 'Maltese', nativeName: 'Malti', region: 'Europe', hasSTT: false, hasTTS: false, quality: 2, popularity: 55 },
  { code: 'is', name: 'Icelandic', nativeName: 'Íslenska', region: 'Europe', hasSTT: true, hasTTS: true, quality: 3, popularity: 56 },
  { code: 'fo', name: 'Faroese', nativeName: 'Føroyskt', region: 'Europe', hasSTT: false, hasTTS: false, quality: 2, popularity: 57 },
  { code: 'kl', name: 'Greenlandic', nativeName: 'Kalaallisut', region: 'Americas', hasSTT: false, hasTTS: false, quality: 1, popularity: 58 },
];

export const languageRegions = [
  'Europe',
  'Asia', 
  'Americas',
  'Africa',
  'Middle East',
  'Oceania',
  'Universal'
];
