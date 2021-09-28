/*
 * @Author: ADI
 * @Date: 2021-03-29 16:41:56
 * @LastEditors  : ADI
 * @LastEditTime : 2021-04-14 15:28:32
 */
import Vue from 'vue';
import loadingVue from './components/index.vue';

export const loading = (function() {
  const loadingConstructor = Vue.extend(loadingVue);

  const loadingApp = new loadingConstructor().$mount();
  document.body.appendChild(loadingApp.$el);
  return {
    /*
      key: loading的key
      msg: loading提示语
    */
    addQuene: function(opt, msg = '加载中...') {
      Object.assign(opt, {
        msg: msg,
        waitTime: 800,
      });
      if (typeof opt.key === 'undefined') {
        console.warn('need attribute key,as like { key : "router"}');
        return;
      }
      loadingApp.$data.loadingType = opt.loadingType || 'pc'; // 添加loading之前就开始确定平台pc/mt

      // 后续如果产品说需要加上loadding的话，可以加参数 ts_hideLoading 判断是否需要开启loadding
      // 只有当ts_hideLoading为false，才给他出loadding
      if (loadingApp.$data && loadingApp.$data.loadingType === 'pc') return;

      loadingApp.cacheQuene[opt.key] = setTimeout(() => {
        loadingApp.loadingQuene.push(opt);
      }, opt.waitTime);
    },
    poupQuene: function(key) {
      if (typeof key === 'undefined') {
        return;
      }
      let hasAdd = false;
      loadingApp.loadingQuene.forEach((data, index) => {
        if (data.key == key) {
          hasAdd = true;
          loadingApp.loadingQuene.splice(index, 1);
          return false;
        }
      });
      //还没有被添加到队列
      if (!hasAdd) {
        clearTimeout(loadingApp.cacheQuene[key]);
        loadingApp.cacheQuene[key] = null;
        delete loadingApp.cacheQuene[key];
      }
    },
    /**
     * @method 判断是否已经存在某个loading
     * @author lymn
     * @param {String} key loading弹窗的指定id
     * @returns {Boolean} 是否存在该loading
     */
    getQuene: function(key) {
      const hasKey = loadingApp.loadingQuene.find(data => {
        return data.key == key;
      });
      return hasKey;
    },
  };
})();
