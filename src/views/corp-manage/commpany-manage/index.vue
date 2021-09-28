<!--
 * @Description  : 公司管理
 * @Author       : turbo
 * @Date         : 2021-03-30 14:18:37
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-26 11:25:16
-->

<template>
  <div class="commpanyManage">
    <div id="compannyEdit"></div>
    <global-ts-header>
      <template v-slot:leftPart>公司管理</template>
      <template v-slot:rightPart>
        <global-ts-button
          class="comm_header_addcomm"
          ref="addCommpany"
          type="primary"
          size="small"
          min-width="950px"
          icon="icon-icon-11"
          @click="newAddcomm($event)"
          >添加公司
        </global-ts-button>
      </template>
    </global-ts-header>
    <div class="com_body">
      <el-table
        :class="'tshu-tableset'"
        :data="myData"
        border
        header-row-class-name="companyHeader"
        cell-class-name="cellStyle"
        min-width="1010px"
      >
        <el-table-column prop="id" label="公司ID" class="compannyId" min-width="200px"> </el-table-column>
        <el-table-column prop="name" label="公司名称" class="companyName" min-width="548px"> </el-table-column>
        <el-table-column label="操作" class="operation" min-width="200px">
          <template slot-scope="scope">
            <span ref="editBtn" class="com_edit tanshu_linkColor" @click="editCompany($event, scope.row.id)">
              编辑
            </span>
          </template>
        </el-table-column>
      </el-table>
      <global-ts-pagination v-model="myData" :httpurl="ajaxUrl" :isReload.sync="isReload" @getData="changeTable">
      </global-ts-pagination>
    </div>
  </div>
</template>

<script>
import CommpanBubble from './components/commpan-bubble/index.js';

export default {
  name: 'commpanyManage',
  components: {},
  props: {},
  data() {
    return {
      ajaxUrl: '/ajax/company/tsCompany_h.jsp?cmd=getTsCompanyList',
      isReload: false,
      myData: [],
      addTagBubble: null,
    };
  },
  computed: {},
  watch: {},
  created() {
    this.$utils.logDog('showCompanyManage');
  },
  mounted() {},
  methods: {
    //接收更新数据
    changeTable(data) {
      this.myData = data;
    },
    getBubble(target, id) {
      if (!this.addTagBubble) {
        this.addTagBubble = new CommpanBubble().$mount('#compannyEdit');
      }
      this.addTagBubble.changeTarget({
        linkTarget: target,
        commpanyId: id,
        parent: this,
      });
    },
    //新增公司
    newAddcomm(e) {
      this.$utils.logDog('newAddcomm');
      this.getBubble(this.$refs.addCommpany.$el, -1);
    },
    //编辑公司
    editCompany(e, id) {
      this.getBubble(e.target, id);
    },
  },
};
</script>

<style lang="scss" scoped>
.commpanyManage {
  .comm_header {
    position: relative;
    height: 34px;
    margin-bottom: 22px;
    .comm_header_name {
      position: absolute;
      top: 50%;
      left: 0;
      font-size: 16px;
      font-weight: bold;
      color: $color-00;
      transform: translate(0%, -50%);
    }
    .comm_header_addcomm {
      top: 0;
      right: 0;
      float: right;
      width: 110px;
      height: 34px;
      font-size: 14px;
      line-height: 34px;
      .addAccount {
        width: 14px;
        height: 14px;
      }
    }
  }
  .com_body {
    min-width: 1040px;
    padding: 30px;
    background-color: $color-ff;
    border-radius: 4px;
    opacity: 1;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
    box-sizing: border-box;
    .tshu_pagination {
      padding-top: 30px;
    }
    .companyHeader {
      .cell {
        padding: 0;
        font-size: 14px;
        font-weight: bold;
        color: $color-53;
        text-align: center;
      }
    }
    .cellStyle {
      font-size: 14px;
      font-weight: 400;
      color: #535353;
      text-align: center;
      border-color: $border-disabled-color !important;
    }
    .com_edit {
      font-size: 14px;
      font-weight: 400;
      cursor: pointer;
    }
  }
}
</style>
