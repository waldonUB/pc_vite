/*
 * @Author       : ADI
 * @Date         : 2021-03-22 11:37:09
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-24 10:01:48
 */
module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', 'eslint:recommended', '@vue/prettier'],
  // plugin:vue/recommended
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-control-regex': 'off',
    'no-prototype-builtins': 'off',
    'quotes': ['error', 'single'],
    'vue/no-parsing-error': ['error', { 'x-invalid-end-tag': false }],
    'vue/html-closing-bracket-newline': 'error',
    'comma-dangle': ['error', 'only-multiline'],
    'no-unused-vars': 'off',
    'indent': 'off',
    'prefer-const': 'error',
    'no-case-declarations': 'off',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
};
