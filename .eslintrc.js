// const base = require('../eslint-rules');
// const react = require('../eslint-rules/react');
// const ts = require('./eslint-rules/ts');

// module.exports = {
//   /**
//    * 一个包含 prettier，eslint，stylelint 的配置文件合集
//    */
//   extends: [require.resolve('@umijs/fabric/dist/eslint')],

//   rules: {
//     // your rules
//     ...base,
//     ...react,
//     ...ts,
//   },
// };


//   // extends: [require.resolve('@umijs/fabric/dist/eslint')],
const base = require('./eslint-rules/base');
const react = require('./eslint-rules/react');
const ts = require('./eslint-rules/ts');

module.exports = {
  extends: [
    'alloy',
    'alloy/react',
    'alloy/typescript'
  ],
  env: {
    // 你的环境变量（包含多个预定义的全局变量）
    //
    browser: true,
    // node: true,
    // mocha: true,
    // jest: true,
    // jquery: true
  },
  globals: {
    // 你的全局变量（设置为 false 表示它不允许被重新赋值）
    //
    // myGlobal: false
  },
  rules: {
    ...base,
    ...react,
    ...ts,
    // 在 Promise 中使用 asnyc
    'no-async-promise-executor': 0,
    'default-case-last': 0,
    'no-useless-backreference': 0,
    // 随便写 throw
    'no-throw-literal': 'off',
    'no-implicit-coercion': 'off',
    'max-nested-callbacks': 'off',
  },
};