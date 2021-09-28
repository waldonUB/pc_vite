/*
 * flx: 修复vite 资源路径(~@)识别错误问题
 * runtime: VITE DEV
 * @Author       : ADI
 * @Date         : 2021-05-26 14:15:11
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-10 11:33:00
 */
const fileRegex = /\.(vue|scss)$/;

function compileFix(src) {
  return src.replace(/@fs\/@/g, 'src');
}

module.exports = function vueCssAliasFix() {
  return {
    name: 'vue-css-alias-fix',

    transform(src, id) {
      if (fileRegex.test(id)) {
        return {
          code: compileFix(src),
          map: null,
        };
      }
    },
  };
};
