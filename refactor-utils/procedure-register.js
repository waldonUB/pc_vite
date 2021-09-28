/*
 * @Author       : ADI
 * @Date         : 2021-03-30 16:19:12
 * @LastEditors  : ADI
 * @LastEditTime : 2021-04-02 14:06:04
 */
const fs = require('fs');
const path = require('path');
const lodash = require('lodash');
const { info } = require('console');
const resolvePath = (...dirs) => path.resolve(__dirname, ...dirs);
const componentsBaseDirPath = '../src/components/base';
fs.readdir(resolvePath(componentsBaseDirPath), (err, fileNames) => {
  if (err) {
    console.log('err', err);
    return;
  }
  fileNames.forEach(fileName => {
    const filePath = resolvePath(componentsBaseDirPath, fileName);
    // console.log(`filePath`, filePath);
    fs.stat(filePath, (err, stat) => {
      if (err) {
        console.log('err', err);
        return;
      }
      if (stat.isDirectory()) {
        const componentName = lodash.camelCase(fileName);
        const str = `import ${componentName} from '@/components/base/${fileName}';`;
        console.log(str);
      }
    });
  });
});
