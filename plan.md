# Plan: Selector de Idioma (ES/EN) - Advansys Website

## Contexto

El sitio es HTML/CSS/JS estático con Bootstrap 5. Todo el contenido está hardcodeado en español directamente en el HTML. Hay dos páginas: la landing principal (`index.html`) y la página de producto SICO (`sico/index.html`).

## Enfoque elegido: Traducción client-side con JSON

Se usará un sistema de traducción basado en JavaScript puro que intercambia el texto del DOM sin recargar la página, usando archivos JSON con las traducciones.

---

## Pasos de implementación

### 1. Crear archivos de traducción JSON

- **`lang/es.json`** - Extraer todos los textos en español del HTML actual
- **`lang/en.json`** - Traducir todos los textos al inglés

Estructura por secciones: `nav`, `hero`, `services`, `technologies`, `about`, `process`, `products`, `contact`, `footer`.

Ejemplo:
```json
{
  "nav": {
    "services": "Servicios",
    "technologies": "Tecnologías",
    "about": "Nosotros",
    "process": "Proceso",
    "products": "Productos",
    "contact": "Contacto"
  },
  "hero": {
    "badge": "Soluciones de Software a Medida",
    "title": "Transformamos ideas en <span>software</span>",
    ...
  }
}
```

### 2. Marcar elementos traducibles en el HTML

Agregar atributos `data-i18n` a cada elemento de texto en ambas páginas (`index.html` y `sico/index.html`):

```html
<!-- Antes -->
<a class="nav-link" href="#servicios">Servicios</a>

<!-- Después -->
<a class="nav-link" href="#servicios" data-i18n="nav.services">Servicios</a>
```

Para elementos con HTML interno (como `<span>`), usar `data-i18n-html` para indicar que el contenido incluye markup.

### 3. Agregar selector de idioma en el navbar

Insertar un dropdown/toggle de idioma en la barra de navegación, después de los links, en ambas páginas:

```html
<div class="language-selector ms-3">
  <button class="btn btn-outline-light btn-sm" id="langToggle">
    <span class="fi fi-es"></span> ES | EN
  </button>
</div>
```

Diseño: botón compacto que muestre "ES | EN" con el idioma activo resaltado. Funciona bien en desktop y mobile (dentro del menú colapsable).

### 4. Implementar lógica de traducción en JavaScript

Crear **`js/i18n.js`** con la siguiente funcionalidad:

- **`loadTranslations(lang)`** - Cargar el JSON del idioma seleccionado
- **`applyTranslations(lang)`** - Recorrer todos los elementos con `data-i18n` y reemplazar su texto
- **`switchLanguage(lang)`** - Cambiar idioma, guardar preferencia, aplicar traducciones
- **`initI18n()`** - Al cargar la página, detectar idioma guardado en `localStorage` (o usar `es` por defecto) y aplicar

Flujo:
1. Al cargar la página: leer `localStorage.getItem('lang')` → si existe, aplicar; si no, usar `es`
2. Al hacer click en el selector: cambiar idioma, guardar en `localStorage`, actualizar DOM
3. Actualizar atributo `lang` del `<html>`

### 5. Crear traducciones para la página SICO

- **`lang/sico-es.json`** - Textos en español de la página SICO
- **`lang/sico-en.json`** - Textos en inglés de la página SICO

Marcar los elementos con `data-i18n` en `sico/index.html`.

### 6. Estilos CSS para el selector de idioma

Agregar estilos en `css/style.css`:
- Botón del selector que se integre con el diseño del navbar
- Estado activo/inactivo para el idioma seleccionado
- Responsive: que funcione bien en el menú colapsable mobile
- Transición suave al cambiar (opcional: fade-in/out del texto)

### 7. Persistencia y UX

- Guardar preferencia en `localStorage`
- Al navegar entre páginas (landing ↔ SICO), mantener el idioma seleccionado
- El idioma por defecto es español (`es`)

---

## Archivos a crear

| Archivo | Descripción |
|---------|-------------|
| `lang/es.json` | Traducciones español - landing |
| `lang/en.json` | Traducciones inglés - landing |
| `lang/sico-es.json` | Traducciones español - SICO |
| `lang/sico-en.json` | Traducciones inglés - SICO |
| `js/i18n.js` | Lógica de internacionalización |

## Archivos a modificar

| Archivo | Cambios |
|---------|---------|
| `index.html` | Agregar `data-i18n` a elementos, selector de idioma en navbar, cargar `i18n.js` |
| `sico/index.html` | Agregar `data-i18n` a elementos, selector de idioma en navbar, cargar `i18n.js` |
| `css/style.css` | Estilos del selector de idioma |
