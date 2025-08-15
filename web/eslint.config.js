import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    ignores: [
      // Build outputs
      '.next/**',
      '.next/**/*',
      'out/**',
      'dist/**',
      'build/**',

      // Dependencies
      'node_modules/**',

      // Generated files
      '*.config.js',
      '*.config.ts',
      'turbo.json',
      'next-env.d.ts',
      'postcss.config.mjs',
      'tailwind.config.js',
      'tailwind.config.ts',

      // Coverage and logs
      'coverage/**',
      '*.log',

      // Environment files
      '.env*',

      // Cache directories
      '.eslintcache',
      '.npm',
      '.cache',
      '.parcel-cache',
    ],
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
      'no-unused-vars': 'off',
      'no-undef': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'none',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
];
