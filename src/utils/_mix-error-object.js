/*
  后续要迁移为 antd form rule
 * @Author       : ADI
 * @Date         : 2021-04-01 14:41:13
 * @LastEditors  : ADI
 * @LastEditTime : 2021-04-01 14:46:11
 */
import { postMessage } from '@/utils';

export const mixErrorObject = function() {
  var addErrorToList = function(isErr, key, data, list) {
    var returnIndex = -1;
    list.forEach((arrayData, index) => {
      if (arrayData.key == key) {
        returnIndex = index;
        return false;
      }
    });
    if (isErr) {
      var operateData = Object.assign(
        {},
        {
          key: key,
        },
        data,
      );
      if (returnIndex < 0) {
        list.push(operateData);
      } else {
        list.splice(returnIndex, 1, operateData);
      }
    } else {
      if (returnIndex >= 0) {
        list.splice(returnIndex, 1);
      }
    }
  };
  return {
    methods: {
      //focus的时候或者click的时候（自定义的select组件），将错误隐藏
      tanshu_hideError: function(hideErr, key) {
        if (!this.tanshu_firstSubmit) {
          addErrorToList(hideErr, key, null, this.tanshu_checkHideList);
        }
      },
      //添加错误回调
      tanshu_errorSubmit: function(haveErr, key, data) {
        addErrorToList(haveErr, key, data, this.tanshu_saveErrList);
      },
      //检查是否有错误
      tanshu_checkCanSubmit: function(hasMoreErr) {
        this.tanshu_firstSubmit = false;
        ++this.tanshu_submitCount;
        if (this.tanshu_saveErrList.length > 0) {
          if (!this.tanshu_firstShowTips) {
            if (this.tanshu_saveErrList[0].topTips != '' && this.tanshu_saveErrList[0].topTips != undefined) {
              postMessage({
                type: 'error',
                message:
                  this.tanshu_saveErrList.length == 1 && !hasMoreErr
                    ? this.tanshu_saveErrList[0].topTips
                    : '提交失败，请修改后重试',
              });
            }
          }
          this.tanshu_firstShowTips = true;
          return false;
        }
        return true;
      },
      tanshu_removeCheckErr: function() {
        this.tanshu_firstSubmit = true;
        this.tanshu_saveErrList = [];
        this.tanshu_checkHideList = [];
        // ++this.tanshu_submitCount;
      },
    },
    data() {
      return {
        tanshu_submitCount: 0, //标记检查次数
        tanshu_saveErrList: [], //错误保存的数组
        tanshu_checkHideList: [], //暂时触发的隐藏错误数组
        tanshu_firstSubmit: true, //是否第一次提交
        tanshu_firstShowTips: false, //此次错误是否是第一次出现
      };
    },
    computed: {
      //return false  表示当前有错且正在检查，true表示隐藏错误.
      tanshu_checkButtonStatus: function() {
        if (this.tanshu_firstSubmit) {
          return true;
        }
        let hasHideKey = 0;
        const checkHideList = this.tanshu_checkHideList;
        this.tanshu_saveErrList.map((value, key) => {
          checkHideList.map((v, k) => {
            if (value.key == v.key) {
              hasHideKey++;
              return false;
            }
          });
        });
        const isHide = hasHideKey == this.tanshu_saveErrList.length;
        if (isHide) {
          this.tanshu_firstShowTips = false;
        } else {
          this.tanshu_firstShowTips = true;
        }
        return isHide;
      },
    },
  };
};
