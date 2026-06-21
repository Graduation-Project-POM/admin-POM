import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // The app intentionally fetches data on mount inside effects (setting
      // loading/error/data state). The React Compiler rule flags this common
      // pattern as an error; downgrade to a warning until/unless we adopt a
      // data layer (e.g. React Query) that removes the effect entirely.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
])
