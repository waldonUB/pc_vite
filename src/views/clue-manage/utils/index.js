/*
 * @Description  : 线索相关的公共方法
 * @Author       : turbo
 * @Date         : 2021-06-17 11:14:48
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-13 15:15:19
 */

/**
 * @description : 获取默认的全部自定义显示字段列表
 * @author      : turbo
 * @Date        : 2021-06-07 17:26:17
 * @param        {Number} pageValue: 0 - 我的线索, 1 - 全部线索, 2 - 线索公海
 * @return       {Array}
 */
export const getFieldList = pageValue => {
  // 默认的全部自定义显示字段
  const fieldListDef = [
    {
      field: 'sexName',
      name: '性别',
      width: 120,
      isShow: false,
    },
    {
      field: 'createTimeName',
      name: '创建时间',
      width: 180,
      isShow: false,
    },
    {
      field: 'qq',
      name: 'QQ',
      width: 120,
      isShow: false,
    },
    {
      field: 'company',
      name: '公司名称',
      width: 180,
      isShow: false,
    },
    {
      field: 'industryName',
      name: '行业',
      width: 120,
      isShow: false,
    },
    {
      field: 'wxProvince',
      name: '省份',
      width: 120,
      isShow: false,
    },
    {
      field: 'wxCity',
      name: '城市',
      width: 120,
      isShow: false,
    },
    {
      field: 'county',
      name: '区县',
      width: 120,
      isShow: false,
    },
    {
      field: 'address',
      name: '地址',
      width: 180,
      isShow: false,
    },
    {
      field: 'isQualityName',
      name: '优质用户',
      width: 120,
      isShow: false,
    },
    {
      field: 'viewerLastVisitTimeName',
      sortKey: 'viewerLastVisitTime',
      name: '最近访问',
      width: 180,
      isShow: false,
    },
    {
      field: 'todayClicksName',
      name: '今日访问次数',
      width: 120,
      isShow: false,
    },
    {
      field: 'todayVisitTimeName',
      name: '今日访问时长',
      width: 120,
      isShow: false,
    },
    {
      field: 'clicksName',
      name: '文章访问次数',
      width: 120,
      isShow: false,
    },
    {
      field: 'readTimesSecondName',
      name: '文章访问时长',
      width: 120,
      isShow: false,
    },
    {
      field: 'sharesName',
      name: '文章转发次数',
      width: 120,
      isShow: false,
    },
    {
      field: 'cardClicksName',
      name: '名片访问次数',
      width: 120,
      isShow: false,
    },
    {
      field: 'cardSharesName',
      name: '名片转发次数',
      width: 120,
      isShow: false,
    },
    {
      field: 'formClicksName',
      name: '表单访问次数',
      width: 120,
      isShow: false,
    },
    {
      field: 'formSubmitName',
      name: '表单提交次数',
      width: 120,
      isShow: false,
    },
    {
      field: 'materialClicksName',
      name: '文件访问次数',
      width: 120,
      isShow: false,
    },
    {
      field: 'materialVisitTimeName',
      name: '文件访问时长',
      width: 120,
      isShow: false,
    },
    {
      field: 'sourceName',
      name: '来源',
      width: 120,
      isShow: true,
    },
    {
      field: 'staffName',
      name: '成员',
      width: 120,
      isShow: true,
    },
    {
      field: 'fromViewerName',
      name: '上级人脉',
      width: 120,
      isShow: true,
    },
    {
      field: 'wxMobile',
      name: '电话',
      width: 120,
      isShow: true,
    },
    {
      field: 'releaseReasonName',
      name: '放弃原因',
      width: 120,
      isShow: true,
    },
    {
      field: 'releaseTimeName',
      name: '放弃时间',
      width: 180,
      isShow: true,
    },
    {
      field: 'optUpdateTimeName',
      sortKey: 'optUpdateTime',
      name: '最近更新',
      width: 180,
      isShow: true,
    },
    {
      field: 'allVisitClicksName',
      sortKey: 'allVisitClicks',
      name: '总访问次数',
      width: 120,
      isShow: true,
    },
    {
      field: 'allVisitTimeName',
      sortKey: 'allVisitTime',
      name: '总访问时长',
      width: 180,
      isShow: true,
    },
    {
      field: 'receiveTimeName',
      sortKey: 'receiveTime',
      name: '获取时间',
      width: 180,
      isShow: false,
    },
    {
      field: 'intentionName',
      name: '意向度',
      width: 180,
      isShow: false,
    },
    {
      field: 'remark',
      name: '备注',
      width: 180,
      isShow: false,
    },
  ];

  return fieldListDef.filter((item, index) => {
    item.defaultSort = index + 1; // 这里会用于 ts-custom-file 组件
    if ([2].includes(pageValue)) {
      return true;
    } else {
      // 如果不是线索公海，排除掉放弃时间和放弃原因
      return !['releaseTimeName', 'releaseReasonName'].includes(item.field);
    }
  });
};
