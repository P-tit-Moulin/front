import vue from 'eslint-plugin-vue'
import prettier from 'eslint-config-prettier'
import js from '@eslint/js'
import vueEslintParser from 'vue-eslint-parser'
import babelEslintParser from '@babel/eslint-parser'
import prettierPlugin from 'eslint-plugin-prettier'

export default [
  js.configs.recommended,

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
      vue,
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
      prettier: prettierPlugin,
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
      'prettier/prettier': [
        'error',
        { singleQuote: true },
        { endOfLine: 'auto' },
      ],
      'no-console': 'off',
    },
  },

  {
    rules: {
      ...prettier.rules,
    },
  },
]
