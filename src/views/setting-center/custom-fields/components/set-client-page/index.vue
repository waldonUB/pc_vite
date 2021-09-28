<!--
 * @Author       : ADI
 * @Date         : 2021-07-12 11:38:56
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-12 14:28:39
-->
<template>
  <div class="setClientPage">
    <div class="setClientPage-header">
      <div class="setClientPage-header-left">
        <fa-radio-group v-model="currentComponent">
          <fa-radio-button v-for="(item, index) in buttonList" :key="index" :value="item.component">
            {{ item.name }}
          </fa-radio-button>
        </fa-radio-group>
      </div>
      <div class="setClientPage-header-right">
        <div v-if="['fieldsList', 'followStatusList'].includes(currentComponent)">
          <global-ts-version :hasButton="true" v-if="!version">
            <global-ts-button
              slot="button"
              class="pro_header_addEm header-right-btn"
              type="primary"
              size="small"
              icon="icon-tianjia1616"
              :disabled="true"
              >{{ addText }}
            </global-ts-button>
          </global-ts-version>
          <global-ts-button
            v-else
            slot="button"
            class="pro_header_addEm header-right-btn"
            type="primary"
            size="small"
            icon="icon-tianjia1616"
            @click="addNew"
            >{{ addText }}
          </global-ts-button>
        </div>
        <div v-if="['realseReasonList', 'delReasonList'].includes(currentComponent)">
          <global-ts-button
            class="header-right-btn"
            type="primary"
            size="small"
            icon="icon-tianjia1616"
            @click="addReason(currentComponent)"
            >新增原因
          </global-ts-button>
        </div>
      </div>
    </div>
    <component :is="currentComponent" ref="currentComponent"> </component>
  </div>
</template>

<script>
import versionDef from '@/config/version-def';
import fieldsList from '../fields-list/index.vue';
import fieldsSetting from '../fields-setting/index.vue';
import followStatusList from '../follow-status-list/index.vue';
import realseReasonList from '../realse-reason-list/index.vue';
import businessModel from '../business-model/index.vue';
import delReasonList from '../del-reason-list/index.vue';

export default {
  name: 'set-client-page',
  components: {
    fieldsList,
    fieldsSetting,
    followStatusList,
    realseReasonList,
    businessModel,
    delReasonList,
  },
  props: {},
  data() {
    return {
      buttonList: [
        //     {
        //     name: '业务模式',
        //     component: 'businessModel'
        // },
        {
          name: '客户信息设置',
          component: 'fieldsList',
        },
        {
          name: '跟进阶段设置',
          component: 'followStatusList',
        },
        // ,{
        //     name: '放弃原因设置',
        //     component: 'realseReasonList'
        // },{
        //     name: '删除原因设置',
        //     component: 'delReasonList'
        // }
      ],
      currentComponent: 'fieldsList', // TODO 后续改成businessModel
    };
  },
  computed: {
    version() {
      // 是否为试用版（包括七天试用版）
      return versionDef.getFunctionLimit('crmUserFields').condition;
    },
    addText() {
      return this.currentComponent == 'followStatusList' ? '添加跟进阶段' : '添加客户字段';
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    /**
     * @description 新增原因
     * @author enson
     * @date 2021-03-10
     */
    addReason(currentComponent) {
      this.$refs[currentComponent].addReason();
    },
    /**
     * 添加字段
     * @author lymn
     * @date 2020-09-29
     */
    addNew() {
      if (this.currentComponent == 'fieldsList') {
        this.$refs.currentComponent.addNewFields();
      } else if (this.currentComponent == 'followStatusList') {
        this.$utils.FdpLog('yx_zdygjjdtc', {
          // 自定义跟进阶段弹窗
          yx_free_text_0: '弹窗曝光',
        });
        this.$refs.currentComponent.addNewStatus();
      }
    },
    /**
     * 跳转到添加客户字段页面
     * @author lymn
     * @date 2020-09-29
     * @param {Object} opt 客户字段数据
     * @param {Boolean} opt的isAddType 是否为添加客户字段
     * @param {Number} opt的editId 编辑客户字段的id
     */
    goFieldsSetting: function(opt) {
      this.$parent.goFieldsSetting(opt);
    },
  },
};
</script>

<style lang="scss" scoped>
.setClientPage {
  .setClientPage-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
}
</style>
