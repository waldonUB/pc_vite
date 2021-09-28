<!--
 * @Description  : 客户合并对话框
 * @Author       : turbo
 * @Date         : 2021-07-16 17:13:28
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-20 12:00:24
-->

<template>
  <div>
    <global-ts-dialog
      class="customer-merge-dialog"
      dialog-size="small"
      sure-btn-name="合并"
      :closable="false"
      :dialog-visible.sync="dialogVisible"
      @cancel="cancel"
      @sure="sure"
    >
      <div class="customer-merge-dialog__head">客户重复</div>
      <div class="customer-merge-dialog__content">
        <div class="explain">检测到“{{ customerName }}”存在多个疑似相同客户，是否合并到当前客户？</div>
        <div class="list">
          <div>
            <div
              class="item"
              v-for="item in clientRepeatList"
              :key="item.id"
              @click.stop="$pubsub.emit('showCustomerDetail', item.id, clientRepeatList)"
            >
              <fa-checkbox v-model="item.isCheck" @click.native.stop></fa-checkbox>
              <global-ts-text-img
                :img-url="item.wxHeadImgUrl"
                :img-text="item.contacts"
                :sex-color="sexColor(item.sex)"
              ></global-ts-text-img>
              <div class="info">
                <div class="name">
                  {{ item.contacts }}
                  <span v-if="item.wxName">({{ item.wxName }})</span>
                </div>
                <div v-if="item.mobile" class="mobile">({{ item.mobile }})</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </global-ts-dialog>
  </div>
</template>

<script>
// utils
import { confirm } from '@/utils';

// api
import { client } from '@/api';

export default {
  name: 'CustomerMergeDialog',
  props: {
    cid: {
      type: Number,
      default: 0,
    },
    customerName: {
      type: String,
      default: '',
    },
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data() {
    return {
      clientRepeatList: [],
    };
  },
  watch: {
    dialogVisible(newVal) {
      if (newVal) {
        this.getTsClientRepeatList();
      }
    },
  },
  computed: {
    sexColor() {
      return function(sex) {
        return sex === 1 ? 'man' : sex === 2 ? 'woman' : '';
      };
    },
  },
  methods: {
    async getTsClientRepeatList() {
      const { getTsClientRepeatList } = client;
      const [err, res] = await getTsClientRepeatList({ cid: this.cid });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      const list = res.data;
      for (const item of list) {
        item.isCheck = true;
      }
      this.clientRepeatList = list;
    },
    cancel() {
      this.$emit('update:dialogVisible', false);
    },
    sure() {
      const hasCheckMergeClient = this.clientRepeatList.some(item => item.isCheck);
      if (!hasCheckMergeClient) {
        return this.$utils.postMessage({
          type: 'error',
          message: '请勾选数据',
        });
      }
      confirm('合并后无法撤销，确认合并吗？', '确认合并').then(async () => {
        const { mergerRepeatTsClientByClientId } = client;
        const needMergeClientIdList = this.clientRepeatList.filter(item => item.isCheck).map(item => item.id);
        const [err, res] = await mergerRepeatTsClientByClientId({
          clientId: this.cid,
          needMergeClientIdList: JSON.stringify(needMergeClientIdList),
        });
        this.$utils.postMessage({
          type: err ? 'error' : 'success',
          message: err ? err.msg || '网络错误，请稍候重试' : '合并成功',
        });
        if (!err) {
          this.$emit('updateDetail', res.data);
          this.$emit('update:dialogVisible', false);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.customer-merge-dialog {
  ::v-deep {
    .defaultBody {
      padding: 20px 0;
    }
  }

  .customer-merge-dialog__head {
    margin-top: 12px;
    font-size: 16px;
    line-height: 16px;
    color: $color-00;
    text-align: center;
  }

  .customer-merge-dialog__content {
    padding: 12px 0;

    .explain {
      padding: 0 24px;
      margin-bottom: 32px;
      font-size: 14px;
      color: $color-89;
      text-align: center;
    }

    .list {
      @include flex-top-center;

      max-height: 200px;
      padding: 0 24px;
      overflow-y: auto;
    }

    .item {
      @include flex-left;

      margin-bottom: 20px;
      cursor: pointer;

      &:last-child {
        margin-bottom: 0;
      }

      .textImg {
        margin-left: 12px;

        ::v-deep {
          img {
            width: 40px;
            height: 40px;
            border-radius: 4px;
          }
        }
      }

      .info {
        margin-left: 5px;

        > div + div {
          margin-top: 4px;
        }
      }

      .name {
        @include ellipsis;

        max-width: 192px;
        line-height: 19px;
        color: $color-53;
      }

      .mobile {
        font-size: 12px;
        line-height: 16px;
        color: $color-89;
      }
    }
  }
}
</style>
