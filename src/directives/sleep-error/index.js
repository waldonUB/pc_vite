/*
 * @Author: ADI
 * @Date: 2021-03-23 15:21:57
 * @LastEditors: ADI
 * @LastEditTime: 2021-03-23 15:22:10
 */
const sleepErr = 'sleepErr';
export const sleepError = {
  bind(el, binding, vnode) {
    el[sleepErr] = {
      documentHandler: binding.value,
    };
  },
  update(el, binding, vnode, oldVnode) {
    // el[sleepErr].documentHandler = binding.value;
    // console.log(vnode);
  },
  unbind(el, binding, vnode) {
    el[sleepErr].documentHandler();
    delete el[sleepErr];
  },
};
