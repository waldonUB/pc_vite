/*
 * @Description  : 客户群发相关的公共方法
 * @Author       : turbo
 * @Date         : 2021-08-02 09:36:53
 * @LastEditors  : turbo
 * @LastEditTime : 2021-08-03 13:43:48
 */

// utils
import { postMessage, confirm } from '@/utils';

// api
import { wxwork } from '@/api';

/**
 * 主动提醒群发
 * @author waldon
 * @date 2020/4/10
 * @param {Number} taskId - 群发任务id
 */
export const sendMsgInform = async taskId => {
  const { sendMsgInform } = wxwork;
  const [err, res] = await sendMsgInform({ taskId });
  postMessage({
    type: err ? 'error' : 'success',
    message: err ? err.msg || '网络错误，请稍候重试' : res.msg || '已提醒',
  });
};

/**
 * 取消群发
 * @author guoyijie
 * @date 2021-03-25
 * @param {Number} taskId - 群发任务id
 */
export const cancelSend = taskId => {
  return new Promise(resolve => {
    confirm('确认取消该群发任务吗？', '删除取消').then(async () => {
      const { cancelMsgTask } = wxwork;
      const [err, res] = await cancelMsgTask({ taskId });
      postMessage({
        type: err ? 'error' : 'success',
        message: err ? err.msg || '网络错误，请稍候重试' : '已取消该群发任务',
      });
      resolve([err, res]);
    });
  });
};

/**
 * 上传前操作
 * 限制图片大小，保存上传顺序，限制上传文件的格式
 * 文件的 uid 是唯一的，根据这个来作为排序
 * @author waldon
 * @date 2020/4/10
 * @param {Object} file - 文件数据
 */
export const beforeUpload = file => {
  if (file.name?.includes('.')) {
    const fileNames = file.name.split('.');
    const suffixName = fileNames[fileNames.length - 1];
    if (!['jpg', 'jpeg', 'png', 'JPG', 'JPEG', 'PNG'].includes(suffixName)) {
      postMessage({
        type: 'error',
        message: '文件类型不符合规范，请上传jpg/jpeg/png格式的图片',
      });
      return false;
    }
    const limit2M = file.size / 1024 / 1024;
    if (limit2M > 2) {
      postMessage({
        type: 'error',
        message: '文件大小不能超过2M',
      });
      return false;
    }
  } else {
    postMessage({
      type: 'error',
      message: '文件类型不符合规范，请上传jpg/jpeg/png格式的图片',
    });
    return false;
  }
  return true;
};
