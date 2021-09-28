<!--
 * @Author       : ADI
 * @Date         : 2021-06-30 15:16:21
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-05 09:59:49
-->
<template>
  <div class="formManageBox">
    <global-ts-header>
      <template v-slot:leftPart>
        <div class="topTitle">
          企业表单
          <global-ts-tool-tips class="item" offset="10" effect="dark" content="" placement="top-start">
            <div slot="content">
              可以通过表单收集客户信息。<a :href="formGuideUrl" target="_blank">如何使用表单？</a>
            </div>
            <global-ts-svg-icon class="icon" name="icon-bianzu"></global-ts-svg-icon>
          </global-ts-tool-tips>
        </div>
      </template>
      <template v-slot:rightPart>
        <global-ts-button
          class="pro_header_addEm"
          type="primary"
          size="small"
          icon="icon-icon-11"
          @click="addFormModel"
        >
          创建表单模板
        </global-ts-button>
      </template>
    </global-ts-header>
    <div class="pro_listBox" v-cloak>
      <div class="formManage_main">
        <div class="pro_line flex flex-vc">
          <el-select size="small" class="toFormList" v-model="requestParam.title" placeholder="表单标题">
            <el-option
              v-for="item in formResponsibility.formFilterList"
              :key="item.value"
              :label="item.key"
              :value="item.key"
            >
            </el-option>
          </el-select>
          <global-ts-date-picker @updateTime="getSearchTime" defaultStartTime="year"> </global-ts-date-picker>
          <global-ts-button
            class="formSearchBtn"
            type="primary"
            size="small"
            ref="button"
            @keyup.enter.native="reloadFormRecord"
            @click="reloadFormRecord"
            >搜索
          </global-ts-button>
        </div>
        <div class="fromBoxList">
          <el-table
            type="index"
            :class="'tshu-tableset'"
            :data="formResponsibility.formRecordList"
            border
            min-width="1010px"
            cell-class-name="cellStyle"
            header-row-class-name="employeeHeader"
          >
            <el-table-column prop="title" label="表单标题" min-width="240" key="title"></el-table-column>
            <el-table-column
              prop="createTime"
              label="创建时间"
              min-width="150"
              key="createTime"
              :formatter="dateFormat"
            >
              <template #header>
                <div class="sortBar" @click="changeSortType()">
                  <span class="nextTimeBaby">创建时间</span>
                  <span class="sortArrow">
                    <global-ts-svg-icon
                      class="icon"
                      name="icon-shaixuanshang"
                      :class="requestParam.sort == 2 ? '' : 'isNotActive'"
                    ></global-ts-svg-icon>
                    <global-ts-svg-icon
                      class="icon"
                      name="icon-shaixuanxia"
                      :class="requestParam.sort == 1 ? '' : 'isNotActive'"
                    ></global-ts-svg-icon>
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="发布状态" min-width="150" key="status">
              <template slot-scope="scope">
                <div v-if="[0].includes(scope.row.isGfwClose)">
                  <span :class="scope.row.status == 0 ? 'green' : 'red'"></span>
                  <span :class="scope.row.status == 0 ? '' : 'unactive'"> {{ scope.row.statusName }}</span>
                </div>
                <div v-else>
                  <span class="red"></span>
                  <span style="color: red;"> {{ scope.row.statusName }} </span>
                  <global-ts-tool-tips class="item tanshu_linkColor" offset="10" effect="dark" placement="top-start">
                    <div slot="content">
                      您的模板已被关闭，请先删除违规内容，再提交申诉。<br />
                      原因：{{ scope.row.gfwStatusReasion }}
                    </div>
                    <global-ts-svg-icon class="icon" name="icon-bianzu"></global-ts-svg-icon>
                  </global-ts-tool-tips>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="statusName" label="操作" min-width="150" key="statusName">
              <template slot-scope="scope">
                <span class="tanshu_linkColor" @click="lookData(scope.row.id)">数据</span>
                <span class="tanshu_linkColor" @click="editForm(scope.row.id)">&nbsp;编辑</span>
                <span class="tanshu_linkColor" @click="operateForm('changeStatus', scope.row.id, scope.row.status)">
                  {{ scope.row.status == 0 ? '关闭' : '开启' }}
                </span>
                <span class="tanshu_linkColor" style="color: #ff4d4d;" @click="operateForm('delete', scope.row.id)">
                  删除
                </span>
              </template>
            </el-table-column>
            <template slot="empty">
              暂无数据，马上<a class="mainColor" @click="addFormModel">创建表单模板</a>吧
            </template>
          </el-table>
        </div>
        <global-ts-pagination
          :tableData="formResponsibility.formRecordList"
          :requestParam="requestParam"
          :isReload.sync="formResponsibility.isReload"
          @getData="changeTable"
          :httpurl="formResponsibility.httpurl"
        >
        </global-ts-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { confirm, format } from '@/utils';
import { Select, Option } from 'element-ui';
import { getTempSelectList, operationTemp } from '@/api/modules/views/customer-tools/form-manage';

