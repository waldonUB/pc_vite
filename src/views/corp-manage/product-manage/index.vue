<!--
 * @Description  : 产品管理
 * @Author       : turbo
 * @Date         : 2021-03-30 14:18:10
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-31 17:14:47
-->

<template>
  <div class="productManage">
    <div class="manageProduct" v-if="showType == 1">
      <div id="productManage_bubble"></div>
      <global-ts-header>
        <template v-slot:leftPart>产品管理</template>
        <template v-slot:rightPart>
          <global-ts-button
            class="pro_header_addEm"
            type="primary"
            size="small"
            icon="icon-icon-11"
            @click="newAddProduct"
            >产品录入
          </global-ts-button>
        </template>
      </global-ts-header>
      <div class="pro_listBox">
        <div class="pro_line">
          <global-ts-input
            style="width: 160px;"
            v-model="requestParam.name"
            placeholder="请输入产品名称"
            @keyup.enter.native="searchInfo"
          >
          </global-ts-input>
          <global-ts-button type="primary" size="small" icon="icon-icon-4" @click="searchInfo">搜索 </global-ts-button>
        </div>
        <div class="showTabList">
          <el-table
            :class="'tshu-tableset'"
            :data="proList"
            border
            header-row-class-name="employeeHeader"
            min-width="1010px"
            cell-class-name="cellStyle"
            :fit="true"
          >
            <el-table-column prop="id" label="产品ID" min-width="60px"> </el-table-column>
            <el-table-column prop="name" label="产品名称" min-width="308px"> </el-table-column>
            <el-table-column prop="companyName" label="所属公司" min-width="308px"> </el-table-column>
            <el-table-column prop="dataSourceName" label="来源" min-width="82px"> </el-table-column>
            <el-table-column label="是否分佣" min-width="82px">
              <template slot-scope="scope">
                <div
                  class="payMoney"
                  :ref="'payMoney' + scope.$index"
                  @click="changePayStatus(scope.$index, scope.row.id, scope.row.bkgeStatus)"
                >
                  <template v-for="(item, index) in payTypeList">
                    <span class="tanshu_linkColor" v-if="scope.row.bkgeStatus == item.value" :key="index">
                      {{ item.label }}
                    </span>
                  </template>
                  <svg class="icon mySunshine" aria-hidden="true">
                    <use xlink:href="#icon-shaixuanxia"></use>
                  </svg>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="104px" cell-class-name="editList">
              <template slot-scope="scope">
                <div class="bottomBar">
                  <global-ts-button
                    class="em_edit"
                    type="textGreen"
                    size="mini"
                    @click="editProduct(scope.row.id)"
                    :ref="'button' + scope.row.id"
                    >编辑
                  </global-ts-button>
                  <global-ts-button
                    class="em_delete"
                    :disabled="scope.row.dataSource == 2"
                    type="textGreen"
                    size="mini"
                    @click="deleteProductInTable(scope.row.id)"
                    :ref="'button' + scope.row.id"
                    >删除
                  </global-ts-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <global-ts-pagination
          :tableData="proList"
          :requestParam="requestParam"
          :isReload.sync="isReload"
          @getData="changeTable"
          :httpurl="httpurl"
        >
        </global-ts-pagination>
      </div>
    </div>
    <global-ts-card-box class="productEdit" v-if="showType == 2">
      <template v-slot:card-box-head>
        <global-ts-tabguide @backToPrePage="backManage">
          <template v-slot:leftPart>产品管理</template>
          <template v-slot:rightPart>{{ isAddType ? '产品录入' : '产品编辑' }}</template>
        </global-ts-tabguide>
      </template>
      <template v-slot:card-box-body>
        <div class="companyeInfo">
          <fa-form-model
            ref="ruleForm"
            :model="productInfo"
            layout="vertical"
            :rules="formRules"
            :hideRequiredMark="true"
          >
            <fa-form-model-item v-if="!isAddType" label="产品ID：" prop="id">
              {{ productInfo.id }}
            </fa-form-model-item>
            <fa-form-model-item label="产品名称" prop="name">
              <global-ts-input
                v-model="productInfo.name"
                placeholder="请输入产品名称"
                :disabled="productInfo.isComFromInterface"
                :maxLength="25"
                :limitSpace="true"
                size="large"
                @focus="formBtnDisabled = false"
              >
              </global-ts-input>
            </fa-form-model-item>
            <fa-form-model-item label="所属公司" prop="companyId">
              <global-ts-fai-select
                :selectkey="{ label: 'label', value: 'value' }"
                v-model="productInfo.companyId"
                :list="belongCompanyList$"
                type="large"
                placeholder="请选择"
                :disabled="!isAddType"
                style="width: 350px;"
                @focus="formBtnDisabled = false"
              >
              </global-ts-fai-select>
            </fa-form-model-item>
            <fa-form-model-item label="是否分佣" prop="bkgeStatus">
              <div class="isPayMoneySet">
                <span v-for="(item, index) in payTypeList" :key="index">
                  <input
                    v-model="productInfo.bkgeStatus"
                    type="radio"
                    :id="'bkgeStatus' + index"
                    name="bkgeStatus"
                    :value="item.value"
                  />
                  <label :for="'bkgeStatus' + index">{{ item.label }}</label>
                </span>
              </div>
            </fa-form-model-item>
            <fa-form-model-item prop="dataSourceName" class="dataSourceNameBox">
              <template #label>
                <span>
                  来&nbsp;&nbsp;&nbsp;源:
                </span>
              </template>
              <div>{{ productInfo.dataSourceName }}</div>
            </fa-form-model-item>
          </fa-form-model>
        </div>
      </template>
      <template v-slot:card-box-bottom>
        <div class="bottomBtn">
          <div v-if="isAddType">
            <global-ts-button
              class="pro_add_emp"
              type="primary"
              size="medium"
              :disabled="formBtnDisabled"
              @click="addProduct"
              >添加
            </global-ts-button>
          </div>
          <div v-else>
            <global-ts-button
              class="pro_save_emp"
              type="primary"
              size="medium"
              :disabled="formBtnDisabled"
              @click="saveChange"
            >
              保存
            </global-ts-button>
            <global-ts-button
              class="pro_delete"
              type="others"
              size="medium"
              icon="icon-icon-10"
              :disabled="productInfo.isComFromInterface"
              @click="deleteProductInEdit"
              >删除
            </global-ts-button>
          </div>
        </div>
      </template>
    </global-ts-card-box>
  </div>
