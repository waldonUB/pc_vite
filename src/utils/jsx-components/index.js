/*
 * @Author: ADI
 * @Date: 2021-03-29 16:49:29
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-21 10:52:00
 */

import store from '@/store';

export { loading } from './loading';
export { getGuide } from './get-guide';
export { getOpenPoup } from './get-open-poup';
export { getLoginCard } from './get-login-card';
export { versionChangePopup } from './version-change-popup';
export { newVersionMinAppPopup } from './new-version-min-app-popup';
export { getPopup } from './get-popup';
export { getPricePoup } from './get-price-poup';
export { getNewAddPoup } from './get-new-add-poup';
const getStoreState = () => store.state;

// 因为这个cookie在bindMp也需要用到因此把他暴露出来
export const newVersionMinAppPopupCookie = () => {
  `ts_newVersionMinAppPopup${getStoreState().globalData.userTicket}`;
};
