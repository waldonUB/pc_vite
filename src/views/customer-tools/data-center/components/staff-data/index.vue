<!--
 * @Author       : ADI
 * @Date         : 2021-05-24 11:15:42
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-16 16:47:18
-->
<template>
  <div class="staffData">
    <div class="qrCode_box"></div>
    <div class="articleCenter_main">
      <div class="pro_line">
        <ts-select-list
          v-if="isCanSelect"
          class="workList searchSelect floatLeft"
          :selectedOrgData.sync="selectedOrgData"
          :needUpdate.sync="needUpdate"
          :depIdList.sync="requestParam.depIdList"
          :sids.sync="requestParam.sids"
        >
        </ts-select-list>
        <fa-input
          style="width: 200px;"
          v-model="requestParam.title"
          placeholder="文章标题"
          @keyup.enter.native="reloadDataList"
        >
        </fa-input>
        <global-ts-date-picker @updateTime="getSearchTime" defaultStartTime="year"> </global-ts-date-picker>
        <global-ts-button
          type="primary"
          size="small"
          icon="icon-icon-4"
          ref="button"
          @keyup.enter.native="reloadDataList"
          @click="reloadDataList"
        >
          搜索
        </global-ts-button>
        <global-ts-button type="primary" size="small" icon="icon-daochu" ref="button" @click="onExportExcel">
          导出
        </global-ts-button>
      </div>
      <div class="showArticleList">
        <el-table
          type="index"
          :class="'tshu-tableset'"
          :data="ArticleResponsibility.ArticleList"
          border
          min-width="1010px"
          cell-class-name="cellStyle"
        >
          <el-table-column prop="staffName" key="staffName" label="成员" min-width="70">
            <template slot-scope="scope">
              {{
                scope.row.staffName
                  ? $utils.showStaffName(tsStaffExtraList, scope.row.sid, scope.row.staffName)
                  : '已删除'
              }}
            </template>
          </el-table-column>
          <el-table-column prop="title" label="文章标题" min-width="160" key="title">
            <template slot-scope="scope">
              {{ scope.row.title }}<span v-if="scope.row.del === 1" class="tanshu_err">（已删除）</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTimeName" label="创建时间" min-width="130" key="createTimeName">
            <template #header>
              <div class="sortBar" @click="changeSortType('id')">
                <span class="nextTimeBaby">创建时间</span>
                <span class="sortArrow">
                  <global-ts-svg-icon
                    class="icon"
                    :class="requestParam.sortKey === 'id' && !requestParam.desc ? '' : 'isNotActive'"
                    name="icon-shaixuanshang"
                    :size="14"
                  />
                  <global-ts-svg-icon
                    class="icon"
                    :class="requestParam.sortKey === 'id' && requestParam.desc ? '' : 'isNotActive'"
                    name="icon-shaixuanxia"
                    :size="14"
                  />
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="clickViewers" label="阅读人数" key="clicks" min-width="80">
            <template #header>
              <div class="sortBar" @click="changeSortType('clickViewers')">
                <span class="nextTimeBaby">阅读人数</span>
                <span class="sortArrow">
                  <global-ts-svg-icon
                    class="icon"
                    :class="requestParam.sortKey === 'clickViewers' && !requestParam.desc ? '' : 'isNotActive'"
                    name="icon-shaixuanshang"
                    :size="14"
                  />
                  <global-ts-svg-icon
                    class="icon"
                    :class="requestParam.sortKey === 'clickViewers' && requestParam.desc ? '' : 'isNotActive'"
                    name="icon-shaixuanxia"
                    :size="14"
                  />
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="readTimesSecond" label="阅读时长" min-width="90" :formatter="timeFormat">
            <template #header>
              <div class="sortBar" @click="changeSortType('readTimesSecond')">
                <span class="nextTimeBaby">阅读时长</span>
                <span class="sortArrow">
                  <global-ts-svg-icon
                    class="icon"
                    :class="requestParam.sortKey === 'readTimesSecond' && !requestParam.desc ? '' : 'isNotActive'"
                    name="icon-shaixuanshang"
                    :size="14"
                  />
                  <global-ts-svg-icon
                    class="icon"
                    :class="requestParam.sortKey === 'readTimesSecond' && requestParam.desc ? '' : 'isNotActive'"
                    name="icon-shaixuanxia"
                    :size="14"
                  />
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="shares" label="转发次数" min-width="80">
            <template #header>
              <div class="sortBar" @click="changeSortType('shares')">
                <span class="nextTimeBaby">转发次数</span>
                <span class="sortArrow">
                  <global-ts-svg-icon
                    class="icon"
                    :class="requestParam.sortKey === 'shares' && !requestParam.desc ? '' : 'isNotActive'"
                    name="icon-shaixuanshang"
                    :size="14"
                  />
                  <global-ts-svg-icon
                    class="icon"
                    :class="requestParam.sortKey === 'shares' && requestParam.desc ? '' : 'isNotActive'"
                    name="icon-shaixuanxia"
                    :size="14"
                  />
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="发布状态" min-width="60px">
            <template slot-scope="scope">
              <div v-if="!scope.row.isRedForGfw">
                <span :class="scope.row.status == 1 ? 'green' : 'red'"></span>
                <span :class="scope.row.status == 1 ? '' : 'unactive'"> {{ scope.row.statusName }}</span>
              </div>
              <div v-else>
                <span class="red"></span>
                <span style="color: red;"> {{ scope.row.statusName }}</span>
                <global-ts-tool-tips offset="10" class="item tanshu_linkColor" effect="dark" placement="top-start">
                  <div slot="content">
                    您的模板已被关闭，请删除违规内容。<br />
                    原因：{{ scope.row.gfwReasonName }}
                  </div>
                  <global-ts-svg-icon class="icon" name="icon-bianzu" />
                </global-ts-tool-tips>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="120px" prop="status">
            <template slot-scope="scope">
              <span
                class="tanshu_linkColor"
                :class="scope.row.status == 2 && scope.row.articleClose == 2 ? 'unactive' : ''"
                @click="closeArticle(scope.row.id, scope.row.status, scope.row.articleClose)"
                >{{ scope.row.status == 1 ? '关闭' : '开启' }}
              </span>
              <div v-if="false" style="display: inline-block;" class="positionBox" replace>
                <a class="tanshu_linkColor" @click="toView(scope.row.id, scope.row.sid, scope.row.title)">数据</a>
              </div>
              <span class="tanshu_linkColor" style="color: #ff4d4d;" @click="deleteArticle(scope.row.id)">删除 </span>
            </template>
          </el-table-column>
          <template slot="empty"> 暂无分享数据 <a class="st_seeGuide" @click="toShare">去分享</a> </template>
        </el-table>
      </div>
      <global-ts-pagination
        :tableData="ArticleResponsibility.ArticleList"
        :requestParam="requestParam"
        :isReload.sync="ArticleResponsibility.isReload"
        @getData="changeTable"
        :httpurl="ArticleResponsibility.httpurl"
      >
      </global-ts-pagination>
    </div>
  </div>
