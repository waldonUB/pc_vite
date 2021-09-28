/*
 * @Author: ADI
 * @Date: 2021-03-22 17:21:10
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-15 10:02:51
 */

import { encodeHtml, postMessage } from './index';
import {
  getDepStaffRelListAjax,
  getTsFunctionsAjax,
  getTsGuideListAjax,
  getWxWorkConfInfoAjax,
  getWxWorkCorpAjax,
  saveTsGuideAjax,
} from '@/api/modules/common';

import Vue from 'vue';
import { getDownloadTemplateUrl } from '@/api/modules/common';
import { getTsStaffList } from '@/api/modules/component/search-tree';
import { isPlainObject } from 'lodash';
import router from '@/router';
import store from '@/store';
import versionDef from '@/config/version-def';

const getStoreState = () => store.state;

export const getWxWorkConfInfo = async () => {
  const [err, res] = await getWxWorkConfInfoAjax();
  if (err) {
    postMessage({
      type: 'error',
      message: err.msg || '网络错误，请稍候重试',
    });
    return Promise.reject(err);
  }
  const wxWorkConfInfo = res.data.wxWorkConf;
  return Promise.resolve(wxWorkConfInfo);
};

/**
 *发起循环调用的查询接口
 * @author tomato
 * @date 2020-04-10
 */
export const poll = (function() {
  var poll = getPoll();
  poll.$new = getPoll;
  return poll;

  function getPoll() {
    var cache = {};
    var poll = function(opts) {
      Object.assign(
        {
          name: '',
          time: -1, //间隔执行时间
          poll: null,
          delay: -1, //延迟执行时间
        },
        opts,
      );
      poll.stop(opts.name);
      var step = 0,
        timer,
        isStop = false;
      var next = function() {
        if (isStop) return;
        opts.poll(function(time) {
          time = time || opts.time;
          timer = time < 0 ? next() : setTimeout(next, time);
        }, step++);
      };
      var stop = function() {
        clearTimeout(timer);
        isStop = true;
        delete cache[opts.name];
      };
      if (opts.name) {
        cache[opts.name] = stop;
      }
      opts.delay < 0 ? next() : setTimeout(next, opts.delay);
      return stop;
    };
    poll.stop = function(name) {
      if (arguments.length == 0) {
        // $.each(cache, function(key, val) {
        //   val && val();
        // });
        Object.keys(cache).forEach(key => {
          cache[key] & cache[key]?.();
        });
      } else if (name && cache[name]) {
        cache[name]();
      }
      return poll;
    };
    return poll;
  }
})();

/**
 * 分组格式化成选中的标签
 * @author waldon
 * @date 2020/8/6
 * @param {*} tagGroup - 标签组
 * return {Array} - 选择的标签
 */
export const tagGroupToTagList = function(tagGroup) {
  const tagList = [];
  if (Array.isArray(tagGroup)) {
    tagGroup.forEach(item => {
      if (Array.isArray(item.tag)) {
        item.tag.forEach(subItem => {
          tagList.push(subItem);
        });
      }
    });
  }
  return tagList;
};

/*
 * @description: 根据sid获取部门
 * @author: enson
 * @date: 2020-09-28 17:54:14
 */
export const getUserDepIdList = async function(sid, name) {
  const [err, res] = await getDepStaffRelListAjax({ sid });
  if (err) {
    postMessage({
      type: 'error',
      message: err.msg || '网络错误，请稍候重试',
    });
    return Promise.reject(err);
  }
  return Promise.resolve(res.data);
};

/**
 * @function 获取指引
 */
export const getGuideList = async () => {
  const [err, res] = await getTsGuideListAjax({
    // 因为 articleMaterial 页面 create 的时候以及监听路由跳转的时候都会调用这个方法
    // 因此加参数区分
    unique: true,
    getGuideList: true,
  });
  if (err) {
    postMessage({
      type: 'error',
      message: err.msg || '网络错误，请稍候重试',
    });
    return Promise.reject(err);
  }
  return Promise.resolve(res.data?.guideList);
};

