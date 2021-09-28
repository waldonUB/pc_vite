/*
 * @Description  : 各环境域名配置
 * @Author       : turbo
 * @Date         : 2021-01-20 13:33:08
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-22 18:10:34
 */
const TSPORTAL_BASEURL = process.env.VUE_APP_BASE_URL;

const TSPORTAL_HOSTS = {
  own: 'http://i.yx.fff.com.$NAME$.faidev.cc/',
  dev: 'http://i.yx.fff.com/',
  pre: 'http://i.yx.fkw.com.faidev.cc/',
  svr: 'https://i.yx.fkw.com/',
  oem_own: 'http://st.ppp.top.$NAME$.faidev.cc/',
  oem_dev: 'http://st.ppp.top/',
  oem_pre: 'http://st.webportal.top.faidev.cc/',
  oem_svr: 'https://st.webportal.top/',
};

/**
 * @description : 获取对应环境下的域名
 * @author      : turbo
 * @Date        : 2021-02-04 11:32:15
 * @param        {Object} hosts
 * @return       {String}
 */
function getEnvHost(hosts) {
  const prefix = process.env.VUE_APP_IS_OEM === 'true' ? 'oem_' : '';

  const env = process.env.VUE_APP_INDEPENDENT_ENV ? 'own' : process.env.VUE_APP_PROJECT_ENV || 'dev';

  return hosts[prefix + env].replace(/\$NAME\$/g, process.env.VUE_APP_INDEPENDENT_ENV || '');
}

function getResHost() {
  return process.env.VUE_APP_HOST + process.env.VUE_APP_BASE_URL;
}

module.exports = {
  TSPORTAL_HOST: getEnvHost(TSPORTAL_HOSTS),
  TSPORTAL_RES_HOST: getResHost(),
  TSPORTAL_BASEURL,
};
