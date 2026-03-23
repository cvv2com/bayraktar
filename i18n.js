const apiEndpoint = 'https://ipapi.co/json';

// Default language based on country
const getDefaultLanguage = async () => {
    try {
        const response = await fetch(apiEndpoint);
        const data = await response.json();
        const country = data.country;
        if (country === 'UA') return 'uk';
        if (country === 'TR') return 'tr';
        return 'en';
    } catch (error) {
        // Fallback to navigator.language
        return navigator.language ? navigator.language.split('-')[0] : 'en';
    }
};

// Store and retrieve selected language
const setLanguage = (lang) => {
    localStorage.setItem('selectedLanguage', lang);
};

const getLanguage = () => {
    return localStorage.getItem('selectedLanguage') || getDefaultLanguage();
};

// Function to apply translations
const applyTranslations = async () => {
    const lang = await getLanguage();
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        // Here you would fetch or map your translations
        element.innerText = translations[lang][key];
    });

    const attrElements = document.querySelectorAll('[data-i18n-attr]');
    attrElements.forEach(element => {
        const attr = element.getAttribute('data-i18n-attr');
        const key = element.getAttribute('data-i18n');
        // Here you would fetch or map your translations
        element.setAttribute(attr, translations[lang][key]);
    });

    populateLanguageSwitcher();
};

// Populate language switcher UI
const populateLanguageSwitcher = () => {
    const languages = ['en', 'uk', 'tr'];
    const switcher = document.getElementById('languageSwitcher');
    if (switcher) {
        languages.forEach(lang => {
            const button = document.createElement('button');
            button.innerText = lang.toUpperCase();
            button.onclick = () => setLanguage(lang);
            switcher.appendChild(button);
        });
    }
};

// Initialize language setting
window.onload = async () => {
    const defaultLang = await getDefaultLanguage();
    setLanguage(defaultLang);
    applyTranslations();
};
