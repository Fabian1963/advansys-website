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
   * Update the visual state of the language toggle
   */
  function updateLanguageToggle(lang) {
    var btnEs = document.getElementById('langEs');
    var btnEn = document.getElementById('langEn');
    if (!btnEs || !btnEn) return;

    if (lang === 'es') {
      btnEs.classList.add('active');
      btnEn.classList.remove('active');
    } else {
      btnEn.classList.add('active');
      btnEs.classList.remove('active');
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

    // Set up click handlers for the language toggle buttons
    var btnEs = document.getElementById('langEs');
    var btnEn = document.getElementById('langEn');

    if (btnEs) {
      btnEs.addEventListener('click', function (e) {
        e.preventDefault();
        switchLanguage('es');
      });
    }

    if (btnEn) {
      btnEn.addEventListener('click', function (e) {
        e.preventDefault();
        switchLanguage('en');
      });
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
