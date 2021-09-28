<!--
 * @Author       : ADI
 * @Date         : 2021-08-03 19:37:30
 * @LastEditors  : ADI
 * @LastEditTime : 2021-08-04 15:15:11
-->
<template>
  <global-ts-dialog
    wrapClassName="setParamDialog"
    :dialog-title="dialogTitle"
    :dialog-visible.sync="dialogVisible"
    :zIndex="1100"
    @cancel="handleCancel"
    @sure="handleOk"
  >
    <div class="setParamDialog-content">
      <div class="setParamDialog-setItem addBottom">
        <div class="setParamDialog-title">参数名称</div>
        <global-ts-input
          v-model="paramTitle"
          placeholder="请输入参数名称"
          :max-length="20"
          :show-count="true"
          :block="true"
          size="large"
        >
        </global-ts-input>
      </div>
      <div class="setParamDialog-setItem">
        <div class="setParamDialog-title">参数选项值</div>
        <fa-table
          ref="fa-paramTable"
          class="paramTable"
          :columns="paramColumns"
          :data-source="paramList"
          size="middle"
          :pagination="false"
          :scroll="scrollConfig"
        >
          <template slot="val" slot-scope="text, record">
            <div class="paramNameWrap">
              <p class="paramName" @click="editParam(record.key, 'paramInput' + record.key)" v-show="!record.editable">
                {{ text }}
              </p>
              <el-input
                class="paramName"
                v-show="record.editable"
                :ref="'paramInput' + record.key"
                :value="record.val"
                :maxlength="25"
                @input="handleChange($event, record.key, 'val')"
                @keyup.enter.native="saveParam(record.key, 'val')"
              >
              </el-input>
              <div v-show="record.editable" class="fillDev" @click="saveParam(record.key, 'val')"></div>
            </div>
          </template>
          <template slot="sort" slot-scope="text, record, index">
            <div class="arrowWrap">
              <fa-icon
                class="arrow-icon"
                type="arrow-up"
                v-show="index !== 0"
                @click="changeParam('toUp', index)"
              ></fa-icon>
              <fa-icon
                class="arrow-icon"
                type="arrow-down"
                :class="index !== 0 ? ' hasTwo' : ''"
                v-show="index === 0 || index !== paramList.length - 1"
                @click="changeParam('toDown', index)"
              ></fa-icon>
            </div>
          </template>
          <template slot="operation" slot-scope="text, record">
            <div class="editable-row-operations redColor" @click="delParam(record.key)">删除</div>
          </template>
        </fa-table>
        <div :class="['addParam', { disabled: paramLen }]" @click="addParam">
          <i class="el-icon-plus"></i>
          添加选项值
        </div>
      </div>
    </div>
  </global-ts-dialog>
</template>

<script>
import { Table, Switch } from '@fk/faicomponent';
import { Input } from 'element-ui';
import { confirm } from '@/utils';
import { saveProp, getProp } from '@/api/modules/views/mall-manage/mall-param';

