<!--
 * @Author       : ADI
 * @Date         : 2021-07-19 11:48:20
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-31 14:03:55
-->
<template>
  <div class="allTaskData">
    <global-ts-header>
      <template v-slot:leftPart>
        全部任务
      </template>
      <template v-slot:rightPart>
        <global-ts-button class="pro_header_addEm" type="primary" size="small" icon="icon-icon-11" @click="newAddTask">
          下发任务
        </global-ts-button>
      </template>
    </global-ts-header>
    <div class="pro_listBox" v-cloak>
      <div class="pro_line">
        <ts-select-list
          v-if="isNoOneSelfDataAuth"
          style="width: 160px;"
          class="headSelect floatLeft workList"
          :selectType="1"
          :limitNum="1"
          :depIdList.sync="requestParam.depIdList"
          :sids.sync="requestParam.sidList"
        >
        </ts-select-list>
        <global-ts-input
          style="width: 160px;"
          v-model="requestParam.title"
          @keyup.enter.native="reloadFormData"
          placeholder="任务名称"
        >
        </global-ts-input>
        <global-ts-select
          class="moreFilterInput"
          style="width: 160px;"
          v-model="requestParam.taskType"
          placeholder="全部类型"
          :selectkey="{ label: 'key', value: 'value' }"
          :list="taskTypeListCal"
        >
        </global-ts-select>
        <global-ts-date-picker @updateTime="getSearchTime" :isInit="false"> </global-ts-date-picker>
        <global-ts-button
          type="primary"
          size="small"
          class="queryBtn"
          icon="icon-icon-4"
          ref="button"
          @click="reloadFormData"
          >搜索
        </global-ts-button>
        <global-ts-button type="primary" size="small" icon="icon-daochu" ref="button" @click="onExportExcel">
          导出
        </global-ts-button>
      </div>
      <global-ts-slide
        ref="dataCenterSlider"
        class="tanshu-bottomBorder"
        :activeNum="activeNum"
        :slidArray="slideList"
        @changeStatus="changeResonsibilityStatus"
      >
      </global-ts-slide>
      <el-table
        ref="tab"
        min-width="1010px"
        :data="taskResponsibility.formTableList"
        border
        cell-class-name="cellStyle"
        header-row-class-name="employeeHeader"
        box-sizing="border-box"
      >
        <el-table-column label="序号" type="index" width="50">
          <template slot-scope="scope">
            <span>{{ (nowPage - 1) * limit + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="任务名称" min-width="300">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column label="任务类型" min-width="70" prop="taskTypeName"></el-table-column>
        <el-table-column label="创建人" min-width="80" prop="creatorName">
          <template slot-scope="scope">
            {{ $utils.showStaffName(tsStaffExtraList, scope.row.creator, scope.row.creatorName) }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="160" prop="createTimeName"></el-table-column>
        <el-table-column label="开始时间" min-width="160" prop="startTimeName"></el-table-column>
        <el-table-column label="结束时间" min-width="160" prop="endTimeName"></el-table-column>
        <el-table-column label="完成情况" min-width="80">
          <template slot-scope="scope">
            {{ scope.row.finishedProportion }}
          </template>
        </el-table-column>
        <el-table-column label="任务状态" min-width="80" prop="statusName"></el-table-column>
        <el-table-column label="操作" min-width="180" fixed="right">
          <template slot-scope="scope">
            <span class="tanshu_color text_but1" @click="seeDetail(scope.row.id)">
              详情
            </span>
            <span class="tanshu_color text_but1" @click="editTask(scope.row.id)" v-if="scope.row.status == 1">
              编辑
            </span>
            <span class="tanshu_color operateBtn red" @click="finishTask(scope.row.id)" v-if="scope.row.status < 3">
              结束任务
            </span>
          </template>
        </el-table-column>
      </el-table>
      <global-ts-pagination
        ref="formPagination"
        :tableData="taskResponsibility.formTableList"
        :isJson="true"
        :requestParam="requestParam"
        :isReload.sync="taskResponsibility.isReload"
        @getData="changeTable"
        @sendPageInfo="sendPageInfo"
        :httpurl="taskResponsibility.httpurl"
        :httpConfigByJson="true"
      >
      </global-ts-pagination>
    </div>
  </div>
</template>

<script>
import TsSelectList from '@/components/base/ts-select-list/index.vue';
import taskCommon from '../../mixins/task-common/index.vue';
import { mapGetters, mapState } from 'vuex';
import versionDef from '@/config/version-def';
import { confirm, getWorkerList, exportExcel, postLimitVer } from '@/utils';
import { getTsMarketingTaskList, finishTsMarketing } from '@/api/modules/views/corp-manage/all-task';

export default {
  name: 'all-task-data',
  mixins: [taskCommon],
  components: { TsSelectList },
  props: {},
  data() {
    return {
      taskResponsibility: {
        // 表格数据
        staffList: [], // 员工列表
        initTime: '', // 时间
        formTableList: [], // 表格数据
        isReload: false, // 是否重新加载
        httpurl: '/rest/manage/marketingTask/getTsMarketingTaskList', // 请求地址
      },
      requestParam: {
        // 请求数据
        sid: -1, //跟进员工
        sidListStr: '[]', // 多名员工
        depIdList: '', // 部门
        title: '', // 任务名称
        startTime: '', // 开始时间
        endTime: '', // 结束时间
        status: 0,
        isGetAll: false, // 是否
        taskType: -1, //任务类型
      },
      slideList: [
        // 任务状态分类，注意已完成和已过期的value值（不是按照顺序排序的数字）
        {
          key: '全部（0）',
          value: 0,
        },
        {
          key: '未开始（0）',
          value: 1,
        },
        {
          key: '未完成（0）',
          value: 2,
        },
        {
          key: '已完成（0）',
          value: 4,
        },
        {
          key: '已过期（0）',
          value: 3,
        },
      ],
      activeNum: 0,
      isInit: false, // 是否初始化
      nowPage: 1,
      limit: 10,
    };
  },
  computed: {
    ...mapGetters({
      isManage: 'user/isManage',
      isCanSelect: 'user/isNoOneSelfDataAuth',
      isNoOneSelfDataAuth: 'user/isNoOneSelfDataAuth',
    }),
    ...mapState({
      userInfo: state => state.user.info,
      functionInfo: state => state.globalData?.functionInfo,
      tsStaffExtraList: state => state.user.tsStaffExtraList,
      addressUrl: state => state.globalData.addressUrl,
    }),
    taskTypeListCal() {
      return [
        {
          key: '全部类型',
          value: -1,
        },
      ].concat(this.taskTypeList);
    },
    limitVer() {
      return versionDef.getLimitVer('STANDARD', 'BASE');
    },
  },
  watch: {},
  created() {
    this.requestParamDefaultValue();
    this.getTsStaffList();
  },
  mounted() {},
  methods: {
    /**
     * 下发任务
     * @author lymn
     * @date 2020-08-24
     */
    newAddTask() {
      if (!versionDef.getFunctionLimit('marketingTask').condition) {
        postLimitVer(`该功能为${versionDef.getVersionName(this.limitVer)}功能`, 0, 4);
      } else {
        this.$emit('changeComponent', 'taskNewAdd');
      }
    },
    editTask(id) {
      this.$emit('changeComponent', 'taskNewAdd', id);
    },
    sendPageInfo(obj) {
      this.nowPage = obj.pageNow;
      this.limit = obj.limit;
    },
    /**
     * 设置搜索时间
     * @author lymn
     * @date 2020-08-24
     * @param {Array} val 存放开始和结束时间
     */
    getSearchTime(val) {
      this.taskResponsibility.initTime = val;
      this.requestParam.startTime = (val && val[0]) || '';
      this.requestParam.endTime = (val && val[1]) || '';
    },
    /**
     * 更新数据
     * @author lymn
     * @date 2020-08-24
     */
    reloadFormData() {
      this.taskResponsibility.isReload = true;
    },
    /**
     * 导出
     * @author lymn
     * @date 2020-08-24
     */
    async onExportExcel() {
      this.requestParam.isGetAll = true;
      const [err, res] = await getTsMarketingTaskList(this.requestParam);
      this.requestParam.isGetAll = false;
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '系统错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      const excelList = [...res.data.list];
      const keyJson = {
        title: '任务名称',
        taskTypeName: '任务类型',
        creatorName: '创建人',
        createTimeName: '创建时间',
        startTimeName: '开始时间',
        endTimeName: '结束时间',
        finishedProportion: '完成情况',
        statusName: '任务状态',
      };
      const { totalCnt, notStartCnt, onGoingCnt, completedCnt, finishedCnt } = res.data; // 每个状态的数量 全部、未开始、未完成、已完成、已过期
      const headerInfo = `全部任务：${totalCnt}个，未开始：${notStartCnt}个，未完成：${onGoingCnt}个，已完成：${completedCnt}个，已过期：${finishedCnt}个`; // 表头信息
      exportExcel(excelList, '全部任务', keyJson, undefined, headerInfo);
    },
    /**
     * 切换分类
     * @author lymn
     * @date 2020-08-24
     * @param {object} e node节点
     * @param {Number} value 选中一级分类的value
     */
    changeResonsibilityStatus(e, value, index) {
      this.activeNum = value;
      this.requestParam.status = value;
      this.reloadFormData();
    },
    /**
     * 查看详情
     * @author lymn
     * @date 2020-08-24
     * @param {Number} id 文章的id
     */
    seeDetail(id) {
      this.$emit('changeComponent', 'taskDetail', id);
    },
    /**
     * 结束任务
     * @author lymn
     * @date 2020-08-24
     * @param {Number} id 要删除的任务id
     */
    finishTask(id) {
      confirm('确定结束该任务？', '结束确认').then(async () => {
        const [err, res] = await finishTsMarketing({ id });
        if (err) {
          this.$utils.postMessage({
            type: 'error',
            message: err.msg || '系统错误，请稍候重试',
          });
          return Promise.reject(err);
        }
        this.reloadFormData();
      });
    },
    /**
     * 更新表格数据
     * @author lymn
     * @date 2020-08-27
     * @param {Object} data 表格数据
     */
    changeTable(data, all) {
      // 更新各状态的数量
      const { totalCnt, notStartCnt, onGoingCnt, completedCnt, finishedCnt } = data;
      const numArr = [totalCnt, notStartCnt, onGoingCnt, completedCnt, finishedCnt];
      const slideTextList = ['全部', '未开始', '未完成', '已完成', '已过期'];
      this.slideList.forEach((val, index) => {
        if (val.num == 'undefind' || val.num != numArr[index]) {
          val.key = `${slideTextList[index]}（${numArr[index]}）`;
          val.num = numArr[index];
          this.$set(this.slideList, index, val);
        }
      });
      // }
      this.taskResponsibility.formTableList = data.list;
    },
    /**
     * 获取员工列表
     * @author lymn
     * @returns {Promise} 获取到数据后回调
     */
    getTsStaffList() {
      return new Promise(resolve => {
        if (this.isCanSelect) {
          getWorkerList().then(list => {
            this.taskResponsibility.staffList = list[0];
            this.taskResponsibility.staffList = this.taskResponsibility.staffList.filter(item => item.sid != 0);
            if (list[1] == 2) {
              //销售员
              this.taskResponsibility.sid = this.taskResponsibility.staffList.sid;
            }
            resolve();
          });
        } else {
          resolve();
        }
      });
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
.allTaskData {
  .queryBtn {
    margin-right: 10px;
  }
  .disabled {
    color: $color-b2;
    cursor: not-allowed;
  }
  .headSelect {
    .tagBox {
      width: 160px;
    }
  }
}
</style>
<style lang="scss">
.allTaskData {
  .el-table__fixed-right {
    &::before {
      background: none;
    }
  }
}
</style>