/**
 * 针对的是页面单次出现的场景
 * @function 保存单次指引
 */
export const saveGuide = async step => {
  const [err, res] = await saveTsGuideAjax({
    step,
  });
  if (err) {
    postMessage({
      type: 'error',
      message: err.msg || '网络错误，请稍候重试',
    });
    return Promise.reject(err);
  }
  return Promise.resolve(res);
};

/**
 * 跳转到企微设置
 * 目前只有超管能设置
 * @author waldon
 * @date 2021/1/14
 * @param {Boolean} isToPage - 是否跳转到对应页面
 * @return {String} 直分销对应的设置页路径
 */
export const gotoWxCorpSet = (isToPage = true, needTip = true) => {
  let pagePath = '';
  console.log('!getStoreState().user.info.staffInfo.isUpperAdm', !getStoreState().user.info.staffInfo.isUpperAdm);
  if (!getStoreState().user.info.staffInfo.isUpperAdm) {
    // 部门管理员和自定义角色不能设置
    needTip &&
      postMessage({
        type: 'error',
        message: '暂无该功能权限，请联系管理员',
      });
    return pagePath;
  }
  pagePath = 'wxCorpApp'; // 2021年3月1日 直分销的路径合并成一个
  if (isToPage) {
    router.push({
      path: pagePath,
    });
  }
  return pagePath;
};

/**
 * 获取企微授权信息
 * @author waldon
 * @date 2021/1/23
 */
// 企微tag
export const getWxWorkCorp = async () => {
  if (getWxWorkCorp._data && !getWxWorkCorp._refresh) {
    return Promise.resolve(getWxWorkCorp._data);
  }
  const params = {
    url: location.href, // 这里pc加url只是为了兼容在企微客户端打开tsportal，并无实际作用
  };
  const [err, res] = await getWxWorkCorpAjax(params);
  if (err) {
    postMessage({
      type: 'error',
      message: err.msg || '网络错误，请稍候重试',
    });
    return Promise.reject(err);
  }
  const corpData = { ...res.data };
  const appFieldList = [
    'appleAgentId',
    'appleAgentLogo',
    'appleAgentName',
    'appleAgentDescription',
    'appleAgentSecret',
  ];
  const { corpSetSuccess, corpFinishCorp } = corpData;
  corpData.corpSetSuccessRel = corpSetSuccess && corpFinishCorp;
  for (const key of appFieldList) {
    if (!corpData[key] || corpData[key] === '0') {
      // 暂时兼容部分脏数据为字符串0的情况
      corpData[key] = '';
    }
  }
  getWxWorkCorp._data = corpData;
  getWxWorkCorp._refresh = false;
  return Promise.resolve(corpData);
};

/*
 * @description: 根据开通时间判断是否显示newIcon
 * @author: enson
 * @date: 2020-11-18 15:10:32
 */
const showIconKey = 'st_newIconList';
let showPointIconList = [
  {
    type: 'card_tabBarSetting',
    versionDate: '2020-11-19',
    isShow: true, // 是否需要展示
  },
];
export const showNewIcon = type => {
  const showPointIconStr = localStorage.getItem(showIconKey);
  if (showPointIconStr) {
    if (Array.isArray(JSON.parse(showPointIconStr))) {
      showPointIconList = JSON.parse(showPointIconStr);
    }
  }

  const currentIconData = showPointIconList.find(item => item.type === type);
  const isShow = currentIconData.isShow;
  const versionDate = currentIconData.versionDate;
  let versionDataBool = false;
  console.log('getStoreState().user.info.openTime', getStoreState().user.info.openTime);
  if (getStoreState().user.info.openTime) {
    versionDataBool = new Date(versionDate).getTime() > new Date(getStoreState().user.info.openTime).getTime();
  }

  return isShow && versionDataBool;
};
export const hideNewIcon = type => {
  const showPointIconStr = localStorage.getItem(showIconKey);

  if (showPointIconStr) {
    if (Array.isArray(JSON.parse(showPointIconStr))) {
      showPointIconList = JSON.parse(showPointIconStr);
    }
  }

  const index = showPointIconList.findIndex(item => item.type === type);
  if (index !== -1) {
    showPointIconList.splice(index, 1, {
      type: type,
      isShow: false,
      versionDate: showPointIconList[index].versionDate,
    });
    localStorage.setItem(showIconKey, JSON.stringify(showPointIconList));
  }
};

