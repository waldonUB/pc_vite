/**
 * 实现触底加载
 * @author han
 * @date 2020-11-19
 * 如果是做el-table的触底刷新：
 * 把el的监听换成let selectWrap = el.querySelector('.el-table__body-wrapper')
 * 例如：selectWrap.addEventListener
 */
export const touchBottom = {
  bind(el, binding) {
    let timer = null;
    const [func, wait = 150, immediate = true] = binding.value;
    el.addEventListener('scroll', function() {
      timer && clearTimeout(timer);
      //判断是否到底
      const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight;
      if (scrollDistance == 0) {
        if (immediate) {
          func();
        } else {
          timer = setTimeout(() => {
            func();
          }, wait);
        }
      }
    });
  },
};
