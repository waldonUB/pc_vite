/*
 * @Author       : ADI
 * @Date         : 2021-07-29 14:46:37
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-31 14:03:14
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const getTaskTypeDef = data => {
  return POST_WRAP('/rest/manage/marketingTask/getTaskTypeDef', data);
};

export const getTsMarketingTaskList = data => {
  return POST_WRAP(
    '/rest/manage/marketingTask/getTsMarketingTaskList',
    data,
    {},
    {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    },
  );
};

export const cmd = data => {
  return POST_WRAP(
    '/rest/manage/marketingTask/saveTsMarketing',
    data,
    {},
    {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    },
  );
};

export const finishTsMarketing = data => {
  return POST_WRAP('/rest/manage/marketingTask/finishTsMarketing', data);
};

export const finishTsMarketingAjax = data => {
  return POST_WRAP('/ajax/marketingTask/tsMarketingTask_h.jsp?cmd=finishTsMarketing', data);
};

export const getTsMarketingTask = data => {
  return POST_WRAP('/rest/manage/marketingTask/getTsMarketingTask', data);
};

export const getTsMarketingDetailsListById = data => {
  return POST_WRAP('/rest/manage/marketingDetails/getTsMarketingDetailsListById', data);
};

export const getTsMarketingTaskAjax = data => {
  return POST_WRAP('/ajax/marketingTask/tsMarketingTask_h.jsp?cmd=getTsMarketingTask', data);
};

export const saveTsMarketing = data => {
  return POST_WRAP('/rest/manage/marketingTask/saveTsMarketing', data);
};