/**
 * 根据需要跟随的对象，自动计算气泡弹窗所在的位置
 *
 * @param {Object} obj，需要跟随的对象
 * @param {Object} target，被跟随的对象
 * @param {String} position，跟随所在位置 left: 与目标位置左边对齐；right: 与目标位置右边对齐；center: 在目标位置中间；top：在目标位置上方；bottom：在目标位置下方； 例："left,top" 贴近目标位置的左边，且在目标位置的上方
 * @param {Object} scorllTopBox，当前节点所在的盒子
 * @returns {RegExp} RegExp,正则表达式
 */
export const bubble = (function() {
  function getPosition(obj) {
    return obj.getBoundingClientRect();
  }
  function getOffsetTop(obj, isFixed = false) {
    if (document.getElementById('app') && !isFixed) {
      return (
        getPosition(obj).top +
        document.getElementById('app').scrollTop -
        document.querySelector('.header-wrap').offsetHeight
      );
    } else {
      return getPosition(obj).top;
    }
  }
  //去掉路由tab的大小
  function getOffsetLeft(obj, isFixed = false) {
    if (document.querySelector('.sidebar-wrap') && !isFixed) {
      return (
        getPosition(obj).left -
        document.querySelector('.sidebar-wrap').offsetWidth +
        document.getElementById('app').scrollLeft
      );
    } else {
      return getPosition(obj).left;
    }
  }
  //贴近目标的左边，obj表示需要跟随的对象，target表示被跟随的对象
  function calcLeft(followObj, target) {
    var followLeft = getOffsetLeft(target);
    var followTop = getOffsetTop(target);

    var followClientWidth = followObj.clientWidth;
    if (followClientWidth > 0) {
      followObj._clientWidth = followClientWidth;
    } else {
      followClientWidth = followObj._clientWidth;
    }
    //如果超出了屏幕位置，则绑定到另一边
    if (followClientWidth + followLeft > document.documentElement.clientWidth) {
      return calcRigth(followObj, target);
    }
    return followLeft;
  }
  //贴近目标的右边，obj表示需要跟随的对象，target表示被跟随的对象
  function calcRigth(followObj, target) {
    var followLeft = getOffsetLeft(target);

    var followClientWidth = followObj.clientWidth;
    if (followClientWidth > 0) {
      followObj._clientWidth = followClientWidth;
    } else {
      followClientWidth = followObj._clientWidth;
    }
    if (followLeft + target.offsetWidth < 0) {
      return calcLeft(followObj, target);
    }
    return followLeft - followClientWidth + target.offsetWidth;
  }
  function calcMiddle(followObj, target) {
    var followLeft = getOffsetLeft(target);

    var followClientWidth = followObj.clientWidth;
    if (followClientWidth > 0) {
      followObj._clientWidth = followClientWidth;
    } else {
      followClientWidth = followObj._clientWidth;
    }
    var leftDistance = followLeft - (followClientWidth - target.clientWidth) / 2;
    if (leftDistance < 0) {
      return calcLeft(followObj, target);
    }
    return leftDistance;
  }
  //贴近目标的垂直方向，obj表示需要跟随的对象，target表示被跟随的对象，position表示在被跟随对象的上方或下方
  function calculateVerical(followObj, target, position) {
    var followTop = getOffsetTop(target) + 68; // 68是顶部导航栏的高度
    var followClientHeight = followObj.clientHeight;
    if (followClientHeight > 0) {
      followObj._clientHeight = followClientHeight;
    } else {
      followClientHeight = followObj._clientHeight;
    }
    var bottomPos = followTop + target.offsetHeight + followClientHeight + 8;
    var topPos = followTop - followClientHeight - 8;
    //如果超过了浏览器显示的位置，或者在被跟随对象的上方
    if (bottomPos > document.documentElement.clientHeight || position == 'top') {
      return topPos - 68;
    }
    return bottomPos - followClientHeight - 68;
  }
  return {
    calculatePosition: function(obj, target, position, scorllTopBox, isFixed = false) {
      if (!target) return;
      let verticalStyle = 0;
      let planes = 0;
      if (isFixed) {
        verticalStyle = getOffsetTop(target, isFixed) + target.offsetHeight + 8;
        planes = getOffsetLeft(target, isFixed);
      } else {
        const scorllTop = scorllTopBox?.scrollTop || 0;
        verticalStyle = calculateVerical(obj, target) + scorllTop;
        const positionArr = position.split(',');
        positionArr.forEach((value, index) => {
          if (value == 'left') {
            planes = calcLeft(obj, target);
          } else if (value == 'right') {
            planes = calcRigth(obj, target);
          } else if (value == 'center') {
            planes = calcMiddle(obj, target);
          } else if (value == 'top' || value == 'bottom') {
            verticalStyle = calculateVerical(obj, target, value) + scorllTop;
          }
        });
      }
      return 'left: ' + planes + 'px; top: ' + verticalStyle + 'px;';
    },
  };
})();

