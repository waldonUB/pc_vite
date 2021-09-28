import { getGuide, getLoginCard, getOpenPoup, getPricePoup, newVersionMinAppPopup, versionChangePopup } from '@/utils';

/**
 * 弹窗调用方法
 *
 * @author guoyijie
 * @date 2020-04-18
 * @param {*} page
 * @param {*} step
 * @returns
 */
export const getPopup = function(page, step) {
  let popupList = [
    {
      orderKey: 100,
      popupFn: getOpenPoup,
    },
    {
      orderKey: 200,
      popupFn: getPricePoup,
    },
    {
      orderKey: 300,
      popupFn: getLoginCard,
    },
    {
      orderKey: 400,
      popupFn: versionChangePopup,
    },
    {
      orderKey: 500,
      params: {
        page: page,
        step: step,
      },
      popupFn: getGuide,
    },
    {
      orderKey: 600,
      popupFn: newVersionMinAppPopup,
    },
  ];
  /**
   * 按优先级排序
   *
   * @author guoyijie
   * @date 2020-04-18
   * @param {*} arr
   * @param {*} key
   * @returns
   */
  const sortbyKey = function(arr, key) {
    if (arr.length > 0) {
      return arr.sort((a, b) => {
        const x = a[key];
        const y = b[key];
        return x - y;
      });
    }
  };
  popupList = sortbyKey(popupList, 'orderKey');
  /**
   *按顺序执行弹窗方法
   *
   * @author guoyijie
   * @date 2020-04-18
   */
  async function run() {
    for (const p of popupList) {
      if (p.params) {
        await p.popupFn(p.params);
      } else {
        await p.popupFn();
      }
    }
  }
  // 企微不支持部分es6语法，为了避免频繁开编译，先把上面的代码转成es5
  // 如有改动上面的代码，需编译后，重新覆盖下面的run方法
  // 后续如果有较多es6的api，考虑将这些再抽成个js，企微侧边栏的页面就不引用这些
  run();
};
