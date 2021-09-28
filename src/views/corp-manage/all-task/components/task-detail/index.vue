<!--
 * @Author       : ADI
 * @Date         : 2021-07-19 11:59:37
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-31 14:04:07
-->
<template>
  <div class="taskDetail">
    <global-ts-header>
      <template v-slot:leftPart>
        <global-ts-tabguide @backToPrePage="backManage">
          <template v-slot:leftPart>全部任务</template>
          <template v-slot:rightPart>任务详情</template>
        </global-ts-tabguide>
      </template>
    </global-ts-header>
    <div class="pro_listBox">
      <div class="detailInfo">
        <div class="detailItem">
          <span class="title">任务名称：</span>
          <span class="content">
            {{ taskInfo.title }}
            <span
              v-if="taskInfo.statusName"
              :class="taskInfo.status == 1 ? 'red' : taskInfo.status == 2 ? 'tanshu_color' : 'grey'"
              >（{{ taskInfo.statusName }}）
            </span>
          </span>
        </div>
        <div class="detailItem">
          <span class="title">任务类型：</span>
          <span class="content">{{ taskTypeNameList[taskInfo.taskType] }}</span>
        </div>
        <div class="detailItem" v-if="taskTypeWithPersonCal">
          <span class="title">{{ taskTitleList[taskInfo.taskType] }}标题：</span>
          <span class="content" v-if="taskInfo.targetTitle">{{ taskInfo.targetTitle }}</span>
          <span class="content" v-else>{{ taskTypeContentArr[taskInfo.taskType] }}</span>
        </div>
        <div class="detailItem" v-else>
          <span class="title">{{ taskTitleList[taskInfo.taskType] }}：</span>
          <span class="content">{{ taskInfo.taskContent }}</span>
        </div>
        <div class="contentImgBoxList" v-if="taskInfo.pidImgUrlList && taskInfo.pidImgUrlList.length > 0">
          <div class="contentImgBox" v-for="item in taskInfo.pidImgUrlList" :key="item.imgId">
            <img class="contentImg" :src="item.pidImgUrl" />
            <ts-img-gfw-tip :gfwStatus="item.gfwStatus" :gfwStatusReason="item.gfwStatusReason"> </ts-img-gfw-tip>
          </div>
        </div>
        <div class="detailItem">
          <span class="title">任务目标：</span>
          <span class="content">
            <span class="targetBlock tanshu_color" v-if="taskInfo.taskType === 1 && taskInfo.formSubmit">
              提交人数 {{ taskInfo.formSubmit }}
            </span>
            <span class="targetBlock tanshu_color" v-if="taskTypeWithShareCal && taskInfo.shares">
              销售员分享次数 {{ taskInfo.shares }}
            </span>
            <span class="targetBlock tanshu_color" v-if="taskTypeWithPersonCal && taskInfo.visitsViewer">
              访问人数 {{ taskInfo.visitsViewer }}
            </span>
            <span class="targetBlock tanshu_color" v-if="taskTypeWithPersonCal && taskInfo.viewers">
              新增访问人数 {{ taskInfo.viewers }}
            </span>
            <span class="targetBlock tanshu_color" v-if="taskInfo.isNeedEvidence && taskTypeEvidenceCal">
              上传完成凭证
            </span>
            <span class="targetBlock tanshu_color" v-if="taskInfo.otherTarget">
              {{ taskInfo.otherTarget }}
            </span>
          </span>
        </div>
        <div class="detailItem">
          <span class="title">任务时间：</span>
          <span class="content">{{ taskInfo.startTimeName }} 至 {{ taskInfo.endTimeName }}</span>
        </div>
        <div class="detailItem" v-if="taskInfo.integralStr">
          <span class="title">任务奖惩：</span>
          <span class="content">
            {{ taskInfo.integralStr }}
          </span>
        </div>
      </div>
      <div class="detailBtn">
        <global-ts-button class="headerBtn" size="small" @click="editTask" v-if="taskInfo.status == 1">
          编辑
        </global-ts-button>
        <global-ts-button
          class="headerBtn endBtn"
          size="small"
          :type="'warnText'"
          @click="finishTask"
          v-if="taskInfo.status < 3"
        >
          结束
        </global-ts-button>
        <global-ts-button class="headerBtn" size="small" @click="onExportExcel">导出数据</global-ts-button>
      </div>
      <global-ts-slide
        ref="dataCenterSlider"
        class="tanshu-bottomBorder"
        :activeNum="requestParam.status"
        :slidArray="slideList"
        @changeStatus="changeResonsibilityStatus"
      >
      </global-ts-slide>
      <el-table
        ref="tab"
        :data="detailResponsinility.formTableList"
        :empty-text="isShowEmptyTips"
        border
        cell-class-name="cellStyle"
        header-row-class-name="employeeHeader"
        box-sizing="border-box"
      >
        <el-table-column label="接收人" min-width="60" key="staffName" prop="staffName"></el-table-column>
        <el-table-column
          label="提交人数"
          key="formProportion"
          min-width="60"
          prop="formProportion"
          v-if="taskInfo.taskType === 1 && taskInfo.formSubmit"
        >
          <template slot-scope="scope"> {{ scope.row.formSubmit }}/{{ scope.row.targetFormSubmit }} </template>
        </el-table-column>
        <el-table-column
          label="销售员分享次数"
          key="sharesProportion"
          min-width="60"
          prop="sharesProportion"
          v-if="taskTypeWithShareCal && taskInfo.shares"
        >
          <template slot-scope="scope"> {{ scope.row.shares }}/{{ scope.row.targetShares }} </template>
        </el-table-column>
        <el-table-column
          label="访问人数"
          key="visitsViewerProportion"
          min-width="60"
          prop="visitsViewerProportion"
          v-if="taskTypeWithPersonCal && taskInfo.visitsViewer"
        >
          <template slot-scope="scope"> {{ scope.row.visitsViewer }}/{{ scope.row.targetVisitsViewer }} </template>
        </el-table-column>
        <el-table-column
          label="新增访问人数"
          key="viewersProportion"
          min-width="60"
          prop="viewersProportion"
          v-if="taskTypeWithPersonCal && taskInfo.viewers"
        >
          <template slot-scope="scope"> {{ scope.row.viewers }}/{{ scope.row.targetViewers }} </template>
        </el-table-column>
        <el-table-column
          label="其他目标"
          min-width="60"
          prop="otherTarget"
          key="otherTarget"
          v-if="taskInfo.otherTarget"
        >
          <template slot-scope="scope">
            {{ scope.row.otherTarget || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="完成情况" min-width="60" prop="statusName" key="statusName">
          <template slot-scope="scope">
            <div>
              <span class="point" :class="scope.row.detailStatus == 4 ? '' : 'red'"></span>
              <span> {{ scope.row.statusName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="完成时间" min-width="60" prop="fulfilTimeName"></el-table-column>
        <el-table-column label="完成凭证" min-width="60" v-if="taskInfo.isNeedEvidence && taskTypeEvidenceCal">
          <template slot-scope="scope">
            <span
              v-if="scope.row.evidenceImgUrl"
              class="tanshu_color operateBtn"
              @click="previewImg(scope.row.evidenceImgUrl)"
              :class="scope.row.status > 0 ? 'disabled' : ''"
            >
              查看
            </span>
            <span v-else>未上传</span>
          </template>
        </el-table-column>
      </el-table>
      <global-ts-pagination
        ref="formPagination"
        :tableData="detailResponsinility.formTableList"
        :requestParam="requestParam"
        :isReload.sync="detailResponsinility.isReload"
        @getData="changeTable"
        :httpurl="detailResponsinility.httpurl"
      >
      </global-ts-pagination>
      <ts-preview-picture :previewVisible.sync="previewVisible" :previewImgUrl="previewImgUrl"> </ts-preview-picture>
    </div>
  </div>
</template>

<script>
import TsImgGfwTip from '@/components/base/ts-img-gfw-tip/index.vue';
import TsPreviewPicture from '@/components/base/ts-preview-picture/index.vue';
import { confirm, exportExcel } from '@/utils';
import {
  finishTsMarketingAjax,
  getTsMarketingTask,
  getTsMarketingDetailsListById,
} from '@/api/modules/views/corp-manage/all-task';

export default {
  name: 'task-detail',
  components: { TsImgGfwTip, TsPreviewPicture },
  props: {
    taskId: {
      // 任务id
      type: Number,
      defualt: 0,
    },
  },
  data() {
    return {
      previewVisible: false,
      previewImgUrl: '',
      currentComponent: 'taskDetail',
      slideVal: 2,
      slideList: [
        // 任务状态列表
        {
          key: '全部（0）',
          value: 0,
        },
        {
          key: '未查看（0）',
          value: 3,
        },
        {
          key: '未完成（0）',
          value: 1,
        },
        {
          key: '已完成（0）',
          value: 2,
        },
      ],
      taskTypeNameList: [
        '分享文章',
        '分享表单',
        '分享文件',
        '分享海报',
        '发朋友圈',
        '其他',
        '分享活动',
        '分享传单',
        '分享视频',
      ],
      taskTitleList: ['文章', '表单', '文件', '海报', '朋友圈内容', '任务内容', '活动', '传单', '视频'],
      taskTypeContentArr: [
        '任意文章',
        '任意表单',
        '任意文件',
        '任意海报',
        '发朋友圈',
        '普通任务',
        '任意活动',
        '任意传单',
        '任意视频',
      ],
      taskInfo: {}, // 任务信息
      detailResponsinility: {
        formTableList: [], // 表格数据
        isReload: false, // 是否重新加载
        httpurl: '/rest/manage/marketingDetails/getTsMarketingDetailsListById', // 请求路径
      },
      isCreating: false, //是否显示正在创建任务中
      formTableList: [],
      requestParam: {
        taskId: 0, // 任务id
        status: 0, // 任务状态 0：全部 1：未完成 2：已完成
        isGetAll: false,
        seen: -1,
      }, // 请求数据
      isInit: false, // 是否初始化
    };
  },
  computed: {
    taskTypeEvidenceCal() {
      return [3, 4, 5].includes(this.taskInfo.taskType);
    },
    taskTypeFriendCal() {
      return [4, 5].includes(this.taskInfo.taskType);
    },
    /**
     * 必须的任务类型
     * @author waldon
     * @date 2020-10-31
     * @return {Boolean} - 必须的任务类型
     */
    taskTypeWithRequiredCal() {
      return [1, 2, 6, 7, 8].includes(this.taskInfo.taskType);
    },
    /**
     * 带访问人数的任务类型
     * @author waldon
     * @date 2020-10-31
     * @return {Boolean} - 带访问人数的任务类型
     */
    taskTypeWithShareCal() {
      return [0, 1, 2, 6, 7, 8].includes(this.taskInfo.taskType);
    },
    /**
     * 带访问人数的任务类型
     * @author waldon
     * @date 2020-10-31
     * @return {Boolean} - 带访问人数的任务类型
     */
    taskTypeWithPersonCal() {
      return [0, 1, 2, 3, 6, 7, 8].includes(this.taskInfo.taskType);
    },
    isShowEmptyTips() {
      return this.isCreating ? '正在创建任务中' : '暂无数据';
    },
  },
  watch: {
    'requestParam.status'(newVal) {
      if (newVal == 3) {
        this.requestParam.seen = 0;
      } else {
        this.requestParam.seen = -1;
      }
    },
  },
  created() {
    this.getDetail();
    this.requestParam.taskId = this.taskId;
  },
  mounted() {},
  methods: {
    previewImg(img) {
      this.previewImgUrl = img;
      this.previewVisible = true;
    },
    editTask(id) {
      this.$emit('changeComponent', 'taskNewAdd', this.taskInfo.id);
    },
    /**
     * 返回全部任务
     * @author lymn
     * @date 2020-08-24
     */
    backManage() {
      this.$emit('changeComponent', 'allTaskData');
    },
    /**
     * 切换分类
     * @author lymn
     * @date 2020-08-24
     * @param {object} e node节点
     * @param {Number} value 选中一级分类的value
     */
    changeResonsibilityStatus(e, value) {
      this.requestParam.status = value;
      this.detailResponsinility.isReload = true;
      console.log(value, '选择分类');
    },
    /**
     * 更新数据
     * @author lymn
     * @date 2020-08-24
     * @param {Array} Object 获取的数据列表
     */
    changeTable(data) {
      // 初始化各状态的数量
      this.isInit = true;
      const { totalCnt, unCompletedCnt, completedCnt, notSeenCnt } = data;
      const numArr = [totalCnt, notSeenCnt, unCompletedCnt, completedCnt];
      const slideTextList = ['全部', '未查看', '未完成', '已完成'];
      this.slideList.forEach((val, index) => {
        val.key = `${slideTextList[index]}（${numArr[index]}）`;
      });
      this.detailResponsinility.formTableList = data.list;
      this.isCreating = data.isInit;
    },
    /**
     * 结束任务
     * @author lymn
     * @date 2020-08-24
     */
    finishTask() {
      confirm('确定结束该任务？', '结束确认').then(async () => {
        const [err, res] = await finishTsMarketingAjax({ id: this.taskId });
        if (err) {
          this.$utils.postMessage({
            type: 'error',
            message: err.msg || '系统错误，请稍候重试',
          });
          return Promise.reject(err);
        }
        this.$emit('changeComponent', 'allTaskData');
      });
    },
    /**
     * 获取任务详情
     * @author lymn
     * @date 2020-08-31
     */
    async getDetail() {
      const params = {
        id: this.taskId,
      };
      const [err, res] = await getTsMarketingTask(params);
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '系统错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.taskInfo = res.data;
      console.log(this.taskInfo, '任务信息');
    },
    /**
     * 导出
     * @author lymn
     * @date 2020-08-31
     */
    async onExportExcel() {
      this.requestParam.isGetAll = true;
      const [err, res] = await getTsMarketingDetailsListById(this.requestParam);
      this.requestParam.isGetAll = false;
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '系统错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      const excelList = [...res.data.list];
      let keyJson = {
        staffName: '接收人',
      };
      let taskTarget = '任务目标：';
      const targetTitle = this.taskInfo.targetTitle || this.taskTypeContentArr[this.taskInfo.taskType];
      const taskTitle = this.taskTypeFriendCal
        ? `${this.taskTitleList[this.taskInfo.taskType]}：${this.taskInfo.taskContent}`
        : `${this.taskTitleList[this.taskInfo.taskType]}标题：${targetTitle}`;

      if (this.taskInfo.taskType === 1 && this.taskInfo.formSubmit) {
        keyJson = Object.assign(keyJson, { formProportion: '提交人数' });
        taskTarget += `提交人数：${this.taskInfo.formSubmit} `;
      }
      if (this.taskTypeWithShareCal && this.taskInfo.shares) {
        keyJson = Object.assign(keyJson, { sharesProportion: '销售员分享次数' });
        taskTarget += `销售员分享次数${this.taskInfo.shares} `;
      }
      if (this.taskTypeWithPersonCal && this.taskInfo.visitsViewer) {
        keyJson = Object.assign(keyJson, { visitsViewerProportion: '访问人数' });
        taskTarget += `访问人数：${this.taskInfo.visitsViewer} `;
      }
      if (this.taskTypeWithPersonCal && this.taskInfo.viewers) {
        keyJson = Object.assign(keyJson, { viewersProportion: '新增访问人数' });
        taskTarget += `新增访问人数：${this.taskInfo.viewers} `;
      }
      if (this.taskTypeEvidenceCal && this.taskInfo.isNeedEvidence) {
        taskTarget += '上传完成凭证 ';
      }
      if (this.taskInfo.otherTarget) {
        keyJson = Object.assign(keyJson, { otherTarget: '其他目标' });
        taskTarget += `其他目标：${this.taskInfo.otherTarget}`;
      }
      keyJson = Object.assign(keyJson, {
        statusName: '完成情况',
        fulfilTimeName: '完成时间',
      });
      const { totalCnt, unCompletedCnt, completedCnt, notSeenCnt } = res.data; // 每个状态的数量 全部、未完成、已完成
      const headerInfo = [
        // 表头信息
        `任务名称：${this.taskInfo.title}`,
        `任务类型：${this.taskTypeNameList[this.taskInfo.taskType]}`,
        `${taskTarget}`,
        `${taskTitle}`,
        `任务时间：${this.taskInfo.startTimeName} 至 ${this.taskInfo.endTimeName}`,
        `任务完成情况：全部：${totalCnt}，未查看：${notSeenCnt}，未完成：${unCompletedCnt}，已完成：${completedCnt}`,
      ];
      if (this.taskInfo.integralStr) {
        headerInfo.push(`任务奖惩：${this.taskInfo.integralStr}`);
      }
      if (this.taskInfo.articleTitle) {
        // 如果有指定文章
        const headerText = `指定文章：${this.taskInfo.articleTitle}`;
        headerInfo.splice(1, 0, headerText);
      }
      exportExcel(excelList, '任务详情', keyJson, undefined, headerInfo);
    },
  },
};
</script>

<style lang="scss" scoped>
.taskDetail {
  .detailInfo {
    .detailItem {
      margin-bottom: 20px;
      font-size: 14px;
      .red {
        color: #f88304;
      }
      .grey {
        color: $color-b2;
      }
      .content {
        word-break: break-all;
      }
    }
    .contentImgBoxList {
      display: flex;
      margin-bottom: 20px;
      .contentImg {
        width: 80px;
        height: 80px;
        border: 1px solid $border-color;
        border-radius: 4px;
        box-sizing: border-box;
      }
    }
    .contentImgBox {
      position: relative;
      margin-right: 20px;
      .gfwBox {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 80px;
        height: 34px;
        margin: auto;
        font-size: 12px;
        line-height: 34px;
        color: $error-color;
        text-align: center;
        background: #fef0f0;
        .helpIcon {
          &.icon {
            width: 12px;
            height: 12px;
            margin: 0 2px 0 0;
            fill: $error-color;
          }
        }
      }
    }
  }
  .detailBtn {
    margin-bottom: 20px;
    .headerBtn {
      min-width: auto;
      margin-right: 10px;
    }
    .endBtn {
      color: #ffffff;
      background-color: $error-color;
    }
  }
  .targetBlock {
    display: inline-block;
    height: 26px;
    padding: 0 8px;
    margin-right: 10px;
    font-size: 12px;
    line-height: 26px;
    text-align: center;
    background: rgba(36, 122, 243, 0.1);
    border: 1px solid #247af3;
    border-radius: 4px;
  }
}
</style>

<style lang="scss">
.taskDetail {
  .pro_listBox {
    .el-table {
      .point {
        display: inline-block;
        width: 5px;
        height: 5px;
        vertical-align: middle;
        background: #247af3;
        border-radius: 50%;
      }
      .red {
        background: $error-color;
      }
    }
  }
}
</style>
