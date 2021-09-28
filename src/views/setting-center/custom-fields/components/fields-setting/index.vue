<!--
 * @Author       : ADI
 * @Date         : 2021-07-12 11:37:58
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-13 10:21:05
-->
<template>
  <global-ts-card-box class="fieldsSetting">
    <template v-slot:card-box-head>
      <global-ts-tabguide @backToPrePage="backManage">
        <template v-slot:leftPart>客户字段设置</template>
        <template v-slot:rightPart>添加字段</template>
      </global-ts-tabguide>
    </template>
    <template v-slot:card-box-body>
      <div class="formContent">
        <fa-form-model ref="fieldsSettingFormRef" :model="fieldsInfo" layout="vertical" :rules="formRules">
          <fa-form-model-item label="分类" prop="groupId">
            <global-ts-select
              class="content-item"
              type="large"
              v-model="fieldsInfo.groupId"
              placeholder="请选择"
              :selectkey="{ label: 'value', value: 'key' }"
              :list="groupList"
            >
            </global-ts-select>
          </fa-form-model-item>

          <fa-form-model-item label="字段名称" prop="name">
            <global-ts-input
              class="content-item fill-show-count"
              v-model="fieldsInfo.name"
              placeholder="请输入字段名称"
              :maxLength="6"
              :showCount="true"
            >
            </global-ts-input>
          </fa-form-model-item>

          <fa-form-model-item label="是否启用" prop="unable">
            <div class="userInfo_list">
              <div class="settingBox_2">
                <div class="isAbleSetting">
                  <span v-for="(item, index) in unableList" :key="index">
                    <input
                      v-model="fieldsInfo.unable"
                      type="radio"
                      :id="'able' + index"
                      :value="item.key"
                      @change="setIsAble(item.key)"
                    />
                    <label :for="'able' + index">{{ item.value }}</label>
                  </span>
                </div>
              </div>
            </div>
          </fa-form-model-item>

          <fa-form-model-item label="字段类型" prop="fieldType">
            <div class="settingBox_2">
              <div class="typeSetting">
                <span v-for="(item, index) in fieldTypeList" :key="index">
                  <input
                    v-model="fieldsInfo.fieldType"
                    type="radio"
                    :id="'fieldsType' + index"
                    :disabled="!$parent.isAddType"
                    :value="item.key"
                    @change="setFieldsType(item.key)"
                  />
                  <label :for="'fieldsType' + index">{{ item.value }}</label>
                </span>
              </div>
            </div>
          </fa-form-model-item>

          <div class="form-header comm-model" v-if="fieldsInfo.fieldType == 6 || fieldsInfo.fieldType == 5">
            <fa-form-model-item label="选项" :required="true">
              <div class="option_list">
                <slicksortList
                  lockAxis="y"
                  v-model="optionList"
                  :pressThreshold="10"
                  :lockToContainerEdges="true"
                  lockOffset="50px"
                >
                  <ts-filed-input
                    v-for="(item, index) in optionList"
                    menusPosition="left"
                    :index="index"
                    :key="index"
                    :item="item"
                    :isShowDel="optionList.length > 1"
                    @updateOptions="updateOptions"
                    @changeOptions="deleteOptions"
                    @changeName="name => (item.name = name)"
                    :greyDelIcon="false"
                    deleteTips="删除选项后，已选中的选项会被一并删除，请谨慎操作"
                  ></ts-filed-input>
                </slicksortList>
                <div class="addBtn flex flex-vc flex-hc" @click="toShowInput">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-icon-11"></use>
                  </svg>
                  <span class="mainColor">添加</span>
                </div>
              </div>
            </fa-form-model-item>
          </div>
        </fa-form-model>
      </div>
    </template>
    <template v-slot:card-box-bottom>
      <div class="bottomBtn">
        <global-ts-button v-if="$parent.isAddType" type="primary" size="medium" @click="addFields">
          添加
        </global-ts-button>
        <global-ts-button v-else class="em_add_emp" type="primary" size="medium" @click="addFields">
          保存
        </global-ts-button>
      </div>
    </template>
  </global-ts-card-box>
</template>

<script>
import { transNum } from '@/utils';
import { ContainerMixin } from 'vue-slicksort';
import { CRM_FIELD } from '../../config';
import TsFiledInput from '@/components/base/ts-filed-input/index.vue';
import {
  getTsUserFieldInfo,
  getTsUserFieldDef,
  saveTsUserFieldWithOption,
} from '@/api/modules/views/setting-center/custom-fields';