export default {
  name: 'set-param-dialog',
  components: {
    [Switch.name]: Switch,
    [Table.name]: Table,
    [Input.name]: Input,
  },
  props: {
    isEdit: {
      type: Boolean,
      defualt: false,
    },
    dialogVisible: {
      type: Boolean,
      defualt: false,
    },
    currentParamId: {
      type: [Number, String],
      default: -1,
    },
  },
  data() {
    return {
      paramColumns: [
        {
          title: '选项值',
          dataIndex: 'val',
          width: 186,
          align: 'center',
          scopedSlots: { customRender: 'val' },
        },
        {
          title: '排序',
          dataIndex: 'sort',
          width: 186,
          align: 'center',
          scopedSlots: { customRender: 'sort' },
        },
        {
          title: '操作',
          dataIndex: 'operation',
          align: 'center',
          scopedSlots: { customRender: 'operation' },
        },
      ],
      paramTitle: '', // 参数名称
      paramList: [], // 参数列表
      delItemIdList: [], // 删除已有参数id的列表
    };
  },
  computed: {
    dialogTitle() {
      return this.isEdit ? '编辑参数弹窗' : '添加参数弹窗';
    },
    paramLen() {
      return this.paramList.length >= 20;
    },
    scrollConfig() {
      return this.paramList.length > 3
        ? {
            y: 150,
          }
        : {};
    },
  },
  watch: {
    dialogVisible(newValue) {
      if (newValue) {
        this.reset();
        this.getParamDetail();
      } else {
        setTimeout(() => {
          this.reset();
        }, 400);
      }
    },
  },
  created() {},
  mounted() {},
  methods: {
    /**
     * @description 弹窗关闭的回调函数
     * @author enson
     * @date 2020-12-09
     */
    handleCancel() {
      // this.$nextTick( () => {
      //     this.paramTitle = '' // 重置参数名称
      //     this.paramList = []  // 重置参数列表
      // })
      this.$emit('update:dialogVisible', false);
    },
    /**
     * @description 点击确定的回调函数
     * @author enson
     * @date 2020-12-09
     */
    handleOk() {
      /***  
        1）参数名称为空：请填写参数名称
        2）已存在相同参数名称：已存在相同参数名称，请修改
      */
      if (!this.paramTitle) {
        this.$utils.postMessage({
          type: 'error',
          message: '请填写参数名称',
        });
        return;
      }

      if (this.paramList.length <= 0) {
        this.$utils.postMessage({
          type: 'error',
          message: '请添加选项值',
        });
        return;
      }

      const isNull = this.paramList.some(item => !item.val);
      if (isNull) {
        this.$utils.postMessage({
          type: 'error',
          message: '选项值为空',
        });
        return;
      }

      const saveItemList = this.paramList.map(item => {
        return {
          propValId: item.propValId ? item.propValId : -1,
          val: item.val,
          sort: item.sort,
        };
      });

      this.saveProp(saveItemList);
    },
    /**
     * @description : saveProp
     * @author      : ADI
     * @Date        : 2021-07-27 19:43:27
     * @param        {*} saveItemList
     * @return       {*}
     */
    async saveProp(saveItemList) {
      const [err, res] = await saveProp({
        id: this.currentParamId,
        name: this.paramTitle,
        saveItemList: JSON.stringify(saveItemList),
        delItemList: JSON.stringify(this.delItemIdList),
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.$emit('handleSuccess');
      this.handleCancel();
    },
    /**
     * @description 编辑选项名称
     * @author enson
     * @date 2020-12-09
     * @param {*} key 选项数据的唯一标识
     * @param {String} refKey - 获取元素的ref
     */
    editParam(key, refKey) {
      const newData = [...this.paramList];
      const target = newData.filter(item => key === item.key)[0];
      if (target) {
        this.$set(target, 'editable', true);
        this.$nextTick(() => {
          this.$refs[refKey].focus();
        });
      }
    },
    /**
     * @description 设置选项名称
     * @author enson
     * @date 2020-12-09
     */
    saveParam(key, column) {
      const target = this.paramList.filter(item => key === item.key)[0];
      if (target) {
        this.$set(target, 'editable', false);

        if (!target[column]) {
          target['oldValue'] && (target[column] = target['oldValue']);
        } else {
          if (!this.checkParam('modify')) {
            this.$utils.postMessage({
              type: 'error',
              message: '已存在相同名称的选项值，请修改',
            });
            // target[column] = target['oldValue'] || '';
            this.delParamOprate(key);
            return;
          }
        }
        target['oldValue'] = ''; // 重置
      }
    },
    /**
     * @description 修改选项的名称
     * @author enson
     * @date 2020-11-12
     * @param {*} value
     * @param {*} key
     * @param {*} column
     */
    handleChange(value, key, column) {
      const target = this.paramList.find(item => key === item.key);
      if (target) {
        target.editable = true;
        !target['oldValue'] && (target['oldValue'] = target[column]); // 暂存
        target[column] = (value && value.trim()) || '';
      }
    },
    /**
     * @description 删除选项
     * @author enson
     * @date 2020-12-11
     * @param {*} key
     */
    delParam(key) {
      confirm({
        msg: '删除后，所有商品将不出现该选项值，确定删除吗？',
      }).then(() => {
        this.delParamOprate(key);
      });
    },
    delParamOprate(key) {
      const delParam = this.paramList.find(item => key === item.key);
      this.paramList = this.paramList.filter(item => key !== item.key);
      if (delParam.propValId) {
        this.delItemIdList.push(delParam.propValId);
      }
    },
    /**
     * @description 添加参数
     * @author enson
     * @date 2020-12-10
     */
    addParam() {
      if (!this.checkParam('add')) {
        this.$utils.postMessage({
          type: 'error',
          message: '最多只能添加20个选项值',
        });
        return;
      }

      const paramList = this.paramList;
      const sortList = paramList.map(item => item.sort);
      const maxLen = paramList.length;
      const newSort = sortList.length <= 0 ? 1 : Math.max(...sortList) + 1;
      const paramKey = `param_${new Date().getTime()}`;

      paramList.push({
        key: paramKey,
        val: `选项值${maxLen + 1}`,
        sort: newSort,
      });

      this.$nextTick(() => {
        this.editParam(paramKey, 'paramInput' + paramKey);
      });
    },
    /**
     * @description 检查参数选项是否符合规则
     * @author enson
     * @date 2020-12-10
     * @param {String} type - add-添加参数规则 modify-修改参数规则
     * @returns checkFlag - true-符合 false-不符合
     */
    checkParam(type) {
      let checkFlag = false; // 参数项是否符合规则
      switch (type) {
        case 'add': // 添加参数项规则，参数项最多20个
          if (!this.paramLen) {
            // 小于20，则可以添加
            checkFlag = true;
          }
          break;
        case 'modify':
          const nameList = this.paramList.map(item => item.val);
          const nameUniqueList = [...new Set(nameList)];
          if (nameList.length === nameUniqueList.length) {
            // 沒有相同的参数项名称
            checkFlag = true;
          }
          break;
      }
      return checkFlag;
    },
    /**
     * @description 改变参数项位置
     * @author enson
     * @date 2020-12-11
     * @param {String} type toUp-向上交换 toDown-向下交换
     * @param {Number} index 被交换的选项值下标
     */
    changeParam(type, index) {
      const paramList = [...this.paramList];
      const paramLen = paramList.length; // 数组长度
      const maxIndex = paramLen - 1; // 最大下标
      const minIndex = 0; // 最小下标
      const cacheTarget = paramList[index]; // 被交换的选项值
      const cacheSort = cacheTarget.sort;
      let newIndex; // 目标下标
      // let newTarget; // 目标对象
      // let newSort; // 目标sort

      if (!type || paramLen <= 0) return;

      switch (type) {
        case 'toUp':
          newIndex = index - 1;
          break;
        case 'toDown':
          newIndex = index + 1;
          break;
      }

      if (newIndex < minIndex || newIndex > maxIndex) return;
      if (index === newIndex) return;

      const newTarget = paramList[newIndex];
      const newSort = newTarget.sort;

      newTarget.sort = cacheSort;
      cacheTarget.sort = newSort;
      paramList[index] = newTarget;
      paramList[newIndex] = cacheTarget;

      this.paramList = [].concat(paramList);
    },
    /**
     * @description 重置数据
     * @author enson
     * @date 2020-12-16
     */
    reset() {
      this.paramTitle = ''; // 参数名称
      this.paramList = []; // 参数列表
      this.delItemIdList = []; // 删除已有参数的列表
    },
    /**
     * @description 如果是编辑，根据参数id获取参数项的值
     * @author enson
     * @date 2020-12-16
     */
    async getParamDetail() {
      if (!this.isEdit) return;
      const [err, response] = await getProp({
        id: this.currentParamId,
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      const { propInfo, propValList } = response.data;
      this.paramTitle = propInfo.name;
      this.paramList = propValList;
    },
  },
};
</script>

<style lang="scss" scoped>
.setParamDialog {
  .editable-row-operations {
    cursor: pointer;
  }
  .redColor {
    color: $error-color;
  }
  .addParam {
    width: 100%;
    height: 50px;
    line-height: 50px;
    color: #247af3;
    text-align: center;
    cursor: pointer;
    background: $color-ff;
    border: 1px solid $border-disabled-color;
    box-sizing: border-box;
    &.disabled {
      color: #90bbf8;
    }
  }
  .setParamDialog-content {
    height: 374px;
    padding-bottom: 10px;
    box-sizing: border-box;
    .setParamDialog-setItem {
      .setParamDialog-title {
        margin-bottom: 10px;
        font-family: MicrosoftYaHei;
        font-size: 14px;
        line-height: 14px;
        color: $color-53;
      }
    }
  }
  .addBottom {
    margin-bottom: 20px;
  }
  .paramTable {
    border: 1px solid $border-disabled-color;
    border-bottom: none;
    tr {
      height: 50px;
      box-sizing: border-box;
    }
  }
  .paramNameWrap {
    height: 34px;
    .paramName {
      z-index: 9999;
      display: inline-block;
      width: 110px;
      height: 34px;
      font-size: 14px;
      line-height: 34px;
      color: $color-53;
      text-align: center;
      border-radius: 4px;
      box-sizing: border-box;
      &:hover {
        cursor: pointer;
        background: #e9f1fd;
      }
    }
    p {
      &.paramName {
        padding: 0 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .fillDev {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9998;
    width: 100%;
    height: 100%;
  }
  .arrowWrap {
    display: flex;
    justify-content: center;
  }
  .arrow-icon {
    &.hasTwo {
      margin-left: 20px;
    }
    &:hover {
      color: #247af3;
    }
  }
}
</style>

<style lang="scss">
.setParamDialog {
  .paramTable {
    .fa-table-placeholder {
      border-bottom: none;
      border-radius: 0;
    }
    .fa-table-tbody {
      & > tr {
        & > td {
          border-bottom: none;
        }
      }
    }
    .fa-table-body {
      &::-webkit-scrollbar {
        background-color: #f0f0f0;
      }
    }
    .fa-table-middle {
      & > .fa-table-content {
        & > .fa-table-body {
          & > table {
            & > .fa-table-tbody {
              & > tr {
                & > td {
                  padding: 0 8px;
                  padding-top: 7px;
                  padding-bottom: 7px;
                }
              }
            }
          }
        }
        & > .fa-table-scroll {
          & > .fa-table-body {
            & > table {
              & > .fa-table-tbody {
                & > tr {
                  & > td {
                    padding: 0 8px;
                    padding-top: 7px;
                    padding-bottom: 7px;
                  }
                }
              }
            }
          }
        }
      }
    }
    .fa-table-header {
      background: $table-header-bg;
    }
    .fa-table-thead {
      & > tr {
        & > th {
          border-bottom: 1px solid $border-disabled-color;
        }
      }
    }
  }
  .paramNameWrap {
    .paramName {
      .el-input__inner {
        height: 34px;
        text-align: center;
      }
    }
  }
}
.setParamDialog
  .paramTable
  .fa-table-thead
  > tr.fa-table-row-hover:not(.fa-table-expanded-row):not(.fa-table-row-selected)
  > td,
.setParamDialog
  .paramTable
  .fa-table-tbody:not(.fa-table-tbody-has-dragging-row)
  > tr.fa-table-row-hover:not(.fa-table-expanded-row):not(.fa-table-row-selected)
  > td,
.setParamDialog .paramTable .fa-table-thead > tr:hover:not(.fa-table-expanded-row):not(.fa-table-row-selected) > td,
.setParamDialog
  .paramTable
  .fa-table-tbody:not(.fa-table-tbody-has-dragging-row)
  > tr:hover:not(.fa-table-expanded-row):not(.fa-table-row-selected)
  > td {
  background: #f5f7fa;
}
</style>
