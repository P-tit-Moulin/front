import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

export default [
  // Configuration de base JavaScript
  js.configs.recommended,

  // Configuration pour les fichiers Vue
  ...vue.configs['flat/recommended'],

  // Configuration Prettier (doit être en dernier)
  prettier,

  {
    files: ['**/*.{js,mjs,cjs,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // Variables globales du navigateur
        ...globals.browser,
        // Variables globales Node.js (si nécessaire)
        ...globals.node,
        // Variables globales ES2021
        ...globals.es2021,
      },
    },
    rules: {
      // Désactiver les règles qui peuvent entrer en conflit avec Prettier
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      'vue/html-self-closing': 'off',
      'vue/html-indent': 'off',

      // Autoriser console.log en développement
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

      // Règles Vue.js 3 spécifiques
      'vue/multi-word-component-names': 'off', // Optionnel selon vos besoins
      'vue/no-v-html': 'warn',

      // Règles générales recommandées
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },

  // Configuration spécifique pour les fichiers Vue
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: '@babel/eslint-parser',
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-env'],
        },
      },
    },
  },

  // Ignorer certains fichiers/dossiers
  {
    ignores: ['dist/**', 'node_modules/**', 'build/**', '*.min.js'],
  },
]
