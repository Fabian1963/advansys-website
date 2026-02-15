/**
 * AdvanSys IT - Internationalization (i18n)
 * Lightweight client-side translation system
 */
(function () {
  'use strict';

  var DEFAULT_LANG = 'es';
  var STORAGE_KEY = 'advansys-lang';
  var translationsCache = {};

  /**
   * Detect which translation file prefix to use based on the current page
   */
  function getTranslationPrefix() {
    var path = window.location.pathname;
    if (path.indexOf('/sico') !== -1) {
      return 'sico-';
    }
    return '';
  }

  /**
   * Resolve the base path for translation files
   */
  function getLangBasePath() {
    var path = window.location.pathname;
    if (path.indexOf('/sico') !== -1) {
      return '../lang/';
    }
    return 'lang/';
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
   * Load translations for the given language
   */
  function loadTranslations(lang, callback) {
    var prefix = getTranslationPrefix();
    var cacheKey = prefix + lang;

    if (translationsCache[cacheKey]) {
      callback(translationsCache[cacheKey]);
      return;
    }

    var basePath = getLangBasePath();
    var url = basePath + prefix + lang + '.json';

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          try {
            var data = JSON.parse(xhr.responseText);
            translationsCache[cacheKey] = data;
            callback(data);
          } catch (e) {
            console.error('i18n: Error parsing translations', e);
            callback(null);
          }
        } else {
          console.error('i18n: Could not load ' + url);
          callback(null);
        }
      }
    };
    xhr.send();
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

    loadTranslations(lang, function (translations) {
      applyTranslations(translations);
      updateLanguageToggle(lang);
    });
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
