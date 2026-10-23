import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Import our translation files
import enTranslation from './locales/en/translation.json'
import amTranslation from './locales/am/translation.json'

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      am: { translation: amTranslation }
    },
    lng: "en", // Default language is English
    fallbackLng: "en",
    interpolation: {
      escapeValue: false 
    }
  });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)