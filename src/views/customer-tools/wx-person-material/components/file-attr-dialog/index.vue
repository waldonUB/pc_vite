<!--
 * @Author       : ADI
 * @Date         : 2021-06-09 15:21:51
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-15 15:50:34
-->
<template>
  <global-ts-wx-work-dialog
    class="fileDetailDialog"
    :withFooter="false"
    dialogSize="small"
    dialogTitle="详细信息"
    :tsDialogVisible.sync="dialogVisible"
    @cancel="cancelUpload"
  >
    <div class="infoList" v-if="fileInfo">
      <div class="infoBox" v-for="(item, index) in infoList" :key="index">
        <span class="title flexItem">{{ item.title }}</span>
        <span class="name">{{ item.getInfo ? item.getInfo(fileInfo[item.key]) : fileInfo[item.key] }}</span>
      </div>
    </div>
  </global-ts-wx-work-dialog>
</template>

<script>
import { format } from '@/utils';
import { GROUPTYPE } from '../../config';
import { getFileOrDirAttr } from '@/api/modules/views/customer-tools/file-resource';

export default {
  name: 'file-attr-dialog',
  components: {},
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    file: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      requestParam: {
        isDir: false, // 是否是文件夹 true:是 false:否
        id: '', // 文件夹/文件 id
        type: GROUPTYPE, // 类型 12:企业文件
      },
      fileInfo: null, // 文件属性信息
      initInfoList: [
        // 默认的文件属性列表
        {
          key: 'name',
          title: '名称',
        },
        {
          key: 'size',
          title: '大小',
        },
        {
          key: 'fileNum', // 只有文件夹需要显示这个
          title: '数量',
        },
        {
          key: 'path',
          title: '位置',
        },
        {
          key: 'updateTime',
          title: '修改时间',
          getInfo(date) {
            return format.formatDate(date);
          },
        },
        {
          key: 'creatorName', // 只有文件需要显示这个
          title: '创建人',
        },
      ],
      infoList: [], // 实际的文件属性列表
    };
  },
  computed: {},
  watch: {
    dialogVisible(newVal) {
      if (newVal) {
        if (Object.keys(this.file).length && this.dialogVisible) {
          console.log(this.file, '文件属性的');
          this.fileInfo = null;
          this.infoList = [...this.initInfoList];
          if (this.file.isDir) {
            this.infoList.splice(5, 1); // 文件夹没有"创建人"属性
          } else {
            this.infoList.splice(2, 1); // 文件没有"数量"属性
          }
          this.requestParam.isDir = this.file.isDir;
          this.requestParam.id = this.file.id;

          console.log('准备获取文件属性');
          this.getFileAttr();
        }
      }
    },
  },
  created() {},
  mounted() {},
  methods: {
    /**
     * 关闭
     * @author lymn
     * @date 2020-11-03
     */
    cancelUpload() {
      this.$emit('update:dialogVisible', false);
    },
    async getFileAttr() {
      const [err, res] = await getFileOrDirAttr(this.requestParam);
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '系统错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.fileInfo = res.data;
    },
  },
};
</script>

<style lang="scss" scoped>
.fileDetailDialog {
  .infoList {
    .infoBox {
      display: flex;
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0;
      }
      .title {
        display: inline-block;
        width: 56px;
        margin-right: 30px;
        color: $color-b2;
        text-align: right;
      }
      .name {
        display: inline-block;
        width: 100%;
        word-break: break-all;
      }
    }
  }
}
</style>
