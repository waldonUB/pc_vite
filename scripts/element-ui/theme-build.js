/*
 * @Author       : ADI
 * @Date         : 2021-04-07 11:45:40
 * @LastEditors  : ADI
 * @LastEditTime : 2021-04-16 16:19:56
 */
const et = require('element-theme');
const utils = require('./utils.js');

// 生成主题文件
utils.mergeFileFun();

// 编译
et.run({
  config: utils.output, // 配置参数文件路径 默认`./element-variables.css`
  out: './src/styles/element-theme', // 输出目录 默认`./theme`
  minimize: false, // 压缩文件
  browsers: ['ie > 9', 'last 2 versions'], // 浏览器支持
});
