import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: [
      'node_modules/**',
      'packages/**',
      '.vs/**',
      '**/bin/**',
      '**/obj/**',
      'src/IntraMessenger.Web/Scripts/dist/**',
      'src/IntraMessenger.Web/Content/app/**',
    ],
  },
  js.configs.recommended,
  {
    files: ['frontend/src/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
    },
  },
  {
    files: ['frontend/tests/**/*.js', 'tools/frontend/**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
  },
];
