<!--
 * @Description  : 添加/编辑标签对话框
 * @Author       : turbo
 * @Date         : 2021-07-21 16:55:14
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-22 10:27:41
-->

<template>
  <global-ts-dialog
    class="edit-tag-dialog"
    dialog-size="medium"
    :dialog-title="dialogTitle"
    :dialog-visible.sync="dialogVisible"
    @cancel="cancel"
    @sure="sure"
  >
    <fa-form-model layout="vertical">
      <fa-form-model-item label="标签组">
        <global-ts-input
          placeholder="请输入标签组名称"
          size="large"
          :max-length="30"
          v-model="form.groupName"
        ></global-ts-input>
      </fa-form-model-item>
      <fa-form-model-item label="标签">
        <div class="input-item" v-for="item in tagList" :key="item.id">
          <global-ts-input
            placeholder="请输入标签名称"
            size="large"
            :max-length="30"
            v-model="item.name"
          ></global-ts-input>
          <global-ts-svg-icon
            class="delete-icon"
            name="icon-icon-7"
            color="#b2b2b2"
            :size="14"
            @click="deleteWxTag(item)"
          ></global-ts-svg-icon>
        </div>
        <div class="add-btn" @click="addWxTag">
          <global-ts-svg-icon class="add-icon" name="icon-icon-11"></global-ts-svg-icon>添加
        </div>
      </fa-form-model-item>
    </fa-form-model>
  </global-ts-dialog>
</template>

<script>
// api
import { wxwork } from '@/api';

export default {
  name: 'EditTagDialog',
  props: {
    tagGroupInfo: {
      type: Object,
      default: () => {},
    },
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data() {
    return {
      form: {
        groupId: '',
        groupName: '',
        tag: '',
      },
      tagState: {
        add: [],
        set: [],
        del: [],
      },
      tagList: [],
      tagListCurrentNum: 0, // tagList的当前标志位
    };
  },
  watch: {
    dialogVisible(newVal) {
      if (newVal) {
        this.initForm();
        if (this.isAddType) {
          this.tagList.push({
            id: 'wxTag_' + this.tagListCurrentNum++,
            name: '',
          });
        } else {
          this.form = {
            groupId: this.tagGroupInfo.id,
            groupName: this.tagGroupInfo.name,
            tag: '',
          };
          this.getCurrentGroupInfo();
        }
      }
    },
  },
  computed: {
    isAddType() {
      return !this.tagGroupInfo?.id;
    },
    dialogTitle() {
      return this.tagGroupInfo?.id ? '编辑标签' : '添加标签';
    },
  },
  methods: {
    cancel() {
      this.$emit('update:dialogVisible', false);
    },
    /**
     * 获取当前分组的标签列表
     * @author waldon
     * @date 2020/4/10
     */
    async getCurrentGroupInfo() {
      const { getCorpTagList } = wxwork;
      const [err, res] = await getCorpTagList({
        type: 1, // type状态 1 - 标签 2 - 标签组
        groupId: this.tagGroupInfo.id, // 标签组id
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      res.data.forEach(item => {
        this.tagList.push({
          id: item.id,
          name: item.name,
          sort: item.sort,
        });
      });
    },
    /**
     * 重置表单数据
     * @author waldon
     * @date 2020/4/10
     */
    initForm() {
      this.form = {
        groupId: '',
        groupName: '',
        tag: '',
      };
      this.tagList = [];
      this.tagState = {
        add: [],
        set: [],
        del: [],
      };
    },
    /**
     * 添加标签
     * @author waldon
     * @date 2020/4/10
     */
    addWxTag() {
      this.tagList.push({
        id: 'wxTag_' + this.tagListCurrentNum++, // 给值，方便未保存的时候删除
        name: '',
      });
    },
    /**
     * 删除弹窗的单个标签
     * @param {Object} tag - 单个标签的信息
     * @author waldon
     * @date 2020/4/10
     */
    deleteWxTag(tag) {
      this.tagList = this.tagList.filter(item => item.id !== tag.id);
      this.tagState.del.push(tag.id);
    },
    /**
     * 保存标签分组和标签
     * @author waldon
     * @date 2020/4/10
     */
    async sure() {
      if (!this.form.groupName) {
        return this.$utils.postMessage({
          type: 'error',
          message: '添加失败，标签组名称不能为空',
        });
      }
      const index = this.tagList.findIndex(item => !item.name);
      if (index > -1) {
        return this.$utils.postMessage({
          type: 'error',
          message: '添加失败，标签名称不能为空',
        });
      }
      this.tagList.forEach(item => {
        if (item.id.includes('wxTag_')) {
          // 新增态只传name，编辑态传id name sort
          this.tagState.add.push({
            name: item.name,
          });
        } else {
          this.tagState.set.push({
            id: item.id,
            name: item.name,
            sort: item.sort,
          });
        }
      });
      this.form.tag = JSON.stringify(this.tagState);

      const { addCorpTag, editCorpTag } = wxwork;
      const [err, res] = this.isAddType ? await addCorpTag(this.form) : await editCorpTag(this.form);
      this.tagState = {
        // 保存完成时，清空传进去的添加参数
        add: [],
        set: [],
        del: [],
      };
      let errMsg = '';
      if (err?.rt === 40071 || res?.data?.errcode === 40071) {
        errMsg = '标签名字已经存在';
      }
      const isErr = errMsg || err;
      this.$utils.postMessage({
        type: isErr ? 'error' : 'success',
        message: isErr ? errMsg || err.msg || '网络错误，请稍候重试' : '操作成功',
      });
      if (!isErr) {
        !this.isAddType && this.$utils.FdpLog('yx_bjbq');
        this.$emit('editTagSuccess');
        this.cancel();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.edit-tag-dialog {
  .fa-form-item {
    margin-bottom: 12px;
  }

  .input-item {
    @include flex-center;

    margin-bottom: 15px;

    .delete-icon {
      margin-left: 20px;
      cursor: pointer;
    }
  }

  .add-btn {
    @include flex-center;

    height: 40px;
    color: $primary-color;
    cursor: pointer;
    border: 1px dashed $primary-color;
    border-radius: 4px;
    box-sizing: border-box;

    .add-icon {
      margin-right: 6px;
    }
  }
}
</style>
