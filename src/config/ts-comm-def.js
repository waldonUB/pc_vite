/*
 * @Author: ADI
 * @Date: 2021-03-29 09:56:48
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-28 13:57:39
 */
export default class TsCommDef {
  static FolderType = {
    // 系统资源文件夹分类
    NORMAL: 0, // 普通文件夹
    PERSON_SYS_RES_FOLDER: 1, // 系统资源文件
    PERSON_SYS_CARD: 2, // 智能名片
    PERSON_SYS_ARTICLE: 3, // 获客文章
    PERSON_SYS_FORM: 4, // 获客表单
    PERSON_SYS_POSTER: 5, // 获客海报
    PERSON_SYS_VIDEO: 6, // 获客视频
    PERSON_SYS_FRIEND_CIRCLE: 7, // 盆友圈
    PERSON_SYS_CLIENT: 8, // CRM客户
    PERSON_SYS_MARKETING_TASK: 9, // 任务中心
    PERSON_SYS_PRODUCT: 10, // 获客商品
    PERSON_SYS_WX_WORK: 11, // 企微助手
  };
  static WxMaterialCategoryDef = {
    // 公文包文件类型
    doc: 1, // 文档
    img: 2, // 图片
    video: 3, // 视频
  };

  static WxMaterialCategoryDefNameMap = {
    // 公文包文件类型Map
    doc: '文档', // 文档
    img: '图片', // 图片
    video: '视频', // 视频
  };

  static TypeGroupDef = {
    // 分类类型
    WX_WORK_CHANNEL: 4, // 渠道列表
    PRODUCT_FOLDER: 18, // 产品文件夹
    CORP_FOLDER: 12, // 企业文件夹
    PERSON_FOLDER: 13, // 个人文件夹
  };

  static dataAuthTypeDef = {
    // 角色数据权限
    ALL: 1, // 所有人数据
    DEPT_ALL: 2, // 所在部门及子部门的所有数据
    ONESELF: 3, // 登录人自己
  };

  static FuncKeyDef = {
    // 功能权限字段
    CLUE_SEA_GET: 'clueSeaGet', // 线索领取
    CLUE_SEA_DISTRIBUTE: 'clueSeaDistribute', // 线索分配
    CLUE_SET_CLIENT: 'clueSetClient', // 置为客户
    CLUE_GIVEUP_CLUE: 'clueGiveUpClue', // 放弃线索
    CLUEPOOL_ADD_CLUE: 'cluePoolAddClue', // 导入线索
  };

  static GuideStepDef = {
    // 操作提示
    routerNew: 12, // 新菜单栏提示
  };

  static MaterialTypeDef = {
    IMG_TEXT: 1, // 图片
    LINK: 2, // 链接
    APP: 3, // 小程序
    CARD: 4, // 名片
    ARTICLE: 5, // 文章
    PRODUCT: 6, // 商品
    TEXT: 7, // 文本
  };
}

// alias
export const CategoryDef = TsCommDef.WxMaterialCategoryDef;