/**
 * 确认弹窗
 * @param {String} msg，确认弹窗的消息
 * @param {String} title，确认弹窗的标题
 * @param {String} btnText，确认按钮的文字
 * @param {Boolean} dangerouslyUseHTMLString - 是否将 message 属性作为 HTML 片段处理
 * @returns Promise
 */
// ADI TODO: confirm与浏览器原生confirm重名, 后续迁移完成后修改名称为 confirmDialog
export const confirm = function(...args) {
  let msg,
    title,
    btnText,
    isShowCancel = true,
    dangerouslyUseHTMLString = false;

  if (args.length <= 1) {
    const option = args[0];
    if (isPlainObject(option)) {
      setArgs(true, option);
    } else {
      setArgs(false, args);
    }
  } else {
    setArgs(false, args);
  }

  function setArgs(isObject, params) {
    if (isObject) {
      ({ msg, title, btnText, isShowCancel, dangerouslyUseHTMLString } = params);
    } else {
      [msg, title, btnText, isShowCancel, dangerouslyUseHTMLString] = params;
    }
  }

  if (title == undefined) {
    title = '提醒';
  }

  if (btnText == undefined) {
    return Vue.prototype.$confirm(msg, title, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      showClose: false,
      dangerouslyUseHTMLString,
    });
  } else {
    return Vue.prototype.$confirm(msg, title, {
      confirmButtonText: btnText,
      showCancelButton: isShowCancel,
      showClose: false,
      center: true,
      dangerouslyUseHTMLString,
    });
  }
};

// 给金额设置分割逗号
export const fmoney = function(s, n) {
  n = n >= 0 && n <= 20 ? n : 2;
  s = parseFloat((s + '').replace(/[^\d.-]/g, '')).toFixed(n) + '';
  const l = s
    .split('.')[0]
    .split('')
    .reverse();
  let r = s.split('.')[1];
  if (r == undefined) {
    r = '';
  } else {
    r = `<span style='font-size:14px'>.${r}</span>`;
  }
  let t = '';
  for (let i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? ',' : '');
  }
  return (
    t
      .split('')
      .reverse()
      .join('') + r
  );
};

