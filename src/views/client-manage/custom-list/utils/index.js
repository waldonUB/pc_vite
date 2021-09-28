/*
 * @Description  : 客户相关的公共方法
 * @Author       : turbo
 * @Date         : 2021-07-01 11:13:45
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-12 11:22:16
 */

// utils
import { postMessage } from '@/utils';

// api
import { client } from '@/api';

/**
 * @description : 获取客户自定义字段列表
 * @author      : turbo
 * @Date        : 2021-07-09 17:22:50
 * @param        {Number} type
 * @return       {Object}
 */
export const getCustomFiledList = async type => {
  const { getCrmDefinedList } = client;
  const [err, res] = await getCrmDefinedList({
    type,
  });
  if (err) {
    postMessage({
      type: 'error',
      message: err.msg || '网络错误，请稍候重试',
    });
    return Promise.reject(err);
  }

  const { isExistRecord, allDefinedFieldList, tsUserDefinedFieldList } = res.data;
  let initSelectedList = [];
  if (isExistRecord) {
    tsUserDefinedFieldList.forEach(item => {
      allDefinedFieldList.forEach(subItem => {
        if (item.field === subItem.field) {
          item.width = subItem.width;
        }
      });
    });
    initSelectedList = tsUserDefinedFieldList;
  } else {
    // 没有用过自定义字段的按默认的显示
    initSelectedList = allDefinedFieldList.filter(item => {
      return item.isShow;
    });
  }

  return {
    allDefinedFieldList,
    initSelectedList,
  };
};

/**
 * @description : 标签数据翻译
 * @author      : turbo
 * @Date        : 2021-07-12 11:12:41
 * @param        {Array} allTagList - 所有标签数据
 * @param        {Object} row - 行数据
 * @return       {Array}
 */
export const getTagList = (allTagList, row) => {
  const tagList = [];
  if (Array.isArray(allTagList)) {
    allTagList.forEach(item => {
      if (Array.isArray(item.tag)) {
        item.tag.forEach(subItem => {
          if (row.tagIdList.includes(subItem.id)) {
            tagList.push(subItem);
          }
        });
      }
    });
  }
  return tagList;
};
