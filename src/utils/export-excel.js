/*
 * @Author       : ADI
 * @Date         : 2021-04-07 17:40:34
 * @LastEditors  : ADI
 * @LastEditTime : 2021-04-07 17:44:36
 */
/*
 * excelList: sheet data
 * downName: sheet name
 * keyJson: sheet key
 * type: export type 可选，默认xlsx
 * @param {String|Arry} headerInfo 表头信息，如果有多行信息则传数组，只有一行信息传字符串
 */
import XLSX from 'xlsx';

// 字符串转字符流
function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i !== s.length; ++i) {
    view[i] = s.charCodeAt(i) & 0xff;
  }
  return buf;
}
// 将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]。
function getCharCol(n) {
  var s = '';
  var m = 0;
  while (n > 0) {
    m = (n % 26) + 1;
    s = String.fromCharCode(m + 64) + s;
    n = (n - m) / 26;
  }
  return s;
}

export const exportExcel = function(excelList, downName, keyJson, type, headerInfo, mergesConfigArr) {
  // 如果是火狐浏览器，不支持
  // if($.browser.mozilla) {
  //     alert("该浏览器暂不支持导出功能，请使用其他浏览器（如谷歌浏览器）");
  //     return;
  // }
  var excelOption; // 参数是对象时的参数集合
  var excelArgs = Array.prototype.slice.call(arguments);

  // 参数实在是太长了，加一个参数是对象的写法...
  if (excelArgs.length <= 1) {
    excelOption = excelArgs[0];
    excelList = excelOption.excelList;
    downName = excelOption.downName;
    keyJson = excelOption.keyJson;
    type = excelOption.type;
    headerInfo = excelOption.headerInfo;
    mergesConfigArr = excelOption.mergesConfigArr;
  }

  // 从json中提取key和data
  var json = []; // 获取数据
  var keyMap = []; // 获取键
  var keyData = [{}];
  var colsWidth = []; // 表格列宽度集合
  console.log(keyJson);
  for (var k in keyJson) {
    var key = keyJson[k];
    keyMap.push(key);
    colsWidth.push({ wpx: key.length * 16 });
    keyData[0][key] = key;
  }

  excelList.forEach(function(item) {
    var excelData = {};
    for (var k in keyJson) {
      var value = item[k];
      excelData[keyJson[k]] = value;
    }

    json.push(excelData);
  });

  json = keyData.concat(json);
  var tmpdata = []; // 用来保存转换好的json

  // 表头信息
  var countNum = 0; // 列
  var mergesArr = []; // 表头合并数据
  var mergeColCount = keyMap.length - 1 > 0 ? keyMap.length - 1 : 1; // 表头合并多少列
  var rowsHeight = []; // 每行表格的高度
  if (headerInfo) {
    // 有表头信息
    if (typeof headerInfo == 'string') {
      tmpdata['A1'] = {
        // 第一行表格
        v: headerInfo,
      };
      var mergeItem = {
        // 第一行合并即可
        s: {
          // 合并开始
          c: 0, // 列
          r: 0, // 行
        },
        e: {
          // 合并结束
          c: mergeColCount, // 列
          r: 0, // 行
        },
      };
      rowsHeight.push({ hpx: 20 });
      mergesArr.push(mergeItem);
      countNum++;
    } else if (headerInfo instanceof Array) {
      headerInfo.map(val => {
        var mergeItem = {
          s: {
            // 合并开始
            c: 0, // 列
            r: countNum, // 行
          },
          e: {
            // 合并结束
            c: mergeColCount, // 列
            r: countNum, // 行
          },
        };
        mergesArr.push(mergeItem);
        rowsHeight.push({ hpx: 20 });
        countNum++;
        tmpdata['A' + countNum] = {
          // 从第一行表格开始依次每行排下去
          v: val,
        };
      });
    }
  }

  if (mergesConfigArr && mergesConfigArr.length >= 0) {
    mergesArr = mergesArr.concat(mergesConfigArr);
    console.log('mergesArr-------------->', mergesArr);
  }

  json
    .map((v, i) =>
      keyMap.map((k, j) =>
        Object.assign(
          {},
          {
            v: v[k],
            position: (j > 25 ? getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1 + countNum),
          },
        ),
      ),
    )
    .reduce((prev, next) => prev.concat(next))
    .forEach(function(v) {
      tmpdata[v.position] = {
        v: v.v,
      };
    });

  var outputPos = Object.keys(tmpdata); // 设置区域,比如表格从A1到D10

  var tmpWB = {
    SheetNames: ['mySheet'], // 保存的表标题
    Sheets: {
      mySheet: Object.assign(
        {},
        tmpdata, // 内容
        {
          '!merges': mergesArr, // 合并区域
          '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1], // 设置填充区域
          '!rows': rowsHeight, // 表头行高度
          '!cols': colsWidth, // 列宽度
        },
      ),
    },
  };
  var tmpDown = new Blob(
    [
      s2ab(
        XLSX.write(
          tmpWB,
          { bookType: type === undefined ? 'xlsx' : type, bookSST: false, type: 'binary' }, // 这里的数据是用来定义导出的格式类型
        ),
      ),
    ],
    {
      type: '',
    },
  ); // 创建二进制对象写入转换好的字节流
  var href = URL.createObjectURL(tmpDown); // 创建对象超链接

  var outFile = document.createElement('a');
  outFile.download = downName + '.xlsx'; // 下载名称
  outFile.href = href; // 绑定a标签
  outFile.click(); // 模拟点击实现下载
  setTimeout(function() {
    // 延时释放
    URL.revokeObjectURL(tmpDown); // 用URL.revokeObjectURL()来释放这个object URL
  }, 100);
};
