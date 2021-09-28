/*
 * @Author       : ADI
 * @Date         : 2021-05-13 14:44:55
 * @LastEditors  : ADI
 * @LastEditTime : 2021-05-13 14:51:30
 */
import { FdpLog, logDog } from '@/utils';

/**
 *链接跳转
 *
 * @author guoyijie
 * @date 2020-04-27
 * @param {*} type
 */
export function toURL(type, _logDog) {
  const btnText = new Map([
    ['qiyuChatUrl', '在线咨询'],
    ['functionalSuggestionUrl', '在线咨询'],
    ['portalHelpUrl', '帮助中心'],
    ['allianceUrl', '代理咨询'],
  ]);
  const fdpText = btnText.get(type);
  if (fdpText) {
    FdpLog('yx_portal_topservice_click', {
      yx_free_text_0: fdpText,
    });
  }
  if (_logDog) {
    logDog(_logDog, true).then(() => {
      window.open(this.addressUrl[type], '_blank');
    });
  } else {
    window.open(this.addressUrl[type], '_blank');
  }
}
