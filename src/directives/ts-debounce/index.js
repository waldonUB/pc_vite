/*
 * @Author: ADI
 * @Date: 2021-03-23 15:23:00
 * @LastEditors: ADI
 * @LastEditTime: 2021-03-23 15:23:38
 */ /**
 * 防抖函数
 * @author enson
 * @date 2020-04-13
 * @param {*} func
 * @param {*} delay
 * @param {Boolean} immediate - 是否立即执行
 * @returns
 */
function debounce(func, delay, immediate = true) {
  let timer;
  return function(...args) {
    if (timer) clearTimeout(timer);
    if (immediate) {
      const callNow = !timer;
      timer = setTimeout(() => {
        timer = 0;
      }, delay);
      if (callNow) func.apply(this, args);
    } else {
      timer = setTimeout(() => {
        console.log('调用了！', this);
        func.apply(this, args);
      }, delay);
    }
  };
}
var on = (function() {
  if (document.addEventListener) {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    };
  } else {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler);
      }
    };
  }
})();
export const tsDebounce = {
  bind(el, binding) {
    let exportFunc;
    let eventName = 'click';
    if (binding.value instanceof Array) {
      // 传参数时
      const [func, name, time = 1000, immediate = true] = binding.value;
      eventName = name;
      exportFunc = debounce(func, time, immediate);
    } else {
      exportFunc = debounce(binding.value, 1000);
    }
    on(el, eventName, exportFunc);
  },
};
