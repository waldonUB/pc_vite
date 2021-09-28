<!--
 * @Author       : ADI
 * @Date         : 2021-05-24 11:15:12
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-27 11:26:42
-->
<template>
  <div class="articleData">
    <div class="qrCode_box"></div>
    <div class="pro_line">
      <global-ts-select
        class="typeList"
        :list="articleDataResponsibility.typeList"
        v-model="requestParam.type"
        :selectkey="{ label: 'value', value: 'key' }"
        @change="changeTypeName"
      >
      </global-ts-select>
      <global-ts-select
        class="typeList"
        :list="articleDataResponsibility.subTypeList"
        v-model="requestParam.libType"
        :selectkey="{ label: 'value', value: 'key' }"
      >
      </global-ts-select>
      <fa-input
        class="titleInput"
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
    <div class="articleDataList">
      <el-table
        type="index"
        :class="'tshu-tableset'"
        :data="articleDataResponsibility.articleDataList"
        border
        min-width="1010px"
        cell-class-name="cellStyle"
      >
        <el-table-column prop="title" label="素材文章标题" min-width="300" key="title">
          <template slot-scope="scope">
            {{ scope.row.title }}<span v-if="scope.row.del === 1" class="tanshu_err">（已删除）</span>
          </template>
        </el-table-column>
        <el-table-column prop="typeName" label="素材分类" min-width="120" key="typeName"></el-table-column>
        <el-table-column prop="libTypeName" label="二级分类" min-width="120" key="libTypeName"></el-table-column>
        <el-table-column prop="publishTimeName" label="发布时间" min-width="130" key="publishTimeName">
          <template #header>
            <div class="sortBar" @click="changeSortType('publishTime')">
              <span class="nextTimeBaby">发布时间</span>
              <span class="sortArrow">
                <global-ts-svg-icon
                  class="icon"
                  :class="requestParam.sortKey === 'publishTime' && !requestParam.desc ? '' : 'isNotActive'"
                  name="icon-shaixuanshang"
                  :size="14"
                />
                <global-ts-svg-icon
                  class="icon"
                  :class="requestParam.sortKey === 'publishTime' && requestParam.desc ? '' : 'isNotActive'"
                  name="icon-shaixuanxia"
                  :size="14"
                />
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="cloneStaffs" label="分享人数" key="shareViewers" min-width="80">
          <template #header>
            <div class="sortBar" @click="changeSortType('cloneStaffs')">
              <span class="nextTimeBaby">分享人数</span>
              <span class="sortArrow">
                <global-ts-svg-icon
                  class="icon"
                  :class="requestParam.sortKey === 'cloneStaffs' && !requestParam.desc ? '' : 'isNotActive'"
                  name="icon-shaixuanshang"
                  :size="14"
                />
                <global-ts-svg-icon
                  class="icon"
                  :class="requestParam.sortKey === 'cloneStaffs' && requestParam.desc ? '' : 'isNotActive'"
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
        <el-table-column prop="readTimeSecondName" label="阅读时长" min-width="90" key="readTimeSecondName">
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
        <el-table-column label="操作" min-width="150px" prop="status">
          <template slot-scope="scope">
            <span class="text_but1" @click="toView(scope.row, 2)">
              分享数据
            </span>
            <span class="text_but1" @click="toView(scope.row, 3)">
              访问明细
            </span>
          </template>
        </el-table-column>
        <template slot="empty"> 暂无文章数据 <a class="st_seeGuide" @click="toShare">去分享</a> </template>
      </el-table>
    </div>
    <global-ts-pagination
      v-if="loadPagination"
      :tableData="articleDataResponsibility.articleDataList"
      :requestParam="requestParam"
      :isReload.sync="articleDataResponsibility.isReload"
      @getData="changeTable"
      :httpurl="articleDataResponsibility.httpurl"
    >
    </global-ts-pagination>
  </div>
</template>

<script>
import { recordClick, logDog, postMessage, exportExcel } from '@/utils';
import qrBoxDialogVm from '../qr-box-dialog/index.vue';
import Vue from 'vue';
import { articleDataGetDef, articleDataGetList } from '@/api/modules/views/customer-tools';
import { getTempTypeList } from '@/api/modules/views/customer-tools/article-material';