// 给页面搜索的时候用的
export const setSearchDate = function(data) {
  var name = data.name; // 对应的时间参数名 array类型
  var form = data.form; // 搜索条件参数对象
  name.forEach(function(val, index) {
    var start = val + 'Start';
    var end = val + 'End';
    // 自定义 开始时间参数 array类型
    if (data.start != null && data.start[index] != undefined && data.start[index] != '') {
      start = data.start[index];
    }
    // 自定义 结束时间参数 array类型
    if (data.end != null && data.end[index] != undefined && data.end[index] != '') {
      end = data.end[index];
    }
    // 处理时间
    var dateTime = form[val];
    if (dateTime == null) {
      dateTime = [];
    }
    form[start] = dateTime[0];
    form[end] = dateTime[1];
  });
};
export const getNameFromList = function(list, value, selectKey) {
  if (!list || !value) {
    return;
  }
  var checkKey = selectKey || ['label', 'value'];
  var trueValue;
  list.forEach(function(data) {
    if (data[checkKey[0]] && data[checkKey[1]] && value == data[checkKey[1]]) {
      trueValue = data[checkKey[0]];
      return false;
    }
  });
  return trueValue;
};

export const getLimitTips = (function() {
  let tipsInfo;
  return async function(fnKey) {
    if (tipsInfo) {
      const targetObj = tipsInfo[fnKey];
      if (targetObj) {
        return Promise.resolve(tipsInfo[fnKey]);
      } else {
        return Promise.reject('getLimitTips not found');
      }
    }
    const [err, res] = await getTsFunctionsAjax();
    if (err) {
      postMessage({
        type: 'error',
        message: err.msg || '网络错误，请稍候重试',
      });
      return Promise.reject('网络错误，请稍候重试');
    }
    tipsInfo = Object.assign({}, res.data);
    const targetObj = tipsInfo[fnKey];
    if (targetObj) {
      return Promise.resolve(tipsInfo[fnKey]);
    } else {
      return Promise.reject('getLimitTips not found');
    }
  };
})();

/**
 * 未达版本提示
 * @date 2020-09-14
 * @param {String} msg 提示信息
 * @param {Number} type type 1：立即扩容 其他：立即升级
 * @param {Number} verType 1：比当前版本更高的版本 2：直销专业版/分销标准版 3：直销专业版/分销高级版
 */
export const postLimitVer = function(msg, type, verType) {
  let message = '';
  console.log(
    'getStoreState().globalData.addressUrl.updateVersionUrl',
    getStoreState().globalData.addressUrl.updateVersionUrl,
  );
  if (type == 1) {
    message = `${msg}&nbsp;&nbsp;&nbsp;<a target="_blank" href="${
      getStoreState().globalData.addressUrl.updateVersionUrl
    }">立即扩容</a>`;
  } else {
    if (verType != undefined) {
      let limitVer = '';
      console.log('getStoreState().user.info.isOem', getStoreState().user.info.isOem);
      const isOem = getStoreState().user.info.isOem;
      const versionlist = isOem
        ? versionDef.NotDirectwindow.VersionDef.VersionList
        : versionDef.Directwindow.VersionDef.VersionList;

      switch (verType) {
        case 1:
          limitVer = versionDef.getUpperVersion();
          break;
        case 2:
          limitVer = isOem ? versionlist.STANDARD : versionlist.PROFESSIONNAL;
          break;
        case 3:
          limitVer = isOem ? versionlist.MID : versionlist.PROFESSIONNAL;
          break;
        case 4:
          limitVer = isOem ? versionlist.STANDARD : versionlist.BASE;
      }
      console.log(limitVer, '更高级的版本');
      // msg = msg.replace(/，请升级版本[,|。]*/, '');
      if (limitVer != undefined) {
        message = `${msg}，请升级到<!--
								--><div class="tanshu-versionIcon"><!--
									--><span class="tanshu-iconVer">
										<svg class="verIcon">
											<use xlink:href="#${isOem ? 'ts_notDirect_' : 'ts_direct_'}${limitVer}"></use>
										</svg>
									</span><!--
									--><span class="versionName tanshu_color">${versionDef.getVersionName(limitVer)}</span><!--
								--></div>&nbsp;&nbsp;&nbsp;
								<a target="_blank" href="${getStoreState().globalData.addressUrl.updateVersionUrl}">立即升级</a>`;
      }
    }
    if (!message) {
      message = `${msg}&nbsp;&nbsp;&nbsp;<a target="_blank" href="${
        getStoreState().globalData.addressUrl.updateVersionUrl
      }">立即升级</a>`;
    }
  }
  postMessage({
    customClass: 'needHigherVersion',
    dangerouslyUseHTMLString: true,
    message: message,
  });
};

