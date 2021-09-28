/*
 * @Author: ADI
 * @Date: 2021-03-30 15:04:17
 * @LastEditors  : ADI
 * @LastEditTime : 2021-03-31 15:43:44
 */
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = function(str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase();
};

const list = [
  'customFiled',
  'qrTip',
  'clue',
  'classifyBubble',
  'iconVer',
  'typeBox',
  'companyList',
  'companyAllList',
  'selectListDialog',
  'selectList',
  'cardmodule',
  'previewPicture',
  'transfer',
  'classifyManager',
  'cropper',
];

console.log('list', JSON.stringify(list.map(item => hyphenate(item))));
