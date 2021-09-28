/*
 * @Author       : ADI
 * @Date         : 2021-07-06 14:35:16
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-06 14:35:56
 */
export const verfifyDefault = {
  publish: {
    value: 0,
    describe: '已经发布',
  },
  success: {
    value: 1,
    describe: '审核通过',
  },
  verfifIng: {
    value: 2,
    describe: '审核中',
  },
  verfuifyFail: {
    value: 3,
    describe: '审核不通过',
  },
};

/**
 *获取当前状态
 * @param {*} judgeData
 * @returns
 */
export const getVerifyStatus = judgeData => {
  if (judgeData.codeStatus == 7 || judgeData.codeStatus == 4) {
    return verfifyDefault.verfuifyFail.value;
  }
  if (judgeData.appStatus == 1) {
    return verfifyDefault.publish.value;
  } else {
    if (judgeData.appStatus == 0 && judgeData.codeStatus == 3) {
      return verfifyDefault.success.value;
    } else if (judgeData.appStatus == 0 && (judgeData.codeStatus == 7 || judgeData.codeStatus == 4)) {
      return verfifyDefault.verfuifyFail.value;
    }
    return verfifyDefault.verfifIng.value;
  }
};