/**
 * 顶部提示，沿用之前的
 * @author waldon
 * @date 2020/12/18
 * @param {Object} option - 1.btnText-按钮文案 2.msg-提示内容 3.fn-按钮回调
 */
export const topTip = option => {
  const topTipFn = option.fn;
  const message = `${option.msg}&nbsp;&nbsp;&nbsp;<a href="javascript:topTipFn();">${option.btnText}</a>`;
  postMessage({
    customClass: 'needHigherVersion tsTopTip',
    dangerouslyUseHTMLString: true,
    message: message,
    duration: option.duration,
  });
};

/**
 * 高亮搜索关键字
 * @author JHao
 * @date 2021-01-22
 * @param {String} result  - 需要处理关键字的字符串
 * @param {String} keyword - 关键字
 * @param {Boolean} isCaseSensitive  - 是否区分大小写,默认false-不区分
 * @param {Boolean} highlightClassName  - 高亮关键字class类名  默认 search-text
 * @returns {String} 返回转码并关键字处理后的字符串
 */
export const getHighlight = (
  result = '',
  keyword = '',
  isCaseSensitive = false,
  highlightClassName = 'search-text',
) => {
  if (result && keyword && keyword.length > 0) {
    // 匹配关键字正则
    let regKeyWord = keyword;
    // regKeyWord = '(' + regKeyWord.replace(/([\+\.\*\|\?\-\(\[\^\$])/g, '\\$1').replace(/\s+/g, '|') + ')'; // 把匹配关键字中的正则符转义
    regKeyWord = '(' + regKeyWord.replace(/([+.*|?\-([^$])/g, '\\$1').replace(/\s+/g, '|') + ')'; // 把匹配关键字中的正则符转义
    const regRule = isCaseSensitive ? 'gm' : 'gim';
    const replaceReg = new RegExp(regKeyWord, regRule); // 匹配关键字的正则
    // 根据正则表达式切割字符串为数组,example: ".gGggggggg?" 关键词为 "G",经过split + 正则处理后,
    // keywordList = [".", "g", "", "G", "", "g", "", "g", "", "g", "", "g", "", "g", "", "g", "", "g", "?"]
    const keywordList = result.split(replaceReg);
    let encodeResult = ''; // 处理转码并高亮关键字后的html
    for (const item of keywordList) {
      if (item) {
        if (item.toLocaleLowerCase() === keyword.toLocaleLowerCase()) {
          // 正则处理不区分大小写
          encodeResult += `<span class="${highlightClassName}">${encodeHtml(item)}</span>`;
        } else {
          encodeResult += encodeHtml(item);
        }
      }
    }
    console.log(encodeResult);
    return encodeResult;
  }
};

/**
 * 获取员工列表
 * @author tomato
 * @date 2020-04-10
 * @modify waldon 2020-07-30 修改入参
 * @param {Object} option - 其他参数
 * @returns
 */
export const getWorkerList = async (option = {}) => {
  if (store.getters['user/isManage'] || option.isForGetAssistantList) {
    let params = {
      workId: -1, // -1查全部
      isGetAll: true,
      isSelect: true,
    };
    params = { ...params, ...option };
    const [err, res] = await getTsStaffList(params);
    if (err) {
      postMessage({
        type: 'error',
        message: err.msg || '网络错误，请稍候重试',
      });
      return Promise.reject(err);
    }
    res.data.forEach(item => {
      item.name = item.selectName; // selectName为带（无角色）的字段
    });
    const staffList = [
      {
        name: '无',
        sid: 0,
      },
    ];
    if (option.isSearch) {
      // 是否用于搜索
      staffList.unshift({
        name: '全部成员',
        sid: -1,
      });
    }
    return Promise.resolve([staffList.concat(res.data), getStoreState().user.info.staffInfo.workId]);
  } else {
    const noManager = [
      {
        name: getStoreState().user.info.staffInfo.name,
        sid: getStoreState().user.info.staffInfo.sid,
      },
    ];
    return Promise.resolve([noManager, getStoreState().user.info.staffInfo.workId]);
  }
};
/**
 * 成员无职务时，需要显示
 * @author lymn
 * @date 2021-04-15
 * @param {Obeject} obj.staffExtraList 有职务的角色列表
 * @param {Number} obj.sid 角色sid
 * @param {String} obj.name 角色名称
 * obj : {staffExtraList, sid, staffName}
 */
export const showStaffName = (list, sid, name) => {
  // let {list = {}, sid, name = ''} = obj
  if (name !== '已删除') {
    return name + (list[sid] ? '' : '（无职务）');
  }
  return name;
};

export const downloadTempUrl = async (type, refresh = false) => {
  const downloadTempMap = new Map(); // 存储全局的模板下载文件
  // 如果没有传type 直接return
  if (!type) return Promise.reject('没有传type', type);
  if (refresh) {
    // 清除缓存
    downloadTempMap.clear();
  }
  if (downloadTempMap.has(type)) {
    // 如果有获取过模板则直接用之前的模板
    return Promise.resolve(downloadTempMap.get(type));
  }
  const [err, res] = await getDownloadTemplateUrl({ type });
  if (err) {
    postMessage({
      type: 'error',
      message: err.msg || '获取模板地址失败，请刷新重试',
    });
    return Promise.reject(err);
  }
  downloadTempMap.set(type, res.data);
  return Promise.resolve(downloadTempMap.get(type));
};

/**
 * 判断是否有某个功能权限
 * @author lymn
 * @date 2021-04-29
 * @param {Array} funcList 功能权限列表
 * @param {String} funcKey 权限定义，参考TsCommDef.FuncKeyDef
 */
export const checkHasFuncPermission = (funcList, funcKey) => {
  if (Array.isArray(funcList)) {
    return funcList.includes(funcKey);
  }
  return false;
};

/**
 * 校验文件是否合法，常规校验文件大小和格式
 * @author lymn
 * @date 2021-04-29
 * @param {Object} verifyObj 文件和格式大小限制对象
 * @param {Object} verifyObj.file 文件
 * @param {String} verifyObj.fileAccept 文件类型限制 例如：'.jpg,.jpeg,.png,.JPG,.JPEG,.PNG'
 * @param {Number} verifyObj.limitSize 限制的文件大小，以M为单位
 * @return {Boolean} 是否校验成功
 */
export const verifyFileQuality = ({
  file = {},
  fileAccept = '.jpg,.jpeg,.png,.JPG,.JPEG,.PNG',
  limitSize = 2,
} = {}) => {
  // let {file, fileAccept, limitSize} = verifyObj
  if (file.name && file.name.includes('.')) {
    const fileNames = file.name.split('.');
    const suffixName = fileNames[fileNames.length - 1];
    if (!fileAccept.includes(suffixName)) {
      postMessage({
        type: 'error',
        message: '文件类型不符合规范，请上传jpg/jpeg/png格式的图片',
      });
      return false;
    }
    const limit2M = file.size / 1024 / 1024;
    if (limit2M > limitSize) {
      postMessage({
        type: 'error',
        message: '文件大小不能超过2M',
      });
      return false;
    }
    return true;
  } else {
    postMessage({
      type: 'error',
      message: '文件类型不符合规范，请上传jpg/jpeg/png格式的图片',
    });
    return false;
  }
};

/**
 * 是否显示新的提示
 * 产经说后续红点和“新”的提示只会存在一个版本
 * 所以由前端在这里统一处理
 * @author waldon
 * @date 2021-05-06
 * @param {String} key
 * @param {String} endDate
 * @returns {Boolean} 是否显示“新”的提示
 */
export const getNewFucShow = (key, endDate) => {
  if (new Date().getTime() > new Date(endDate).getTime()) {
    // 超过截止日期直接隐藏
    return false;
  }
  if (window.localStorage.getItem(key)) {
    return false;
  }
  return true;
};
