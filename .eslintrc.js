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
    ecmaVersion: 8
  },
  rules: {
    'no-underscore-dangle': 'off',
    camelcase: 'off',
  }
};
