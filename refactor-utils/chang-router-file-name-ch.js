/*
 * @Author: ADI
 * @Date: 2021-03-24 10:47:03
 * @LastEditors  : ADI
 * @LastEditTime : 2021-05-20 10:53:35
 */
const fse = require('fs-extra');
const path = require('path');
const lodash = require('lodash');
const resolvePath = (...dirs) => path.resolve(__dirname, ...dirs);

const componentsGlobalDirPath = '../src/views';

async function isDir(path) {
  return await fse.stat(path).then(flag => {
    return flag.isDirectory();
  });
}

async function moveToDir(filePath, dirPath, fileStr) {
  if (await isDir(filePath)) {
    return;
  }
  fse.readFile(filePath).then(file => {
    fse.mkdir(dirPath).then(d => {
      fse
        .rename(filePath, resolvePath(dirPath, 'index.vue'))
        .then(f => console.log(`${fileStr}:success`))
        .catch(e => console.log(`${fileStr}:err`));
    });
  });
}

function changeFileName(path = componentsGlobalDirPath) {
  fse
    .readdir(resolvePath(path))
    .then(dirNames => {
      dirNames.forEach(dirName => {
        const fileDirPath = resolvePath(path, dirName);
        fse.readdir(fileDirPath).then(res => {
          res.forEach(fileStr => {
            moveToDir(resolvePath(fileDirPath, fileStr), resolvePath(fileDirPath, fileStr.split('.')[0]), fileStr);
          });
        });
      });
    })
    .catch(err => {
      console.log('err', err);
      return;
    });
}
changeFileName();
