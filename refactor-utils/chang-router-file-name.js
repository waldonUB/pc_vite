/*
 * @Author: ADI
 * @Date: 2021-03-24 10:47:03
 * @LastEditors  : ADI
 * @LastEditTime : 2021-04-01 11:25:07
 */
const fse = require('fs-extra');
const path = require('path');
const lodash = require('lodash');
const resolvePath = (...dirs) => path.resolve(__dirname, ...dirs);

const componentsGlobalDirPath = '../src/views';

function changeFileName(path = componentsGlobalDirPath) {
  fse.readdir(resolvePath(path), (err, fileNames) => {
    if (err) {
      console.log('err', err);
      return;
    }
    fileNames.forEach(fileName => {
      const [name, suffix = ''] = fileName.split('.');
      const kebabCaseName = lodash.kebabCase(name) + (suffix ? `.${suffix}` : '');
      const filePath = resolvePath(path, fileName);
      const newDirNamePath = resolvePath(path, kebabCaseName);
      console.log('kebabCaseName', kebabCaseName);
      fse.renameSync(filePath, newDirNamePath);
      fse.stat(newDirNamePath).then(flag => {
        if (flag.isDirectory()) {
          changeFileName(newDirNamePath);
        }
      });
    });
  });
}
changeFileName();
