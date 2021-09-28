<!--
 * @Description  : 录入/编辑线索
 * @Author       : turbo
 * @Date         : 2021-06-09 15:20:51
 * @LastEditors  : turbo
 * @LastEditTime : 2021-06-29 11:59:38
-->

<template>
  <global-ts-card-box class="edit-clue">
    <template #card-box-head>
      <global-ts-tabguide @backToPrePage="$emit('backToPrePage')">
        <template #leftPart>{{ pageName }}</template>
        <template #rightPart>{{ isAdd ? '录入线索' : '编辑线索' }}</template>
      </global-ts-tabguide>
    </template>
    <template #card-box-body>
      <fa-form-model ref="clueForm" class="edit-clue__form" :model="clueInfo" :rules="rules">
        <fa-form-model-item label="姓名：" prop="name">
          <global-ts-input placeholder="请输入" :max-length="25" v-model="clueInfo.name"></global-ts-input>
        </fa-form-model-item>
        <fa-form-model-item label="电话：" :validate-status="haveMobileErr ? 'error' : 'success'">
          <global-ts-input
            limit-type="int"
            placeholder="请输入"
            :max-length="25"
            v-model.number="clueInfo.wxMobile"
          ></global-ts-input>
          <template v-if="haveMobileErr" #help>电话只允许6-25位数字</template>
        </fa-form-model-item>
        <fa-form-model-item label="意向度：">
          <global-ts-select
            placeholder="请选择"
            direction="down"
            :width="718"
            :list="intentionList"
            v-model="clueInfo.intention"
          ></global-ts-select>
        </fa-form-model-item>
        <fa-form-model-item class="top-align" label="备注：">
          <fa-textarea
            placeholder="可填写意向产品/来源渠道等信息"
            :max-length="100"
            :rows="4"
            v-model="clueInfo.remark"
          ></fa-textarea>
        </fa-form-model-item>
        <fa-form-model-item v-if="isAdd" label="成员：">
          <ts-search-tree
            bind-class="addClueSelect"
            :is-worker="true"
            :is-need-permission="false"
            :select-value.sync="clueInfo.sidName"
            @select="selectSalers"
          ></ts-search-tree>
          <template #extra>非必填，不选择成员的情况下默认录入到线索公海</template>
        </fa-form-model-item>
        <div v-if="!isShowMore" class="edit-clue__show-more-btn" @click="showMore">
          更多信息<global-ts-svg-icon name="icon-xiangxia1616"></global-ts-svg-icon>
        </div>
        <div v-else class="edit-clue__more-box">
          <fa-form-model-item label="公司名称：">
            <global-ts-input placeholder="请输入" :max-length="25" v-model="clueInfo.companyName"></global-ts-input>
          </fa-form-model-item>
          <fa-form-model-item label="行业：">
            <global-ts-select
              placeholder="请选择"
              direction="down"
              :width="718"
              :list="industryList"
              :selectkey="{ label: 'value', value: 'key' }"
              v-model="clueInfo.industry"
            ></global-ts-select>
          </fa-form-model-item>
          <fa-form-model-item label="省市区：">
            <fa-cascader
              placeholder="请选择"
              :value="getRegion"
              :field-names="cascaderProps"
              :options="addressDefList"
              :change-on-select="true"
              :allow-clear="false"
              @change="changeArea"
            >
              <template #suffixIcon>
                <global-ts-svg-icon
                  class="edit-clue__area-icon"
                  name="icon-xialakuangjiantou"
                  :width="10"
                  :height="6"
                ></global-ts-svg-icon>
              </template>
            </fa-cascader>
          </fa-form-model-item>
          <fa-form-model-item label="详细地址：">
            <global-ts-input placeholder="请输入" :max-length="50" v-model="clueInfo.address"></global-ts-input>
          </fa-form-model-item>
          <fa-form-model-item label="性别：">
            <fa-radio-group v-model="clueInfo.wxSex">
              <fa-radio v-for="(item, index) in sexList" :key="index" :value="item.value">
                {{ item.label }}
              </fa-radio>
            </fa-radio-group>
          </fa-form-model-item>
          <fa-form-model-item label="QQ：">
            <global-ts-input
              limit-type="int"
              placeholder="请输入"
              :max-length="25"
              v-model="clueInfo.qq"
            ></global-ts-input>
          </fa-form-model-item>
        </div>
      </fa-form-model>
    </template>
    <template #card-box-bottom>
      <global-ts-button type="primary" size="medium" :disabled="!clueInfo.name" @click="saveClue">
        保存
      </global-ts-button>
    </template>
  </global-ts-card-box>
