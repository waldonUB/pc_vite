/*
 * @description  : vite 环境垫片
 * @Author       : ADI
 * @Date         : 2021-05-07 17:15:21
 * @LastEditors  : ADI
 * @LastEditTime : 2021-05-08 16:31:08
 */

const fse = require('fs-extra');
const path = require('path');
const resolvePath = (...dirs) => path.resolve(__dirname, ...dirs);
const argvs = process.argv.slice(2);
const argType = argvs[0];
const os = require('os');
const formatEOL = str => {
  const isCRLF = os.EOL === '\r\n';
  return isCRLF ? str.replace(/\r\n/gm, '\n').replace(/\n/gm, '\r\n') : str.replace(/\r\n/gm, '\n');
};

if (argType === 'add') {
  console.log('add => hack: vite less');
  fixLess().add();
  console.log('add => hack: vite icon');
  fixIcon().add();
}
if (argType === 'remove') {
  console.log('remove => hack: vite less');
  fixLess().remove();
  console.log('remove => hack: vite icon');
  fixIcon().remove();
}

/**
 * @description : vite-plugin-vue-cli兼容: https://github.com/IndexXuan/vite-plugin-vue-cli/blob/main/src/index.ts#L48
 * @author      : ADI
 * @Date        : 2021-05-08 10:00:59
 */
function fixLess() {
  const vueConfigJsFilePath = resolvePath('../vue.config.js');
  const lessConfigStr = formatEOL(`
        // hack: vite less
        modifyVars: faicomponentModifyVars,
        javascriptEnabled: true,`);
  const vueConfigJsStr = fse.readFileSync(vueConfigJsFilePath, { encoding: 'utf-8' });
  return {
    add() {
      const perchChar = 'less: {';
      if (vueConfigJsStr.includes('// hack: vite less')) {
        return;
      }
      let charIndex = vueConfigJsStr.indexOf(perchChar);
      if (charIndex === -1) {
        console.error('not find less config');
        return;
      }
      charIndex += perchChar.length;

      const fileStr = vueConfigJsStr.slice(0, charIndex) + lessConfigStr + vueConfigJsStr.slice(charIndex);
      fse.writeFile(vueConfigJsFilePath, fileStr).catch(e => {
        console.error(e);
      });
    },
    remove() {
      if (!vueConfigJsStr.includes('// hack: vite less')) {
        return;
      }
      const reg = new RegExp(lessConfigStr);
      const fileStr = vueConfigJsStr.replace(reg, '');
      fse.writeFile(vueConfigJsFilePath, fileStr).catch(e => {
        console.error(e);
      });
    },
  };
}

/**
 * @description : esm兼容: import * as allIcons from '@ant-design/icons/lib/dist';
 * @author      : ADI
 * @Date        : 2021-05-08 10:05:22
 */
function fixIcon() {
  const iconConfigFilePath = resolvePath('../node_modules/@fk/faicomponent/es/icon/index.js');
  const iconConfigStr = formatEOL(`// hack: vite import
VueIcon.add.apply(VueIcon, _toConsumableArray(Object.keys(allIcons).filter(k=>k!=='default').map(function (key) {
  return allIcons[key];
})));`);
  const iconOriginStr = `VueIcon.add.apply(VueIcon, _toConsumableArray(Object.keys(allIcons).map(function (key) {
  return allIcons[key];
})));`;
  let iconConfigFileStr;
  try {
    iconConfigFileStr = fse.readFileSync(iconConfigFilePath, { encoding: 'utf-8' });
  } catch (error) {
    console.error(error);
    throw Error(error);
  }
  return {
    add() {
      if (iconConfigFileStr.includes('// hack: vite import')) {
        return;
      }
      const charIndex = iconConfigFileStr.indexOf(iconOriginStr);
      if (charIndex === -1) {
        console.error('not find import config');
        return;
      }
      const endIndex = charIndex + iconOriginStr.length;

      const fileStr = iconConfigFileStr.slice(0, charIndex) + iconConfigStr + iconConfigFileStr.slice(endIndex);
      fse.writeFile(iconConfigFilePath, fileStr).catch(e => {
        console.error(e);
      });
    },
    remove() {
      if (!iconConfigFileStr.includes('// hack: vite import')) {
        return;
      }
      const charIndex = iconConfigFileStr.indexOf(iconConfigStr);
      if (charIndex === -1) {
        console.error('not find import config');
        return;
      }
      const endIndex = charIndex + iconConfigStr.length;

      const fileStr = iconConfigFileStr.slice(0, charIndex) + iconOriginStr + iconConfigFileStr.slice(endIndex);
      fse.writeFile(iconConfigFilePath, fileStr).catch(e => {
        console.error(e);
      });
    },
  };
}
