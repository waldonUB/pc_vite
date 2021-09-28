/*
 * @Author       : ADI
 * @Date         : 2021-03-22 11:37:09
 * @LastEditors  : ADI
 * @LastEditTime : 2021-05-06 18:05:14
 */
module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    'babel-plugin-transform-vite-meta-glob',
    '@babel/plugin-proposal-optional-chaining',
    [
      'import',
      {
        libraryName: '@fk/faicomponent',
        libraryDirectory: 'es',
        style: true,
      },
    ],
    [
      'import',
      {
        libraryName: 'lodash',
        libraryDirectory: '',
        camel2DashComponentName: false,
        style: false,
      },
      'lodash',
    ],
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: '~src/styles/element-theme',
        style: false,
        // styleLibraryName: 'theme-chalk',
      },
      'element-ui',
    ],
  ],
};
