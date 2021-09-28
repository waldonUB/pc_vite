/*
 * @Author: ADI
 * @Date: 2021-03-24 10:47:03
 * @LastEditors: ADI
 * @LastEditTime: 2021-03-25 16:55:40
 */
const fs = require('fs');
const path = require('path');
const resolvePath = (...dirs) => path.resolve(__dirname, ...dirs);
const componentsGlobalDirPath = './src/components-global';
fs.readdir(resolvePath(componentsGlobalDirPath), (err, fileNames) => {
  if (err) {
    console.log('err', err);
    return;
  }
  fileNames.forEach(fileName => {
    const filePath = resolvePath(componentsGlobalDirPath, fileName);
    // console.log(`filePath`, filePath);
    fs.stat(filePath, (err, stat) => {
      if (err) {
        console.log('err', err);
        return;
      }
      if (stat.isDirectory()) {
        const reg = /tanshu-(\w+)/;
        if (!reg.test(fileName)) {
          // console.log(`不是目标文件夹`, fileName);
          return;
        }
        const newDirName = fileName.replace(reg, 'ts-$1');
        const newDirNamePath = resolvePath(componentsGlobalDirPath, newDirName);
        console.log('newDirNamePath', newDirNamePath);
        fs.renameSync(filePath, newDirNamePath);
      }
    });
  });
  // console.log(`dirs`, dirs);
});
