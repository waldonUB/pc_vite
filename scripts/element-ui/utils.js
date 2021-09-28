/*
 * @Author       : ADI
 * @Date         : 2021-04-16 16:08:56
 * @LastEditors  : ADI
 * @LastEditTime : 2021-04-16 17:55:15
 */
const fse = require('fs-extra');
const path = require('path');
const resolvePath = (...dirs) => path.resolve(__dirname, ...dirs);

const rootPath = '../../';
const variablesPathStr = './src/styles/variables.scss';
const elementVariablesPathStr = './src/styles/element-variables.scss';
const variablesPathPath = resolvePath(rootPath, variablesPathStr);
const elementVariablesPath = resolvePath(rootPath, elementVariablesPathStr);
const outPutConfigStr = './src/styles/__element-variables.scss';

const tipsText = `
/**
 * 脚本自动生成，请勿修改
 */

`;
function mergeFileFun() {
  try {
    const variablesPathPathData = fse.readFileSync(variablesPathPath);
    const elementVariablesPathData = fse.readFileSync(elementVariablesPath);
    const resultData = `${tipsText} ${variablesPathPathData} ${elementVariablesPathData}`;
    fse.outputFileSync(outPutConfigStr, resultData);
    console.log(`${outPutConfigStr} 文件生成完成。`);
  } catch (ex) {
    console.error('ex', ex);
  }
}

module.exports = {
  output: outPutConfigStr,
  mergeFileFun,
};
