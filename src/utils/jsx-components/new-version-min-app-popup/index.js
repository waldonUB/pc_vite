/*
 * @Author       : ADI
 * @Date         : 2021-04-14 15:01:26
 * @LastEditors  : ADI
 * @LastEditTime : 2021-04-21 17:57:21
 */
import router from '@/router';
import { newVersionMinAppPopupCookie, getCookie, setCookie, format, postMessage, confirm } from '@/utils';
import { checkPush } from '@/api/modules/common';

export const newVersionMinAppPopup = async () => {
  const [err, res] = await checkPush();
  if (err) {
    postMessage({
      type: 'error',
      message: err.msg || '网络错误，请稍候重试',
    });
  } else {
    setCookie(`${newVersionMinAppPopupCookie()}`, true, {
      expires: format.addDate(new Date(), 7, 'days'),
    });
    confirm(
      '当前小程序不是最新版，请更新<br>（更新后可以使用新功能）',
      '小程序新版本发布提醒',
      '去更新',
      true,
      true,
    ).then(action => {
      if (action == 'confirm') {
        router.push({
          path: '/bindMp',
        });
      }
    });
  }
  return Promise.resolve();
};
