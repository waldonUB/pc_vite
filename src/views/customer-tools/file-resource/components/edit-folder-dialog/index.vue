<!--
 * @Author       : ADI
 * @Date         : 2021-06-09 15:09:08
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-10 17:28:19
-->
<template>
  <global-ts-dialog
    class="editFolderDialog"
    wrap-class-name="fileResourceWrap"
    dialog-title="复制文件夹"
    :dialog-visible.sync="dialogVisible"
    :lock-dialog-body-height="false"
    @cancel="cancel"
    @sure="sure"
  >
    <fa-form-model ref="editFolderRuleForm" layout="vertical" :model="requestParam" :rules="rules">
      <fa-form-model-item label="上级文件夹" prop="parentId">
        <div class="inputGroupBox">
          <selectFolderList
            v-if="dialogVisible"
            ref="selectFolderList"
            @select="selectFolder"
            :defaultSelectId="requestParam.parentId"
          >
          </selectFolderList>
        </div>
      </fa-form-model-item>
      <fa-form-model-item label="文件夹名称" prop="name">
        <div class="inputGroupBox">
          <fa-input
            size="large"
            v-model="requestParam.name"
            :maxLength="15"
            :showCount="true"
            placeholder="请输入文件夹名称"
            class="display-block"
          ></fa-input>
        </div>
      </fa-form-model-item>
    </fa-form-model>
  </global-ts-dialog>
</template>

<script>
import selectFolderList from '../select-folder-list/index.vue';
import TsCommDef from '@/config/ts-comm-def';
import { cloneGroupFromProductMaterial } from '@/api/modules/views/customer-tools/file-resource';

export default {
  name: 'edit-folder-dialog',
  components: {
    selectFolderList,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    editItem: {
      // 如果是编辑文件夹,传入待编辑的文件夹对象
      type: Object,
      defualt: () => {},
    },
  },
  data() {
    return {
      // dialogTitle: '编辑文件夹',
      requestParam: {
        // 请求数据
        groupId: '',
        parentId: 0,
        typeGroup: TsCommDef.TypeGroupDef.CORP_FOLDER,
        name: '',
      },
    };
  },
  computed: {
    rules() {
      return {
        name: [
          { required: true, message: '请输入文件夹名称', trigger: 'blur' },
          {
            min: 0,
            max: 15,
            message: '名称不能超过15个字符',
            trigger: 'blur',
          },
        ],
      };
    },
    // dialogTitle() {
    //     return this.editType == 'add' ? '新建文件夹' : '复制文件夹'
    // }
  },
  watch: {
    // editItem: {
    //     handler(newVal, oldVal) {
    //         let urlIndex;
    //         console.log(newVal, '文件项修改')
    //         if (Object.keys(newVal).length) {
    //             // 编辑文件夹
    //             urlIndex = 1
    //             this.requestParam.name = newVal.name
    //             this.requestParam.id = newVal.id
    //             this.requestParam.parentId = newVal.parentId
    //             this.editType = 'edit'
    //         } else {
    //             // 新建文件夹
    //             urlIndex = 0
    //             this.editType = 'add'
    //             this.requestParam = {
    //                 type: GROUPTYPE,
    //                 name: '',
    //                 parentId: 0,
    //                 id: '',
    //             }
    //         }
    //         this.requestUrl = this.requestUrlList[urlIndex]
    //     },
    //     deep: true
    // },
    dialogVisible(newVal) {
      if (newVal) {
        // this.requestParam = {
        //     type: GROUPTYPE,
        //     name: this.editItem.name || '',
        //     parentId: this.editItem.parentId || 0,
        //     id: this.editItem.id || '',
        // }
        // if (Object.keys(this.editItem).length) {
        //     this.requestParam = {
        //         type: GROUPTYPE,
        //         name: this.editItem.name,
        //         parentId: this.editItem.parentId,
        //         id: this.editItem.id,
        //         isDir: true
        //     }
        // }
        this.requestParam = {
          groupId: this.editItem.id,
          parentId: TsCommDef.TypeGroupDef.CORP_FOLDER,
          typeGroup: TsCommDef.TypeGroupDef.CORP_FOLDER,
          name: this.editItem.name,
        };
      } else {
        this.$refs.editFolderRuleForm?.resetFields();
      }
    },
  },
  created() {
    console.log('开始编辑文件夹');
  },
  mounted() {},
  methods: {
    cancel() {
      this.$emit('update:dialogVisible', false);
    },
    sure() {
      this.$refs.editFolderRuleForm.validate(async valid => {
        console.log('valid', valid);
        if (!valid) {
          return;
        }
        const [err, res] = await cloneGroupFromProductMaterial(this.requestParam);
        if (err) {
          this.$utils.postMessage({
            type: 'error',
            message: err.msg || '系统错误，请稍候重试',
          });
          return Promise.reject(err);
        }
        this.$emit('success', this.editType, res.data);
        this.$utils.postMessage({
          type: 'success',
          message: '复制成功！',
        });
        this.cancel();
      });
    },
    /**
     * 选中文件夹
     * @author lymn
     * @date 2020-11-10
     */
    selectFolder(selectId, selectItem) {
      this.requestParam.parentId = selectId;
      this.requestParam.typeGroup = selectItem.isCorp
        ? TsCommDef.TypeGroupDef.CORP_FOLDER
        : TsCommDef.TypeGroupDef.PERSON_FOLDER;
    },
  },
};
</script>

<style lang="scss" scoped>
.edit-folder-dialog {
}
</style>

<style lang="scss">
.editFolderDialog .el-input__inner {
  padding: 0 13px;
}
</style>
