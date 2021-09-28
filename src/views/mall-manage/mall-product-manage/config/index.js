/*
 * @Author       : ADI
 * @Date         : 2021-08-04 10:12:23
 * @LastEditors  : ADI
 * @LastEditTime : 2021-08-03 17:36:19
 */

// 商品管理
export const optionInitConfig = () => {
  // 因为这里要加上一些变化的自定义字段, 后续会改成在接口拿
  return [
    {
      field: 'name',
      name: '商品名称',
      width: 300,
      isShow: true,
      defaultSort: 1, // 用于所有字段的初始排序
    },
    {
      field: 'price',
      name: '价格',
      width: 100,
      isShow: true,
      defaultSort: 2, // 用于所有字段的初始排序
    },
    {
      field: 'sourceName',
      name: '来源',
      width: 100,
      isShow: true,
      defaultSort: 3, // 用于所有字段的初始排序
    },
    {
      field: 'clickViewersName',
      name: '浏览人数',
      width: 100,
      isShow: true,
      defaultSort: 4, // 用于所有字段的初始排序
    },
    {
      field: 'selfStatus',
      name: '上架状态',
      width: 100,
      isShow: true,
      defaultSort: 5, // 用于所有字段的初始排序
    },
    {
      field: 'pubStatus',
      name: '发布状态',
      width: 100,
      isShow: true,
      defaultSort: 6, // 用于所有字段的初始排序
    },
  ];
};
