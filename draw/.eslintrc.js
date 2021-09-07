/*
 * @Author: bowentang
 * @Date: 2021-09-07 16:55:34
 * @LastEditTime: 2021-09-07 16:57:59
 * @FilePath: /draw/.eslintrc.js
 * @Description:
 */
module.exports = {
  // 公司js和ts规范 https://git.woa.com/standards/javascript
  // eslint文档 https://eslint.bootcss.com/
  root: true,
  // es环境注入，官方自带部分环境
  env: {
    browser: true,
    es6: true,
    mocha: true,
  },
  globals: {
    cy: true,
    // jquery {"$": true}
  },
  // js默认解析器
  parser: 'babel-eslint',
  // js默认解析器配置
  parserOptions: {
    requireConfigFile: true,
    ecmaVersion: '6',
    sourceType: 'module',
  },
  // js默认规则集合
  extends: [
    '@tencent/eslint-config-tencent', // 公司
  ],
  plugins: [
    '@typescript-eslint', // 处理ts文件
  ],
  overrides: [
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      extends: [
        // 'plugin:@typescript-eslint/recommended', // 基础的ts规范，来自ts plugin
        '@tencent/eslint-config-tencent/ts', // 公司ts规范 还有bug
      ],
    },
  ],
  rules: {
    'max-len': ['error', { code: 300 }],
    '@typescript-eslint/no-explicit-any': 'off',
    camelcase: 'off',
    'no-param-reassign': 'off',
    // indent: ['error', 2],
    // 'linebreak-style': ['error', 'unix'],
    // quotes: ['error', 'single'],
    // semi: ['error', 'always'],
  },
};