export default {
  name: 'article-data',
  components: {},
  props: {},
  data() {
    return {
      articleDataResponsibility: {
        typeList: [{ key: -1, value: '全部分类' }],
        subTypeList: [{ key: -1, value: '全部二级分类' }],
        productTypeList: [],
        industryTypeList: [],
        tempTypeList: [], // 企业文库二级分类
        articleDataList: [], // 文章数据列表
        isReload: false,
        httpurl: '/rest/manage/article/data/getList',
        initTime: '', // 日期选择器初始时间
      },
      requestParam: {
        title: '',
        type: -1,
        libType: -1,
        createTimeStart: '',
        createTimeEnd: '',
        sortKey: 'publishTime',
        desc: true,
        isGetAll: false, // 导出的时候获取全部
      },
      qrDialog: null,
      loadPagination: false, // 减少不必要的请求
    };
  },
  computed: {},
  watch: {
    'articleDataResponsibility.initTime'(newVal) {
      this.requestParam.createTimeStart = newVal ? newVal[0] : '';
      this.requestParam.createTimeEnd = newVal ? newVal[1] : '';
    },
  },
  created() {},
  activated() {
    recordClick({
      dogId: 100029,
      srcId: 4,
    });
    if (this.$route.params && this.$route.params.isToView && this.$route.params.type != 4) {
      this.requestParam.title = this.$route.params.title;
      this.requestParam.type = this.$route.params.type;
      this.requestParam.libType = this.$route.params.libType;
    } else {
      this.$route.params.isToView = 0;
    }
    // this.$nextTick(() => {
    //   this.articleDataResponsibility.isReload = true;
    // });
    this.loadPagination = true;
    // this.getList()
    console.log(123333333);
    this.getDef();
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
      this.articleDataResponsibility.initTime = val;
    },
    toShare() {
      if (!this.qrDialog) {
        const qrBoxDialogVmConstructor = Vue.extend(qrBoxDialogVm);
        this.qrDialog = new qrBoxDialogVmConstructor({}).$mount('.qrCode_box');
      }
      this.qrDialog.open();
    },
    changeTable(data) {
      this.articleDataResponsibility.articleDataList = data;
      console.log(this.articleDataResponsibility.articleDataList, 'aeticle==');
    },
    reloadDataList() {
      this.articleDataResponsibility.isReload = true;
    },
    /**
     * 跳转到当前文章的销售员数据页面
     */
    toView(row, page) {
      logDog('dataCenter_articleDetail');
      const articleParams = {
        // 传文章id还是标题再沟通一下
        title: row.title,
        cloneSource: row.cloneSource,
        cloneId: row.cloneId,
        isToView: 1,
      };
      console.log(articleParams, 'params');
      // this.$emit('toView', '', 2, articleParams)
      this.$emit('toView', '', page, articleParams);
    },
    async getDef() {
      let tempTypeList = await this.getTempTypeList(); // 这里暂时处理，后续让后端把企业文库的分类加在cmd=getDef里面
      tempTypeList = tempTypeList.map(item => {
        return {
          key: item.id,
          value: item.name,
        };
      });
      tempTypeList.unshift({
        key: -1,
        value: '全部二级分类',
      });
      const [err, res] = await articleDataGetDef();
      if (err) {
        postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject();
      }
      this.articleDataResponsibility.typeList = res.data.typeList;
      if (this.$route.params && this.$route.params.type) {
        switch (this.$route.params.type) {
          case 1:
            this.articleDataResponsibility.subTypeList = res.data.productTypeList;
            break;
          case 2:
            this.articleDataResponsibility.subTypeList = res.data.industryTypeList;
            break;
          case 3:
            this.articleDataResponsibility.subTypeList = tempTypeList;
            console.log('tempTypeList', tempTypeList);
            break;
          default:
            this.articleDataResponsibility.subTypeList = [{ key: -1, value: '全部二级分类' }];
            this.requestParam.libType = -1;
        }
      }
      this.articleDataResponsibility.tempTypeList = tempTypeList;
      this.articleDataResponsibility.productTypeList = res.data.productTypeList;
      this.articleDataResponsibility.industryTypeList = res.data.industryTypeList;
    },
    async getTempTypeList() {
      const [err, res] = await getTempTypeList();
      if (err) {
        postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      return Promise.resolve(res.data);
    },
    /**
     * 导出
     */
    async onExportExcel() {
      this.requestParam.isGetAll = true;
      const [err, response] = await articleDataGetList(this.requestParam);
      this.requestParam.isGetAll = false;
      if (err) {
        postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      const excelList = response.data;
      const keyJson = {
        title: '素材文章标题',
        typeName: '素材分类',
        libTypeName: '二级分类',
        publishTime: '发布时间',
        cloneStaffs: '分享人数',
        clickViewers: '阅读人数',
        readTimeSecondName: '阅读时长',
        shares: '转发次数',
      };
      exportExcel(excelList, '文章数据', keyJson);
    },
    /**
     * 改变一级分类时，重新赋值二级分类
     */
    changeTypeName(val) {
      switch (val) {
        case -1:
          this.articleDataResponsibility.subTypeList = [{ key: -1, value: '全部二级分类' }];
          break;
        case 1:
          this.articleDataResponsibility.subTypeList = this.articleDataResponsibility.productTypeList;
          break;
        case 2:
          this.articleDataResponsibility.subTypeList = this.articleDataResponsibility.industryTypeList;
          break;
        case 3:
          this.articleDataResponsibility.subTypeList = this.articleDataResponsibility.tempTypeList;
          break;
        default:
          this.articleDataResponsibility.subTypeList = [{ key: -1, value: '全部二级分类' }];
      }
      if (this.$route.params.isToView) {
        // 从素材中心跳转过来的不用重置二级分类
        this.$route.params.isToView = 0;
      } else {
        this.requestParam.libType = -1;
      }
    },
    /**
     * 排序
     * @param {列表行} row
     */
    changeSortType(type) {
      this.requestParam.sortKey = type;
      this.requestParam.desc = !this.requestParam.desc;
      this.articleDataResponsibility.isReload = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.articleData {
  .pro_line {
    .typeList {
      width: 140px;
    }
    .titleInput {
      width: 200px;
      font-size: inherit;
    }
  }
}
</style>

<style lang="scss">
.articleData .el-table .is-sortable {
  cursor: auto !important;
}

.articleData .el-table__body .el-table__row .cell .tanshu_linkColor {
  margin: 0 5px;
}
</style>
