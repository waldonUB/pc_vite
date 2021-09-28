/*
 * 表格头吸顶
 * el-table 添加以下配置项
	:max-height="fixedTableMaxHeight"
	@header-dragend="() => $eventBus.$emit('header-dragend')"
	v-sticky="{
			top:0, // 距离滚动容器顶部的距离
			parent:'.cluePool'  // 包含el-table的滚动容器
	}"
 *
 * @Author       : JHao
 * @Date         : 2021-02-25 17:34:39
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-10 17:40:54
 */

import Vue from 'vue';

// 给固定头设置样式
function doFix(dom, top, fixedLeftColumn, fixedRightColumn) {
  dom.style.top = top + 'px';
  if (fixedLeftColumn) {
    const width = fixedLeftColumn.parentNode.offsetWidth;
    fixedLeftColumn.style.top = top + 'px';
    fixedLeftColumn.style.width = width + 'px';
  }
  if (fixedRightColumn) {
    const width = fixedRightColumn.parentNode.offsetWidth;
    const right = document.body.clientWidth - dom.parentNode.getBoundingClientRect().right;
    fixedRightColumn.style.width = width + 'px';
    fixedRightColumn.style.top = top + 'px';
    fixedRightColumn.style.right = right + 'px';
  }
  Vue.prototype.$eventBus.$emit('custom-fixed', true, getComputedStyle(dom));
}
// 设置固定列表格头宽度
function setFixedColumnWidth(dom, scrollParent, isResetRight = false) {
  setTimeout(() => {
    const fixedLeftColumn = scrollParent.querySelector('.el-table__fixed .el-table__fixed-header-wrapper'); // 左固定列
    const fixedRightColumn = scrollParent.querySelector('.el-table__fixed-right .el-table__fixed-header-wrapper'); // 右固定列
    if (fixedLeftColumn) {
      const width = fixedLeftColumn.parentNode.offsetWidth;
      fixedLeftColumn.style.width = width + 'px';
    }
    if (fixedRightColumn) {
      const width = fixedRightColumn.parentNode.offsetWidth;
      fixedRightColumn.style.width = width + 'px';
      if (isResetRight) {
        const right = document.body.clientWidth - dom.parentNode.getBoundingClientRect().right;
        fixedRightColumn.style.right = right + 'px';
      }
    }
    changeTransform(dom);
  }, 100);
}
// 给固定头取消样式
function removeFix(dom, fixedLeftColumn, fixedRightColumn) {
  dom.style.top = '0';
  if (fixedLeftColumn) {
    fixedLeftColumn.style.top = '0';
    fixedLeftColumn.style.width = 'auto';
  }
  if (fixedRightColumn) {
    fixedRightColumn.style.top = '0';
    fixedRightColumn.style.width = 'auto';
    fixedRightColumn.style.right = '0';
  }
  Vue.prototype.$eventBus.$emit('custom-fixed', false);
}
// 给固定头添加class
function addClass(dom, fixtop, fixedLeftColumn, fixedRightColumn) {
  const old = dom.className;
  if (!old.includes('custom-fixed')) {
    dom.classList.add('custom-fixed');
    if (fixedLeftColumn) {
      fixedLeftColumn.classList.add('custom-fixed');
      fixedLeftColumn.nextElementSibling.classList.add('custom-fixed');
    }
    if (fixedRightColumn) {
      fixedRightColumn.classList.add('custom-fixed');
      fixedRightColumn.nextElementSibling.classList.add('custom-fixed');
      if (Vue.prototype.fixedTableMaxHeight === 'auto') {
        fixedRightColumn.parentNode.classList.add('custom-position-right');
      }
    }
    changeTransform(dom);
    doFix(dom, fixtop, fixedLeftColumn, fixedRightColumn);
  }
}
function changeTransform(dom) {
  // 由于表头吸顶 中间.el-table__body-wrapper 上移一个表头的高度 因此左右两列跟着上移
  const tableBody = dom.parentNode.getElementsByClassName('el-table__body-wrapper');
  const domStyleInfo = getComputedStyle(dom);
  let paddingTop = 0;
  if (domStyleInfo.position === 'fixed') {
    paddingTop = domStyleInfo.height;
  }
  for (let i = 0; i < tableBody.length; i++) {
    tableBody[i].style.paddingTop = paddingTop;
  }
}
// 给固定头移除class
function removeClass(dom, fixedLeftColumn, fixedRightColumn) {
  const old = dom.className;
  const idx = old.indexOf('custom-fixed');
  if (idx !== -1) {
    dom.classList.remove('custom-fixed');
    if (fixedLeftColumn) {
      fixedLeftColumn.classList.remove('custom-fixed');
      fixedLeftColumn.nextElementSibling.classList.remove('custom-fixed');
    }
    if (fixedRightColumn) {
      fixedRightColumn.classList.remove('custom-fixed');
      fixedRightColumn.nextElementSibling.classList.remove('custom-fixed');
      if (Vue.prototype.fixedTableMaxHeight === 'auto') {
        fixedRightColumn.parentNode.classList.remove('custom-position-right');
      }
    }
    changeTransform(dom);
    removeFix(dom, fixedLeftColumn, fixedRightColumn);
  }
}
// 具体判断是否固定头的主函数
function fixHead(parent, el, top) {
  /**
   * myTop 当前元素距离滚动父容器的高度，
   * fixtop 当前元素需要设置的绝对定位的高度
   * parentHeight 滚动父容器的高度
   */
  let myTop, fixtop, parentHeight;
  // 表头DOM节点
  const dom = el.children[1];
  const fixedLeftColumn = el.querySelector('.el-table__fixed .el-table__fixed-header-wrapper'); // 左固定列
  const fixedRightColumn = el.querySelector('.el-table__fixed-right .el-table__fixed-header-wrapper'); // 右固定列

  if (parent.tagName) {
    // 如果是DOM内局部滚动
    // 当前元素距离滚动父容器的高度
    myTop = el.getBoundingClientRect().top - parent.getBoundingClientRect().top;
    // 父元素高度
    const height = getComputedStyle(parent).height;
    parentHeight = Number(height.slice(0, height.length - 2));
    // 绝对定位高度 = 滚动父容器相对于视口的高度 + 传入的吸顶高度
    fixtop = top + parent.getBoundingClientRect().top;
    // 如果自己距离顶部距离大于父元素的高度，也就是自己还没在父元素滚动出来，直接return
    if (myTop > parentHeight) {
      return;
    }
  } else {
    // document节点滚动
    // 当前元素距离滚动父容器的高度 = 当前元素距离视口顶端的距离
    myTop = el.getBoundingClientRect().top;
    // 父元素高度 = 视口的高度
    parentHeight = window.innerHeight;
    //  绝对定位高度 = 传入的吸顶高度
    fixtop = top;
    // 如果自己距离顶部距离大于父元素的高度，也就是自己还没在父元素滚动出来，直接return
    if (myTop > document.documentElement.scrollTop + parentHeight) {
      return;
    }
  }
  // 如果 已经滚动的上去不在父容器显示了。直接return
  if (Math.abs(myTop) > el.offsetHeight + 100) {
    return;
  }
  // 如果是有横线滚动条，不吸顶
  if (hasHorizontalScroll(parent, false)) {
    removeClass(dom, fixedLeftColumn, fixedRightColumn);
    return;
  }
  if (myTop < 0 && Math.abs(myTop) > el.offsetHeight) {
    // 如果当前表格已经完全滚动到父元素上面，也就是不在父元素显示了。则需要去除fixed定位
    removeClass(dom, fixedLeftColumn, fixedRightColumn);
  } else if (myTop <= top) {
    // 如果表头滚动到 父容器顶部了。fixed定位
    const domHeight = getComputedStyle(dom).height;
    const domHeightNumber = Number(domHeight.slice(0, domHeight.length - 2));
    // 这里主要是处理临界值问题: 头部fixed定位后，会缩小表格高度，导致滚动条滚动又触发了fixHead走了removeClass的逻辑
    // 这里加了一个保护，当滚动条距离底部不足表格的头部的高度时，不fixed
    if (parent.scrollHeight - parent.scrollTop - parent.clientHeight > domHeightNumber) {
      addClass(dom, fixtop, fixedLeftColumn, fixedRightColumn);
    }
  } else if (myTop > top) {
    // 如果表格向上滚动 又滚动到父容器里。取消fixed定位
    removeClass(dom, fixedLeftColumn, fixedRightColumn);
  } else if (Math.abs(myTop) < el.offsetHeight) {
    // 如果滚动的距离的绝对值小于自身的高度，也就是说表格向上滚动，刚刚显示出表格的尾部是需要将表头fixed定位
    addClass(dom, fixtop, fixedLeftColumn, fixedRightColumn);
  }
}
// 设置头部固定时表头外容器的宽度写死为表格body的宽度
function setHeadWidth(el) {
  // 获取到当前表格个表格body的宽度
  const width = getComputedStyle(el.getElementsByClassName('el-table__body-wrapper')[0]).width;
  // 给表格设置宽度。这里默认一个页面中的多个表格宽度是一样的。所以直接遍历赋值，也可以根据自己需求，单独设置
  const tableParent = el.getElementsByClassName('el-table__header-wrapper');
  for (let i = 0; i < tableParent.length; i++) {
    tableParent[i].style.width = width;
  }
}
// 是否出现横向滚动条
function hasHorizontalScroll(parent, isDom = true) {
  const scrollNode = isDom ? document.querySelector(parent).parentNode : parent.parentNode;
  return scrollNode.scrollWidth > scrollNode.clientWidth;
}
/**
 * 这里有三个全局对象。用于存放监听事件。方便组件销毁后移除监听事件
 */
