<!--
 * @Author       : ADI
 * @Date         : 2021-05-26 15:36:45
 * @LastEditors  : turbo
 * @LastEditTime : 2021-06-04 16:40:24
-->
<template>
  <div class="corpSearchList">
    <div class="selectInfo globalSelectWrapper">
      <global-ts-select
        style="width: 270px;"
        placeholder="不限行业"
        :list="dataDef.industryDefList"
        v-model="requestParam.industryCode"
        :selectkey="{ label: 'value', value: 'key' }"
      >
      </global-ts-select>
      <fa-cascader
        v-model="selectedArea"
        class="globalSelectWrapper__item"
        :fieldNames="cascaderProps"
        @change="changeArea"
        :options="dataDef.addressDefList"
        placeholder="不限地区"
        :change-on-select="true"
      >
      </fa-cascader>
      <fa-input
        class="globalSelectWrapper__item"
        :maxLength="50"
        v-model="requestParam.keyword"
        placeholder="企业名称/经营范围"
        @change="changeKeyWord"
        @keyup.enter.native="searchInfo"
      >
      </fa-input>
      <global-ts-button size="small" icon="icon-icon-4" @keyup.enter.native="searchInfo" @click="searchInfo">
        搜索
      </global-ts-button>
      <global-ts-button v-if="isManager" size="small" icon="icon-daochu" @click="onExportExcel">
        导出
      </global-ts-button>
    </div>
    <div class="showTabList">
      <el-table
        row-key="id"
        ref="sortTable"
        :data="corpSearchList"
        border
        header-row-class-name="employeeHeader"
        min-width="1010px"
        box-sizing="border-box"
        cell-class-name="cellStyle"
      >
        <el-table-column
          :label="item.name"
          :min-width="item.width + 'px'"
          v-for="item of initAllFiledList"
          :key="item.field"
        >
          <template slot-scope="scope">
            <div v-html="getColumnName(item.field, scope.row)"></div>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="80px">
          <template slot-scope="scope">
            <span class="tanshu_linkColor editCustom" @click="gotoDetail(scope.row)">详情 </span>
          </template>
        </el-table-column>
        <template slot="empty">
          <div class="emptyBox" v-if="!ajaxUrl">
            <img class="bannerCorpSearchImg" :src="bannerCorpSearchImg" alt="" />
            <p class="emptyText">查企业，查老板，找合作</p>
          </div>
          <div v-else>未找到相关企业</div>
        </template>
      </el-table>
      <global-ts-versionfunctip v-if="!isHaveVersion" :limitVer="limitVer" afterTable></global-ts-versionfunctip>
      <global-ts-pagination
        v-model="corpSearchList"
        :httpurl="ajaxUrl"
        :isReload.sync="isReload"
        :requestParam="requestParam"
        @getData="changeTable"
      >
      </global-ts-pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { newFiledList } from '../../utils';
import versionDef from '@/config/version-def';
import { FdpLog, postLimitVer, Browser, textEllipsis, exportExcel } from '@/utils';
import { Cascader } from '@fk/faicomponent';
import { getDef, getCorpList } from '@/api/modules/views/customer-tools/data-center';
import bannerCorpSearchIMG from '@/assets/image/directSale/corpSearch/banner_corpSearch.png';

