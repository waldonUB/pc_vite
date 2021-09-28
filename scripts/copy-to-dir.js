/*
 * @Description  : 复制打包成功后dist目录下的文件到各环境域名下对应的目录
 * @Author       : turbo
 * @Date         : 2021-01-26 17:04:29
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-23 09:55:15
 */

require('colors');
const path = require('path');
const fs = require('fs-extra');

const targetWeb = path.resolve('../../web/tsportal/web/newVersion');
const targetRes = path.resolve('../../web/tsportal/res');
const originDir = path.resolve(__dirname, '../dist/');
const resourcePath = ['js/newVersion', 'image/newVersion', 'css/newVersion'];

const print = {
  info(...args) {
    console.log(' INFO '.bgBlue.black, ...args);
  },
  done(...args) {
    console.log(' DONE '.bgGreen.black, ...args);
  },
  error(...args) {
    console.log(' ERROR '.bgRed.black, ...args);
  },
  warning(...args) {
    console.log(' WARNING '.bgYellow.black, ...args);
  },
};

/**
 * @description : 清除res目标目录下的资源文件
 * @author      : turbo
 * @Date        : 2021-02-04 11:41:40
 * @return       {*} undefined
 */
function cleanup() {
  print.info(`Starting cleanup path "${path.join(targetRes, '*/newVersion/')}".`);
  cleanup.time = Date.now();

  return Promise.all(
    resourcePath.map(dir => {
      return fs.emptyDir(path.join(targetRes, dir));
    }),
  ).then(() => {
    print.done(`Cleanup successfully in ${Date.now() - cleanup.time}ms!\n`);
  });
}

/**
 * @description : 复制dist目录下的文件到指定的目录
 * @author      : turbo
 * @Date        : 2021-02-04 11:45:01
 * @return       {*} undefined
 */
function copy() {
  print.info(`Starting copy path "${path.join(originDir, '*/newVersion/')}".`);
  copy.time = Date.now();

  return Promise.all([
    fs.copy(path.join(originDir, 'index.jsp'), path.join(targetWeb, 'index.jsp')),
    ...resourcePath.map(dir => {
      return fs.copy(path.join(originDir, dir), path.join(targetRes, dir));
    }),
  ]).then(() => {
    print.done(`Copy successfully in ${Date.now() - copy.time}ms!\n`);
  });
}

if (!fs.pathExistsSync(targetWeb)) return print.error(`The path "${targetWeb}" does not exist!\n`);
if (!fs.pathExistsSync(targetRes)) return print.error(`The path "${targetRes}" does not exist!\n`);

console.log('');
cleanup()
  .then(copy)
  .catch(error => {
    console.log('');
    print.error(error.message || error);
    console.error(error);
    process.exit(1);
  });
