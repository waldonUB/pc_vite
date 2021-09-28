<!-- 获客文章设置-selectTypeBox
 * @Author       : ADI
 * @Date         : 2021-07-13 11:21:31
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-13 11:22:55
-->
<template>
  <global-ts-dialog
    class="selectInvisible"
    width="550px"
    :dialog-visible.sync="isDialog"
    dialog-title="不可见文章分类"
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
import { postMessageByMultiInstance } from '../../config';
import { Checkbox, CheckboxGroup } from 'element-ui';
import { getTypeList, saveTsTypeConf } from '@/api/modules/views/setting-center/set-visit-data';

export default {
  name: 'select-type-box',
  components: {
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
  },
  props: {},
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
  computed: {},
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
  created() {
    this.getTypeList('1');
    this.getTypeList('2');
  },
  mounted() {},
  methods: {
    /**
     *获取类别列表
     *
     * @author guoyijie
     * @date 2020-04-18
     * @param {*} sliderType
     */

    async getTypeList(sliderType) {
      const [err, response] = await getTypeList({
        checkRestrict: false,
        fatherTypeId: sliderType,
        configMode: true,
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      if (sliderType == 1) {
        this.typeListOne = [].concat(response.data);
      } else if (sliderType == 2) {
        this.typeListTwo = [].concat(response.data);
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
      const [err, response] = await saveTsTypeConf({
        open: true,
        restrictTypes: JSON.stringify(array),
      });
      this.$emit('onselectHandle', array);
      this.isDialog = false;
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      postMessageByMultiInstance({
        type: 'success',
        message: response.msg || '修改成功',
      });
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
