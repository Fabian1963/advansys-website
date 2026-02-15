/**
 * AdvanSys IT - Internationalization (i18n)
 * Lightweight client-side translation system
 * Translations are loaded via <script> tags and registered on window._i18n
 */
(function () {
  'use strict';

  var DEFAULT_LANG = 'es';
  var STORAGE_KEY = 'advansys-lang';

  /**
   * Detect which translation key prefix to use based on the current page
   */
  function getTranslationPrefix() {
    var path = window.location.pathname;
    if (path.indexOf('/sico') !== -1) {
      return 'sico-';
    }
    return '';
  }

  /**
   * Get a nested value from an object using a dot-separated key
   */
  function getNestedValue(obj, key) {
    var parts = key.split('.');
    var current = obj;
    for (var i = 0; i < parts.length; i++) {
      if (current === undefined || current === null) return undefined;
      current = current[parts[i]];
    }
    return current;
  }

  /**
   * Get translations for the given language from window._i18n
   */
  function getTranslations(lang) {
    var prefix = getTranslationPrefix();
    var cacheKey = prefix + lang;
    if (window._i18n && window._i18n[cacheKey]) {
      return window._i18n[cacheKey];
    }
    console.error('i18n: Translations not found for "' + cacheKey + '". Make sure the script tag is loaded.');
    return null;
  }

  /**
   * Apply translations to the DOM
   */
  function applyTranslations(translations) {
    if (!translations) return;

    // Translate elements with data-i18n (text content)
    var elements = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      var key = el.getAttribute('data-i18n');
      var value = getNestedValue(translations, key);
      if (value !== undefined) {
        el.textContent = value;
      }
    }

    // Translate elements with data-i18n-html (HTML content)
    var htmlElements = document.querySelectorAll('[data-i18n-html]');
    for (var j = 0; j < htmlElements.length; j++) {
      var htmlEl = htmlElements[j];
      var htmlKey = htmlEl.getAttribute('data-i18n-html');
      var htmlValue = getNestedValue(translations, htmlKey);
      if (htmlValue !== undefined) {
        htmlEl.innerHTML = htmlValue;
      }
    }

    // Translate placeholders
    var placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    for (var k = 0; k < placeholderElements.length; k++) {
      var phEl = placeholderElements[k];
      var phKey = phEl.getAttribute('data-i18n-placeholder');
      var phValue = getNestedValue(translations, phKey);
      if (phValue !== undefined) {
        phEl.setAttribute('placeholder', phValue);
      }
    }
  }

  /**
   * Switch to the specified language
   */
  function switchLanguage(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.setAttribute('lang', lang);

    var translations = getTranslations(lang);
    applyTranslations(translations);
    updateLanguageToggle(lang);
  }

  /**
   * Update the visual state of all language toggle buttons (desktop + mobile)
   */
  function updateLanguageToggle(lang) {
    var esButtons = [document.getElementById('langEs'), document.getElementById('langEsMobile')];
    var enButtons = [document.getElementById('langEn'), document.getElementById('langEnMobile')];

    for (var i = 0; i < esButtons.length; i++) {
      if (!esButtons[i]) continue;
      if (lang === 'es') {
        esButtons[i].classList.add('active');
      } else {
        esButtons[i].classList.remove('active');
      }
    }
    for (var j = 0; j < enButtons.length; j++) {
      if (!enButtons[j]) continue;
      if (lang === 'en') {
        enButtons[j].classList.add('active');
      } else {
        enButtons[j].classList.remove('active');
      }
    }
  }

  /**
   * Get the current language
   */
  function getCurrentLang() {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  }

  /**
   * Initialize the i18n system
   */
  function initI18n() {
    var lang = getCurrentLang();

    // Set up click handlers for all language toggle buttons (desktop + mobile)
    var esIds = ['langEs', 'langEsMobile'];
    var enIds = ['langEn', 'langEnMobile'];

    for (var i = 0; i < esIds.length; i++) {
      var btnEs = document.getElementById(esIds[i]);
      if (btnEs) {
        btnEs.addEventListener('click', function (e) {
          e.preventDefault();
          switchLanguage('es');
        });
      }
    }

    for (var j = 0; j < enIds.length; j++) {
      var btnEn = document.getElementById(enIds[j]);
      if (btnEn) {
        btnEn.addEventListener('click', function (e) {
          e.preventDefault();
          switchLanguage('en');
        });
      }
    }

    // Apply the saved/default language
    if (lang !== DEFAULT_LANG) {
      switchLanguage(lang);
    } else {
      updateLanguageToggle(lang);
    }
  }

  // Run initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initI18n);
  } else {
    initI18n();
  }
})();
