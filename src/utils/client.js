/*
 * @Description  : 客户 & 线索相关的公共方法
 * @Author       : turbo
 * @Date         : 2021-06-30 17:29:17
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-02 17:31:59
 */

// utils
import { confirm, postMessage } from '@/utils';

import { client } from '@/api';

/**
 * @description : 线索操作成功提示
 * @author      : turbo
 * @Date        : 2021-06-24 13:58:40
 * @param        {Object} resData - 返回的数据
 * @param        {Boolean} isSetCustomer - 是否置为客户的提示
 * @return       {*}
 */
export const clueCommTip = (resData, isSetCustomer) => {
  postMessage({
    type: 'success',
    message: `成功${(isSetCustomer ? '置为客户' : '') + resData.successTotal}条，失败${
      resData.failTotal ? resData.failTotal : 0
    }条`,
  });
};

/**
 * @description : 将线索置为客户
 * @author      : turbo
 * @Date        : 2021-06-24 11:58:03
 * @param        {Array} idList - 线索id列表
 * @return       {*}
 */
export const batchSetCustomer = idList => {
  return new Promise((resolve, reject) => {
    confirm('确定将选中线索置为客户？').then(async () => {
      const { batchSetCustomer } = client;
      const [err, res] = await batchSetCustomer({
        idListJson: JSON.stringify(idList),
      });
      if (err) {
        postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return reject();
      }
      clueCommTip(res.data, true);
      resolve();
    });
  });
};

/**
 * @description : 领取线索
 * @author      : turbo
 * @Date        : 2021-06-24 11:59:35
 * @param        {Array} idList - 线索id列表
 * @return       {*}
 */
export const getClue = idList => {
  return new Promise((resolve, reject) => {
    confirm('确定领取选中的线索？').then(async () => {
      const { getClue } = client;
      const [err, res] = await getClue({
        idListJson: JSON.stringify(idList),
      });
      if (err) {
        postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return reject();
      }
      clueCommTip(res.data);
      resolve();
    });
  });
};

/**
 * @description : 获取客户来源以及客户库状态
 * @author      : turbo
 * @Date        : 2021-06-21 10:52:07
 * @param        {Boolean} isGetAll - 是否返回所有数据
 * @param        {String} field - isGetAll 为 false 时，表示需要获取哪个字段的数据，不传也是返回所有数据
 * @param        {Boolean} hasSelectAll - isGetAll 为 false 时，所需要获取的字段是否可以选择“全部”
 * @return       {Array}
 */
export const getTsClientDef = async (isGetAll, field, hasSelectAll) => {
  const { getTsClientDef } = client;
  const [err, res] = await getTsClientDef();
  if (err) {
    return Promise.reject(err);
  }
  if (isGetAll || !field) return res.data;
  const data = res.data[field];
  hasSelectAll &&
    data?.unshift({
      key: '',
      value: '全部',
    });
  return data;
};

/**
 * @description : 获取所有省市区
 * @author      : ADI
 * @Date        : 2021-06-21 10:53:43
 * @param        {Boolean} hasSelectAll - 是否可以选择“全部”
 * @return       {Array}
 */

export const getAddressList = async hasSelectAll => {
  const { getAddressList } = client;
  const [err, res] = await getAddressList();
  if (err) {
    return Promise.reject(err);
  }
  let list = res.data;
  if (hasSelectAll) {
    // 添加“全部”显示字段
    const _addAddressItem = (list = [], item = { id: '', name: '全部' }) => {
      function addSubItem(arr = [], item) {
        for (const sub of arr) {
          if (sub.subList && sub.subList.length) {
            const _addItem = Object.assign({}, item);
            sub.subList.unshift(_addItem);
            addSubItem(sub.subList, item);
          }
        }
        return arr;
      }
      const _list = addSubItem(list, item);
      _list.unshift(item);
      return _list;
    };
    list = _addAddressItem([...list]);
  }
  return list;
};
