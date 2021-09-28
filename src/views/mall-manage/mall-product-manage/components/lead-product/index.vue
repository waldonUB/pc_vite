<!--
 * @Author       : ADI
 * @Date         : 2021-08-04 10:12:23
 * @LastEditors  : ADI
 * @LastEditTime : 2021-08-03 17:35:55
-->
<template>
  <global-ts-card-box>
    <template v-slot:card-box-head>
      <div class="operateList">
        <global-ts-tabguide @backToPrePage="backManage">
          <template v-slot:leftPart>商品列表</template>
          <template v-slot:rightPart>商城录入商品</template>
        </global-ts-tabguide>
      </div>
    </template>
    <template v-slot:card-box-body>
      <div class="leadProduct">
        <div class="selectSiteNode flexBox">
          <global-ts-select
            class="choseSiteMall"
            v-if="siteList.length > 1"
            v-model="requestParam.siteId"
            placeholder="选择商城站点"
            @change="changeSite"
            :list="siteList"
          >
          </global-ts-select>
          <global-ts-input
            class="producename"
            v-model="requestParam.name"
            placeholder="商品名称"
            @keyup.enter.native="searchInfo"
          ></global-ts-input>
          <global-ts-button class="searchBtn" size="small" @click="searchInfo">搜索</global-ts-button>
        </div>
        <div class="flexBox guideProduct">
          <div class="mainLeftBox">
            <el-table
              border
              :row-key="getRowKey"
              ref="itsmDataTable"
              header-row-class-name="employeeHeader"
              @selection-change="handleSelectionChange"
              :data="product.productList"
            >
              <el-table-column
                type="selection"
                :selectable="checkStatus"
                :reserve-selection="true"
                min-width="58px"
              ></el-table-column>
              <el-table-column prop="name" label="商品名称" min-width="300px"></el-table-column>
              <el-table-column prop="mallPrice" label="价格" min-width="40px"></el-table-column>
            </el-table>
            <global-ts-pagination
              :tableData="product.productList"
              :requestParam="requestParam"
              :isReload.sync="product.isReload"
              @getData="changeTable"
              :httpurl="product.httpurl"
            >
              <template #leftPart>
                <span style="line-height: 34px;">
                  <span :class="selectNum > limitNum ? 'red' : ''">已选择{{ selectNum }}个</span>
                  /最多还能录入{{ selectableNum }}个
                </span>
              </template>
            </global-ts-pagination>
            <!-- <global-ts-select-pagination
              :selectNum="selectNum"
              :tableData="product.productList"
              :httpurl="product.httpurl"
              :limitNum="limitNum"
              @getData="changeTable"
              :isReload.sync="product.isReload"
              :requestParam="requestParam"
            >
            </global-ts-select-pagination> -->
          </div>
        </div>
      </div>
    </template>
    <template v-slot:card-box-bottom>
      <global-ts-button @click="leadProduct">录入所选商品 </global-ts-button>
    </template>
  </global-ts-card-box>
</template>

<script>
import { post } from '@/utils';

