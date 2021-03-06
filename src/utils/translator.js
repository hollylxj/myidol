import en from '../config/language/en';
import zh from '../config/language/zh';

var defaultLocale = 'en';
var locale = defaultLocale;

var translations = {
	'en' : en,
	'zh' : zh
};

export default {
	setLocale : (_locale) => {
		if(_locale in translations){
			locale = _locale;
		} else {
			locale = defaultLocale;
		}
	},

	getLocale : (_locale) => locale,

	translate : (_key) => translations[locale][_key]
}