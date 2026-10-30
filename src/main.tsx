import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/rtl.css'
// Self-hosted UI fonts (see fontStack in src/theme/tokens.ts). Inter carries
// every Latin glyph; only the Arabic subset of IBM Plex Sans Arabic is loaded,
// so Arabic glyphs come from Plex and everything else from Inter.
import '@fontsource-variable/inter'
import '@fontsource/ibm-plex-sans-arabic/arabic-400.css'
import '@fontsource/ibm-plex-sans-arabic/arabic-500.css'
import '@fontsource/ibm-plex-sans-arabic/arabic-600.css'
import '@fontsource/ibm-plex-sans-arabic/arabic-700.css'
import './i18n'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)