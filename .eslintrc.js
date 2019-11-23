module.exports = {
  env: {
    node: true,
    commonjs: true,
    es6: true
  },
  extends: ['airbnb-base'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    'no-underscore-dangle': 'off',
    'camelcase': 'off',
    'import/no-dynamic-require': 'off'
  }
};
