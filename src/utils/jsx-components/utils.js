/*
 * @Author       : ADI
 * @Date         : 2021-04-14 14:00:27
 * @LastEditors  : ADI
 * @LastEditTime : 2021-04-14 14:00:44
 */
// 销毁实例
export const destroyInstance = instance => {
  instance && instance.$destroy();
  instance?.$el && instance.$el.remove();
};
