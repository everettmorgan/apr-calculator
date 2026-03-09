const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat();

module.exports = [
  ...compat.extends('airbnb-base'),

  { ignores: ['dist/**', 'js/**', 'node_modules/**', 'eslint.config.cjs', 'vitest.config.ts'] },

  {
    files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    plugins: {
      import: require('eslint-plugin-import'),
    },
    rules: {
      'no-console': 'off',
      'import/extensions': ['error', 'ignorePackages', { js: 'never' }],
    },
    settings: {
      'import/resolver': {
        node: { extensions: ['.js', '.ts'] },
      },
    },
  },

  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        ecmaVersion: 5,
        sourceType: 'module',
      },
      globals: {
        document: 'readonly',
        HTMLElement: 'readonly',
        CustomEvent: 'readonly',
        fetch: 'readonly',
        Response: 'readonly',
        RequestInit: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      import: require('eslint-plugin-import'),
    },
    rules: {
      'import/no-extraneous-dependencies': 'off',
      'import/prefer-default-export': 'off',
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'class-methods-use-this': 'off',
      'import/extensions': 'off',
      'max-classes-per-file': 'off',
      'no-use-before-define': 'off',
      'lines-between-class-members': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-console': 'off',
      'import/no-duplicates': 'off',
    },
    settings: {
      'import/resolver': {
        node: { extensions: ['.js', '.ts'] },
      },
    },
  },
];