export default {
  name: 'form-manage-box',
  components: { [Select.name]: Select, [Option.name]: Option },
  props: {},
  data() {
    return {
      formResponsibility: {
        formFilterList: [], // 表单筛选列表
        isReload: false,
        httpurl: '/ajax/form/tsForm_h.jsp?cmd=getTsFormTempList',
        formRecordList: [], // 表单数据列表
        initTime: '', // 日期选择器初始时间
      },
      // 请求的参数
      requestParam: {
        // 过滤条件
        title: '',
        createTimeStart: '', // 筛选的起始时间
        createTimeEnd: '', // 筛选的终止时间
        sort: 1, // 创建时间降序
      },
    };
  },
  computed: {
    ...mapState({
      formGuideUrl: state => state.globalData.addressUrl?.formGuideUrl,
    }),
  },
  watch: {
    'formResponsibility.initTime'(newVal) {
      this.requestParam.createTimeStart = (newVal && newVal[0]) || '';
      this.requestParam.createTimeEnd = (newVal && newVal[1]) || '';
    },
  },
  async created() {
    this.$utils.logDog('show_FormMangage');
    await this.getFormTitleList();
    this.formResponsibility.isReload = true;
  },
  mounted() {},
  methods: {
    /**
     * @description 获取日期选择器的值
     * @author enson
     * @date 2020-05-11
     * @param {*} val
     */
    getSearchTime(val) {
      this.formResponsibility.initTime = val;
    },
    /**
     * @description 跳转到创建表单模板页面
     * @author enson
     * @date 2020-05-11
     */
    addFormModel() {
      this.$utils.logDog('form_addFormModel');
      this.$router.push({
        path: 'createForm',
      });
    },
    /**
     * @description 编辑表单
     * @author enson
     * @date 2020-06-01
     */
    editForm(templateId) {
      this.$utils.logDog('form_editForm');
      this.$router.push({
        path: `createForm?templateId=${templateId}`,
      });
    },
    /**
     * @description 创建时间排序
     * @author enson
     * @date 2020-05-11
     */
    changeSortType() {
      this.requestParam.sort = this.requestParam.sort == 1 ? 2 : 1;
      this.formResponsibility.isReload = true;
    },
    /**
     * @description 重新加载表单列表数据
     * @author enson
     * @date 2020-05-11
     */
    reloadFormRecord() {
      this.formResponsibility.isReload = true;
    },
    /**
     * @description 从tanshu-pagination组件发送请求后获取到表单的数据的回调函数
     * @author enson
     * @date 2020-05-11
     */
    changeTable(data) {
      this.formResponsibility.formRecordList = data;
    },
    /**
     * @description 获取表单标题整成下拉列表
     * @author enson
     * @date 2020-05-26
     */
    async getFormTitleList() {
      const [err, res] = await getTempSelectList();
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.formResponsibility.formFilterList = res.data;
      return Promise.resolve(res.data);
    },
    /**
     * @description 操作 - 开启/关闭/删除表单
     * @author enson
     * @date 2020-05-27
     */
    operateForm(type, id, currentStatus) {
      if (!type) return;
      let action = null;
      let msg = '';
      let title = '';
      switch (type) {
        case 'changeStatus':
          this.$utils.logDog('form_changeStatus');
          if (currentStatus === 0) {
            // 当前状态是开启
            action = 1;
            msg = '确认关闭模板？';
            title = '关闭确认';
          } else {
            // 当前状态是关闭
            action = 2;
            msg = '确认开启模板？';
            title = '开启确认';
          }
          break;
        case 'delete':
          this.$utils.logDog('form_delete');
          action = 3;
          msg = '确认删除表单？删除后无法恢复';
          title = '删除确认';
          break;
      }
      confirm(msg, title).then(async confirmAction => {
        if (confirmAction == 'confirm') {
          const [err, response] = await operationTemp({
            templateId: id,
            action: action,
          });
          if (err) {
            this.$utils.postMessage({
              type: 'error',
              message: err.msg || '系统错误，请稍候重试',
            });
            return Promise.reject(err);
          }
          this.$utils.postMessage({
            type: 'success',
            message: response.msg || '操作成功',
          });
          this.reloadTable();
        }
      });
    },
    //重载页面
    reloadTable: function() {
      this.formResponsibility.isReload = true;
    },
    /**
     * @function 日期格式化为YY-MM-DD hh:mm:ss格式
     */
    dateFormat: function(row, column) {
      const date1 = row[column.property];
      const date = new Date(date1);
      return format.formatDate(date);
    },
    /**
     * @description 查看对应表单的数据
     * @author enson
     * @date 2020-05-30
     */
    lookData(id) {
      this.$utils.logDog('form_lookData');
      this.$router.push({
        path: `/formData?templateId=${id}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.formManageBox {
  .topTitle {
    .icon {
      width: 1.2em;
      height: 1.2em;
      overflow: hidden;
      color: #247af3;
      vertical-align: -0.15em;
    }
  }
  .pro_listBox {
    .pro_line {
      .formSearchBtn {
        vertical-align: middle;
      }
      .toFormList {
        margin-right: 10px;
      }
    }
    .fromBoxList {
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
      .mainColor {
        color: #247af3;
      }
    }
  }
}
</style>

<style lang="scss">
.formManageBox .pro_listBox .pro_line .toFormList .el-input--small .el-input__inner {
  height: 34px;
  line-height: 34px;
}
</style>
