import js from '@eslint/js';
import globals from 'globals';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.node,
        ...globals.es2022,
        ...globals.browser,
        React: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
];
