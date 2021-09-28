<!--
 * @Author       : ADI
 * @Date         : 2021-07-25 09:29:00
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-31 14:04:42
-->
<template>
  <div class="myTaskDetail myTaskContianer">
    <global-ts-header>
      <template v-slot:leftPart>
        <global-ts-tabguide @backToPrePage="backManage">
          <template v-slot:leftPart>我的任务</template>
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
              >（{{ statusList[taskInfo.status - 1] }}）
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
            <span class="targetBlock tanshu_color" v-if="taskInfo.taskType === 1 && taskInfo.targetFormSubmit">
              提交人数 {{ taskInfo.targetFormSubmit }}
            </span>
            <span class="targetBlock tanshu_color" v-if="taskTypeWithShareCal && taskInfo.targetShares">
              销售员分享次数 {{ taskInfo.targetShares }}
            </span>
            <span class="targetBlock tanshu_color" v-if="taskTypeWithPersonCal && taskInfo.targetVisitsViewer">
              访问人数 {{ taskInfo.targetVisitsViewer }}
            </span>
            <span class="targetBlock tanshu_color" v-if="taskTypeWithPersonCal && taskInfo.targetViewers">
              新增访问人数 {{ taskInfo.targetViewers }}
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
      <el-table
        ref="tab"
        :data="[taskInfo]"
        border
        cell-class-name="cellStyle"
        header-row-class-name="employeeHeader"
        box-sizing="border-box"
      >
        <el-table-column
          label="提交人数"
          min-width="60"
          prop="formProportion"
          v-if="taskInfo.taskType === 1 && taskInfo.targetFormSubmit"
        >
          <template> {{ taskInfo.formSubmit }}/{{ taskInfo.targetFormSubmit }} </template>
        </el-table-column>
        <el-table-column
          label="销售员分享次数"
          min-width="60"
          prop="sharesProportion"
          v-if="taskTypeWithShareCal && taskInfo.targetShares"
        >
          <template> {{ taskInfo.shares }}/{{ taskInfo.targetShares }} </template>
        </el-table-column>
        <el-table-column
          label="访问人数"
          min-width="60"
          prop="visitsViewerProportion"
          v-if="taskTypeWithPersonCal && taskInfo.targetVisitsViewer"
        >
          <template> {{ taskInfo.visitsViewer }}/{{ taskInfo.targetVisitsViewer }} </template>
        </el-table-column>
        <el-table-column
          label="新增访问人数"
          min-width="60"
          prop="viewersProportion"
          v-if="taskTypeWithPersonCal && taskInfo.targetViewers"
        >
          <template> {{ taskInfo.viewers }}/{{ taskInfo.targetViewers }} </template>
        </el-table-column>
        <el-table-column label="其他目标" min-width="60" prop="staffName" v-if="taskInfo.otherTarget">
          <template>
            {{ taskInfo.otherTarget || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="完成情况" min-width="60" prop="statusName">
          <template slot-scope="scope">
            <div>
              <span class="point" :class="scope.row.status == 4 ? '' : 'red'"></span>
              <span> {{ scope.row.statusName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="完成时间" min-width="60" prop="fulfilTimeName"></el-table-column>
        <el-table-column label="操作" min-width="60">
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
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getTsMarketingDetail } from '@/api/modules/views/corp-manage/my-task';
import TsImgGfwTip from '@/components/base/ts-img-gfw-tip/index.vue';
import TsQrTip from '@/components/base/ts-qr-tip/index.vue';

export default {
  name: 'task-detail',
  components: { TsImgGfwTip, TsQrTip },
  props: {
    taskId: {
      // 任务id
      type: Number,
      defualt: 0,
    },
  },
  data() {
    return {
      statusList: ['未开始', '未完成', '已过期', '已完成'], // 任务状态,对应的status值[1,2,3,4]
      detailResponsinility: {
        formTableList: [], // 表格数据
      },
      taskInfo: {}, // 任务数据
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
  },
  watch: {},
  created() {
    this.getDetail();
  },
  mounted() {},
  methods: {
    /**
     * 返回我的任务首页
     * @author lymn
     * @date 2020-08-25
     */
    backManage() {
      this.$emit('changeComponent', 'myTaskData');
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
      const [err, res] = await getTsMarketingDetail(params);
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
  },
};
</script>

<style lang="scss" scoped>
.myTaskDetail {
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
    .endBtn {
      min-width: auto;
      margin-right: 10px;
    }
  }
  .targetBlock {
    display: inline-block;
    padding: 6px 8px;
    margin-right: 10px;
    font-size: 14px;
    background: rgba(36, 122, 243, 0.1);
    border: 1px solid #247af3;
    border-radius: 4px;
  }
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
