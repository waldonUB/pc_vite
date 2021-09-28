/*
 * @Author: ADI
 * @Date: 2021-03-22 15:59:31
 * @LastEditors: ADI
 * @LastEditTime: 2021-03-23 14:08:40
 */
const logListConfig = {
  isOem: {
    hotArticle: {
      dogId: 100029,
      srcId: 2,
    }, // 文章中心 - 切换到行业热文
    companyArticle: {
      dogId: 100029,
      srcId: 3,
    }, // 文章中心 - 切换到企业文库
    showVisitCardClone: {
      dogId: 100029,
      srcId: 7,
    }, // 名片克隆访问量
    showFunctionSetting: {
      dogId: 100029,
      srcId: 8,
    }, // 功能设置访问量
    addArticleModel: {
      dogId: 100029,
      srcId: 10,
    }, // 文库模板制作
    linkTransition: {
      dogId: 100029,
      srcId: 11,
    }, // 文库模板制作 - 链接转化
    data_companyArticle: {
      dogId: 100029,
      srcId: 1001,
    }, // 素材中心 - 企业文库 - 数据
    edit_companyArticle: {
      dogId: 100029,
      srcId: 1002,
    }, // 素材中心 - 企业文库 - 编辑
    closeArticle: {
      dogId: 100029,
      srcId: 1003,
    }, // 素材中心 - 企业文库 - 关闭
    deleteArticle: {
      dogId: 100029,
      srcId: 1004,
    }, // 素材中心 - 企业文库 - 删除
    showClassifyManager: {
      dogId: 100029,
      srcId: 1005,
    }, // 显示企业文库管理分类页面
    addArticleType: {
      dogId: 100029,
      srcId: 1006,
    }, // 企业中心 - 新增分类
    openMall: {
      dogId: 100029,
      srcId: 1007,
    }, // 商城授权页面曝光数
    authMallStep_1: {
      dogId: 100029,
      srcId: 1008,
    }, // 商城授权 - 第一步曝光
    authMallStep_2: {
      dogId: 100029,
      srcId: 1009,
    }, // 商城授权 - 第二步曝光
    authMallStep_3: {
      dogId: 100029,
      srcId: 1010,
    }, // 商城授权 - 第三步曝光
    showBindMall: {
      dogId: 100029,
      srcId: 1011,
    }, // 商城页面曝光用户数
    toUpGrade_up: {
      dogId: 100029,
      srcId: 1101,
    }, // 立即升级
    toUpGrade_continue: {
      dogId: 100029,
      srcId: 1102,
    }, // 立即续费
    articleModel_nextStep: {
      dogId: 100029,
      srcId: 1111,
    }, // 素材中心 - 文章模板制作 - 下一步
    articleModel_cancel: {
      dogId: 100029,
      srcId: 1112,
    }, // 素材中心 - 文章模板制作 - 取消
    articleModel_lastStep: {
      dogId: 100029,
      srcId: 1113,
    }, // 素材中心 - 文章模板制作 - 上一步
    //    'articleModel_addModel': { dogId:100029,srcId: 1114 }, // 素材中心 - 文章模板制作 - 保存到企业文库 健哥在后端在后端加上了
    edit_productArticle: {
      dogId: 100029,
      srcId: 1121,
    }, // 素材中心 - 产品素材 - 编辑
    data_productArticle: {
      dogId: 100029,
      srcId: 1122,
    }, // 素材中心 - 产品素材 - 数据
    articleMaterial_shareBtn: {
      dogId: 100029,
      srcId: 1123,
    }, // PC-素材中心-企业文库-分享点击
    edit_HotArticle: {
      dogId: 100029,
      srcId: 1131,
    }, // 素材中心 - 行业热文 - 编辑
    data_hotArticle: {
      dogId: 100029,
      srcId: 1132,
    }, // 素材中心 - 行业热文 - 数据
    //    'onTransition': { dogId:100029,srcId: 1133 },  // 链接转化成功
    dataCenter_articleDetail: {
      dogId: 100029,
      srcId: 1241,
    }, // 数据中心 - 文章数据 - 详情
    dataCenter_closeArticle: {
      dogId: 100029,
      srcId: 1251,
    }, // 数据中心 - 销售员数据 - 关闭文章
    data_staffData: {
      dogId: 100029,
      srcId: 1252,
    }, // 数据中心 - 销售员数据 - 数据
    dataCenter_deleteArticle: {
      dogId: 100029,
      srcId: 1253,
    }, // 数据中心 - 销售员数据 - 删除
    dataCenter_showDataInfo: {
      dogId: 100029,
      srcId: 1261,
    }, // 数据中心 - 访客数据 - 详情
    addTsCardClone: {
      dogId: 100029,
      srcId: 1271,
    }, // 克隆成功
    closeQualityViewer: {
      dogId: 100029,
      srcId: 1281,
    }, // 关闭精准用户定义
    openQualityViewer: {
      dogId: 100029,
      srcId: 1282,
    }, // 开启精准用户定义
    publicSettingClose: {
      dogId: 100029,
      srcId: 1283,
    }, // 关闭公众号提醒
    publicSettingOpen: {
      dogId: 100029,
      srcId: 1284,
    }, // 开启公众号提醒
    libraryFormClose: {
      dogId: 100029,
      srcId: 1285,
    }, // 关闭不可见文章
    libraryFormOpen: {
      dogId: 100029,
      srcId: 1286,
    }, // 开启不可见文章
    showConsumeRecode: {
      dogId: 100029,
      srcId: 1301,
    }, // 消费访问量
    showOrderCheck: {
      dogId: 100029,
      srcId: 1302,
    }, // 订单审批访问量
    orderCheckIn: {
      dogId: 100029,
      srcId: 1303,
    }, // 订单审批 - 点击订单录入
    showCommisionRecord: {
      dogId: 100029,
      srcId: 1304,
    }, // 佣金记录访问量
    showProductManage: {
      dogId: 100029,
      srcId: 1305,
    }, // 产品管理访问量
    productManage_newAdd: {
      dogId: 100029,
      srcId: 1306,
    }, // 产品管理 - 点击产品录入
    showCompanyManage: {
      dogId: 100029,
      srcId: 1307,
    }, // 公司管理访问量
    newAddcomm: {
      dogId: 100029,
      srcId: 1308,
    }, // 公司管理 - 点击添加公司
    showEmployeeMange: {
      dogId: 100029,
      srcId: 1311,
    }, // 权限中心 - 员工管理
    newAddEmpoyee: {
      dogId: 100029,
      srcId: 1312,
    }, // 权限中心 - 添加员工
    addEmployee: {
      dogId: 100029,
      srcId: 1313,
    }, // 权限中心 - 员工管理 - 成功添加
    employee_unbindWX: {
      dogId: 100029,
      srcId: 1314,
    }, // 权限中心 - 解绑小程序
    employee_editAccount: {
      dogId: 100029,
      srcId: 1315,
    }, // 权限中心 - 编辑
    employee_delete: {
      dogId: 100029,
      srcId: 1316,
    }, // 权限中心 - 删除
    showChangePW: {
      dogId: 100029,
      srcId: 1317,
    }, // 修改密码访问量
    changePw_savePwd: {
      dogId: 100029,
      srcId: 1318,
    }, // 修改密码 - 保存成功
    help_click: {
      dogId: 100029,
      srcId: 9,
    }, // 跳转到帮助中心
    product_setting: {
      dogId: 100029,
      srcId: 1026,
    }, // 商城设置曝光数量
    product_H5_open: {
      dogId: 100029,
      srcId: 1017,
    }, // 开通手机微商城数量
    product_H5_close: {
      dogId: 100029,
      srcId: 1018,
    }, // 关闭手机微商城数量
    product_App_open: {
      dogId: 100029,
      srcId: 1019,
    }, // 开通小程序商城数量
    product_App_close: {
      dogId: 100029,
      srcId: 1020,
    }, // 关闭小程序商城数量
    //首页数据统计
    expose_home: {
      dogId: 100041,
      srcId: 0,
    }, //首页-访问量
    home_clickSearch: {
      dogId: 100041,
      srcId: 1,
    }, //首页-工作台-搜索按钮-点击量
    indexBType_clue: {
      dogId: 100041,
      srcId: 2,
    }, // 首页-数据概况-获取线索-点击量
    home_clickArticleCard: {
      dogId: 100041,
      srcId: 10,
    }, //首页-常用功能-H5文章获客卡片-点击量
    home_clickGetCustom: {
      dogId: 100041,
      srcId: 11,
    }, //首页-常用功能-智能名片获客卡片-点击量
    homeBtype_file: {
      dogId: 100041,
      srcId: 12,
    }, // 首页-文件获客卡片-点击量
    home_clickForm: {
      dogId: 100041,
      srcId: 13,
    }, // 首页-常用功能-企业表单卡片-点击量
    home_clickPoster: {
      dogId: 100041,
      srcId: 14,
    }, // 首页-海报获客卡片-点击量
    home_clickMall: {
      dogId: 100041,
      srcId: 20,
    }, //首页-更多功能-我的商城卡片-点击量
    home_clickManageCustom: {
      dogId: 100041,
      srcId: 21,
    }, //首页-更多功能-客户管理卡片-点击量
    home_clickSale: {
      dogId: 100041,
      srcId: 22,
    }, //首页-更多功能-全民营销卡片-点击量
    home_clickSearchMoney: {
      dogId: 100041,
      srcId: 23,
    }, //首页-更多功能-商机雷达卡片-点击量
    home_clickAuthorizeWX: {
      dogId: 100041,
      srcId: 24,
    }, //首页-更多功能-微信授权卡片-点击量
    home_clickDataCenter: {
      dogId: 100041,
      srcId: 25,
    }, //首页-更多功能-数据中心卡片-点击量
    home_clickWxWork: {
      dogId: 100041,
      srcId: 26,
    }, // 首页-企微助手卡片-点击量
    home_clickMoreActive: {}, //首页-最新动态-更多动态-点击量
    home_clickAdd: {}, //首页-最新动态-广告图-点击量
    home_clickArticleTitle: {}, //首页-最新动态-文章标题-总点击量
    home_clickMoreArticle: {
      dogId: 100041,
      srcId: 40,
    }, //首页-常见问题-查看更多-点击量
    home_clickAllArticle: {
      dogId: 100041,
      srcId: 41,
    }, //首页-常见问题-文章标题-总点击量
    home_exposeFreeCard: {
      dogId: 100041,
      srcId: 50,
    }, //首页-免费版版本卡片-曝光量
    home_clickFreeCard: {
      dogId: 100041,
      srcId: 51,
    }, //首页-免费版版本卡片-点击量
    home_shareArticle: {
      dogId: 100041,
      srcId: 60,
    }, // 首页-行业热文-立即分享-总点击量
    home_lookMoreArticle: {
      dogId: 100041,
      srcId: 61,
    }, // 首页-行业热文-更多-点击量
    mp_authFail_show: {
      dogId: 100047,
      srcId: 0,
    }, //公众号-失败页面曝光数量
    mp_authFail_guide: {
      dogId: 100047,
      srcId: 1,
    }, //公众号-查看指引-点击数量
    mp_auth_show: {
      dogId: 100047,
      srcId: 2,
    }, //公众号-授权页面曝光数量
    mp_authGuide_click: {
      dogId: 100047,
      srcId: 4,
    }, //公众号-授权前查看指引-点击数量
    app_openFail_show: {
      dogId: 100047,
      srcId: 5,
    }, //小程序-失败页面曝光数量(开放平台未授权)
    app_openGuide_click: {
      dogId: 100047,
      srcId: 6,
    }, //小程序-查看指引-点击数量(开放平台未授权)
    app_otherFail_show: {
      dogId: 100047,
      srcId: 7,
    }, //小程序-失败页面曝光数量(绑定其他小程序)
    app_otherGuide_click: {
      dogId: 100047,
      srcId: 8,
    }, //小程序-查看指引-点击数量(绑定其他小程序)
    oversea_Fail_show: {
      dogId: 100047,
      srcId: 9,
    }, //开发平台-失败页面曝光数量(境外小程序)
    oversea_Guide_click: {
      dogId: 100047,
      srcId: 10,
    }, //开发平台-查看指引-点击数量(境外小程序)
    app_auth_show: {
      dogId: 100047,
      srcId: 11,
    }, //小程序-授权页面曝光数量
    app_authGuide_click: {
      dogId: 100047,
      srcId: 12,
    }, //小程序-授权前查看指引-点击数量
    show_FormMangage: {
      dogId: 100056,
      srcId: 1,
    }, // 企业表单-页面访问量
    form_addFormModel: {
      dogId: 100056,
      srcId: 2,
    }, // 企业表单-创建表单模板-按钮点击量
    form_lookData: {
      dogId: 100056,
      srcId: 3,
    }, // 企业表单-数据-点击量
    form_editForm: {
      dogId: 100056,
      srcId: 4,
    }, // 企业表单-编辑-点击量
    form_changeStatus: {
      dogId: 100056,
      srcId: 5,
    }, // 企业表单-开启/关闭-点击量
    form_delete: {
      dogId: 100056,
      srcId: 6,
    }, // 企业表单-删除-点击量
    form_saveModel: {
      dogId: 100056,
      srcId: 10,
    }, // 创建表单模板-成功保存量
    formData_show: {
      dogId: 100056,
      srcId: 100,
    }, // 表单数据-页面访问量
    form_showDataInfo: {
      dogId: 100056,
      srcId: 101,
    }, // 表单数据-详情-点击量
    customPay_show: {
      dogId: 100060,
      srcId: 3,
    }, //客户付费分析-曝光
    customPayDetail_show: {
      dogId: 100060,
      srcId: 4,
    }, //客户付费详情-曝光
    productPay_show: {
      dogId: 100060,
      srcId: 5,
    }, //商品付费分析-曝光
    show_customList: {
      dogId: 100090,
      srcId: 1,
    }, // 客户列表页-曝光量
    customList_showDetailDialog: {
      dogId: 100090,
      srcId: 2,
    }, // 客户按钮-点击量
    customList_editRecord: {
      dogId: 100090,
      srcId: 3,
    }, // 编辑按钮-点击量
    customList_isDetail: {
      dogId: 100090,
      srcId: 4,
    }, // 详情按钮-点击量
    customList_addFollow: {
      dogId: 100090,
      srcId: 5,
    }, // 写跟进按钮-点击量
    customList_phone: {
      dogId: 100090,
      srcId: 6,
    }, // 搜索框-点击量
    customList_showTagDialog: {
      dogId: 100090,
      srcId: 7,
    }, // 筛选项-标签-点击量
    customList_intention: {
      dogId: 100090,
      srcId: 8,
    }, // 筛选项-意向度-点击量
    customList_followStatus: {
      dogId: 100090,
      srcId: 9,
    }, // 筛选项-跟进情况-点击量
    customList_isVisitsArticle: {
      dogId: 100090,
      srcId: 10,
    }, // 筛选项-是否访问过文章-点击量
    customList_isVisitsCard: {
      dogId: 100090,
      srcId: 11,
    }, // 筛选项-是否访问过名片-点击量
    customList_workList: {
      dogId: 100090,
      srcId: 12,
    }, // 筛选项-销售员-点击量
    customList_onExportExcel: {
      dogId: 100090,
      srcId: 13,
    }, // 导出excel按钮-点击量
    customList_newAddCustom: {
      dogId: 100090,
      srcId: 14,
    }, // 客户录入按钮点击量
    show_customerDetailDialog: {
      dogId: 100090,
      srcId: 15,
    }, // 客户详情页-曝光量
    customerDetailDialog_editCustom: {
      dogId: 100090,
      srcId: 16,
    }, // 编辑按钮-点击量
    customList_changeCustomerTab1: {
      dogId: 100090,
      srcId: 17,
    }, // 客户信息tab页-曝光量
    customList_changeCustomerTab2: {
      dogId: 100090,
      srcId: 18,
    }, // 互动动态tab页-曝光量
    customList_changeCustomerTab3: {
      dogId: 100090,
      srcId: 19,
    }, // 跟进记录tab页-曝光量
    customerDetailDialog_showTagSelectDialog: {
      dogId: 100090,
      srcId: 20,
    }, // 新增/修改标签按钮-点击量
    customList_goPrePage: {
      dogId: 100090,
      srcId: 21,
    }, // 上一个按钮-点击量
    customList_goNextPage: {
      dogId: 100090,
      srcId: 22,
    }, // 下一个按钮-点击量
    customList_changeCustomerTab3_click: {
      dogId: 100090,
      srcId: 29,
    }, // 跟进状态按钮-点击量
    customList_intentionNew: {
      dogId: 100090,
      srcId: 30,
    }, // 意向度按钮-点击量
    customList_visitsTimeNew: {
      dogId: 100090,
      srcId: 31,
    }, // 下次跟进时间按钮-点击量
    customList_Time1: {
      dogId: 100090,
      srcId: 32,
    }, // 下次跟进时间-1天后按钮-点击量
    customList_Time2: {
      dogId: 100090,
      srcId: 33,
    }, // 下次跟进时间-3天后按钮-点击量
    customList_Time3: {
      dogId: 100090,
      srcId: 34,
    }, // 下次跟进时间-7天后按钮-点击量
    customList_Time4: {
      dogId: 100090,
      srcId: 35,
    }, // 下次跟进时间-15天后按钮-点击量
    customerDetailDialog_changeDate: {
      dogId: 100090,
      srcId: 36,
    }, // 下次跟进时间-自定义时间-点击量
    customList_addTsClientVisits: {
      dogId: 100090,
      srcId: 37,
    }, // 添加跟进-按钮-点击量
    show_customOperate: {
      dogId: 100090,
      srcId: 38,
    }, // 录入页-曝光量
    customOperate_addEmployee: {
      dogId: 100090,
      srcId: 39,
    }, // 成功录入客户数量
    customOperate_contacts: {
      dogId: 100090,
      srcId: 40,
    }, // 姓名-点击量
    customOperate_changeSex: {
      dogId: 100090,
      srcId: 41,
    }, // 性别-点击量
    customOperate_phone: {
      dogId: 100090,
      srcId: 42,
    }, // 手机-点击量
    customOperate_wx: {
      dogId: 100090,
      srcId: 43,
    }, // 微信-点击量
    customOperate_birthday: {
      dogId: 100090,
      srcId: 44,
    }, // 生日-点击量
    customOperate_qq: {
      dogId: 100090,
      srcId: 45,
    }, // QQ-点击量
    customOperate_idCard: {
      dogId: 100090,
      srcId: 46,
    }, // 证件号码-点击量
    customOperate_remark: {
      dogId: 100090,
      srcId: 47,
    }, // 备注-点击量
    customOperate_corpName: {
      dogId: 100090,
      srcId: 48,
    }, // 企业名称-点击量
    customOperate_industry: {
      dogId: 100090,
      srcId: 49,
    }, // 行业-点击量
    customOperate_province: {
      dogId: 100090,
      srcId: 50,
    }, // 省份-点击量
    customOperate_city: {
      dogId: 100090,
      srcId: 51,
    }, // 城市-点击量
    customOperate_address: {
      dogId: 100090,
      srcId: 52,
    }, // 地址-点击量
    customOperate_source: {
      dogId: 100090,
      srcId: 53,
    }, // 来源-点击量
    customOperate_showTagSelectDialog: {
      dogId: 100090,
      srcId: 54,
    }, // 选择标签-点击量
    customOperate_tagManage: {
      dogId: 100090,
      srcId: 55,
    }, // 标签管理-点击量
    customOperate_worker: {
      dogId: 100090,
      srcId: 56,
    }, // 选择销售员-点击量
    show_editCustomOperate: {
      dogId: 100090,
      srcId: 57,
    }, // 编辑页-曝光量
    customOperate_deleteCustom: {
      dogId: 100090,
      srcId: 58,
    }, // 删除客户数量（仅计算删除成功数量）
    cardManager_show: {
      dogId: 100096,
      srcId: 0,
    }, // PC-智能名片-曝光
    cardManager_edit: {
      dogId: 100096,
      srcId: 1,
    }, // PC-编辑名片-点击
    cardManager_edit_show: {
      dogId: 100096,
      srcId: 2,
    }, // PC-内容编辑-曝光
    cardManager_edit_save: {
      dogId: 100096,
      srcId: 3,
    }, // PC-内容编辑-保存-点击
    cardManager_module_show: {
      dogId: 100096,
      srcId: 4,
    }, // PC-模块设置-曝光
    cardManager_module_save: {
      dogId: 100096,
      srcId: 5,
    }, // PC-模块设置-保存-点击
    cluePool_show: {
      dogId: 100086,
      srcId: 0,
    }, // 统计线索池tab的曝光数量
    multipartImport_click: {
      dogId: 100086,
      srcId: 1,
    }, // 统计批量导入的点击数量
    fieldDefine_show: {
      dogId: 100086,
      srcId: 2,
    }, // 统计设置项弹窗的曝光数量
    fieldDefine_close: {
      dogId: 100086,
      srcId: 3,
    }, // 统计设置项弹窗的关闭按钮点击数量
    fieldDefine_save: {
      dogId: 100086,
      srcId: 4,
    }, // 统计设置项弹窗的保存按钮点击数量
    moreFilter_show: {
      dogId: 100086,
      srcId: 5,
    }, // 统计高级筛选弹窗的曝光数量
    moreFilter_close: {
      dogId: 100086,
      srcId: 6,
    }, // 统计高级筛选弹窗的关闭按钮点击数量
    moreFilter_save: {
      dogId: 100086,
      srcId: 7,
    }, // 统计高级筛选弹窗的保存按钮点击数量
    distribute_click: {
      dogId: 100086,
      srcId: 8,
    }, // 统计批量分配按钮的点击数量
    release_click: {
      dogId: 100086,
      srcId: 9,
    }, // 统计批量释放按钮的点击数量
    setViewerToCustomer_click: {
      dogId: 100086,
      srcId: 10,
    }, // 统计批量置为客户按钮的点击数量
    releaseSingle_click: {
      dogId: 100086,
      srcId: 11,
    }, // 统计单个释放按钮的点击数量
    setViewerToCustomerSingle_click: {
      dogId: 100086,
      srcId: 12,
    }, // 统计单个置为客户按钮的点击数量
    clueDetail_click: {
      dogId: 100086,
      srcId: 13,
    }, // 统计详情按钮的点击数量
    clueDetail_show: {
      dogId: 100086,
      srcId: 14,
    }, // 统计访问详情tab的曝光数量
  },
  notOem: {
    //改成新的
    // 'toHelpCenter': {
    //     dogId: 12000006,
    //     srcId: 1
    // }, // 跳转到帮助中心
    // 'toUpGrade_up': {
    //     dogId: 12000006,
    //     srcId: 2
    // }, // 立即升级
    // 'toUpGrade_continue': {
    //     dogId: 12000006,
    //     srcId: 3
    // }, // 立即续费
    hotArticle: {
      dogId: 12000006,
      srcId: 102,
    }, // 文章中心 - 切换到行业热文
    companyArticle: {
      dogId: 12000006,
      srcId: 103,
    }, // 文章中心 - 切换到企业文库
    addArticleModel: {
      dogId: 12000006,
      srcId: 104,
    }, // 文库模板制作
    linkTransition: {
      dogId: 12000006,
      srcId: 105,
    }, // 文库模板制作 - 链接转化
    articleModel_nextStep: {
      dogId: 12000006,
      srcId: 106,
    }, // 素材中心 - 文章模板制作 - 下一步
    articleModel_cancel: {
      dogId: 12000006,
      srcId: 107,
    }, // 素材中心 - 文章模板制作 - 取消
    articleModel_lastStep: {
      dogId: 12000006,
      srcId: 108,
    }, // 素材中心 - 文章模板制作 - 上一步
    // 'articleModel_addModel': { dogId:12000006,srcId: 109 }, // 素材中心 - 文章模板制作 - 保存到企业文库
    edit_HotArticle: {
      dogId: 12000006,
      srcId: 112,
    }, // 素材中心 - 行业热文 - 编辑
    data_hotArticle: {
      dogId: 12000006,
      srcId: 113,
    }, // 素材中心 - 行业热文 - 数据
    data_companyArticle: {
      dogId: 12000006,
      srcId: 114,
    }, // 素材中心 - 企业文库 - 数据
    edit_companyArticle: {
      dogId: 12000006,
      srcId: 115,
    }, // 素材中心 - 企业文库 - 编辑
    closeArticle: {
      dogId: 12000006,
      srcId: 116,
    }, // 素材中心 - 企业文库 - 关闭
    deleteArticle: {
      dogId: 12000006,
      srcId: 117,
    }, // 素材中心 - 企业文库 - 删除
    showClassifyManager: {
      dogId: 12000006,
      srcId: 118,
    }, // 显示企业文库管理分类页面
    addArticleType: {
      dogId: 12000006,
      srcId: 119,
    }, // 企业中心 - 新增分类
    articleMaterial_shareBtn: {
      dogId: 12000006,
      srcId: 121,
    }, // PC-素材中心-企业文库-分享点击
    // 'onTransition': { dogId:12000006,srcId: 120 },  // 链接转化成功 -  健哥在后端在后端加上了
    dataCenter_article: {
      dogId: 12000006,
      srcId: 201,
    }, // 数据中心 - 文章数据访问量
    dataCenter_staffData: {
      dogId: 12000006,
      srcId: 202,
    }, // 数据中心 - 销售员数据访问量
    dataCenter_visitorData: {
      dogId: 12000006,
      srcId: 203,
    }, // 数据中心 - 访客数据访问量
    dataCenter_closeArticle: {
      dogId: 12000006,
      srcId: 205,
    }, // 数据中心 - 销售员数据 - 关闭文章
    data_staffData: {
      dogId: 12000006,
      srcId: 206,
    }, // 数据中心 - 销售员数据 - 数据
    dataCenter_deleteArticle: {
      dogId: 12000006,
      srcId: 207,
    }, // 数据中心 - 销售员数据 - 删除
    dataCenter_showDataInfo: {
      dogId: 12000006,
      srcId: 208,
    }, // 数据中心 - 访客数据 - 详情
    showVisitCardClone: {
      dogId: 12000006,
      srcId: 301,
    }, // 名片克隆访问量
    addTsCardClone: {
      dogId: 12000006,
      srcId: 302,
    }, // 克隆成功
    showFunctionSetting: {
      dogId: 12000006,
      srcId: 401,
    }, // 功能设置访问量
    closeQualityViewer: {
      dogId: 12000006,
      srcId: 402,
    }, // 关闭精准用户定义
    openQualityViewer: {
      dogId: 12000006,
      srcId: 403,
    }, // 开启精准用户定义
    publicSettingClose: {
      dogId: 12000006,
      srcId: 404,
    }, // 关闭公众号提醒
    publicSettingOpen: {
      dogId: 12000006,
      srcId: 405,
    }, // 开启公众号提醒
    libraryFormClose: {
      dogId: 12000006,
      srcId: 406,
    }, // 关闭不可见文章
    libraryFormOpen: {
      dogId: 12000006,
      srcId: 407,
    }, // 开启不可见文章
    showBindMall: {
      dogId: 12000006,
      srcId: 501,
    }, // 商城页面曝光用户数
    authMallStep_1: {
      dogId: 12000006,
      srcId: 502,
    }, // 商城授权 - 第一步曝光
    authMallStep_2: {
      dogId: 12000006,
      srcId: 503,
    }, // 商城授权 - 第二步曝光
    authMallStep_3: {
      dogId: 12000006,
      srcId: 504,
    }, // 商城授权 - 第三步曝光
    openMall: {
      dogId: 12000006,
      srcId: 505,
    }, // 商城授权页面曝光数
    createSiteId: {
      dogId: 12000006,
      srcId: 506,
    }, // 关联站点的用户数
    hasAuthTsMallApp: {
      dogId: 12000006,
      srcId: 507,
    }, // 是否授权了商城
    showConsumeRecode: {
      dogId: 12000006,
      srcId: 601,
    }, // 消费访问量
    showOrderCheck: {
      dogId: 12000006,
      srcId: 602,
    }, // 订单审批访问量
    orderCheckIn: {
      dogId: 12000006,
      srcId: 603,
    }, // 订单审批 - 点击订单录入
    showCommisionRecord: {
      dogId: 12000006,
      srcId: 604,
    }, // 佣金记录访问量
    showProductManage: {
      dogId: 12000006,
      srcId: 605,
    }, // 产品管理访问量
    productManage_newAdd: {
      dogId: 12000006,
      srcId: 606,
    }, // 产品管理 - 点击产品录入
    showCompanyManage: {
      dogId: 12000006,
      srcId: 607,
    }, // 公司管理访问量
    newAddcomm: {
      dogId: 12000006,
      srcId: 608,
    }, // 公司管理 - 点击添加公司
    showEmployeeMange: {
      dogId: 12000006,
      srcId: 701,
    }, // 权限中心 - 员工管理
    newAddEmpoyee: {
      dogId: 12000006,
      srcId: 702,
    }, // 权限中心 - 添加员工
    addEmployee: {
      dogId: 12000006,
      srcId: 703,
    }, // 权限中心 - 员工管理 - 成功添加
    employee_unbindWX: {
      dogId: 12000006,
      srcId: 704,
    }, // 权限中心 - 解绑小程序
    employee_editAccount: {
      dogId: 12000006,
      srcId: 705,
    }, // 权限中心 - 编辑
    employee_delete: {
      dogId: 12000006,
      srcId: 706,
    }, // 权限中心 - 删除
    showChangePW: {
      dogId: 12000006,
      srcId: 707,
    }, // 修改密码访问量
    changePw_savePwd: {
      dogId: 12000006,
      srcId: 708,
    }, // 修改密码 - 保存成功
    version_exposure: {
      dogId: 12000009,
      srcId: 0,
    }, // 3月赠券-版本券弹窗曝光量
    version_close: {
      dogId: 12000009,
      srcId: 1,
    }, // 3月赠券-版本券弹窗关闭量
    version_click: {
      dogId: 12000009,
      srcId: 2,
    }, // 3月赠券-版本券弹窗点击量
    reduction_exposure: {
      dogId: 12000009,
      srcId: 10,
    }, // 3月赠券-满减券弹窗曝光量
    reduction_close: {
      dogId: 12000009,
      srcId: 11,
    }, // 3月赠券-满减券弹窗关闭量
    reduction_click: {
      dogId: 12000009,
      srcId: 12,
    }, // 3月赠券-满减券弹窗点击量
    product_setting: {
      dogId: 12000016,
      srcId: 2,
    }, // 商城设置曝光数量
    product_H5_open: {
      dogId: 12000016,
      srcId: 3,
    }, // 开通手机微商城数量
    product_H5_close: {
      dogId: 12000016,
      srcId: 4,
    }, // 关闭手机微商城数量
    product_App_open: {
      dogId: 12000016,
      srcId: 5,
    }, // 开通小程序商城数量
    product_App_close: {
      dogId: 12000016,
      srcId: 6,
    }, // 关闭小程序商城数量
    Open_show: {
      dogId: 12000014,
      srcId: 0,
    }, // 已开通-开通弹窗曝光量
    Open_use: {
      dogId: 12000014,
      srcId: 1,
    }, // 已开通-开通弹窗-立即使用-点击量（不记录未选用途，直接点击的量）
    Open_noneed: {
      dogId: 12000014,
      srcId: 2,
    }, // 已开通-开通弹窗-暂不需要-点击量
    unOpen_show: {
      dogId: 12000014,
      srcId: 10,
    }, // 未开通-开通弹窗曝光量
    unOpen_use: {
      dogId: 12000014,
      srcId: 11,
    }, // 未开通-开通弹窗-立即使用-点击量（不记录未选用途，直接点击的量）
    unOpen_noneed: {
      dogId: 12000014,
      srcId: 12,
    }, // 未开通-开通弹窗-暂不需要-点击量
    //首页数据统计
    expose_home: {
      dogId: 12000012,
      srcId: 0,
    }, //首页-访问量
    home_clickSearch: {
      dogId: 12000012,
      srcId: 1,
    }, //首页-工作台-搜索按钮-点击量
    indexBType_clue: {
      dogId: 12000012,
      srcId: 2,
    }, // 首页-数据概况-获取线索-点击量
    home_clickArticleCard: {
      dogId: 12000012,
      srcId: 10,
    }, //首页-常用功能-H5文章获客卡片-点击量
    home_clickGetCustom: {
      dogId: 12000012,
      srcId: 11,
    }, //首页-常用功能-智能名片获客卡片-点击量
    homeBtype_file: {
      dogId: 12000012,
      srcId: 12,
    }, // 首页-文件获客卡片-点击量
    home_clickForm: {
      dogId: 12000012,
      srcId: 13,
    }, // 首页-常用功能-企业表单卡片-点击量
    home_clickPoster: {
      dogId: 12000012,
      srcId: 14,
    }, // 首页-海报获客卡片-点击量
    home_clickMall: {
      dogId: 12000012,
      srcId: 20,
    }, //首页-更多功能-我的商城卡片-点击量
    home_clickManageCustom: {
      dogId: 12000012,
      srcId: 21,
    }, //首页-更多功能-客户管理卡片-点击量
    home_clickSale: {
      dogId: 12000012,
      srcId: 22,
    }, //首页-更多功能-全民营销卡片-点击量
    home_clickSearchMoney: {
      dogId: 12000012,
      srcId: 23,
    }, //首页-更多功能-商机雷达卡片-点击量
    home_clickAuthorizeWX: {
      dogId: 12000012,
      srcId: 24,
    }, //首页-更多功能-微信授权卡片-点击量
    home_clickDataCenter: {
      dogId: 12000012,
      srcId: 25,
    }, //首页-更多功能-数据中心卡片-点击量
    home_clickWxWork: {
      dogId: 12000012,
      srcId: 26,
    }, // 首页-企微助手卡片-点击量
    home_clickMoreActive: {
      dogId: 12000012,
      srcId: 30,
    }, //首页-最新动态-更多动态-点击量
    home_clickAdd: {
      dogId: 12000012,
      srcId: 31,
    }, //首页-最新动态-广告图-点击量
    home_clickArticleTitle: {
      dogId: 12000012,
      srcId: 32,
    }, //首页-最新动态-文章标题-总点击量
    home_clickMoreArticle: {
      dogId: 12000012,
      srcId: 40,
    }, //首页-常见问题-查看更多-点击量
    home_clickAllArticle: {
      dogId: 12000012,
      srcId: 41,
    }, //首页-常见问题-文章标题-总点击量
    home_exposeFreeCard: {
      dogId: 12000012,
      srcId: 50,
    }, //首页-免费版版本卡片-曝光量
    home_clickFreeCard: {
      dogId: 12000012,
      srcId: 51,
    }, //首页-免费版版本卡片-点击量
    home_shareArticle: {
      dogId: 12000012,
      srcId: 60,
    }, // 首页-行业热文-立即分享-总点击量
    home_lookMoreArticle: {
      dogId: 12000012,
      srcId: 61,
    }, // 首页-行业热文-更多-点击量
    mp_authFail_show: {
      dogId: 12000030,
      srcId: 0,
    }, //公众号-失败页面曝光数量
    mp_authFail_guide: {
      dogId: 12000030,
      srcId: 1,
    }, //公众号-查看指引-点击数量
    mp_auth_show: {
      dogId: 12000030,
      srcId: 2,
    }, //公众号-授权页面曝光数量
    mp_authGuide_click: {
      dogId: 12000030,
      srcId: 4,
    }, //公众号-授权前查看指引-点击数量
    app_openFail_show: {
      dogId: 12000030,
      srcId: 5,
    }, //小程序-失败页面曝光数量(开放平台未授权)
    app_openGuide_click: {
      dogId: 12000030,
      srcId: 6,
    }, //小程序-查看指引-点击数量(开放平台未授权)
    app_otherFail_show: {
      dogId: 12000030,
      srcId: 7,
    }, //小程序-失败页面曝光数量(绑定其他小程序)
    app_otherGuide_click: {
      dogId: 12000030,
      srcId: 8,
    }, //小程序-查看指引-点击数量(绑定其他小程序)
    oversea_Fail_show: {
      dogId: 12000030,
      srcId: 9,
    }, //开发平台-失败页面曝光数量(境外小程序)
    oversea_Guide_show: {
      dogId: 12000030,
      srcId: 10,
    }, //开发平台-查看指引-点击数量(境外小程序)
    app_auth_show: {
      dogId: 12000030,
      srcId: 11,
    }, //小程序-授权页面曝光数量
    app_authGuide_click: {
      dogId: 12000030,
      srcId: 12,
    }, //小程序-授权前查看指引-点击数量
    show_FormMangage: {
      dogId: 12000033,
      srcId: 1,
    }, // 企业表单-页面访问量
    form_addFormModel: {
      dogId: 12000033,
      srcId: 2,
    }, // 企业表单-创建表单模板-按钮点击量
    form_lookData: {
      dogId: 12000033,
      srcId: 3,
    }, // 企业表单-数据-点击量
    form_editForm: {
      dogId: 12000033,
      srcId: 4,
    }, // 企业表单-编辑-点击量
    form_changeStatus: {
      dogId: 12000033,
      srcId: 5,
    }, // 企业表单-开启/关闭-点击量
    form_delete: {
      dogId: 12000033,
      srcId: 6,
    }, // 企业表单-删除-点击量
    form_saveModel: {
      dogId: 12000033,
      srcId: 10,
    }, // 创建表单模板-成功保存量
    formData_show: {
      dogId: 12000033,
      srcId: 100,
    }, // 表单数据-页面访问量
    form_showDataInfo: {
      dogId: 12000033,
      srcId: 101,
    }, // 表单数据-详情-点击量
    ask_click: {
      dogId: 12000038,
      srcId: 1,
    }, //点击在线咨询
    suggest_click: {
      dogId: 12000038,
      srcId: 2,
    }, //点击功能建议
    help_click: {
      dogId: 12000038,
      srcId: 3,
    }, //点击帮助中心
    notice_yx_show: {
      dogId: 12000038,
      srcId: 4,
    }, //曝光关注易销二维码
    companyCenter_click: {
      dogId: 12000038,
      srcId: 5,
    }, //点击企业中心
    order_click: {
      dogId: 12000038,
      srcId: 6,
    }, //点击我的订单
    coupUrl_click: {
      dogId: 12000038,
      srcId: 7,
    }, //点击现金券
    logOut_click: {
      dogId: 12000038,
      srcId: 8,
    }, //点击退出登录
    toUpGrade_up: {
      dogId: 12000038,
      srcId: 9,
    }, //点击立即升级
    toUpGrade_continue: {
      dogId: 12000038,
      srcId: 10,
    }, //点击续费升级
    customPay_show: {
      dogId: 12000037,
      srcId: 3,
    }, //客户付费分析-曝光
    customPayDetail_show: {
      dogId: 12000037,
      srcId: 4,
    }, //客户付费详情-曝光
    productPay_show: {
      dogId: 12000037,
      srcId: 5,
    }, //商品付费分析-曝光
    show_customList: {
      dogId: 12000056,
      srcId: 1,
    }, // 客户列表页-曝光量
    customList_showDetailDialog: {
      dogId: 12000056,
      srcId: 2,
    }, // 客户按钮-点击量
    customList_editCustom: {
      dogId: 12000056,
      srcId: 3,
    }, // 编辑按钮-点击量
    customList_isDetail: {
      dogId: 12000056,
      srcId: 4,
    }, // 详情按钮-点击量
    customList_addFollow: {
      dogId: 12000056,
      srcId: 5,
    }, // 写跟进按钮-点击量
    customList_phone: {
      dogId: 12000056,
      srcId: 6,
    }, // 搜索框-点击量
    customList_showTagDialog: {
      dogId: 12000056,
      srcId: 7,
    }, // 筛选项-标签-点击量
    customList_intention: {
      dogId: 12000056,
      srcId: 8,
    }, // 筛选项-意向度-点击量
    customList_followStatus: {
      dogId: 12000056,
      srcId: 9,
    }, // 筛选项-跟进情况-点击量
    customList_isVisitsArticle: {
      dogId: 12000056,
      srcId: 10,
    }, // 筛选项-是否访问过文章-点击量
    customList_isVisitsCard: {
      dogId: 12000056,
      srcId: 11,
    }, // 筛选项-是否访问过名片-点击量
    customList_workList: {
      dogId: 12000056,
      srcId: 12,
    }, // 筛选项-销售员-点击量
    customList_onExportExcel: {
      dogId: 12000056,
      srcId: 13,
    }, // 导出excel按钮-点击量
    customList_newAddCustom: {
      dogId: 12000056,
      srcId: 14,
    }, // 客户录入按钮点击量
    show_customerDetailDialog: {
      dogId: 12000056,
      srcId: 15,
    }, // 客户详情页-曝光量
    customerDetailDialog_editCustom: {
      dogId: 12000056,
      srcId: 16,
    }, // 编辑按钮-点击量
    customList_changeCustomerTab1: {
      dogId: 12000056,
      srcId: 17,
    }, // 客户信息tab页-曝光量
    customList_changeCustomerTab2: {
      dogId: 12000056,
      srcId: 18,
    }, // 互动动态tab页-曝光量
    customList_changeCustomerTab3: {
      dogId: 12000056,
      srcId: 19,
    }, // 跟进记录tab页-曝光量
    customerDetailDialog_showTagSelectDialog: {
      dogId: 12000056,
      srcId: 20,
    }, // 新增/修改标签按钮-点击量
    customList_goPrePage: {
      dogId: 12000056,
      srcId: 21,
    }, // 上一个按钮-点击量
    customList_goNextPage: {
      dogId: 12000056,
      srcId: 22,
    }, // 下一个按钮-点击量
    customList_changeCustomerTab3_click: {
      dogId: 12000056,
      srcId: 29,
    }, // 跟进状态按钮-点击量
    customList_intentionNew: {
      dogId: 12000056,
      srcId: 30,
    }, // 意向度按钮-点击量
    customList_visitsTimeNew: {
      dogId: 12000056,
      srcId: 31,
    }, // 下次跟进时间按钮-点击量
    customList_Time1: {
      dogId: 12000056,
      srcId: 32,
    }, // 下次跟进时间-1天后按钮-点击量
    customList_Time2: {
      dogId: 12000056,
      srcId: 33,
    }, // 下次跟进时间-3天后按钮-点击量
    customList_Time3: {
      dogId: 12000056,
      srcId: 34,
    }, // 下次跟进时间-7天后按钮-点击量
    customList_Time4: {
      dogId: 12000056,
      srcId: 35,
    }, // 下次跟进时间-15天后按钮-点击量
    customerDetailDialog_changeDate: {
      dogId: 12000056,
      srcId: 36,
    }, // 下次跟进时间-自定义时间-点击量
    customList_addTsClientVisits: {
      dogId: 12000056,
      srcId: 37,
    }, // 添加跟进-按钮-点击量
    show_customOperate: {
      dogId: 12000056,
      srcId: 38,
    }, // 录入页-曝光量
    customOperate_addEmployee: {
      dogId: 12000056,
      srcId: 39,
    }, // 成功录入客户数量
    customOperate_contacts: {
      dogId: 12000056,
      srcId: 40,
    }, // 姓名-点击量
    customOperate_changeSex: {
      dogId: 12000056,
      srcId: 41,
    }, // 性别-点击量
    customOperate_phone: {
      dogId: 12000056,
      srcId: 42,
    }, // 手机-点击量
    customOperate_wx: {
      dogId: 12000056,
      srcId: 43,
    }, // 微信-点击量
    customOperate_birthday: {
      dogId: 12000056,
      srcId: 44,
    }, // 生日-点击量
    customOperate_qq: {
      dogId: 12000056,
      srcId: 45,
    }, // QQ-点击量
    customOperate_idCard: {
      dogId: 12000056,
      srcId: 46,
    }, // 证件号码-点击量
    customOperate_remark: {
      dogId: 12000056,
      srcId: 47,
    }, // 备注-点击量
    customOperate_corpName: {
      dogId: 12000056,
      srcId: 48,
    }, // 企业名称-点击量
    customOperate_industry: {
      dogId: 12000056,
      srcId: 49,
    }, // 行业-点击量
    customOperate_province: {
      dogId: 12000056,
      srcId: 50,
    }, // 省份-点击量
    customOperate_city: {
      dogId: 12000056,
      srcId: 51,
    }, // 城市-点击量
    customOperate_address: {
      dogId: 12000056,
      srcId: 52,
    }, // 地址-点击量
    customOperate_source: {
      dogId: 12000056,
      srcId: 53,
    }, // 来源-点击量
    customOperate_showTagSelectDialog: {
      dogId: 12000056,
      srcId: 54,
    }, // 选择标签-点击量
    customOperate_tagManage: {
      dogId: 12000056,
      srcId: 55,
    }, // 标签管理-点击量
    customOperate_worker: {
      dogId: 12000056,
      srcId: 56,
    }, // 选择销售员-点击量
    show_editCustomOperate: {
      dogId: 12000056,
      srcId: 57,
    }, // 编辑页-曝光量
    customOperate_deleteCustom: {
      dogId: 12000056,
      srcId: 58,
    }, // 删除客户数量（仅计算删除成功数量）
    cardManager_show: {
      dogId: 12000071,
      srcId: 0,
    }, // PC-智能名片-曝光
    cardManager_edit: {
      dogId: 12000071,
      srcId: 1,
    }, // PC-编辑名片-点击
    cardManager_edit_show: {
      dogId: 12000071,
      srcId: 2,
    }, // PC-内容编辑-曝光
    cardManager_edit_save: {
      dogId: 12000071,
      srcId: 3,
    }, // PC-内容编辑-保存-点击
    cardManager_module_show: {
      dogId: 12000071,
      srcId: 4,
    }, // PC-模块设置-曝光
    cardManager_module_save: {
      dogId: 12000071,
      srcId: 5,
    }, // PC-模块设置-保存-点击
    cluePool_show: {
      dogId: 12000052,
      srcId: 0,
    }, // 统计线索池tab的曝光数量
    multipartImport_click: {
      dogId: 12000052,
      srcId: 1,
    }, // 统计批量导入的点击数量
    fieldDefine_show: {
      dogId: 12000052,
      srcId: 2,
    }, // 统计设置项弹窗的曝光数量
    fieldDefine_close: {
      dogId: 12000052,
      srcId: 3,
    }, // 统计设置项弹窗的关闭按钮点击数量
    fieldDefine_save: {
      dogId: 12000052,
      srcId: 4,
    }, // 统计设置项弹窗的保存按钮点击数量
    moreFilter_show: {
      dogId: 12000052,
      srcId: 5,
    }, // 统计高级筛选弹窗的曝光数量
    moreFilter_close: {
      dogId: 12000052,
      srcId: 6,
    }, // 统计高级筛选弹窗的关闭按钮点击数量
    moreFilter_save: {
      dogId: 12000052,
      srcId: 7,
    }, // 统计高级筛选弹窗的保存按钮点击数量
    distribute_click: {
      dogId: 12000052,
      srcId: 8,
    }, // 统计批量分配按钮的点击数量
    release_click: {
      dogId: 12000052,
      srcId: 9,
    }, // 统计批量释放按钮的点击数量
    setViewerToCustomer_click: {
      dogId: 12000052,
      srcId: 10,
    }, // 统计批量置为客户按钮的点击数量
    releaseSingle_click: {
      dogId: 12000052,
      srcId: 11,
    }, // 统计单个释放按钮的点击数量
    setViewerToCustomerSingle_click: {
      dogId: 12000052,
      srcId: 12,
    }, // 统计单个置为客户按钮的点击数量
    clueDetail_click: {
      dogId: 12000052,
      srcId: 13,
    }, // 统计详情按钮的点击数量
    clueDetail_show: {
      dogId: 12000052,
      srcId: 14,
    }, // 统计访问详情tab的曝光数量
  },
};
const TsActType = {
  ADD_CARD_POSTER: 102,
  ADD_FORM_TEMPLATE: 200,
  ADD_MATERIAL_FILE: 300,
  ADD_PRODUCT: 400,
  EDIT_WX_WORK_SETTING: 500,
  ADD_VIEWER: 600,
  ADD_CLIENT: 601,
  EDIT_CARD: 4,
};

export { logListConfig, TsActType };
