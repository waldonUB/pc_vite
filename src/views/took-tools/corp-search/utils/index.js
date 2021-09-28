/*
 * @Author       : ADI
 * @Date         : 2021-05-26 16:03:37
 * @LastEditors  : ADI
 * @LastEditTime : 2021-05-26 16:03:37
 */
export const newFiledList = () => {
  return [
    {
      field: 'acctName',
      name: '企业名称',
      width: 220,
    },
    {
      field: 'legalRep',
      name: '法人',
      width: 120,
    },
    {
      field: 'phone',
      name: '电话',
      width: 120,
    },
    {
      field: 'email',
      name: '邮箱',
      width: 180,
    },
    {
      field: 'industry',
      name: '行业',
      width: 120,
    },
    {
      field: 'businessScope',
      name: '经营范围',
      width: 180,
    },
    {
      field: 'districtAllName',
      name: '省/市/区',
      width: 180,
      isShow: false,
      defaultSort: 7, // 用于所有字段的初始排序
    },
    {
      field: 'startDate',
      name: '成立时间',
      width: 120,
    },
    {
      field: 'regFund',
      name: '注册资本',
      width: 120,
    },
  ];
};