</template>

<script>
import { confirm, filterData, getLimitTips, postLimitVer } from '@/utils';
import changeBkType from './components/change-bk-type/index.js';
import {
  setTsProduct,
  addTsProduct,
  getTsCompanyList,
  getTsProduct,
  delTsProduct,
} from '@/api/modules/views/corp-manage/product-manage';

export default {
  name: 'productManage',
  components: {},
  props: {},
  data() {
    return {
      showType: 1,
      isAddType: false,
      proList: [],
      requestParam: {
        name: '',
      },
      httpurl: '/ajax/product/tsProduct_h.jsp?cmd=getTsProductList',
      isReload: false,
      productInfo: {
        id: 0,
        name: '',
        companyId: undefined,
        bkgeStatus: 1,
        dataSourceName: '手动录入',
        isComFromInterface: false,
      },
      belongCompanyList$: [],
      payTypeList: [
        {
          value: 1,
          label: '是',
          changeLabel: '分佣',
        },
        {
          value: 2,
          label: '否',
          changeLabel: '不分佣',
        },
      ],
      formBtnDisabled: false,
      rules: {
        name: [
          {
            type: 1,
            min: {
              limitNum: 0,
              tips: '请输入产品名称',
              topTips: '产品名称为空',
            },
            max: {
              limitNum: 25,
              tips: '产品名称不能超过25个字，请修改',
              topTips: '产品名称长度超过上限',
            },
          },
          {
            type: 3,
            tips: '产品名称已存在，请修改',
            topTips: '已存在相同产品名称',
          },
        ],
        companey: [
          {
            type: 1,
            min: {
              limitNum: 0,
              tips: '请选择所属公司',
              topTips: '所属公司没有选择',
            },
          },
        ],
      },
      poupTarget: null,
      productNameErrSet: new Set(),
    };
  },
  computed: {
    formRules() {
      return {
        name: [
          { required: true, message: '请输入产品名称', trigger: 'change' },
          { min: 1, max: 25, message: '产品名称不能超过25个字，请修改', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              if (this.productNameErrSet.has(value)) {
                this.$utils.postMessage({
                  type: 'error',
                  message: '产品名称已存在，请修改',
                });
                callback(new Error('产品名称已存在，请修改'));
              } else {
                callback();
              }
            },
            trigger: 'change',
          },
        ],
        companyId: [{ required: true, message: '请选择所属公司', trigger: 'change' }],
      };
    },
  },
  watch: {},
  created() {
    this.$utils.logDog('showProductManage');
    //enter
    const _self = this;
    document.onkeydown = function(e) {
      const key = window.event.keyCode;
      if (key === 13) {
        _self.searchInfo();
      }
    };
  },
  mounted() {},
  methods: {
    tipsToaddCommpany() {
      this.$utils.postMessage({
        type: 'warning',
        message: '您尚未添加公司，请前往“公司管理”添加公司后尝试',
      });
    },
    //保存产品修改
    saveChange() {
      this.$refs['ruleForm'].validate(async valid => {
        if (!valid) {
          this.formBtnDisabled = true;
          return;
        }
        const that = this;
        const [err, res] = await setTsProduct(filterData(this.productInfo, ['id', 'name', 'bkgeStatus']));
        if (err) {
          if (err.rt == 4202) {
            this.checkRuleByName();
            return Promise.reject(err);
          }
          this.$utils.postMessage({
            type: 'error',
            message: err.msg || '修改失败',
          });
          return Promise.reject(err);
        }
        this.$utils.postMessage({
          type: 'success',
          message: '修改成功',
        });
        that.isReload = true;
        setTimeout(() => {
          that.isAddType = false;
          that.showType = 1;
        }, 1000);
      });
    },
    //删除产品
    deleteProductInEdit() {
      this.deleteProduct(this.productInfo.id).then(() => {
        this.isReload = true;
        this.showType = 1;
      });
    },
    //添加产品
    addProduct() {
      this.$refs['ruleForm'].validate(async valid => {
        if (!valid) {
          return;
        }
        const that = this;
        const [err, res] = await addTsProduct(filterData(this.productInfo, ['companyId', 'name', 'bkgeStatus']));
        if (err) {
          getLimitTips('productAdd').then(info => {
            if (err.rt == info.rt) {
              postLimitVer(info.msg, 0, 2);
              return;
            }
            if (err.rt == 4202) {
              this.checkRuleByName();
              return;
            }
            this.$utils.postMessage({
              type: 'error',
              message: err.msg || '网络错误，请稍候重试',
            });
          });
          return Promise.reject(err);
        }
        this.$utils.postMessage({
          type: 'success',
          message: '添加成功',
        });
        that.isReload = true;
        setTimeout(() => {
          that.isAddType = false;
          that.showType = 1;
        }, 1000);
      });
    },
    /**
     * @description : 自定义产品名称校验规则
     * @author      : ADI
     * @Date        : 2021-07-26 17:21:33
     * @param        {*}
     * @return       {*}
     */
    checkRuleByName() {
      this.productNameErrSet.add(this.productInfo.name, true);
      this.formBtnDisabled = true;
      this.$nextTick(() => {
        this.$refs?.ruleForm.validateField('name');
      });
    },
    //订阅数据请求成功事件
    changeTable(data) {
      this.proList = data;
    },
    //获取公司列表
    async getCompanyandBkType() {
      const [err, response] = await getTsCompanyList();
      if (err) {
        return Promise.reject(err);
      }
      //转换成需要用的数据结构
      this.belongCompanyList$ = [];
      const res = response.data;
      for (const data of res) {
        this.belongCompanyList$.push({
          value: data.id,
          label: data.name,
        });
      }
      return Promise.resolve();
    },
    //修改分佣状态
    changePayStatus(index, id, bkgeStatus) {
      if (!this.poupTarget) {
        this.poupTarget = new changeBkType();
        this.poupTarget.$mount('#productManage_bubble');
      }
      this.poupTarget.changeTarget({
        target: this.$refs['payMoney' + index],
        id: id,
        bkgeStatus: bkgeStatus,
        parent: this,
      });
    },
    //跳转产品编辑页
    jumptoEditProduct() {
      this.showType = 2;
    },
    //产品录入
    newAddProduct() {
      this.$utils.logDog('productManage_newAdd');
      this.getCompanyandBkType().then(() => {
        if (this.belongCompanyList$.length > 0) {
          this.productInfo = {
            id: 0,
            name: '',
            companyId: undefined,
            bkgeStatus: 1,
            dataSourceName: '手动录入',
          };
          this.isAddType = true;
          this.jumptoEditProduct();
        } else {
          this.$utils.postMessage({
            type: 'warning',
            message: '您尚未添加公司，请前往“公司管理”添加公司后尝试',
          });
        }
      });
    },
    //编辑产品
    async editProduct(productId) {
      const that = this;
      let hasGetNum = 0;
      const resolveFn = function() {
        if (++hasGetNum == 2) {
          that.isAddType = false;
          that.jumptoEditProduct();
        }
      };
      const [err, response] = await getTsProduct({
        id: productId,
      });
      if (err) {
        return Promise.reject(err);
      } else {
        Object.assign(this.productInfo, response.data);
        this.productInfo.isComFromInterface = this.productInfo.dataSource == 2;
        resolveFn();
      }
      this.getCompanyandBkType().then(resolveFn);
    },
    deleteProductInTable(id) {
      this.deleteProduct(id).then(() => {
        this.isReload = true;
      });
    },
    //删除产品
    deleteProduct(id) {
      return confirm('确认删除产品？删除后无法恢复', '删除确认').then(async action => {
        if (action == 'confirm') {
          const [err, res] = await delTsProduct({
            id,
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
            message: '删除成功！',
          });
          return Promise.resolve();
        }
      });
    },
    //返回产品管理
    backManage() {
      this.isReload = true;
      setTimeout(() => {
        this.showType = 1;
        if (this.poupTarget) {
          this.poupTarget.cancelShow();
          this.poupTarget = null;
        }
      }, 500);
    },
    //搜索按钮搜索产品
    searchInfo() {
      this.isReload = true;
    },
    //更新分佣状态
    updateSomeQuene(bkData) {
      for (const data of this.proList) {
        if (bkData.id == data.id) {
          data.bkgeStatus = bkData.bkgeStatus;
          break;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.productManage {
  height: 100%;
}
.manageProduct {
  .pro_listBox {
    .productId {
      height: 40px;
      padding-bottom: 30px;
      clear: both;
      .procuctName {
        float: left;
        width: 260px;
        margin-right: 10px;
      }
      .search {
        float: left;
        width: 100px;
        font-size: 14px;
      }
    }
    .showTabList {
      width: 100%;
      min-width: 950px;
      padding-bottom: 30px;
      text-align: center;
      box-sizing: border-box;
    }
    .employeeHeader {
      height: 50px;
      background: $border-disabled-color;
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
      color: $color-53;
      text-align: center;
      border-color: $border-disabled-color !important;
    }
    .em_edit {
      display: inline-block;
      min-width: auto;
      margin-right: 10px;
      font-size: 14px;
      font-weight: 400;
      cursor: pointer;
    }
    .em_delete {
      min-width: auto;
      font-size: 14px;
      font-weight: 400;
      cursor: pointer;
    }
    .payMoney {
      width: 40px;
      margin: 0 auto;
      cursor: pointer;
      span {
        font-size: 14px;
        font-weight: 400;
        vertical-align: middle;
      }
      .mySunshine {
        width: 10px;
        height: 6px;
        margin: 0;
        color: $color-b2;
        vertical-align: middle;
      }
    }
  }
}

.productEdit {
  .companyeInfo {
    font-size: 14px;
    color: $color-53;
    & > .fa-form {
      width: 350px;
      margin: 0 auto;
      & > .fa-row {
        /* padding-bottom: 30px; */
        &:nth-child(1) {
          padding-top: 40px;
        }
        & > div {
          padding-bottom: 6px;
          &.isPayMoneySet {
            height: 20px;
            padding: 0;
            line-height: 20px;
          }
        }
      }
    }
    .productId {
      span {
        display: inline-block;
        width: 70px;
        height: 20px;
        line-height: 20px;
      }
    }
  }
  .bottomBtn {
    & > div {
      height: 100px;
      text-align: center;
      & > div {
        display: inline-block;
        &.pro_save_emp {
          margin-right: 10px;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.dataSourceNameBox {
  display: flex;
  .fa-form-item-label {
    min-width: 70px;
  }
}
</style>
