<!--
 * @Author       : ADI
 * @Date         : 2021-04-01 13:50:45
 * @LastEditors  : ADI
 * @LastEditTime : 2021-05-24 11:08:15
-->
<template>
  <div id="ts-dataInfo" class="tanshu-dataInfo ts-dataInfo" v-show="isShow">
    <global-ts-tabguide @backToPrePage="backLast">
      <template v-slot:leftPart>{{ leftPartText }}</template>
      <template v-slot:rightPart>访客详情</template>
    </global-ts-tabguide>
    <div class="pro_listBox">
      <div class="topPart">
        <div class="infoBox">
          <div>
            <p>微信名称</p>
            <span>{{ name }}</span>
          </div>
          <div>
            <p>手机号码</p>
            <span>{{ wxMobile }}</span>
          </div>
          <div>
            <p>精准用户</p>
            <span>{{ isQualityName }}</span>
          </div>
          <div v-if="requestParam.shares == 1">
            <p>总浏览次数</p>
            <span>{{ dataDetail.statInfo.clicks }}</span>
          </div>
          <div v-if="requestParam.shares == 1">
            <p>总浏览时长</p>
            <span>{{ dataDetail.statInfo.readTimesSecond | formatDate }}</span>
          </div>
          <div v-if="requestParam.shares == 2">
            <p>转发总次数</p>
            <span>{{ dataDetail.statInfo.shares }}</span>
          </div>
          <div v-if="requestParam.shares == 3">
            <p>表单提交次数</p>
            <span>{{ relNum }}</span>
          </div>
        </div>
      </div>
      <div class="pro_line">
        <global-ts-input
          v-if="[1, 2].includes(requestParam.shares)"
          style="width: 200px;"
          v-model="requestParam.viewerTitle"
          placeholder="文章标题"
          @keyup.enter.native="reloadDataDetail"
        >
        </global-ts-input>
        <el-select
          v-if="[3].includes(requestParam.shares)"
          class="toFormList"
          size="small"
          v-model="requestParam.templateId"
          placeholder="表单标题"
        >
          <el-option v-for="item in formSelectList" :key="item.value" :label="item.key" :value="item.value">
          </el-option>
        </el-select>
        <global-ts-date-picker @updateTime="getSearchTime" defaultStartTime="year"> </global-ts-date-picker>
        <global-ts-button type="primary" size="small" icon="icon-icon-4" ref="button" @click="reloadDataDetail">
          搜索
        </global-ts-button>
        <global-ts-button type="primary" size="small" icon="icon-daochu" ref="button" @click="onExportExcel">
          导出
        </global-ts-button>
      </div>
      <global-ts-slide
        v-if="isShow"
        class="bottomBorder"
        :issave="issave"
        :activeNum="requestParam.shares"
        :slidArray="dataDetail.resonsibilityStatusDef"
        @changeStatus="changeResonsibilityStatus"
      >
      </global-ts-slide>
      <div class="showTabList">
        <el-table
          v-show="isShowData"
          :class="'tshu-tableset'"
          :data="dataDetail.dataList"
          border
          min-width="1010px"
          header-row-class-name="employeeHeader"
          cell-class-name="cellStyle"
        >
          <template v-if="version" slot="empty">
            <p>当前版本无法查看客户数据，请升级版本。</p>
          </template>
          <el-table-column
            v-cloak
            v-if="[1, 2].includes(requestParam.shares)"
            key="articleTitle"
            prop="articleTitle"
            label="文章标题"
            min-width="240px"
          ></el-table-column>
          <el-table-column
            v-cloak
            v-if="requestParam.shares == 1"
            key="clicks"
            prop="clicks"
            label="浏览次数"
            min-width="40px"
          ></el-table-column>
          <el-table-column
            v-cloak
            v-if="requestParam.shares == 1"
            key="readTimesSecond"
            prop="readTimesSecond"
            :formatter="timeFormat"
            label="总浏览时长"
            min-width="50px"
          ></el-table-column>
          <el-table-column
            v-cloak
            v-if="requestParam.shares == 1"
            key="lastReadTimesSecond"
            prop="lastReadTimesSecond"
            :formatter="timeFormat"
            label="最近一次浏览时长"
            min-width="60px"
          ></el-table-column>
          <el-table-column
            v-cloak
            v-if="requestParam.shares == 1"
            prop="lastVisitTime"
            :formatter="dateFormat"
            key="lastVisitTime"
            label="最近浏览时间"
            min-width="80px"
          >
          </el-table-column>
          <el-table-column
            v-cloak
            v-if="requestParam.shares == 2"
            key="shares"
            prop="shares"
            label="转发次数"
            min-width="80px"
          ></el-table-column>
          <el-table-column
            v-cloak
            v-if="requestParam.shares == 2"
            prop="lastShareTime"
            key="lastShareTime"
            :formatter="dateFormat"
            label="最近转发时间"
            min-width="80px"
          >
          </el-table-column>
          <el-table-column
            v-cloak
            v-if="[3].includes(requestParam.shares)"
            key="title"
            prop="title"
            label="表单标题"
            min-width="100px"
          ></el-table-column>
          <el-table-column
            v-cloak
            v-if="requestParam.shares == 3"
            key="commitTime"
            prop="commitTime"
            label="提交时间"
            min-width="60px"
          ></el-table-column>
          <el-table-column v-cloak v-if="requestParam.shares == 3" label="操作" min-width="50px">
            <template slot-scope="scope">
              <span class="tanshu_linkColor" @click="showDataInfo(scope.row)">详情 </span>
            </template>
          </el-table-column>
        </el-table>
        <div class="showFormDetailData" v-show="showDetailForm">
          <global-ts-tabguide @backToPrePage="backForm">
            <template v-slot:leftPart>返回</template>
          </global-ts-tabguide>
          <table class="formTable">
            <tr v-for="(item, index) in formDatas" :key="index">
              <td class="column table-header">
                <div class="cell">{{ item.name }}</div>
              </td>
              <td class="column">
                <div class="cell">{{ item.data }}</div>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <global-ts-pagination
        v-show="isShowData"
        :tableData="dataDetail.dataList"
        :requestParam="requestParam"
        :isReload.sync="isReload"
        @getData="changeTable"
        :httpurl="dataDetail.httpurl"
      >
      </global-ts-pagination>
    </div>
  </div>
