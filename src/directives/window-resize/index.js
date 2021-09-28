/*
 * @Author: ADI
 * @Date: 2021-03-23 15:20:53
 * @LastEditors: ADI
 * @LastEditTime: 2021-03-23 15:26:00
 */
// 绑定resize事件
let seed = 0;
const resizeNodeList = [];
const resizeCtx = 'resizeCtx';
window.onresize = e => {
  resizeNodeList.forEach(node => {
    node[resizeCtx].documentHandler(e);
  });
};
export const windowResize = {
  bind(el, binding, vnode) {
    resizeNodeList.push(el);
    const id = seed++;
    el[resizeCtx] = {
      id,
      documentHandler: binding.value,
      methodName: binding.expression,
    };
  },
  update(el, binding, vnode) {
    el[resizeCtx].documentHandler = binding.value;
    el[resizeCtx].methodName = binding.expression;
  },
  unbind(el, binding, vnode) {
    const len = resizeNodeList.length;
    for (let i = 0; i < len; i++) {
      if (resizeNodeList[i][resizeCtx].id === el[resizeCtx].id) {
        resizeNodeList.splice(i, 1);
        break;
      }
    }
    delete el[resizeCtx];
  },
};
