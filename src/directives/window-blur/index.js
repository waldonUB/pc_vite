/*
 * @Author: ADI
 * @Date: 2021-03-23 15:24:21
 * @LastEditors: ADI
 * @LastEditTime: 2021-03-23 15:24:31
 */
/**
 * 窗口失去焦点指令(页面最小化或者切换其他标签页时）
 * @author lymn
 * @date 2020-08-10
 */
const blurNodeList = []; // 绑定该事件的元素列表
const blurCtx = 'blurCtx'; // 属性名称
let blurId = 0;
window.onblur = e => {
  blurNodeList.forEach(node => {
    node[blurCtx].documentHandler(e);
  });
};
export const windowBlur = {
  bind(el, binding) {
    blurNodeList.push(el);
    const id = blurId++; // 给定id，用于解绑时判断
    el[blurCtx] = {
      id,
      documentHandler: binding.value,
    };
  },
  update(el, binding) {
    el[blurCtx].documentHandler = binding.value;
  },
  unbind(el) {
    if (blurNodeList.length > 0 && el[blurCtx]) {
      for (let i = 0, len = blurNodeList.length; i < len; i++) {
        if (blurNodeList[i][blurCtx].id === el[blurCtx].id) {
          blurNodeList.splice(i, 1);
          break;
        }
      }
      delete el[blurCtx];
    }
  },
};