export default {
  name: 'lead-product',
  components: {},
  props: {},
  data() {
    return {
      siteList: [],
      product: {
        httpurl: '',
        productList: [],
        leadList: [],
        isReload: false,
        selectAll: false,
      },
      productIdList: [],
      requestParam: {
        siteId: '',
        name: '',
      },
      tableList: [],
      nowCount: 0,
      limitNum: 0,
    };
  },
  computed: {
    /**
     *站点名
     *
     * @author guoyijie
     * @date 2020-04-10
     * @returns
     */
    siteName() {
      const obj = this.siteList.find(item => {
        return item.value == this.requestParam.siteId;
      });
      const name = obj ? obj.label : '无';
      return name;
    },
    /**
     * 已勾选总数
     * @author guoyijie
     * @date 2020-04-10
     * @returns
     */
    selectNum() {
      return this.nowCount + this.productIdList.length;
    },
    selectableNum() {
      return this.limitNum - this.selectNum > 0 ? this.limitNum - this.selectNum : 0;
    },
  },
  watch: {},
  created() {
    this.getMallSiteList().then(() => {
      this.$nextTick(() => {
        this.product.httpurl = '/ajax/mall/tsMall_h.jsp?cmd=getMallProductList';
      });
    });
  },
  mounted() {},
  methods: {
    changeSite() {
      this.productIdList = [];
      this.$refs.itsmDataTable.clearSelection();
      this.searchInfo();
    },
    /**
     * 检查当前行是否可以勾选
     *
     * @author guoyijie
     * @date 2020-04-10
     * @param {*} row行数据
     * @returns
     */
    checkStatus(row) {
      if (this.selectNum >= this.limitNum && this.productIdList.indexOf(row.id) == -1) {
        return false;
      } else {
        return true;
      }
    },
    /**
     *回到商品管理
     *
     * @author guoyijie
     * @date 2020-04-10
     */
    backManage() {
      this.$parent.changeComponets('manageProduct');
    },
    /**
     *搜索
     *
     * @author guoyijie
     * @date 2020-04-10
     */
    searchInfo() {
      this.requestParam = Object.assign({}, this.requestParam);
      this.product.isReload = true;
    },
    /**
     *设置行数据的key
     *
     * @author guoyijie
     * @date 2020-04-10
     * @param {*} row表格行
     * @returns
     */
    getRowKey(row) {
      return row.id;
    },
    /**
     *更新表格数据
     *
     * @author guoyijie
     * @date 2020-04-10
     * @param {*} data
     */
    changeTable(data) {
      this.product.productList = data.productList;
      this.nowCount = data.nowCount;
      this.limitNum = data.limitNum;
    },
    /**
     * 获取表格勾选录入列表
     * @author guoyijie
     * @date 2020-04-10
     */
    handleSelectionChange() {
      this.productIdList = [];
      const selectList = this.$refs.itsmDataTable.selection;
      selectList.forEach(item => {
        this.productIdList.push(item.id);
      });
    },
    /**
     * 录入商品
     * @author guoyijie
     * @date 2020-04-10
     */
    leadProduct() {
      if (this.product.productList.length > 0 && this.limitNum > this.nowCount) {
        if (this.productIdList.length == 0) {
          this.$utils.postMessage({
            type: 'error',
            message: '请选择需要录入的商品',
          });
        } else if (this.limitNum < this.selectNum) {
          this.$utils.postMessage({
            type: 'error',
            message: `您已选择的商品数量超出上限${this.limitNum}个，请去掉不必要的商品`,
          });
        } else {
          const obj = {
            siteId: this.requestParam.siteId,
            pdIdList: JSON.stringify(this.productIdList),
            name: this.requestParam.name,
          };
          post('/ajax/mall/tsMall_h.jsp?cmd=syncMallProductList', obj).then(res => {
            if (res && res.success) {
              this.$utils.postMessage({
                type: 'success',
                message: res.msg,
              });
              this.$utils.ActLog('ADD_PRODUCT');
              this.backManage();
            } else {
              this.$utils.postMessage({
                type: 'error',
                message: res.msg || '网络错误，请稍候重试',
              });
            }
          });
        }
      } else if (this.product.productList == 0 || this.limitNum == this.nowCount) {
        this.backManage();
      }
    },
    /**
     * 获取商城站点列表
     *
     * @author guoyijie
     * @date 2020-04-10
     * @returns
     */
    getMallSiteList() {
      return new Promise(resolve => {
        post('/ajax/mall/tsMall_h.jsp?cmd=getMallSiteList').then(response => {
          if (response && response.success) {
            const list = response.data;
            this.siteList = [];
            list.forEach(item => {
              this.siteList.push({
                value: item.siteid,
                label: item.companyName,
              });
            });
            this.requestParam.siteId = this.siteList[0] ? this.siteList[0].value : -1;
            resolve();
          } else {
            this.$utils.postMessage({
              type: 'error',
              message: response.msg || '网络错误，请稍候重试',
            });
          }
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.leadProduct {
  margin-top: 26px;
  .functionTitle {
    font-weight: bold;
    color: $color-53;
  }
  .selectSiteNode {
    margin-bottom: 20px;
    .functionTitle {
      font-size: 14px;
      font-weight: bold;
      line-height: 40px;
      color: $color-53;
    }
    .tshu_select {
      width: 280px;
      height: 34px;
      margin-left: 20px;
      .motivate {
        height: 34px;
        line-height: 34px;
      }
    }
    .searchBtn {
      margin-right: 10px;
    }
    .ts-input {
      width: 160px;
      margin-right: 10px;
      margin-left: 20px;
    }
  }
  .mainLeftBox {
    width: 100%;
  }
  .guideProduct {
    margin: 0 20px;
    .choseProduct {
      margin-bottom: 20px;
      font-size: 14px;
      color: $color-53;
      justify-content: space-between;
    }
    .mallSiteName {
      display: inline-block;
      max-width: 100px;
      overflow: hidden;
      color: #247af3;
      text-overflow: ellipsis;
      white-space: nowrap;
      vertical-align: bottom;
    }
  }
}
</style>