</template>

<script>
// components
import TsSearchTree from '@/components/base/ts-search-tree/index.vue';

// utils
import { getTsClientDef, getAddressList } from '@/utils';

// api
import { client } from '@/api';

export default {
  name: 'EditClue',
  components: {
    TsSearchTree,
  },
  props: {
    pageName: {
      type: String,
    },
  },
  data() {
    return {
      isAdd: false,
      isShowMore: false,
      haveMobileErr: false,
      clueInfo: {
        name: '',
        wxMobile: '',
        intention: '',
        remark: '',
        sid: '',
        sidName: '',
        companyName: '',
        region: '',
        industry: '',
        address: '',
        wxSex: '',
        qq: '',
        viewerId: 0,
        id: 0,
      },
      rules: {
        name: [{ required: true, message: '请输入姓名' }],
      },
      intentionList: [
        {
          label: '高',
          value: 1,
        },
        {
          label: '中',
          value: 2,
        },
        {
          label: '低',
          value: 3,
        },
      ],
      cascaderProps: {
        // 级联字段定义
        value: 'name',
        label: 'name',
        children: 'subList',
      },
      sexList: [
        {
          label: '男',
          value: 1,
        },
        {
          label: '女',
          value: 2,
        },
      ],
      industryList: [],
      addressDefList: [],
    };
  },
  computed: {
    getRegion() {
      return this.clueInfo.region ? this.clueInfo.region.split(',') : [];
    },
  },
  async created() {
    this.$pubsub.emit('editClue', (customerInfo, isAdd) => {
      this.isAdd = isAdd;
      const keys = Object.keys(this.clueInfo);
      for (const key of keys) {
        this.clueInfo[key] = customerInfo[key];
      }
    });
    this.industryList = await getTsClientDef(false, 'industry');
    this.addressDefList = await getAddressList();
  },
  methods: {
    showMore() {
      this.isShowMore = true;
      this.$utils.FdpLog('yx_xs_djzk', {
        yx_free_text_1: '页面曝光,点击展开',
      });
    },
    /**
     * 选择跟进人
     * @author guoyijie
     * @date 2020/8/14
     */
    selectSalers(value) {
      this.clueInfo.sid = value.sid;
      this.clueInfo.sidName = value.name;
    },
    changeArea(selectedArea) {
      this.clueInfo.region = selectedArea.join(',');
    },
    async saveClue() {
      const valid = await this.$refs.clueForm.validate();
      if (!valid) return;
      if (this.clueInfo.wxMobile) {
        const reg = new RegExp(/^\d{6,25}$/);
        this.haveMobileErr = !reg.test(this.clueInfo.wxMobile);
        if (this.haveMobileErr) return;
      }

      const { addTsClueStatInfo, setTsClientStatInfo } = client;
      const [err, res] = this.isAdd ? await addTsClueStatInfo(this.clueInfo) : await setTsClientStatInfo(this.clueInfo);
      this.$utils.postMessage({
        type: err ? 'error' : 'success',
        message: err ? err.msg || '网络错误，请稍候重试' : this.isAdd ? '录入成功' : '保存成功',
      });
      !err && this.$emit('backToPrePage');
    },
  },
};
</script>

<style lang="scss" scoped>
.edit-clue {
  .edit-clue__form {
    @include flex-column-center;

    padding-top: 28px;

    .fa-form-item {
      width: 800px;
    }

    ::v-deep .fa-form-item-control {
      line-height: 34px;
    }
  }

  .edit-clue__show-more-btn {
    margin-bottom: 80px;
    color: $primary-color;
    cursor: pointer;

    .ts-svg-icon {
      margin-left: 3px;
    }
  }

  .edit-clue__more-box {
    margin-bottom: 100px;
  }

  .edit-clue__area-icon {
    margin-top: -3px;
  }
}
</style>

<style lang="scss">
.ts-search-tree {
  &.addClueSelect {
    .searchTreeBox {
      width: 694px;
    }
  }
}
</style>
