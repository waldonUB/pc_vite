/*
 * @Author       : ADI
 * @Date         : 2021-04-07 11:45:33
 * @LastEditors  : ADI
 * @LastEditTime : 2021-04-16 16:20:20
 */
const et = require('element-theme');
const utils = require('./utils.js');

// 生成主题文件
utils.mergeFileFun();

// 实时编译模式
et.watch({
  config: utils.output, // 配置参数文件路径 默认`./element-variables.css`
  out: './src/styles/element-theme', // 输出目录 默认`./theme`
});