export default {
  name: 'fields-setting',
  components: {
    TsFiledInput,
    slicksortList: {
      template: `
					<div class="sorList">
						<slot></slot>
					</div>
				`,
      mixins: [ContainerMixin],
    },
  },
  props: {},
  data() {
    return {
      fieldTypeList: [], //字段类型列表
      groupList: [], //分类列表
      unableList: [], //是否启用列表
      fieldsInfo: {
        name: '',
        groupId: 0,
        fieldType: 1,
        unable: 0,
      },
      optionList: [], //选项
      delOptionIdList: [],
    };
  },
  computed: {
    formRules() {
      return {
        groupId: [{ required: true, message: '请输入字段名称', trigger: 'blur' }],
        name: [
          { required: true, message: '请选择分类名称', trigger: 'blur' },
          { min: 1, max: 6, message: '分类不能超过6个字符', trigger: 'blur' },
        ],
        unable: [{ required: true, message: '请选择是否启用', trigger: 'blur' }],
        fieldType: [{ required: true, message: '请选择字段类型', trigger: 'blur' }],
      };
    },
  },
  watch: {
    optionList(value) {
      console.log('更新了');
      console.log(value);
      this.optionList.forEach((item, index) => {
        const indexStr = transNum(index + 1);
        item.typeText = '选项' + indexStr;
      });
    },
  },
  created() {
    this.getInitList();
    this.getTsUserFieldInfo();
  },
  mounted() {},
  methods: {
    async getTsUserFieldInfo() {
      if (!this.$parent.isAddType) {
        const [err, res] = await getTsUserFieldInfo({
          id: this.$parent.editId,
          type: CRM_FIELD,
        });
        if (err) {
          this.$utils.postMessage({
            type: 'error',
            message: err.msg || '系统错误，请稍候重试',
          });
          return Promise.reject(err);
        }
        console.log(res.data);
        this.fieldsInfo = res.data;
        this.optionList = res.data.optionList.map(it => {
          it._webKey = Symbol('option');
          return it;
        });
      }
    },
    async getInitList() {
      const [err, res] = await getTsUserFieldDef({
        type: CRM_FIELD,
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '系统错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.fieldTypeList = res.data.fieldTypeList;
      this.groupList = res.data.groupList;
      this.unableList = res.data.unableList;
    },
    addFields() {
      this.$refs['fieldsSettingFormRef'].validate(async valid => {
        if (!valid) {
          return false;
        }
        const nameList = [];
        for (const item of this.optionList) {
          nameList.push(item.name);
        }
        const current = Array.from(new Set(nameList));
        if (this.fieldsInfo.fieldsType === 5 || this.fieldsInfo.fieldsType === 6) {
          const flag = this.optionList.every(element => {
            return element.name;
          });
          if (!flag) {
            this.$utils.postMessage({
              type: 'error',
              message: '保存失败，选项不能为空',
            });
            return;
          }
          if (current.length !== this.optionList.length) {
            this.$utils.postMessage({
              type: 'error',
              message: '保存失败，存在相同的选项',
            });
            return;
          }
        }
        let parmes = {};
        // remove webkey 减少数据传输
        const optionList = this.optionList.map(it => {
          delete it._webKey;
          return it;
        });
        if (!this.$parent.isAddType) {
          parmes = {
            type: CRM_FIELD,
            id: this.$parent.editId,
            optionList: JSON.stringify(optionList),
            delOptionIdList: JSON.stringify(this.delOptionIdList),
          };
        } else {
          parmes = {
            type: CRM_FIELD,
            optionList: JSON.stringify(optionList),
          };
        }
        const [err, res] = await saveTsUserFieldWithOption(Object.assign(this.fieldsInfo, parmes));
        if (err) {
          this.$utils.postMessage({
            type: 'error',
            message: err.msg || '系统错误，请稍候重试',
          });
          return Promise.reject(err);
        }
        this.$utils.postMessage({
          type: 'success',
          message: '保存成功！',
        });
        this.backManage();
      });
    },
    backManage: function() {
      // this.$parent.changeComponets({
      //     isAddType: false,
      //     editId: -1
      // });
      this.$parent.activeNum = 2;
      this.$parent.sonComponent = 'fieldsList';
      this.$parent.changeComponetSlider('', 2);
    },
    setIsAble(key) {
      this.fieldsInfo.isAble = key;
    },
    setFieldsType(key) {
      this.fieldsInfo.fieldsType = key;
      if (this.optionList.length === 0 && (this.fieldsInfo.fieldsType === 5 || this.fieldsInfo.fieldsType === 6)) {
        this.optionList = [
          {
            name: '',
            typeText: '选项一',
            _webKey: Symbol('option'),
          },
        ];
      }
    },
    /**
     * @description 切换input的添加面板
     * @author enson
     * @date 2020-05-19
     */
    toShowInput() {
      if (this.optionList.length >= 100) {
        this.$utils.postMessage({
          type: 'error',
          message: '选项不超过100个',
        });
        return;
      }
      const indexStr = transNum(this.optionList.length + 1);
      this.optionList.push({
        name: '',
        typeText: '选项' + indexStr,
        _webKey: Symbol('option'),
      });
    },

    /**
     * @description 单/多选弹窗更新选项的值
     * @author enson
     * @date 2020-07-13
     * @param {*} index
     * @param {*} value
     */
    updateOptions(index, value) {
      //this.currentOptions[index] = value;
      this.$set(this.currentOptions, index, value);
      console.log('this.currentOptions', this.currentOptions);
    },
    deleteOptions(index) {
      this.optionList[index].id && this.delOptionIdList.push(this.optionList[index].id);
      console.log(this.delOptionIdList);
      this.optionList.splice(index, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
.fieldsSetting {
  height: 100%;
  .content-header {
    margin-top: 20px;
    margin-bottom: 10px;
    font-size: 14px;
    color: $color-53;
  }
  .formContent {
    margin: 20px;
  }
  .redColor {
    color: $error-color;
  }
  .content-item {
    width: 472px;
  }
  .userInfo_list {
    max-width: 472px;
  }
  .option_list {
    max-width: 520px;
  }
  .tanshu_err {
    margin-top: 0;
  }
  .addBtn {
    height: 40px;
    max-width: 472px;
    margin-top: 12px;
    font-size: 14px;
    line-height: 40px;
    color: #247af3;
    text-align: center;
    cursor: pointer;
    border: 2px dashed #247af3;
    box-sizing: border-box;
    &.mainColor {
      &.isGrey {
        color: $border-disabled-color;
        pointer-events: none;
        border-color: $border-disabled-color;
        .mainColor {
          color: $border-disabled-color;
        }
      }
    }
  }
}
</style>
