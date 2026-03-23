const API_ENDPOINT = 'https://ipapi.co/json';

// -------------------- i18n Dictionary --------------------
// Note: UA translations are approximate (as requested).
const translations = {
  tr: {
    // meta
    metaDescription: 'Bayraktar.org – Bayraktar markasına ait kuruluşların resmi portalı.',

    // header/main
    bannerText: 'Site Yapım Aşamasındadır',
    sectionTitle: 'Bayraktar Kuruluşları',

    // cards
    cardBaykar: 'Baykar Teknoloji',
    cardFergani: 'Fergani Uzay Teknolojileri',
    cardBaykarAz: 'Baykar Teknoloji Azerbaycan',
    cardBaykarStore: 'Baykar Mağaza',
    cardFoundation: 'Can Sağlığı Vakfı',
    cardRadio: 'Radio Bayraktar (Ukrayna)',
    cardCafe: 'Bayraktar Cafe & Restaurant',
    cardShipping: 'Bayraktar Shipping',
    cardConstruction: 'Bayraktar İnşaat (Ankara)',
    cardHolding: 'Bayraktarlar Holding',
    cardGroupHolding: 'Bayraktar Grup Holding',
    cardKG: 'Bayraktar KG Group',
    cardAutoParts: 'Bayraktar Otomotiv Yedek Parça',
    cardPortal: 'Bayraktarlar Portal',

    // footer
    footerRights: 'Tüm hakları saklıdır.'
  },

  en: {
    metaDescription: 'Bayraktar.org – Official portal of organizations under the Bayraktar brand.',

    bannerText: 'Website Under Construction',
    sectionTitle: 'Bayraktar Organizations',

    cardBaykar: 'Baykar Technologies',
    cardFergani: 'Fergani Space Technologies',
    cardBaykarAz: 'Baykar Technologies Azerbaijan',
    cardBaykarStore: 'Baykar Store',
    cardFoundation: 'Can Sağlığı Foundation',
    cardRadio: 'Radio Bayraktar (Ukraine)',
    cardCafe: 'Bayraktar Cafe & Restaurant',
    cardShipping: 'Bayraktar Shipping',
    cardConstruction: 'Bayraktar Construction (Ankara)',
    cardHolding: 'Bayraktarlar Holding',
    cardGroupHolding: 'Bayraktar Group Holding',
    cardKG: 'Bayraktar KG Group',
    cardAutoParts: 'Bayraktar Automotive Spare Parts',
    cardPortal: 'Bayraktarlar Portal',

    footerRights: 'All rights reserved.'
  },

  uk: {
    metaDescription: 'Bayraktar.org – Офіційний портал організацій під брендом Bayraktar.',

    bannerText: 'Сайт у розробці',
    sectionTitle: 'Організації Bayraktar',

    cardBaykar: 'Baykar Technologies',
    cardFergani: 'Космічні технології Fergani',
    cardBaykarAz: 'Baykar Technologies Азербайджан',
    cardBaykarStore: 'Магазин Baykar',
    cardFoundation: 'Фонд Can Sağlığı',
    cardRadio: 'Radio Bayraktar (Україна)',
    cardCafe: 'Bayraktar Cafe & Restaurant',
    cardShipping: 'Bayraktar Shipping',
    cardConstruction: 'Будівництво Bayraktar (Анкара)',
    cardHolding: 'Bayraktarlar Holding',
    cardGroupHolding: 'Bayraktar Group Holding',
    cardKG: 'Bayraktar KG Group',
    cardAutoParts: 'Автозапчастини Bayraktar',
    cardPortal: 'Портал Bayraktarlar',

    footerRights: 'Усі права захищені.'
  }
};

// -------------------- Language Selection --------------------
const STORAGE_KEY = 'selectedLanguage';

const normalizeLang = (lang) => {
  if (!lang) return 'en';
  const base = String(lang).toLowerCase().split('-')[0];
  if (base === 'tr') return 'tr';
  if (base === 'uk') return 'uk';
  return 'en';
};

const getStoredLanguage = () => normalizeLang(localStorage.getItem(STORAGE_KEY));

const setStoredLanguage = (lang) => {
  localStorage.setItem(STORAGE_KEY, normalizeLang(lang));
};

const getCountryLanguage = async () => {
  try {
    const response = await fetch(API_ENDPOINT, { cache: 'no-store' });
    if (!response.ok) throw new Error('Geo request failed');
    const data = await response.json();
    const country = data && data.country;
    if (country === 'UA') return 'uk';
    if (country === 'TR') return 'tr';
    return 'en';
  } catch {
    return null;
  }
};

const determineInitialLanguage = async () => {
  // 1) user choice
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return normalizeLang(stored);

  // 2) country detection
  const byCountry = await getCountryLanguage();
  if (byCountry) return normalizeLang(byCountry);

  // 3) browser language
  return normalizeLang(navigator.language);
};

// -------------------- Apply Translations --------------------
const setMetaDescription = (text) => {
  const el = document.querySelector('meta[name="description"]');
  if (el && typeof text === 'string') el.setAttribute('content', text);
};

const applyTranslations = (lang) => {
  const safeLang = normalizeLang(lang);
  const dict = translations[safeLang] || translations.en;

  // set <html lang="...">
  document.documentElement.lang = safeLang;

  // translate text nodes
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (!key) return;
    if (dict[key] == null) return;
    el.textContent = dict[key];
  });

  // translate attributes (optional)
  document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    const attr = el.getAttribute('data-i18n-attr');
    const key = el.getAttribute('data-i18n');
    if (!attr || !key) return;
    if (dict[key] == null) return;
    el.setAttribute(attr, dict[key]);
  });

  // meta description
  if (dict.metaDescription) setMetaDescription(dict.metaDescription);

  // update switcher active state
  updateLanguageSwitcherActive(safeLang);
};

// -------------------- Language Switcher UI --------------------
const LANGS = [
  { code: 'tr', label: 'TR' },
  { code: 'uk', label: 'UA' },
  { code: 'en', label: 'EN' }
];

const clearNode = (node) => {
  while (node && node.firstChild) node.removeChild(node.firstChild);
};

const updateLanguageSwitcherActive = (activeLang) => {
  const switcher = document.getElementById('languageSwitcher');
  if (!switcher) return;
  switcher.querySelectorAll('button[data-lang]').forEach((btn) => {
    const isActive = btn.getAttribute('data-lang') === activeLang;
    btn.classList.toggle('is-active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
};

const renderLanguageSwitcher = () => {
  const switcher = document.getElementById('languageSwitcher');
  if (!switcher) return;

  clearNode(switcher);

  LANGS.forEach(({ code, label }) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'lang-btn';
    btn.textContent = label;
    btn.setAttribute('data-lang', code);
    btn.setAttribute('aria-pressed', 'false');

    btn.addEventListener('click', () => {
      const newLang = normalizeLang(code);
      setStoredLanguage(newLang);
      applyTranslations(newLang);
    });

    switcher.appendChild(btn);
  });
};

// -------------------- Init --------------------
(async () => {
  renderLanguageSwitcher();
  const initialLang = await determineInitialLanguage();
  setStoredLanguage(initialLang);
  applyTranslations(initialLang);
})();