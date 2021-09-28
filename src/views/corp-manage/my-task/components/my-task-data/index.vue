<!--
 * @Author       : ADI
 * @Date         : 2021-07-25 09:26:18
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-31 14:04:40
-->
<template>
  <div class="myTaskData myTaskContianer">
    <global-ts-header>
      <template v-slot:leftPart>
        我的任务
      </template>
    </global-ts-header>
    <div class="pro_listBox" v-cloak>
      <div class="pro_line">
        <global-ts-input
          style="width: 160px;"
          v-model="requestParam.title"
          @keyup.enter.native="reloadFormData"
          placeholder="任务名称"
        >
        </global-ts-input>
        <global-ts-select
          style="width: 160px;"
          class="moreFilterInput"
          v-model="requestParam.taskType"
          placeholder="全部类型"
          :selectkey="{ label: 'key', value: 'value' }"
          :list="taskTypeListCal"
        >
        </global-ts-select>
        <global-ts-date-picker @updateTime="getSearchTime" :isInit="false"> </global-ts-date-picker>
        <global-ts-button type="primary" size="small" icon="icon-icon-4" ref="button" @click="reloadFormData">
          搜索
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
        <el-table-column label="任务名称" min-width="200">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column label="任务类型" min-width="70" prop="taskTypeName"></el-table-column>
        <el-table-column label="创建人" min-width="70" prop="creatorName">
          <template slot-scope="scope">
            {{ $utils.showStaffName(tsStaffExtraList, scope.row.creator, scope.row.creatorName) }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="155" prop="createTimeName"></el-table-column>
        <el-table-column label="开始时间" min-width="155" prop="startTimeName"></el-table-column>
        <el-table-column label="结束时间" min-width="155" prop="endTimeName"></el-table-column>
        <el-table-column label="任务状态" min-width="70" prop="statusName"></el-table-column>
        <el-table-column label="操作" min-width="90" fixed="right">
          <template slot-scope="scope">
            <ts-qr-tip
              v-if="scope.row.status == 2"
              class="qrTipWrap"
              placement="bottom"
              textOne="扫码打开小程序"
              textTwo="去完成任务"
              bindClass="popover-shareBtn shareTask"
              :width="182"
              trigger="hover"
              :detailId="scope.row.id"
              :isFromTask="true"
            >
              <span class="tanshu_linkColor">去完成</span>
            </ts-qr-tip>
            <span class="tanshu_color operateBtn" @click="seeDetail(scope.row.id)">
              详情
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
// 表格数据中，任务名称后缀状态有未开始、未完成、已完成、已过期四种；完成情况只有已完成、未完成两种状态；因此用不同字段；
import taskCommon from '../../mixins/task-common/index.vue';
import { mapState } from 'vuex';
import TsQrTip from '@/components/base/ts-qr-tip/index.vue';

export default {
  name: 'my-task-data',
  mixins: [taskCommon],
  components: { TsQrTip },
  props: {},
  data() {
    return {
      taskResponsibility: {
        // 表格数据
        initTime: '', // 时间
        formTableList: [], // 表格数据
        isReload: false,
        httpurl: '/rest/manage/marketingDetails/getTsMarketingDetailsList', // 请求地址
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
      requestParam: {
        // 请求数据
        title: '', // 任务标题
        startTime: '', // 开始时间
        endTime: '', // 结束时间
        status: 0, // 任务状态
        taskType: -1, //任务类型
      },
      isInit: false, // 是否初始化
      nowPage: 1,
      limit: 10,
    };
  },
  computed: {
    ...mapState({
      tsStaffExtraList: state => state.user.tsStaffExtraList,
    }),
    taskTypeListCal() {
      return [
        {
          key: '全部类型',
          value: -1,
        },
      ].concat(this.taskTypeList);
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
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
     * @param {Number} id 任务id
     */
    seeDetail(id) {
      this.$emit('changeComponent', 'taskDetail', id);
    },
    /**
     * 更新表格数据
     * @author lymn
     * @date 2020-08-27
     * @param {Object} data 表格数据
     */
    changeTable(data) {
      // if (!this.isInit) {
      // 初始化各状态的数量
      // this.isInit = true;
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
      console.log(this.taskResponsibility.formTableList, '任务列表哈哈哈');
    },
  },
};
</script>

<style lang="scss" scoped>
.my-task-data {
}
</style>
