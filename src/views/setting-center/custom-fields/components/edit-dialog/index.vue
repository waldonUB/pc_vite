<!--
 * @Author       : ADI
 * @Date         : 2021-07-12 11:57:04
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-13 10:13:56
-->
<template>
  <global-ts-dialog
    dialog-size="small"
    class="confirmDialog wxCorpDialog center"
    :dialog-visible="showDialog"
    :dialog-title="dialogTitlte"
    @cancel="cancel"
    @sure="sure"
  >
    <div class="inputGroup">
      <p class="inputLabel">跟进阶段</p>
      <global-ts-input
        class="fill-show-count"
        :maxLength="6"
        v-model="saveStatus.name"
        placeholder="跟进阶段名称"
        :showCount="true"
      >
      </global-ts-input>
    </div>
    <div class="inputGroup">
      <p class="inputLabel">阶段描述</p>
      <el-input
        class="accountName"
        type="textarea"
        maxlength="50"
        :autosize="{ minRows: 4, maxRows: 4 }"
        placeholder="请输入阶段描述"
        v-model="saveStatus.description"
      >
      </el-input>
    </div>
  </global-ts-dialog>
</template>

<script>
import { Input } from 'element-ui';
import { saveTsUserFollowStatus } from '@/api/modules/views/setting-center/custom-fields';

export default {
  name: 'edit-dialog',
  components: { [Input.name]: Input },
  props: {
    editType: {
      // 编辑类型 edit:修改字段 add:增加字段
      type: String,
      default: '',
    },
    fid: Number, // 此id用于编辑/添加跟进阶段
    showDialog: {
      // 是否显示弹窗
      type: Boolean,
      default: false,
    },
    editData: {
      // 需要编辑的跟进阶段数据
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      saveStatus: {
        // 跟进阶段
        id: 0, // id，编辑时需要该项，添加时不需要
        name: '', // 名称
        description: '', // 描述
      },
    };
  },
  computed: {
    dialogTitlte() {
      // 编辑框标题
      return this.editType == 'add' ? '增加字段' : '修改字段';
    },
  },
  watch: {
    showDialog: {
      handler: function(show) {
        if (!show) return;
        if (this.editType == 'edit') {
          const data = this.editData;
          if (Object.keys(data).length > 0) {
            this.saveStatus = {
              id: data.id,
              name: data.name,
              description: data.description,
            };
          }
        } else {
          this.saveStatus = this.$options.data().saveStatus;
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {},
  mounted() {},
  methods: {
    /**
     * 关闭弹窗
     * @author lymn
     * @date 2020-09-29
     */
    cancel() {
      this.$emit('update:showDialog', false);
      this.$utils.FdpLog('yx_zdygjjdtc', {
        // 自定义跟进阶段弹窗
        yx_free_text_0: '点击取消',
      });
    },
    /**
     * 保存
     * @author lymn
     * @date 2020-09-29
     */
    async sure() {
      this.$utils.FdpLog('yx_zdygjjdtc', {
        // 自定义跟进阶段弹窗
        yx_free_text_0: '点击确定',
      });
      const params = this.saveStatus;
      if (this.editType == 'add') {
        delete params.id;
      }
      const [err, res] = await saveTsUserFollowStatus(
        Object.assign(params, {
          fid: this.fid,
        }),
      );
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '系统错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.$emit('update:showDialog', false);
      this.$emit('updateList');
    },
  },
};
</script>

<style lang="scss" scoped>
.edit-dialog {
}
</style>
