<!--
 * @Author       : ADI
 * @Date         : 2021-06-30 16:26:00
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-30 16:57:02
-->
<template>
  <div class="visitCardClone_main">
    <div class="pro_line">
      <global-ts-select
        class="formList"
        placeholder="表单标题"
        :list="formResponsibility.formSelectList"
        v-model="requestParam.templateId"
        :selectkey="{ label: 'key', value: 'value' }"
      >
      </global-ts-select>
      <ts-select-list
        class="floatLeft"
        v-if="isCanSelect"
        :depIdList.sync="requestParam.depIdList"
        :sids.sync="requestParam.sids"
      >
      </ts-select-list>
      <global-ts-date-picker class="timePicker" @updateTime="getSearchTime" defaultStartTime="year">
      </global-ts-date-picker>
      <global-ts-button type="primary" size="small" ref="button" icon="icon-icon-4" @click="reloadFormData">
        搜索
      </global-ts-button>
      <global-ts-button type="primary" size="small" icon="icon-daochu" ref="button" @click="onExportExcel">
        导出
      </global-ts-button>
    </div>
    <div class="showFormList">
      <el-table
        ref="tab"
        :data="formResponsibility.formTableList.formData"
        border
        cell-class-name="cellStyle"
        header-row-class-name="employeeHeader"
        box-sizing="border-box"
      >
        <el-table-column fixed label="成员" width="120" prop="staffName">
          <template slot-scope="scope">
            {{ $utils.showStaffName(tsStaffExtraList, scope.row.sid, scope.row.staffName) }}
          </template>
        </el-table-column>
        <el-table-column label="微信名称" width="120" fixed prop="viewerName"></el-table-column>
        <el-table-column
          v-for="(item, index) of formResponsibility.formTableList.formHeader"
          :label="item.name"
          :key="index"
          min-width="240"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.itemList[index]">{{ scope.row.itemList[index] | changeValue }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="提交时间"
          min-width="200"
          :formatter="dateFormat"
          fixed="right"
        ></el-table-column>
        <template slot="empty">
          <div :class="{ noSroll: headerNumer < 5 }">
            暂无表单数据 <a class="showQrDialog" @click="toShare">去分享</a>
          </div>
        </template>
      </el-table>
      <div class="tanshu-freeTip" v-if="isFreeVersion">
        <global-ts-versionfunctip funcText="如需查看更多表单数据"></global-ts-versionfunctip>
      </div>
    </div>
    <global-ts-pagination
      ref="formPagination"
      :tableData="formResponsibility.formTableList"
      :requestParam="requestParam"
      :isReload.sync="formResponsibility.isReload"
      @getData="changeTable"
      :httpurl="formResponsibility.httpurl"
    >
    </global-ts-pagination>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import versionDef from '@/config/version-def';
import { confirm, getWorkerList, exportExcel, format } from '@/utils';
import TsSelectList from '@/components/base/ts-select-list/index.vue';
import { getTempSelectList, getTsFormDataList } from '@/api/modules/views/customer-tools/form-data';

