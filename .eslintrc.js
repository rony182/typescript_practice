module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true  // Only include this if your code runs in Node.js
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
    // You can specify additional rules here
  }
};
