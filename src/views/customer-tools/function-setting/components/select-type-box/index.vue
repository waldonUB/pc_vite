<!--
 * @Author       : ADI
 * @Date         : 2021-05-17 18:01:06
 * @LastEditors  : ADI
 * @LastEditTime : 2021-05-18 17:06:50
-->
<template>
  <global-ts-dialog
    class="selectInvisible"
    dialog-width="550px"
    :dialog-visible.sync="isDialog"
    dialog-title="不可见文章分类"
    sure-btn-name="保存"
    @sure="save"
    @cancel="cancel"
  >
    <div class="selectGroup">
      <div v-if="isShowModel">
        <span class="title">产品素材</span>
        <el-checkbox v-model="checkAllOne" @change="handleCheckAllChangeOne">全选</el-checkbox>
        <el-checkbox-group class="checkGroup" v-model="checkedTypesOne" @change="handleCheckedTypesChangeOne">
          <global-ts-tool-tips
            :disabled="type.name.length <= 5"
            v-for="type in typeListOne"
            :key="type.id"
            class="checkGroupItem"
            effect="dark"
            :content="type.name"
            placement="bottom-start"
          >
            <el-checkbox :label="type.id" :key="type.id">{{ type.name }}</el-checkbox>
          </global-ts-tool-tips>
        </el-checkbox-group>
      </div>
      <br />
      <div>
        <span class="title">行业热文</span>
        <el-checkbox v-model="checkAllTwo" @change="handleCheckAllChangeTwo">全选</el-checkbox>
        <el-checkbox-group class="checkGroup" v-model="checkedTypesTwo" @change="handleCheckedTypesChangeTwo">
          <global-ts-tool-tips
            :disabled="type.name.length <= 5"
            v-for="type in typeListTwo"
            :key="type.id"
            class="checkGroupItem"
            effect="dark"
            :content="type.name"
            placement="bottom-start"
          >
            <el-checkbox :label="type.id" :key="type.id">{{ type.name }}</el-checkbox>
          </global-ts-tool-tips>
        </el-checkbox-group>
      </div>
    </div>
  </global-ts-dialog>
</template>

<script>
import { CheckboxGroup, Checkbox } from 'element-ui';
import { postMessage } from '@/utils';
import { postMessageByMultiInstance } from '../../utils';
import { getTypeList, saveTsTypeConf } from '@/api/modules/views/customer-tools/funtions-setting';

export default {
  name: 'select-type-box',
  components: {
    [CheckboxGroup.name]: CheckboxGroup,
    [Checkbox.name]: Checkbox,
  },
  data() {
    return {
      isDialog: this.isShow,
      checkAllOne: false,
      checkAllTwo: false,
      checkedTypesOne: [],
      checkedTypesTwo: [],
      typeListOne: [],
      typeListTwo: [],
      isShowModel: true,
    };
  },
  created() {
    this.getTypeList('1');
    this.getTypeList('2');
  },
  methods: {
    /**
     *获取类别列表
     *
     * @author guoyijie
     * @date 2020-04-18
     * @param {*} sliderType
     */
    async getTypeList(sliderType) {
      const [err, res] = await getTypeList();
      if (err) {
        postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return false;
      }
      if (sliderType == 1) {
        this.typeListOne = [].concat(res.data);
      } else if (sliderType == 2) {
        this.typeListTwo = [].concat(res.data);
      }
    },
    /**
     *接收父组件的值
     *
     * @author guoyijie
     * @date 2020-04-18
     * @param {*} msg是否显示弹窗
     * @param {*} list选择的分类id
     * @param {boolean} isClose是否关闭产品素材
     */
    parentMsg(msg, list, isClose) {
      this.isDialog = msg;
      this.isShowModel = isClose;
      this.checkedTypesOne = list.enterprise;
      this.checkedTypesTwo = list.industry;
      if (this.checkedTypesOne.length == this.typeListOne.length) {
        this.checkAllOne = true;
      }
      if (this.checkedTypesTwo.length == this.typeListTwo.length) {
        this.checkAllTwo = true;
      }
    },
    /**
     *全选产品素材
     *
     * @author guoyijie
     * @date 2020-04-18
     * @param {*} val
     */
    handleCheckAllChangeOne(val) {
      const selectArr = this.typeListOne.map((item, index, input) => {
        return item.id;
      });
      this.checkedTypesOne = val ? selectArr : [];
    },
    /**
     * 全选行业热文
     *
     * @author guoyijie
     * @date 2020-04-18
     * @param {*} val
     */
    handleCheckAllChangeTwo(val) {
      const selectArr = this.typeListTwo.map((item, index, input) => {
        return item.id;
      });
      this.checkedTypesTwo = val ? selectArr : [];
    },
    /**
     *判断是否全选产品素材
     *
     * @author guoyijie
     * @date 2020-04-18
     * @param {*} value
     */
    handleCheckedTypesChangeOne(value) {
      const checkedCount = value.length;
      this.checkAllOne = checkedCount === this.typeListOne.length;
    },
    /**
     *判断是否全选行业热文
     *
     * @author guoyijie
     * @date 2020-04-18
     * @param {*} value
     */
    handleCheckedTypesChangeTwo(value) {
      const checkedCount = value.length;
      this.checkAllTwo = checkedCount === this.typeListTwo.length;
    },
    /**
     *保存修改
     *
     * @author guoyijie
     * @date 2020-04-18
     */
    async save() {
      const array = this.checkedTypesOne.concat(this.checkedTypesTwo);
      const [err, res] = await saveTsTypeConf();
      if (err) {
        postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
      } else {
        postMessageByMultiInstance({
          type: 'success',
          message: res.msg || '修改成功',
        });
      }
      this.$emit('onselectHandle', array);
      this.isDialog = false;
    },
    /**
     *取消
     *
     * @author guoyijie
     * @date 2020-04-18
     */
    cancel() {
      this.isDialog = false;
    },
  },
  watch: {
    isDialog(newVal) {
      if (newVal === false) {
        // 全选值-重置回初始状态
        const { checkAllOne, checkAllTwo } = this.$options.data();
        Object.assign(this.$data, {
          checkAllOne,
          checkAllTwo,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.selectInvisible {
  height: 100%;
  .title {
    float: left;
    margin-right: 20px;
    line-height: 1;
  }
  .checkGroup {
    margin: 0 0 0 76px;
    .checkGroupItem {
      &:nth-child(4n) {
        margin-right: 0;
      }
    }
  }
}
</style>

<style lang="scss">
.selectInvisible {
  .el-checkbox {
    width: 100px;
    margin-right: 20px;
    margin-bottom: 12.5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .el-checkbox__label {
    display: inline;
    padding-left: 8px;
    font-size: 14px;
    line-height: 19px;
    vertical-align: middle;
  }
  .el-checkbox__input {
    &.is-checked {
      & + .el-checkbox__label {
        color: $color-00;
      }
    }
  }
}
</style>