export default {
  name: 'form-data-list',
  components: { TsSelectList },
  props: {},
  data() {
    return {
      formResponsibility: {
        staffList: [], // 员工列表
        formSelectList: [], // 下拉框的表单列表
        isReload: false, // 是否重新加载数据
        httpurl: '', // 加载表格数据的url
        formTableList: [], // 表单数据列表 -> 即表格的数据
        initTime: '', // 日期选择器初始时间
      },
      requestParam: {
        // 过滤条件
        templateId: this.$route.query.templateId || '', // 表单id
        sid: -1, //跟进员工
        createTimeStart: '', // 开始时间
        createTimeEnd: '', // 结束时间
      },
      dataInfo: null, // 跳转到访客详情页对应访客的数据
      showFiveTip: '',
    };
  },
  computed: {
    ...mapGetters({
      isManage: 'user/isManage',
      isCanSelect: 'user/isNoOneSelfDataAuth', // 是否是管理员
    }),
    ...mapState({
      userInfo: state => state.user.info,
      tsStaffExtraList: state => state.user.tsStaffExtraList,
      updateVersionUrl: state => state.globalData.addressUrl?.updateVersionUrl,
      isOem: state => state.user.info.isOem,
    }),
    isFreeVersion() {
      return versionDef.checkIsFree();
    },
    headerNumer() {
      let header = this.formResponsibility.formTableList.formHeader;
      header = (header && Object.keys(header)) || [];
      console.log(header);
      return header.length;
    },
  },
  filters: {
    /**
     * @description 如果是多选，将至转化为字符串
     * @author enson
     * @date 2020-05-28
     * @param {*} value - 当前的值
     * @returns
     */
    changeValue(value) {
      // 对于多选这里可能需要正则匹配一下
      if (Array.isArray(value)) {
        return value.join();
      }
      return value;
    },
  },
  watch: {
    'formResponsibility.initTime'(newVal) {
      this.requestParam.createTimeStart = (newVal && newVal[0]) || '';
      this.requestParam.createTimeEnd = (newVal && newVal[1]) || '';
    },
  },
  async activated() {
    this.$utils.logDog('formData_show');
    // 要等销售员load完了才能继续load其他的
    await this.getTsStaffList();
    await this.getFormSelectList();
    this.formResponsibility.httpurl = '/ajax/form/tsForm_h.jsp?cmd=getTsFormDataList';
    this.reloadFormData();
  },
  created() {
    this.requestParam.sid = this.isManage ? -1 : this.userInfo.staffInfo.sid; //跟进员工
    this.showFiveTip = !versionDef.checkVersion(
      this.isOem
        ? versionDef.NotDirectVersionDef.VersionList.PERSON
        : versionDef.DirectVersionDef.VersionList.PROFESSIONNAL,
    );
  },
  mounted() {},
  methods: {
    /**
     *设置搜索时间
     *
     * @author guoyijie
     * @date 2020-04-29
     * @param {*} val
     */
    getSearchTime(val) {
      this.formResponsibility.initTime = val;
    },
    changeTable(data, parentData, pages) {
      console.log('parentData', parentData);
      console.log('pages', pages);
      console.log('data', data);
      console.log(this.$refs.formPagination);
      // 这里做个保护，如果免费版有第二页的情况出现，点击/跳转弹窗提示升级
      if (this.isFreeVersion && pages.pageNow > 1) {
        this.$refs.formPagination.nowPage = 1;
        confirm('当前版本只支持查看前五条数据', '', '立即升级').then(confirmAction => {
          if (confirmAction == 'confirm') {
            window.open(this.updateVersionUrl);
          }
        });
        return;
      }
      this.formResponsibility.formTableList = Object.assign({}, data);
    },
    /**
     * @description 获取下拉框中的表单数据列表
     * @author enson
     * @date 2020-05-15
     * @returns
     */
    async getFormSelectList() {
      const [err, res] = await getTempSelectList(this.requestParam);
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      // 如果是链接带上了templateId则用链接上的
      if (!this.$route.query.templateId) {
        this.requestParam.templateId = res.data[0] && res.data[0].value;
      }
      console.log(res);
      console.log(res.data);
      this.formResponsibility.formSelectList = res.data;
      return Promise.resolve();
    },
    /**
     * 重新加载表格中的表单列表
     */
    reloadFormData() {
      this.formResponsibility.isReload = true;
    },
    /**
     * 获取员工列表
     */
    getTsStaffList() {
      return new Promise(resolve => {
        if (this.isCanSelect) {
          getWorkerList().then(list => {
            console.log('list', list);
            this.formResponsibility.staffList = list[0];
            this.formResponsibility.staffList = this.formResponsibility.staffList.filter(item => item.sid != 0);
            if (list[1] == 2) {
              //成员
              this.requestParam.sid = this.formResponsibility.staffList.sid;
            }
            resolve();
          });
        } else {
          resolve();
        }
      });
    },
    /**
     * @description 导出表格
     * @author enson
     * @date 2020-05-15
     */
    async onExportExcel() {
      const [err, response] = await getTsFormDataList(
        Object.assign({}, this.requestParam, {
          limit: 20000,
        }),
      );
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      const { formData, formHeader } = response.data;
      const keyJson = {
        staffName: '成员',
        viewerName: '微信名称',
        createTime: '提交时间',
      };
      const excelData = [];
      // 由于返回的字段不符合导出字段的要求，需要做如下转化 [{[]}] ==> [{},{}]
      formData.forEach(element => {
        const excelItem = {};
        excelItem.staffName = element.staffName;
        excelItem.viewerName = element.viewerName;
        excelItem.createTime = element.createTimeName;
        const itemList = element.itemList;
        // Object.entries() 方法返回一个给定对象自身可枚举属性的键值对数组
        // 避免for of 处理对象的时候没有迭代器iterable而报错
        for (const [index, value] of Object.entries(itemList)) {
          excelItem[`data${index}`] = value;
        }
        excelData.push(excelItem);
      });

      for (const [index, element] of Object.entries(formHeader)) {
        keyJson[`data${index}`] = element;
      }
      console.log('keyJson-----', keyJson);
      console.log('formResponsibility', this.formResponsibility);
      let fileName = '#模板标题#';
      this.formResponsibility.formSelectList.forEach(value => {
        if (value.isSelect) {
          fileName = value.key;
        }
      });
      exportExcel(excelData, `《${fileName}-表单数据》`, keyJson);
      console.log('excelData', excelData);
    },
    /**
     * @description 弹窗出小程序的二维码
     * @author enson
     * @date 2020-05-15
     */
    toShare() {
      // this.isShowDialog = true;
      this.$emit('toShare');
    },
    /**
     * @description 展示访客详情数据
     * @author enson
     * @date 2020-05-16
     */
    showDataInfo(data) {
      this.$emit('showDataInfo', data);
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
     * 改变slider的回调
     * @author lymn
     * @date 2020-07-02
     * @param {Object} node node节点
     * @param {Number} index 选中slider的索引
     */
    changeResonsibilityStatus(node, index) {
      switch (index) {
        case 1:
          this.currentTemp = 'formDataList';
          this.activeNum = 1;
          break;
        case 2:
          this.currentTemp = 'accessDetail';
          this.activeNum = 2;
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.form-data-list {
}
</style>
