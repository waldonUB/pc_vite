/*
 * @Author: ADI
 * @Date: 2021-03-22 16:34:19
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-02 11:33:40
 */

import { isPlainObject } from 'lodash';
import store from '@/store';
import { stringify } from './index';

const getStoreState = () => store.state;

/**
 * @description : 在链接上拼接参数
 * @author      : turbo
 * @Date        : 2021-02-04 10:25:50
 * @param        {String} url
 * @param        {Object} params
 * @return       {String}
 */
export function addUrlParams(url, params) {
  if (!url) return '';
  if (!params || !isPlainObject(params)) return url;
  return `${url}${url.indexOf('?') > -1 ? '&' : '?'}${stringify(params)}`;
}

// 进行html编码
// .replace(/ /g, "&nbsp;").replace(/\b&nbsp;+/g, " ")用于替换空格 再查找单个或者连续的空格，把单个或连续串中第一个替换为原来的“ ”。
/* eslint-disable */
export const encodeHtml = function(html) {
  return html && html.replace
    ? html
        .replace(/&/g, '&amp;')
        .replace(/ /g, '&nbsp;')
        .replace(/\b&nbsp;+/g, ' ')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\\/g, '&#92;')
        .replace(/\'/g, '&#39;')
        .replace(/\"/g, '&quot;')
        .replace(/\n/g, '<br/>')
        .replace(/\r/g, '')
    : html;
};
/* eslint-enable */

// 进行html解码
/* eslint-disable */
export const decodeHtml = function(html) {
  return html && html.replace
    ? html
        .replace(/&nbsp;/gi, ' ')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#92;/gi, '\\')
        .replace(/&#39;/gi, "'")
        .replace(/&quot;/gi, '"')
        .replace(/\<br\/\>/gi, '\n')
        .replace(/&amp;/gi, '&')
    : html;
};
/* eslint-enable */

// 把字符串转换为写在html标签中javascript的字符串，例如<div onclick="alert('xxx')">
/* eslint-disable */
export const encodeHtmlJs = function(html) {
  return html && html.replace
    ? html
        .replace(/\\/g, '\\\\')
        .replace(/\'/g, '\\x27')
        .replace(/\"/g, '\\x22')
        .replace(/\n/g, '\\n')
        .replace(/</g, '\\x3c')
        .replace(/>/g, '\\x3e')
    : html;
};
/* eslint-enable */

// 把字符串转换为写在html中属性值，例如<div title="xxx">
/* eslint-disable */
export const encodeHtmlAttr = function(html) {
  return html && html.replace
    ? html
        .replace(/\"/g, '&#x22;')
        .replace(/\'/g, '&#x27;')
        .replace(/</g, '&#x3c;')
        .replace(/>/g, '&#x3e;')
        .replace(/&/g, '&#x26;')
        .replace(/\\/g, '&#5c;')
    : html;
};
/* eslint-enable */

// 进行url编码
/* eslint-disable */
export const encodeUrl = function(url) {
  /*
    	return url && url.replace ?
    		url.replace(/%/ig, "%25").replace(/\+/ig, "%2B").replace(/&/ig, "%26").replace(/#/ig, "%23")
    		: url;
        str = str.replace(/,/g, '%2C');
        str = str.replace(/\//g, '%2F');
        str = str.replace(/\?/g, '%3F');
        str = str.replace(/:/g, '%3A');
        str = str.replace(/@/g, '%40');
        str = str.replace(/&/g, '%26');
        str = str.replace(/=/g, '%3D');
        str = str.replace(/\+/g, '%2B');
        str = str.replace(/\$/g, '%24');
        str = str.replace(/#/g, '%23');
        return str;
    	*/
  return typeof url === 'undefined' ? '' : encodeURIComponent(url);
};
/* eslint-enable */

// 进行url解码
/* eslint-disable */
export const decodeUrl = function(url) {
  return typeof url === 'undefined' ? '' : decodeURIComponent(url);
};
/* eslint-enable */

/**
 * 修复图片链接
 * @author waldon
 * @date 2020/12/29
 * @param {String} imgUrl - 图片地址
 * @param {Boolean} isFai - 是否架构返回的图片，前面不带//这个符号的
 * @returns {String} - 图片地址
 */
export const fixImgUrl = function(imgUrl, isFai = false) {
  if (isFai) {
    const httpText = getStoreState().globalData.isDebug ? 'http://' : 'https://';
    if (imgUrl.indexOf('http://') < 0 && imgUrl.indexOf('https://') < 0) {
      return httpText + imgUrl;
    }
  } else if (!/^http:/.test(imgUrl) && /^\/\//.test(imgUrl)) {
    return 'http:' + imgUrl;
  }
  return imgUrl;
};

// 获取地址里面的参数
export const getUrlParam = function(url, name) {
  var paramStrings = url.substring(url.indexOf('?') + 1, url.length).split('&');
  var value;
  paramStrings.forEach(str => {
    var tmpKey = decodeURIComponent(str.substring(0, str.indexOf('=')));
    if (tmpKey === name) {
      value = decodeURIComponent(str.substring(str.indexOf('=') + 1, str.length));
      return false;
    }
  });
  return value;
};

export const parseURL = function(url) {
  var a = document.createElement('a');
  a.href = url;
  return {
    obj: a,
    source: url,
    protocol: a.protocol.replace(':', ''),
    host: a.hostname,
    port: a.port,
    query: a.search,
    params: (function() {
      var ret = {},
        seg = a.search.replace(/^\?/, '').split('&'),
        len = seg.length,
        i = 0,
        s;
      for (; i < len; i++) {
        if (!seg[i]) {
          continue;
        }
        s = seg[i].split('=');
        ret[s[0]] = s[1];
      }
      return ret;
    })(),
    file: (a.pathname.match(/\/([^/?#]+)$/i) || ['', ''])[1],
    hash: a.hash.replace('#', ''),
    path: a.pathname.replace(/^([^/])/, '/$1'),
    relative: (a.href.match(/tps?:\/\/[^/]+(.+)/) || ['', ''])[1],
    segments: a.pathname.replace(/^\//, '').split('/'),
  };
};

export const jointUrlArg = function(root, arg) {
  if (arg) {
    return root + (root.indexOf('?') >= 0 ? '&' : '?') + arg;
  } else {
    return root;
  }
};

export const jointParams = function(params) {
  var s = [];
  // $.each(params, function(key, val){
  // 	s.push(key + '=' + val);
  // });
  for (const [key, value] of Object.entries(params)) {
    s.push(key + '=' + value);
  }
  return s.join('&');
};

export const removeUrlArg = function() {
  var argsArray = Array.prototype.slice.call(arguments);
  if (argsArray.length < 2 || !argsArray[0]) {
    return;
  }
  var urlInfo = parseURL(argsArray.shift());
  argsArray.forEach(item => {
    if (urlInfo.params.hasOwnProperty(item)) {
      delete urlInfo.params[item];
    }
  });
  urlInfo.obj.search = jointUrlArg('', jointParams(urlInfo.params));
  return urlInfo.obj.href;
};

export const navigate = function(href = '') {
  if (navigator.onLine) {
    window.location.href = href;
  } else {
    sessionStorage.setItem('href', href);
    window.location.href = '/wxwork/missNetwork.jsp';
  }
};

/**
 * 已废弃，资源文件引用一律通过import引入
 * @description : 获取资源路径地址
 * @author      : ADI
 * @Date        : 2021-05-28 14:35:09
 * @param {String} url 路径
 * @returns {String} 拼接后的资源路径地址
 */
// export const getImgAddress = function(url) {
//   return require(`@/assets${url}`);
// };

/** 20200918
 * 下载图片到本地
 * @author lymn
 * @date 2020-07-25
 * @param {String} url 要下载的图片路径
 * @param {String} name 图片名称
 * @param {Boolean} isNeedTranslate - 是否要转成同源
 */
export const downloadImg = function(url, name, isNeedTranslate = true) {
  let uploadUrl = url;
  if (isNeedTranslate) {
    uploadUrl = getTsImgUrl(url);
  }
  const image = new Image();
  // 解决跨域 Canvas 污染问题
  image.setAttribute('crossOrigin', 'anonymous');
  image.onload = function() {
    // 用canvas再绘制一遍是为了可以重命名
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, image.width, image.height);
    const url = canvas.toDataURL('image/png'); //得到图片的base64编码数据
    const fileName = `${name || 'photo'}.png`;
    console.log('ie10 .....11');
    if (window.navigator.msSaveOrOpenBlob) {
      // ie不支持a标签download属性，特殊处理
      const blob = dataURLtoBlob(url);
      window.navigator.msSaveOrOpenBlob(blob, fileName);
    } else {
      // a标签下载
      const a = document.createElement('a'); // 生成一个a元素
      const event = new MouseEvent('click'); // 创建一个单击事件
      a.download = fileName; // 设置图片名称
      a.href = url; // 将生成的URL设置为a.href属性
      a.dispatchEvent(event); // 触发a的单击事件
    }
  };
  image.src = uploadUrl;
};

/**
 * dataUrl转blob
 * @author lymn
 * @date 2020-08-04
 * @param {String} dataurl
 * @returns {Object} Blob
 */
export const dataURLtoBlob = function(dataurl) {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {
    type: mime,
  });
};

/**
 * 得到同源图片
 * @author lymn
 * @date 2020-08-04
 * @param {String} url 图片路径
 * @returns {String} 同源图片路径
 */
export const getTsImgUrl = function(url) {
  return `/ajax/downloadImg_h.jsp?tsImgUrl=${encodeURIComponent(url)}`; // 浏览器前面自动补全{location.protocol}//{location.host}
};

/**
 * 通过后端来下载
 * 后续把其他前端下载替换成这种
 * @author waldon
 * @date 2021/2/8
 * @param {Object} option - 通过后端来下载，避免ios浏览器兼容问题
 */
export const downloadImgBySvr = function(option) {
  const { u } = option;
  let fn = option.fn;
  const fileTypeList = ['jpg', 'jpeg', 'png', 'gif'];
  if (fn && typeof fn === 'string') {
    const fileNames = fn.split('.');
    const suffixName = fileNames[fileNames.length - 1];
    if (!fileTypeList.includes(suffixName.toLowerCase())) {
      // 如果图片名不带后缀
      fn = `${fn}.${option.suffixName || 'png'}`;
    }
    let downloadPath = '/ajax/downloadFile_h.jsp';
    downloadPath = addUrlParams(downloadPath, {
      u: encodeUrl(u),
      fn,
    });
    window.open(downloadPath);
  }
};

// url拼接token
export const getUrL = url => {
  return addUrlParams(url, {
    _TOKEN: getStoreState().globalData?.token,
    _LOGIN_SIGN: getStoreState().globalData?.login_sign,
  });
};
