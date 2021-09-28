/*
 * flx: 修复vite sfc文件热更新造成store实例不一致的问题
 * runtime: VITE DEV HMR
 * issue: https://github.com/snowpackjs/esm-hmr/issues/7
 * api: https://github.com/snowpackjs/esm-hmr#acceptdeps-string-handler-deps-any-module-any--void
 *
 * @Author       : ADI
 * @Date         : 2021-06-10 08:46:48
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-15 10:10:56
 */

const { normalizePath } = require('vite');
const requireContext = require('node-require-context');

const storeFileVitePath = normalizePath('src/store/index.js');
const storeFileVitePathRegex = new RegExp(storeFileVitePath);

const modulesFiles = requireContext('../src/store/modules', true, /\.js$/);

const acceptList = modulesFiles.keys().map(r => {
  const file = r.match(/([\w]*)\.js/)[0] || '';
  return `./modules/${file}`;
});

const hmrTmp = `
if (import.meta.hot) {
  class ModulesParams {
    fileNames = [];
    constructor(fileNames = []) {
      this.fileNames = fileNames;
    }
    createReplaceModules(modules = []) {
      return this.fileNames.reduce((pre, name) => {
        return Object.assign(pre, {
          [name]: modules[name],
        });
      }, Object.create(null));
    }
  }
  const paramsInstance = new ModulesParams(modulesFiles.keys().map(r => r.replace(/^.(.*).w+$/, '$1')));

  import.meta.hot.accept(${JSON.stringify(acceptList)}, (...modules) => {
    return storeInstance.hotUpdate(paramsInstance.createReplaceModules(modules));
  });
}
`;

function compileFix(src) {
  return src + hmrTmp;
}

module.exports = function vueVuexHmrFlx() {
  return {
    name: 'vue-vuex-hmr-flx',

    transform(src, id) {
      if (storeFileVitePathRegex.test(id)) {
        console.log('[vue-vuex-hmr-flx]: Transform =>', id);
        return {
          code: compileFix(src),
          map: null,
        };
      }
    },
  };
};
