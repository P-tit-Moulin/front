import vue from 'eslint-plugin-vue'
import prettier from 'eslint-config-prettier'
import js from '@eslint/js'
import vueEslintParser from 'vue-eslint-parser'
import babelEslintParser from '@babel/eslint-parser'
import prettierPlugin from 'eslint-plugin-prettier'

export default [
  js.configs.recommended, // Ajout de la config ESLint recommandée

  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueEslintParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
        parser: babelEslintParser,
        requireConfigFile: false,
      },
    },
    plugins: {
      vue, // Ajout du plugin Vue
    },
  },

  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },

  {
    plugins: {
      prettier: prettierPlugin, // Ajout du plugin Prettier correctement sous forme d'objet
    },
    rules: {
      'prettier/prettier': ['error', { singleQuote: true }], // Applique les règles Prettier
    },
  },

  {
    // Configurations de Prettier (au lieu d'utiliser "extends")
    rules: {
      ...prettier.rules, // Inclure toutes les règles de prettier
    },
  },
]