</template>

<script>
import { recordClick, logDog, postMessage, confirm, exportExcel, getUserDepIdList, getWorkerList } from '@/utils';
import qrBoxDialogVm from '../qr-box-dialog/index.vue';
import Vue from 'vue';
import TsSelectList from '@/components/base/ts-select-list/index.vue';
import versionDef from '@/config/version-def';
import { mapGetters, mapState } from 'vuex';
import { delArticle } from '@/api/modules/views/customer-tools/article-material';
import { setArticleStatus, getListForPc } from '@/api/modules/views/customer-tools/data-center';

export default {
  name: 'staff-data',
  components: { TsSelectList },
  props: {
    articleParams: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      needUpdate: false,
      selectedOrgData: {
        dept: [],
        staff: [],
      },
      qrDialog: null, //点击去分享弹窗
      operateTip: '可以在“数据”中查看文章明细数据哦~',
      showStep: false,
      version: versionDef.checkIsFree(),
      ArticleResponsibility: {
        ArticleList: [],
        isReload: false, //是否加载
        httpurl: '', //请求地址
        resonsibilityStatusDef: [
          {
            key: '文章列表',
            value: 2,
          },
        ],
        workList: [],
      },
      requestParam: {
        title: '',
        createTime: '',
        status: 1,
        sid: -1, //跟进员工
        createTimeStart: '',
        createTimeEnd: '',
        sortKey: 'id',
        desc: true,
        cloneSource: -1,
        cloneId: -1,
      },
      statInfo: [],
      beforeLoading: {
        haveLoadStatus: false, //是否已经load了状态
        haveLoadStaff: false, //是否已经load了销售员
      },
    };
  },
  computed: {
    ...mapGetters({
      isManage: 'user/isManage',
      isCanSelect: 'user/isNoOneSelfDataAuth',
    }),
    ...mapState({
      userInfo: state => state.user.info,
      functionInfo: state => state.globalData?.functionInfo,
      tsStaffExtraList: state => state.user.tsStaffExtraList,
    }),
    watchTitle() {
      return this.requestParam.title;
    },
  },
  watch: {
    // 从文章数据跳转过来，会带上文章来源参数。修改标题时清理掉来源参数
    'watchTitle'(newVal, oldVal) {
      if (newVal !== oldVal && oldVal !== '') {
        this.requestParam.cloneSource = -1;
        this.requestParam.cloneId = -1;
      }
    },
    'requestParam.createTime'(newVal) {
      this.requestParam.createTimeStart = newVal ? newVal[0] : '';
      this.requestParam.createTimeEnd = newVal ? newVal[1] : '';
    },
  },
  created() {},
  activated() {
    this.requestParamDefaultValue();
    console.log('articleParams------>', this.articleParams);
    recordClick({
      dogId: 100029,
      srcId: 5,
    });
    var _self = this;
    document.onkeydown = function(e) {
      var key = window.event.keyCode;

      if (key === 13) {
        _self.reloadDataList();
      }
    };
    if (this.articleParams && this.articleParams.isToView === 1) {
      // 文章数据跳转过来的
      console.log('this.articleParams.title---->', this.articleParams.title);
      this.requestParam.title = this.articleParams.title;
      this.requestParam.cloneSource = this.articleParams.cloneSource || -1;
      this.requestParam.cloneId = this.articleParams.cloneId || -1;
      this.requestParam.createTimeStart = '';
      this.requestParam.createTimeEnd = '';
      if (this.articleParams.currentTab === 'staff' && this.articleParams.type === 4) {
        // 已分享的文章跳过来的
        this.requestParam.sids = `[${this.userInfo.staffInfo.sid}]`;
        getUserDepIdList(this.userInfo.staffInfo.sid, this.userInfo.staffInfo.name).then(res => {
          this.selectedOrgData.dept = [];
          this.selectedOrgData.staff.push(res.staffInfo);
          this.needUpdate = true;
        });
      }
    }
    console.log('this.requestParam', this.requestParam);
    //获取销售员列表
    if (this.isCanSelect) {
      getWorkerList().then(list => {
        this.countIsInitFinish('haveLoadStaff');
        this.ArticleResponsibility.workList = list[0];
        this.ArticleResponsibility.workList = this.ArticleResponsibility.workList.filter(item => item.sid != 0);
        if (list[1] == 2) {
          //成员
          this.requestParam.sid = this.ArticleResponsibility.workList.sid;
        }
      });
    } else {
      this.countIsInitFinish('haveLoadStaff');
    }
    this.reloadDataList();
  },
  mounted() {},
  methods: {
    /**
     *重置时间
     *
     * @author guoyijie
     * @date 2020-04-29
     * @param {*} val
     */
    getSearchTime(val) {
      this.requestParam.createTime = val;
    },
    timeFormat: function(row, column) {
      var timeLong = row[column.property];
      const hour = Math.floor(timeLong / 3600);
      const seconds = timeLong % 60;
      const minutes = (timeLong - hour * 3600 - seconds) / 60;
      const time =
        hour == 0
          ? minutes == 0
            ? seconds == 0
              ? '0'
              : seconds + '秒'
            : minutes + '分' + seconds + '秒'
          : hour + '时' + minutes + '分' + seconds + '秒';
      return time;
    },
    toShare() {
      if (!this.qrDialog) {
        const qrBoxDialogVmConstructor = Vue.extend(qrBoxDialogVm);
        this.qrDialog = new qrBoxDialogVmConstructor({}).$mount('.qrCode_box');
      }
      this.qrDialog.open();
    },
    // 等待销售员列表、状态库加载完成才能发起请求
    countIsInitFinish(value) {
      this.beforeLoading[value] = true;
      if (this.beforeLoading.haveLoadStaff) {
        this.ArticleResponsibility.httpurl = '/rest/manage/article/getListForPc';
      }
    },
    //重载页面
    reloadTable: function() {
      this.ArticleResponsibility.isReload = true;
    },
    //订阅数据请求成功事件
    changeTable: function(data) {
      this.ArticleResponsibility.ArticleList = data;
    },
    //删除文章
    deleteArticle: function(id) {
      logDog('dataCenter_deleteArticle');
      this.delete(id).then(() => {
        this.ArticleResponsibility.isReload = true; //成功回调
      });
    },
    delete(id) {
      return confirm('确认删除文章？删除后无法恢复', '删除确认')
        .then(async action => {
          if (action == 'confirm') {
            const [err, res] = await delArticle({
              id,
            });
            if (err) {
              postMessage({
                type: 'error',
                message: err.msg || '系统错误，请稍候重试',
              });
              return Promise.reject(err);
            }
            postMessage({
              type: 'success',
              message: '删除成功！',
            });
            this.reloadTable();
            return Promise.resolve();
          }
        })
        .catch(() => {});
    },
    closeArticle(id, status, articleClose) {
      if (status == 2 && articleClose == 2) {
        return;
      }
      if (status == 1) {
        logDog('dataCenter_closeArticle');
      }
      this.close(id, status).then(() => {
        this.ArticleResponsibility.isReload = true; //成功回调
      });
    },
    close(id, status) {
      const closeText = ['确认关闭文章？', '关闭确认', '关闭成功'];
      const openText = ['确认开启文章？', '开启确认', '开启成功'];
      const textList = status == 1 ? closeText : openText;
      return confirm(textList[0], textList[1])
        .then(async action => {
          if (action == 'confirm') {
            const [err, res] = await setArticleStatus({
              id,
              status: status == 1 ? '2' : '1',
            });
            if (err) {
              postMessage({
                type: 'error',
                message: err.msg || '系统错误，请稍候重试',
              });
              return Promise.reject();
            }
            postMessage({
              type: 'success',
              message: textList[2],
            });
            this.reloadTable();
            return Promise.resolve();
          }
        })
        .catch(() => {});
    },
    //加载
    reloadDataList: function() {
      this.requestParam = Object.assign({}, this.requestParam);
      if (this.requestParam.createTime == null) {
        postMessage({
          type: 'error',
          message: '请输入正确的日期',
        });
      } else {
        this.ArticleResponsibility.isReload = true;
      }
    },
    // 导出数据
    async onExportExcel() {
      // 导出之后把limit设置回原来的数值
      var limit = this.requestParam.limit;
      this.requestParam.limit = 20000;
      const [err, res] = await getListForPc(this.requestParam);
      if (err) {
        postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      const excelList = res.data;
      const keyJson = {
        id: 'ID',
        title: '文章标题',
        staffName: '成员',
        createTimeName: '创建时间',
        clickViewers: '阅读人数',
        readTimesSecondName: '阅读时长',
        shares: '转发次数',
        statusName: '发布状态',
      };
      exportExcel(excelList, '分享数据', keyJson);
      this.requestParam.limit = limit;
    },
    toView(id, sid, title) {
      logDog('data_staffData');
      console.log(title, 'title==');
      const articleParams = {
        id: id,
        sid: sid,
        isToView: 1,
        title: title,
      };
      this.$emit('toView', '', 3, articleParams);
    },
    changeSortType(type) {
      this.requestParam.sortKey = type;
      this.requestParam.desc = !this.requestParam.desc;
      this.ArticleResponsibility.isReload = true;
    },
    /**
     * @description : 设置requestParam默认值
     * @author      : ADI
     * @Date        : 2021-05-24 15:00:30
     * @param        {*}
     * @return       {*}
     */
    requestParamDefaultValue() {
      this.requestParam.sid = this.isManage ? -1 : this.userInfo.staffInfo.sid; //跟进员工
    },
  },
};
</script>

<style lang="scss" scoped>
.staffData {
  .articleCenter_main {
    .pro_line {
      ::v-deep .tshu_select {
        width: 120px;
      }
    }
  }
  ::v-deep .tanshu-slide-card {
    .slider {
      width: 78px !important;
    }
    .slide-children {
      margin-right: 20px;
    }
  }
  .showArticleList {
    .green {
      display: inline-block;
      width: 5px;
      height: 5px;
      vertical-align: middle;
      background: #247af3;
      border-radius: 50%;
    }
    .red {
      display: inline-block;
      width: 5px;
      height: 5px;
      background: $error-color;
      border-radius: 50%;
    }
    .unactive {
      color: $color-b2;
    }
  }
}
</style>
<style lang="scss">
.staffData .el-table .is-sortable {
  cursor: auto !important;
}
.staffData .showArticleList .el-table__body .el-table__row .cell .tanshu_linkColor {
  margin: 0 5px;
}
</style>