export default {
  name: 'corp-search-list',
  components: {
    [Cascader.name]: Cascader,
  },
  props: {
    isManager: {
      type: Boolean,
      default: false,
    },
    currentDetailId: {
      type: [Number, String],
      default: 0,
    },
  },
  data() {
    return {
      requestParam: {
        keyword: '', // 企业名称/法人/手机/经营范围
        industryCode: '', // 行业
        addressCode: '', // 省市区
      },
      corpSearchList: [],
      pages: {
        pageNow: 1,
        limit: 10,
        maxPage: 2,
      },
      ajaxUrl: '',
      isReload: false,
      initAllFiledList: newFiledList(),
      dataDef: {
        industryDefList: [], // 所有行业
        addressDefList: [], // 所有地区
      },
      cascaderProps: {
        // 级联字段定义
        value: 'id',
        label: 'name',
        children: 'subList',
      },
      selectedArea: [''], // 默认值
    };
  },
  computed: {
    ...mapState({
      updateVersionUrl: state => state.globalData?.addressUrl?.updateVersionUrl,
      isOem: state => state.user.info.isOem,
    }),
    limitVer() {
      return this.isOem
        ? versionDef.NotDirectVersionDef.VersionList.MID
        : versionDef.DirectVersionDef.VersionList.PROFESSIONNAL;
    },
    isHaveVersion() {
      if (this.isOem) {
        return versionDef.checkVersion(versionDef.NotDirectVersionDef.VersionList.MID);
      } else {
        return versionDef.checkVersion(versionDef.DirectVersionDef.VersionList.PROFESSIONNAL);
      }
    },
    bannerCorpSearchImg() {
      return bannerCorpSearchIMG;
    },
  },
  watch: {
    'requestParam.industryCode'() {
      FdpLog('yx_cxqy', {
        // 查询企业
        yx_free_text_0: '修改行业',
        yx_app_terminal: 1,
      });
    },
  },
  created() {
    this.getDataDef();
  },
  mounted() {},
  methods: {
    /**
     * 获取对应的列表定义。
     * 行业、地区
     * @author waldon
     * @date 2020/8/14
     */
    async getDataDef() {
      const [err, res] = await getDef();
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.dataDef = res.data;
      this.dataDef.industryDefList.unshift({
        key: '',
        value: '不限行业',
      });
      this.dataDef.addressDefList.unshift({
        id: '',
        name: '不限地区',
      });
    },
    /**
     * 展示详情页面
     * @author waldon
     * @date 2020-06-19
     * @param {Object} row - 行数据
     */
    gotoDetail(row) {
      this.$emit('update:currentDetailId', row.id);
      this.$parent.currentTemp = 'corpSearchDetail';
      FdpLog('yx_ckxq', {
        // 查看详情
        yx_app_terminal: 1,
      });
    },
    /**
     * 格式化显示
     * @author waldon
     * @date 2020-07-23
     * @param {String} columnField - 字段
     * @param {Object} rowData - 行数据
     */
    getColumnName(columnField, rowData) {
      const needSearchList = ['acctName', 'businessScope'];
      if (!rowData[columnField]) {
        return '-';
      } else if (needSearchList.includes(columnField)) {
        // 是否高亮
        // 匹配关键字正则
        const replaceReg = new RegExp(this.requestParam.keyword, 'g');
        // 高亮替换v-html值
        const replaceString = '<span class="highlight">' + this.requestParam.keyword + '</span>';
        // 开始替换
        return rowData[columnField].replace(replaceReg, replaceString);
      } else {
        return rowData[columnField];
      }
    },
    /**
     * 改变地区
     * @author waldon
     * @date 2020/8/12
     * @param {Array} selectedArea - 选择的省/市/区
     */
    changeArea(selectedArea) {
      console.log(selectedArea);
      this.requestParam.addressCode = selectedArea[selectedArea.length - 1];
      FdpLog('yx_cxqy', {
        // 查询企业
        yx_free_text_0: '修改地区',
        yx_app_terminal: 1,
      });
    },
    /**
     * 重新查询
     * @author waldon
     * @date 2020/8/12
     */
    reloadTable() {
      this.isReload = true;
    },
    /**
     * 根据筛选条件查询
     * @author waldon
     * @date 2020-06-16
     */
    searchInfo() {
      if (!this.isHaveVersion) {
        postLimitVer('当前版本企业查询功能未开放', 0, 3);
        return;
      }
      if (!this.requestParam.keyword) {
        postMessage({
          type: 'error',
          message: '请输入搜索关键词',
        });
        return;
      }
      this.ajaxUrl = '/ajax/corpSearch/tsCorpSearch_h.jsp?cmd=getCorpList';
      this.reloadTable();
      FdpLog('yx_cxqy', {
        // 查询企业
        yx_free_text_0: '点击查询',
        yx_app_terminal: 1,
      });
    },
    async onExportExcel() {
      let excelList = [];
      if (this.isHaveVersion && this.requestParam.keyword) {
        const params = {
          limit: 20000,
          isExport: true,
        };
        const [err, res] = await getCorpList({
          ...this.requestParam,
          ...params,
        });
        if (err) {
          this.$utils.postMessage({
            type: 'error',
            message: err.msg || '网络错误，请稍候重试',
          });
          return Promise.reject(err);
        }
        excelList = res.data;
      }
      var keyJson = {};
      this.initAllFiledList.forEach(item => {
        keyJson[item.field] = item.name;
      });
      exportExcel(excelList, '企业查询', keyJson);
      FdpLog('yx_dcqy', {
        // 导出企业
        yx_free_text_0: '导出所有企业',
        yx_app_terminal: 1,
      });
    },
    changeTable(data) {
      this.corpSearchList = data;
      if (Browser.isIE) {
        // 兼容ie的多行截断
        this.corpSearchList.forEach(item => {
          item.businessScope = textEllipsis(item.businessScope, 182, 14, 5);
        });
      }
      this.$emit('getCorpSearchList', this.corpSearchList);
    },
    /**
     * 修改关键词
     * @author lymn
     * @date 2020-08-27
     */
    changeKeyWord() {
      FdpLog('yx_cxqy', {
        // 查询企业
        yx_free_text_0: '修改关键词',
        yx_app_terminal: 1,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.corpSearchList {
  .showTabList {
    .emptyBox {
      margin: 40px 0;
      text-align: center;
      .bannerCorpSearchImg {
        width: 320px;
      }
      .emptyText {
        margin-top: 20px;
        line-height: 1;
        color: #67707e;
      }
    }
  }
}
</style>

<style lang="scss">
.corpSearchList {
  .selectInfo {
    .fa-cascader-picker-label {
      font-size: 14px;
    }
  }
  .showTabList {
    .el-table {
      .cell {
        & > div {
          @include line-clamp(5);
        }
        .highlight {
          color: #247af3;
        }
      }
    }
  }
}
</style>
