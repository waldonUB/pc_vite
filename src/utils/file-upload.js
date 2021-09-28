/*
 * @Author: ADI
 * @Date: 2021-03-22 17:29:07
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-18 16:43:11
 */

import * as faiupload from '@fk/faiupload/esm';

import { batchAddAjax, getAccessKeyAjax, getTxtListAjax } from '@/api/modules/component/file-upload';
import { filterData, postMessage } from '@/utils';

import iconExcelIMG from '@/assets/image/material/icon_excel.png';
import iconPdfIMG from '@/assets/image/material/icon_pdf.png';
import iconPptIMG from '@/assets/image/material/icon_ppt.png';
import iconVideoIMG from '@/assets/image/material/icon_video.png';
import iconWordIMG from '@/assets/image/material/icon_word.png';
import store from '@/store';

const getStoreState = () => store.state;

/**
 * 获取上传文件的AccessKey
 * 管理态时只需调用一次，访客态需每次都调用
 * @author waldon
 * @date 2020/12/15
 * @params {Object} - 上传参数
 * @returns {Promise} -
 */
export const getAccessKey = async params => {
  params = { ...params, ...{ noUseCache: Math.random() } }; // 请求不缓存AccessKey
  const filterParams = filterData(params, ['isComm', 'fileName', 'fileSize', 'noUseCache', 'isCorp']);
  filterParams.fileName = params.putExtra.fileName;
  const [err, res] = await getAccessKeyAjax(filterParams);
  if (err) {
    showCapacityTip(err, params.isHideUpgradeLink);
    return Promise.reject([err.msg || err.message, null]);
  }
  return Promise.resolve([null, res.data]);
};

/**
 * 业务通用上传
 * tempFilePath和isComm是必传的，
 * tempFilePath在pc是file，在小程序是file的路径
 * isComm判断是否使用业务模式上传，true-通用模式 false-业务模式。目前文件夹的上传全部采用业务模式
 * @author waldon
 * @date 2020/12/22
 * @param {Object} option - 上传入参
 * @link http://gitlab.faidev.cc/frontend/faiupload#%E4%BD%BF%E7%94%A8 - 公司文档
 */
export const tsFaiUpload = async option => {
  const [err, accessKeyData] = await getAccessKey(option);
  if (err) {
    option.error && option.error(err, true);
    return Promise.reject(err);
  }
  if (accessKeyData && accessKeyData.accessKey) {
    let { putExtra, config } = option;
    const { tempFilePath, next, error, complete } = option;
    const fnList = ['next', 'error', 'complete'];
    for (const key of fnList) {
      if (!option[key]) {
        option[key] = () => {};
      }
    }
    putExtra = {
      // 这个嵌套的层级不一样，需注意
      params: {
        ...{
          // id: <文件id(可选)>,
          aid: getStoreState().user.info.acctInfo.aid,
          tmp: true, // 是否临时文件
          // fileName: <文件名(业务模式需填)>
        },
        ...putExtra,
      },
    };
    const accessKey = accessKeyData.accessKey;
    config = { ...{}, ...config };
    console.log('config', config);
    console.log('faiupload', faiupload);
    const observable = faiupload.upload(tempFilePath, accessKey, putExtra, config);
    const observer = {
      next: next,
      error: error,
      complete: complete,
    };
    observable.subscribe(observer); // 返回的对象可以用于暂停上传
    return Promise.resolve(observable);
  }
};

/**
 * 查询校验文件
 * @author waldon
 * @date 2020/4/10
 * */
export const getUploadFile = async () => {
  const [err, res] = await getTxtListAjax();
  if (err) {
    postMessage({
      type: 'error',
      message: err.msg || '网络错误，请稍候重试',
    });
    return Promise.reject(err);
  }
  if (res.data.length > 0) {
    return Promise.resolve(res.data[0]?.name);
  } else {
    return Promise.reject(res.data);
  }
};

/**
 * 获取文件名称和后缀名
 * @author lymn
 * @date 2020-10-20
 * @param {String} 文件名称
 */
export const getFileName = data => {
  const index = data.lastIndexOf('.');
  let path = ''; // 文件名
  let suffix = ''; // 后缀名
  if (index >= 0) {
    path = data.substring(0, index);
    suffix = data.substring(index, data.length);
  } else {
    path = data;
    suffix = '';
  }
  return [path, suffix];
};

/**
 * 获取文件icon图片
 * @author lymn
 * @date 2020-11-02
 */
export const getIcon = fileName => {
  if (fileName && fileName.includes('.')) {
    const fileNames = fileName.split('.');
    const fileType = fileNames[fileNames.length - 1];
    switch (fileType) {
      case 'doc':
      case 'docx':
        return iconWordIMG;
      case 'xls':
      case 'xlsx':
        return iconExcelIMG;
      case 'pdf':
        return iconPdfIMG;
      case 'ppt':
      case 'pptx':
      case 'pps':
      case 'ppsx':
        return iconPptIMG;
      default:
        break;
    }
  }
};

/**
 * 上传素材到系统资源文件夹
 * @author lymn
 * @date 2021-01-13
 * @param {Object} res 文件内容
 * @param {Number} folderType 类型
 */
export const batchAdd = async (res, folderType) => {
  const { fileName: name, id: content, type, encodeSize: size } = res;
  const params = [
    {
      name: res.fileName || res.name,
      content,
      type,
      size,
    },
  ];
  const [err, batchAddAjaxRes] = await batchAddAjax({
    content: JSON.stringify(params),
    folderType,
  });
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
 * 上传文件时容量不足以及其他提示
 * @author lymn
 * @date 2021-01-14
 * @param {Object} res 请求结果
 * @param {Boolean} isHideUpgradeLink 是否隐藏去升级链接，目前企微要隐藏，pc端显示
 */
export const showCapacityTip = (res, isHideUpgradeLink) => {
  if (!res.success) {
    const isUpperAdm = getStoreState().user.info.staffInfo.isUpperAdm;
    console.log(isUpperAdm, '是否为超级管理员');
    let msgStr = `${res.msg || res.message}`;
    if (res.rt == 6044) {
      // 超出企业容量
      msgStr += isUpperAdm
        ? `，请升级版本${
            isHideUpgradeLink
              ? ''
              : '【<a rel="noopener noreferrer" target="_blank" href="${initTsParam.addressUrl.updateVersionUrl}">去升级</a>】'
          }`
        : '，请联系管理员升级版本';
    } else if (res.rt == 6065) {
      // 超出个人容量
      msgStr += isUpperAdm ? '，请重新扩容' : '，请联系管理员扩容';
    }
    postMessage({
      type: 'error',
      dangerouslyUseHTMLString: true,
      message: msgStr || '网络错误，请稍候重试',
    });
  }
};

/**
 * 选择文件上传组件-icon显示
 * @author: ADI
 * @Date: 2021-02-19 11:06:44
 * @param {Object} file
 */
export const getFileSelectUploadDialogIcon = file => {
  switch (
    file.categoryName // 1:文档 2:图片 3:视频
  ) {
    case '文档':
      return getIcon(file.name);
    case '图片':
      return file.content;
    case '视频':
      return file.coverImgUrl || iconVideoIMG;
  }
};