</template>

<script>
import versionDef from '@/config/version-def';
import { Table, TableColumn, Select, Option } from 'element-ui';
import { setSearchDate, postMessage, exportExcel } from '@/utils';
import {
  getTsViewerArtcileList,
  getTempCiStatAndCiRec,
  getTempSelectList,
  getTsFormCiRecDetail,
} from '@/api/modules/component/table-data-info';

export default {
  name: 'ts-data-info',
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Select.name]: Select,
    [Option.name]: Option,
  },
  data() {
    return {
      infoType: 'article', // 类型
      isShowData: true,
      showDetailForm: false, // 是否显示表单的详细信息
      version: versionDef.checkIsFree(),
      name: '',
      wxMobile: '-',
      isQualityName: '',
      relNum: '-',
      beforeLoading: {
        haveLoadStatus: false, //是否已经load了状态
      },
      dataDetail: {
        resonsibilityStatusDef: [
          {
            key: '文章浏览记录',
            value: 1,
          },
          {
            key: '文章转发记录',
            value: 2,
          },
          {
            key: '表单提交记录',
            value: 3,
          },
        ],
        id: '',
        dataList: [],
        httpurl: '',
        statInfo: {},
      },
      isShow: true,
      isReload: false,
      requestParam: {
        shares: 1,
        viewerId: '',
        articleId: '',
        timeStart: '',
        timeEnd: '',
        time: '',
        viewerTitle: '',
        templateId: '',
      },
      formDatas: [],
      issave: false, // 在formData有用到
      formSelectList: [],
    };
  },
  computed: {
    leftPartText() {
      let leftPartText = '';
      switch (this.infoType) {
        case 'article':
          leftPartText = '文章数据';
          break;
        case 'form':
          leftPartText = '表单数据';
          break;
        case 'clue':
          leftPartText = '线索池';
      }
      return leftPartText;
    },
    placeholderText() {
      let placeholderText = '';
      switch (this.infoType) {
        case 'article':
          placeholderText = '文章标题';
          break;
        case 'form':
          placeholderText = '表单标题';
          break;
      }
      return placeholderText;
    },
  },
  filters: {
    formatDate(value) {
      const hour = Math.floor(value / 3600);
      const seconds = value % 60;
      const minutes = (value - hour * 3600 - seconds) / 60;
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
  },
  created() {
    var _self = this;
    document.onkeydown = function(e) {
      var key = window.event.keyCode;

      if (key === 13) {
        _self.reloadDataDetail();
      }
    };
  },
  methods: {
    // 导出数据
    async onExportExcel() {
      let ajax = getTsViewerArtcileList;
      if (this.requestParam.shares == 3) {
        ajax = getTempCiStatAndCiRec;
      }
      const [err, response] = await ajax(Object.assign({}, this.requestParam, { limit: 20000 }));
      if (err) {
        postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return err;
      }
      let excelList = null;
      let keyJson = {};
      switch (this.requestParam.shares) {
        case 1:
          excelList = response.data.infoList;
          keyJson = {
            articleTitle: '文章标题',
            clicks: '浏览次数',
            readTimesSecond: '总浏览时长',
            lastReadTimesSecond: '最近一次浏览时长',
            lastVisitTime: '最近浏览时间',
          };
          break;
        case 2:
          excelList = response.data.infoList;
          keyJson = {
            articleTitle: '文章标题',
            shares: '转发次数',
            lastShareTime: '最近转发时间',
          };
          break;
        case 3:
          excelList = response.data.commitList;
          keyJson = {
            title: '表单标题',
            commitTime: '提交时间',
          };
          break;
      }
      excelList.forEach(data => {
        if (data.lastVisitTime) {
          data.lastVisitTime = this.dateFormat(0, 0, data.lastVisitTime);
        }
        if (data.readTimesSecond) {
          data.readTimesSecond = this.timeFormat(0, 0, data.readTimesSecond);
        }
        if (data.lastReadTimesSecond) {
          data.lastReadTimesSecond = this.timeFormat(0, 0, data.lastReadTimesSecond);
        }
        if (data.lastShareTime) {
          data.lastShareTime = this.dateFormat(0, 0, data.lastShareTime);
        }
      });
      exportExcel(excelList, '访客详情', keyJson);
    },
    timeFormat(row, column, timeInfo) {
      let timeLong;
      if (timeInfo) {
        timeLong = timeInfo;
      } else if (row && column) {
        timeLong = column != '' ? row[column.property] : row;
      }
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
    dateFormat(row, column, dateInfo) {
      let date;
      if (dateInfo) {
        date = new Date(dateInfo);
      } else if (row && column) {
        var date1 = row[column.property];
        date = new Date(date1);
      }
      const year = date.getFullYear();
      const month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
      const day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
      const hours = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
      const minutes = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
      const seconds = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds();
      const date2 = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
      return date2;
    },
    //切换访客和数据
    changeResonsibilityStatus(e, value) {
      console.log('value', value);
      this.backForm();
      this.requestParam.shares = value;
      this.requestParam.viewerTitle = '';
      this.issave = false;
      this.reloadTable();
      this.countIsInitFinish('haveLoadStatus');
    },
    // 等待销售员列表、状态库加载完成才能发起请求
    async countIsInitFinish(value) {
      this.beforeLoading[value] = true;
      if (this.beforeLoading.haveLoadStatus) {
        console.log('this.requestParam.shares', this.requestParam.shares);
        switch (this.requestParam.shares) {
          case 1:
          case 2:
            this.dataDetail.httpurl = '/ajax/viewer/tsViewerArticle_h.jsp?cmd=getTsViewerArtcileList';
            break;
          case 3:
            await this.getSelectForm();
            this.dataDetail.httpurl = '/ajax/form/tsForm_h.jsp?cmd=getTempCiStatAndCiRec';
            break;
          default:
            this.dataDetail.httpurl = '/ajax/viewer/tsViewerArticle_h.jsp?cmd=getTsViewerArtcileList';
            break;
        }
        console.log('this.dataDetail.httpurl', this.dataDetail.httpurl);
      }
    },
    //重载页面
    reloadTable() {
      this.isReload = true;
    },
    //订阅数据请求成功事件
    changeTable(data) {
      console.log('data', data);
      const { isQuality: isQualityName, phone: wxMobile, relNum } = data;
      switch (this.requestParam.shares) {
        case 1:
        case 2:
          this.dataDetail.dataList = data.infoList;
          this.dataDetail.statInfo = data.statInfo;
          break;
        case 3:
          this.dataDetail.dataList = data.commitList;
          (this.isQualityName = isQualityName), (this.wxMobile = wxMobile || '-');
          this.relNum = relNum;
          break;
      }
    },
    //返回上一个页面
    backLast() {
      this.backForm();
      this.isShow = false;
      this.dataDetail.dataList = [];
      this.parent.isShow = true;
    },
    //加载
    reloadDataDetail() {
      this.backForm();
      this.requestParam = Object.assign({}, this.requestParam);
      setSearchDate({
        name: ['time'],
        form: this.requestParam,
      });
      if (this.requestParam.time == null) {
        postMessage({
          type: 'error',
          message: '请输入正确的日期',
        });
      } else {
        this.isReload = true;
      }
    },
    /**
     * @description 重置时间
     * @author enson
     * @date 2020-05-16
     * @param {*} val
     */
    getSearchTime(val) {
      this.requestParam.time = val;
    },
    /**
     * @description 查看指定表单的详细数据
     * @author enson
     * @date 2020-05-16
     * @param {*} data - 表单的信息
     */
    async showDataInfo(data) {
      console.log(data);
      await this.getFormDetailInfo(data);
      this.isShowData = false;
      this.showDetailForm = true;
    },
    /**
     * @description 返回表单，重置视图
     * @author enson
     * @date 2020-05-16
     */
    backForm() {
      this.isShowData = true;
      this.showDetailForm = false;
    },
    /**
     * @description 获取表单下拉菜单
     * @author enson
     * @date 2020-05-28
     */
    async getSelectForm() {
      const [err, response] = await getTempSelectList();
      if (err) {
        postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.formSelectList = response.data;
      return Promise.resolve();
    },
    async getFormDetailInfo(param) {
      const [err, response] = await getTsFormCiRecDetail(param);
      if (err) {
        postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.formDatas = response.data;
      return Promise.resolve();
    },
  },
};
</script>

<style lang="scss" scoped>
/* 访客详情数据 start */
.tanshu-dataInfo .pro_listBox .visitorData .pro_line,
.tanshu-dataInfo.dataCenter .ts-dataInfo .pro_listBox .pro_line {
  float: none;
  min-width: 1020px;
  padding-bottom: 20px;
}
.tanshu-dataInfo {
  .pro_listBox {
    .visitorData {
      .visitorAnalyse_main {
        .pro_line {
          .tshu_select {
            width: 120px;
          }
        }
      }
      .analyseBox {
        display: flex;
        justify-content: space-between;
        margin: 0 0 20px 0;
        & > div {
          width: 245px;
          height: 80px;
          margin: 0 5px;
          box-shadow: 0 0 4px 2px rgba(50, 56, 54, 0.1);
          div {
            float: left;
            width: 48px;
            height: 48px;
            margin: 15px 20px 15px;
          }
          &:nth-of-type(1) {
            div {
              background-image: url('~@/assets/image/comm/data_icon1.png');
            }
          }
          &:nth-of-type(2) {
            div {
              background-image: url('~@/assets/image/comm/data_icon2.png');
            }
          }
          &:nth-of-type(3) {
            div {
              background-image: url('~@/assets/image/comm/data_icon3.png');
            }
          }
          &:nth-of-type(4) {
            div {
              background-image: url('~@/assets/image/comm/data_icon4.png');
            }
          }
          & > p {
            &:nth-of-type(1) {
              margin-top: 10px;
              margin-left: 15px;
              font-size: 20px;
              font-weight: bold;
              color: $color-53;
            }
          }
          & > span {
            &:nth-of-type(1) {
              font-size: 14px;
              font-weight: bold;
              color: $color-53;
            }
          }
        }
      }
    }
  }
  &.ts-dataInfo {
    .pro_listBox {
      .topPart {
        /* width: 250px; */

        /* height: 40px; */
        display: inline-block;
        .infoBox {
          /* 混合版本语法: IE 10 */
          display: flex;

          /* width: 250px; */

          /* height: 40px; */
          float: left;
          padding: 20px 0;
          margin-bottom: 20px;
          border-radius: 4px;
          box-shadow: 1px 1px 4px 2px rgba(50, 56, 54, 0.1);
          flex: 3;
          & > div {
            width: 135px;
            height: 43px;

            /* 文本超出显示省略号 */
            padding: 0 5px;

            /* 超出的空白区域不换行 */
            overflow: hidden;
            text-align: center;

            /* 超出隐藏 */
            text-overflow: ellipsis;
            white-space: nowrap;
            border-right: #eeeeee 1px solid;
            &:last-of-type {
              border-right: none;
            }
            & > p {
              margin-bottom: 10px;
              font-weight: bold;
            }
          }
        }
      }
      .pro_line {
        .tshu_input {
          float: left;
          width: 150px;
          margin-right: 10px;
        }
        .toFormList {
          margin-right: 10px;
          vertical-align: middle;
        }
        .tanshu-button {
          vertical-align: middle;
        }
      }
      .tanshu-slide-card {
        border-bottom: #eeeeee 1px solid;
        .slide-children {
          margin-bottom: 33px;
          font-size: 14px;
          line-height: 12px;
        }
        &::after {
          height: 0;
        }
      }
    }
  }
  .showFormDetailData {
    .formTable {
      width: 100%;
      margin: 0 auto;
      text-align: center;
      border-collapse: collapse;
      .table-header {
        width: 30%;
        font-weight: bold;
        background: #fafafa;
      }
    }
    .tanshu-tabguide {
      .goManage {
        &::before {
          background: none;
        }
      }
    }
  }
}
.tanshu-dataInfo .showFormDetailData .formTable td,
.tanshu-dataInfo .showFormDetailData .formTable th {
  padding: 12px 0;
  font-size: 14px;
  line-height: 23px;
  color: $color-53;
  border: 1px solid #ebeef5;
}

/* 访客详情数据 end */
</style>

<style lang="scss">
.tanshu-dataInfo {
  .pro_listBox {
    .visitorData {
      .el-date-editor {
        margin-right: 5px;
      }
    }
  }
  &.ts-dataInfo {
    .pro_listBox {
      .pro_line {
        .toFormList {
          .el-input--small {
            .el-input__inner {
              height: 34px;
              line-height: 34px;
            }
          }
        }
      }
    }
  }
}
#app .tanshu-dataInfo.ts-dataInfo .pro_line .inputContainer .el-input__inner,
#app .tanshu-dataInfo .visitorCenter .pro_line .inputContainer .el-input__inner {
  padding: 0 10px;
}

@media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
  #app .tanshu-dataInfo.ts-dataInfo .pro_line .el-input__inner,
  #app .tanshu-dataInfo .visitorCenter .pro_line .el-input__inner {
    padding: 0 24px 0 10px;
  }
}
</style>
