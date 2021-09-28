<!--
 * @Author       : ADI
 * @Date         : 2021-08-03 19:37:30
 * @LastEditors  : ADI
 * @LastEditTime : 2021-08-04 15:15:08
-->
<template>
  <div class="setMallParam">
    <global-ts-header>
      <template v-slot:leftPart>
        商品参数
      </template>
      <template v-slot:rightPart>
        <global-ts-button
          type="primary"
          size="small"
          icon="icon-icon-11"
          :disabled="overNumber"
          @click.native="newAddParam"
          @click="newAddParam"
          >添加参数
        </global-ts-button>
      </template>
    </global-ts-header>
    <setParamDialog
      :dialogVisible.sync="dialogVisible"
      :isEdit="isEdit"
      :currentParamId="currentParamId"
      @handleSuccess="toSaveParam"
    ></setParamDialog>
    <div class="pro_listBox" v-cloak>
      <div class="pro_line">
        <global-ts-input
          class="searchNameInput"
          v-model="requestParam.name"
          @keyup.enter.native="reloadTable"
          placeholder="参数名称"
        >
        </global-ts-input>
        <global-ts-button
          type="primary"
          size="small"
          class="queryBtn"
          icon="icon-icon-4"
          ref="button"
          @click="reloadTable"
          >搜索
        </global-ts-button>
      </div>
      <el-table
        ref="tab"
        min-width="1010px"
        :data="responsibility.tableList"
        border
        cell-class-name="cellStyle"
        header-row-class-name="employeeHeader"
        box-sizing="border-box"
      >
        <el-table-column label="参数名称" prop="name">
          <template slot-scope="scope">
            <p class="paramTitle ellipsis2">{{ scope.row.name }}</p>
          </template>
        </el-table-column>
        <el-table-column label="选项值" prop="propValStr">
          <template slot-scope="scope">
            <p class="ellipsis2">{{ scope.row.propValStr }}</p>
          </template>
        </el-table-column>
        <el-table-column label="启用">
          <template slot-scope="scope">
            <fa-switch v-model="scope.row.open" @click="openParam(scope.row.rlPropId, scope.row.open)" />
          </template>
        </el-table-column>
        <el-table-column label="排序">
          <template slot-scope="scope">
            <div class="arrowWrap">
              <fa-icon
                class="arrow-icon"
                type="arrow-up"
                v-show="!scope.row.noShowUp"
                @click="removeClassify(scope.row, 'toUp')"
              >
              </fa-icon>
              <fa-icon
                class="arrow-icon"
                type="arrow-down"
                v-show="!scope.row.noShowDown"
                :class="!scope.row.noShowUp ? ' hasTwo' : ''"
                @click="removeClassify(scope.row, 'toDown')"
              >
              </fa-icon>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span class="tanshu_color text_but1" @click="editTableParam(scope.row.rlPropId)">
              编辑
            </span>
            <span class="tanshu_color operateBtn red" @click="delTableParam(scope.row.rlPropId)">
              删除
            </span>
          </template>
        </el-table-column>
      </el-table>
      <global-ts-pagination
        ref="formPagination"
        :tableData="responsibility.tableList"
        :requestParam="requestParam"
        :isReload.sync="responsibility.isReload"
        @getData="changeTable"
        :httpurl="responsibility.httpurl"
      >
      </global-ts-pagination>
    </div>
  </div>
</template>

<script>
import setParamDialog from '../set-param-dialog/index.vue';
import { confirm } from '@/utils';
import { Switch } from '@fk/faicomponent';
import { updateSort, switchStatus, delProp } from '@/api/modules/views/mall-manage/mall-param';

export default {
  name: 'set-mall-param',
  components: { setParamDialog, [Switch.name]: Switch },
  props: {},
  data() {
    return {
      responsibility: {
        // 表格数据
        tableList: [], // 商品参数列表
        isReload: false, // 是否重新加载
        httpurl: '/ajax/product/tsProductProp_h.jsp?cmd=getPropList', // 获取商品参数列表
      },
      requestParam: {
        // 请求数据
        name: '', // 查询的参数名
        isGetAll: false, // 是否获取所有
      },
      dialogVisible: false, // 是否显示编辑选项弹窗
      isEdit: false,
      currentParamId: -1, // 当前修改的参数id
      totalParam: 0, // 一共有多少个参数
    };
  },
  computed: {
    overNumber() {
      return this.totalParam >= 20;
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    changeTable(data) {
      this.totalParam = data.total;
      this.responsibility.tableList = data.dataList;
    },
    /**
     * 上移或下移操作
     * @author waldon
     * @date 2020-04-19
     * @param {number} row - 移位的分类
     * @param {string} type - 移位的类型 up: 上移 down: 下移
     */
    async removeClassify(row, type) {
      let swapItem = null;
      if (type === 'toUp') {
        const list = [...this.responsibility.tableList];
        swapItem = list.reverse().find(item => item.sort > row.sort);
      } else {
        swapItem = this.responsibility.tableList.find(item => item.sort < row.sort);
      }
      console.log(swapItem);
      if (!swapItem) {
        return;
      }
      const params = {
        id: row.rlPropId,
        swapId: swapItem.rlPropId,
      };
      const [err, res] = await updateSort(params);
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.reloadTable();
    },
    reloadTable() {
      this.responsibility.isReload = true;
    },
    /**
     * @description 设置商品参数是否启用
     * @author enson
     * @date 2020-12-09
     * @param {*} data
     */
    async openParam(id, isOpen) {
      if (!id) return;
      const [err, res] = await switchStatus({
        id,
        open: isOpen,
      });
      this.reloadTable();
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
      } else {
        this.$utils.postMessage({
          type: 'success',
          message: isOpen ? '开启成功' : '关闭成功',
        });
      }
    },
    /**
     * @description 打开弹窗
     * @author enson
     * @date 2020-12-09
     */
    newAddParam() {
      if (this.overNumber) {
        this.$utils.postMessage({
          type: 'error',
          message: '最多只能添加20个商品参数',
        });
        return;
      }
      this.isEdit = false;
      this.currentParamId = -1;
      this.dialogVisible = true;
    },

    /**
     * @description 保存成功后的回调函数
     * @author enson
     * @date 2020-12-11
     */
    toSaveParam() {
      this.reloadTable();
    },
    /**
     * @description 删除参数
     * @author enson
     * @date 2020-12-13
     * @param {*} id
     */
    delTableParam(id) {
      confirm('删除后，所有商品将不出现该参数，确定删除吗？').then(async () => {
        const [err, res] = await delProp({ id });
        if (err) {
          this.$utils.postMessage({
            type: 'error',
            message: err.msg || '网络错误，请稍候重试',
          });
          return Promise.reject(err);
        }
        this.$utils.postMessage({
          type: 'success',
          message: '删除成功！',
        });
        this.reloadTable();
      });
    },
    editTableParam(id) {
      this.isEdit = true;
      this.currentParamId = id;
      this.dialogVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.setMallParam {
  .operateBtn {
    &.red {
      color: $error-color;
      cursor: pointer;
    }
  }
  .pro_listBox {
    .pro_line {
      .searchNameInput {
        width: 200px;
      }
    }
    .ellipsis2 {
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
    }
  }
  .arrow-icon {
    &:hover {
      color: #247af3;
    }
    &.hasTwo {
      margin-left: 20px;
    }
  }
  .arrowWrap {
    display: flex;
    justify-content: center;
  }
  .global-button {
    &.global-button-type-primary {
      &.overNumber {
        background: #bdd7fb;
        border: 1px solid #bdd7fb;
      }
    }
  }
}
</style>