const fixFunObj = {}; // 用于存放滚动容器的监听scroll事件
const setWidthFunObj = {}; // 用于存放页面resize后重新计算head宽度事件
const autoMoveFunObj = {}; // 用户存放如果是DOM元素内局部滚动时，document滚动时，fix布局的表头也需要跟着document一起向上滚动

export const sticky = {
  // 当被绑定的元素插入到 DOM 中时……
  inserted(el, binding, vnode) {
    // 首先设置表头宽度
    setHeadWidth(el);
    // 获取当前vueC omponent的ID。作为存放各种监听事件的key
    const uid = vnode.componentInstance._uid;

    // 获取当前滚动的容器是什么。如果是document滚动。则可默认不传入parent参数
    const scrollParent = document.querySelector(binding.value.parent) || document;
    // 给滚动容器加scroll监听事件。并将监听函数存入 监听函数对象中，方便移除监听事件
    let scrollTimer;
    scrollParent.addEventListener(
      'scroll',
      (fixFunObj[uid] = () => {
        if (scrollTimer) clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          fixHead(scrollParent, el, binding.value.top);
        }, 0);
      }),
    );
    // 如果是局部DOM元素内滚动。则需要监听document滚动，document滚动是同步让表头一起滚动。并将监听函数存入 监听函数对象中，方便移除监听事件
    if (binding.value.parent) {
      document.addEventListener(
        'scroll',
        (autoMoveFunObj[uid] = () => {
          // 获取到表头DOM节点
          const dom = el.children[1];
          // 如果当前表头是fixed定位。则跟着document滚动一起滚
          if (getComputedStyle(dom).position === 'fixed') {
            // 滚动的距离是： 滚动父容器距离视口顶端高度 + 传入的吸顶固定距离
            const fixtop = binding.value.top + scrollParent.getBoundingClientRect().top;
            doFix(dom, fixtop, 'fixed');
          }
        }),
      );
    }

    // 当window resize时 重新计算设置表头宽度与右固定列定位，并将监听函数存入 监听函数对象中，方便移除监听事件
    window.addEventListener(
      'resize',
      (setWidthFunObj[uid] = () => {
        // 获取到表头DOM节点
        const dom = el.children[1];
        // 如果当前表头是fixed定位
        setHeadWidth(el);
        if (getComputedStyle(dom).position === 'fixed') {
          setFixedColumnWidth(el.children[1], scrollParent, true);
          Vue.prototype.$eventBus.$emit('custom-fixed', true, getComputedStyle(dom)); // 窗口resize时，重新调整宽度
        }
      }),
    );

    // 当拖动表头改变了列的宽度时,重新设置固定列的宽度
    Vue.prototype.$eventBus.$on('header-dragend', () => {
      // 获取到表头DOM节点
      const dom = el.children[1];
      // 如果当前表头是fixed定位
      if (getComputedStyle(dom).position === 'fixed') {
        setFixedColumnWidth(dom, scrollParent);
      }
    });
  },
  // component 更新后。重新计算表头宽度
  componentUpdated(el) {
    setHeadWidth(el);
  },
  // 节点取消绑定时 移除各项监听事件。
  unbind(el, binding, vnode) {
    const uid = vnode.componentInstance._uid;
    window.removeEventListener('resize', setWidthFunObj[uid]);
    const scrollParent = document.querySelector(binding.value.parent) || document;
    scrollParent.removeEventListener('scroll', fixFunObj[uid]);
    if (binding.value.parent) {
      document.removeEventListener('scroll', autoMoveFunObj[uid]);
    }
  },
};
