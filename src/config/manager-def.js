/*
 * @Author: ADI
 * @Date: 2021-03-26 16:10:42
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-19 09:36:58
 */
export default class ManagerDef {
  /**
   * 功能权限
   * @author waldon
   * @date 2021/1/11
   */
  static FUNC_PERMISSION = {
    GET_CUSTOMER_TOOL: 1, // 获客工具
    CUSTOMER_MANAGER: 2, // 客户管理
    TASK_CENTER: 3, // 任务中心
    INTEGRAL: 4, // 推广积分
    PRODUCT_MANAGER: 5, // 商品管理
    WX_CORP_HELPER: 6, // 企微助手
    OFFICE_CASE: 7, // 公文包
    DATA_CENTER: 8, // 数据中心
  };

  /**
   * 企微安装进度
   * @author waldon
   * @date 2021/1/11
   */
  static WX_CORP_STEP_DEFINE = {
    INIT: 0, // 未设置/已完成
    INSTALL_APP: 1, // 安装应用（这一步不会在后端返回状态里面显示）
    CONTACTS_SET: 2, // 通讯录设置
    CUSTOMER_SET: 3, // 客户联系设置
  };

  /**
   * 分销企微安装
   * @author waldon
   * @date 2021/1/11
   */
  static WX_CORP_STEP_DEFINE_OEM = {
    INIT: 0, // 未设置/已完成
    INSTALL_APP: 1, // 安装应用（这一步不会在后端返回状态里面显示）
    CORP_AGENT_SET: 2, // 内部应用设置
    CONTACTS_SET: 3, // 通讯录设置
    CUSTOMER_SET: 4, // 客户联系设置
  };

  /**
   * 自建应用安装进度
   * @author waldon
   * @date 2021/1/11
   */
  static SELF_APP_STEP_DEFINE = {
    CREATE: 1, // 创建应用
    SET_TOOL: 2, // 聊天工具设置
  };

  /**
   * 自建应用安装进度 - 企微加入会话管理
   * @author enson
   * @date 2021/4/16
   */
  static WXWORK_MSG_STEP_DEFINE = {
    CREATE: 1, // 创建应用
    SET_TOOL: 2, // 接入会话文档
  };

  /**
   * 分组类型
   * @author waldon
   * @date 2021/3/26
   */
  static GROUP_TYPE_DEF = {
    // 分组类型 1.企业话术 2.图片素材 3.文件素材 5.我的话术
    CORP_CHAT: 1, // 企业话术
    PIC_MATERIAL: 2, // 图片素材
    FILE_MATERIAL: 3, // 文件素材
    PERSON_CHAT: 4, // 我的话术
  };

  /**
   * 下载的模板类型
   * @author enson
   * @date 2021/4/21
   */
  static DOWNLOAD_TEMP_TYPE = {
    CLUE_POOL: 4, //线索池
    PRODUCT: 5, // 商品
    CHAT: 6, // 话术
  };
}
