<!--
 * @Author       : ADI
 * @Date         : 2021-06-02 12:00:45
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-02 18:19:35
-->
<template>
  <global-ts-card-box class="addPyqMaterial">
    <template v-slot:card-box-head>
      <global-ts-tabguide @backToPrePage="backManage('noNeed')">
        <template v-slot:leftPart>朋友圈素材</template>
        <template v-slot:rightPart>{{ editId ? '编辑素材' : '添加素材' }}</template>
      </global-ts-tabguide>
    </template>
    <template v-slot:card-box-body>
      <div class="materialInfo">
        <div>
          <div class="contentItem">
            <div class="title">文本内容</div>
            <div>
              <fa-input
                class="description"
                placeholder="请输入朋友圈素材内容"
                type="textarea"
                :maxLength="500"
                :showCount="true"
                v-model="pyqInfo.description"
              >
              </fa-input>
            </div>
          </div>
          <div class="contentItem">
            <div class="title"><span class="redColor">*</span>图片素材</div>
            <div class="imgBoxList">
              <div v-for="(item, index) of fileSaveList" :key="index" class="imgBox">
                <img class="img" :src="item.url" @click="previewImg(item.url)" />
                <div class="gfwBox" v-if="[1, 2, 3].includes(item.gfwStatus)">
                  {{ item.gfwStatus == 1 ? '审查中' : '已封禁' }}
                  <global-ts-svg-icon class="icon helpIcon" name="icon-bianzu" @click="toHelpCenter" />
                </div>
                <div class="operation">
                  <i class="el-icon-delete" @click="removeMaterial(index)"></i>
                </div>
              </div>

              <el-upload
                v-if="fileSaveList.length < 9"
                name="filedata"
                class="materialUploadBox"
                action=""
                :accept="fileAcceptCal"
                :multiple="false"
                :show-file-list="false"
              >
                <div
                  class="fileUploadSelect_pictureCardWrapper"
                  slot="trigger"
                  @click.stop="
                    () => {
                      tanshuFileSelectUploadVisible = true;
                    }
                  "
                >
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                </div>
              </el-upload>

              <global-ts-file-select-upload-dialog
                :dialog-visible.sync="tanshuFileSelectUploadVisible"
                :limit-num="9 - fileSaveList.length"
                accept-type="img"
                @success="uploadSuccess"
              >
              </global-ts-file-select-upload-dialog>
            </div>
          </div>
          <div class="contentItem" v-if="isManage">
            <div class="title">保存到栏目</div>
            <div>
              <global-ts-select v-model="pyqInfo.typeGroup" :list="slideList" type="large" placeholder="请选择">
              </global-ts-select>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:card-box-bottom>
      <div class="bottomBtn">
        <global-ts-button class="pro_save_emp min_width_140" type="primary" size="medium" @click="saveMaterial">
          保存
        </global-ts-button>
      </div>
    </template>
  </global-ts-card-box>
</template>

<script>
import TsCommDef from '@/config/ts-comm-def';
import { getUrL } from '@/utils';
import { mapGetters, mapState } from 'vuex';
import { Upload } from 'element-ui';
import { getMaterialInfo, addMaterialInfo, setTsWxWorkMaterial } from '@/api/modules/views/customer-tools/pyq-material';

export default {
  name: 'addPyqMaterial',
  components: {
    [Upload.name]: Upload,
  },
  props: {
    editId: {
      // 任务id
      type: Number,
      defualt: 0,
    },
  },
  data() {
    return {
      pyqInfo: {
        description: '',
        typeGroup: 14,
        content: '',
      },
      slideList: [
        {
          label: '企业素材',
          value: 14,
        },
        {
          label: '我的素材',
          value: 15,
        },
      ],
      fileTypeTip: '上传失败：格式错误，请上传jpg、png格式的图片',
      fileAcceptCal: '.jpg,.jpeg,.png,.JPG,.JPEG,.PNG',
      uploadUrl: getUrL(
        `/ajax/upload_h.jsp?cmd=uploadTmpFile&folderType=${TsCommDef.FolderType.PERSON_SYS_FRIEND_CIRCLE}`,
      ),
      fileList: [],
      fileSaveList: [],
      delRegIdList: [],
      addRegList: [],
      tanshuFileSelectUploadVisible: false,
    };
  },
  computed: {
    ...mapGetters({
      isManage: 'user/isManage',
      isUpperAdm: 'user/isUpperAdm',
    }),
    ...mapState({
      helpDoc: state => state.user.info?.wxWorkConf?.compMaterialConf?.helpDoc,
    }),
  },
  watch: {},
  created() {
    this.$parent.editId && this.getDetail();
  },
  mounted() {},
  methods: {
    toHelpCenter() {
      window.open(this.helpDoc, '_blank');
    },
    /**
     * 返回我的任务首页
     * @author lymn
     * @date 2020-08-25
     */
    backManage(isUpdate = 'noNeed', typeGroup) {
      const params = {
        component: 'pyqMaterialList',
        editId: 0,
        isAdd: false,
        isUpdate: isUpdate,
        typeGroup: typeGroup,
      };
      this.$emit('changeComponent', params);
    },
    beforeUpload(file) {
      if (file.name && file.name.includes('.')) {
        const fileNames = file.name.split('.');
        const suffixName = fileNames[fileNames.length - 1];
        if (!this.fileAcceptCal.includes(suffixName)) {
          this.$utils.postMessage({
            type: 'error',
            message: this.fileTypeTip,
          });
          return false;
        }
        const limitSize = file.size / 1024 / 1024;
        if (limitSize > 10) {
          this.$utils.postMessage({
            type: 'error',
            message: '图片大小不能超过10M',
          });
          return false;
        }
      } else {
        this.$utils.postMessage({
          type: 'error',
          message: this.fileTypeTip,
        });
        return false;
      }
    },
    /**
     * 朋友圈上传素材时不需要再调用Ts_util.batchAdd方法，因为后端已经处理了
     * @date 2021-01-14
     */
    uploadSuccess(res = []) {
      res.forEach(file => {
        const flag = this.beforeUpload(file);
        if (flag === false) {
          return;
        }
        this.fileSaveList.push(
          Object.assign(file, {
            uid: file.resId,
            url: file.content,
            isNew: true,
            content: file.resId,
          }),
        );
        this.addRegList.push(file);
      });
    },
    removeMaterial(index) {
      const delFile = this.fileSaveList.splice(index, 1)[0];
      if (!delFile) return;
      !delFile.isNew && this.delRegIdList.push(delFile.uid);
    },
    async getDetail() {
      const [err, res] = await getMaterialInfo({
        id: this.$parent.editId,
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.pyqInfo.description = res.data.description;
      this.pyqInfo.typeGroup = res.data.typeGroup;
      this.fileSaveList = res.data.contentList.map(item => {
        return {
          content: item.regId,
          url: item.regUrl,
          del: item.del,
          gfwStatus: item.gfwStatus,
        };
      });
      this.fileList = res.data.contentList.map(item => {
        return {
          name: item.regId,
          url: item.regUrl,
        };
      });
    },
    async saveMaterial() {
      const nowRegIdList = [];
      for (const item of this.fileSaveList) {
        nowRegIdList.push(item.content);
      }
      this.pyqInfo.content = JSON.stringify(this.fileSaveList);
      if (!this.isManage) {
        //不是超管和部门管理员默认选我的素材
        this.pyqInfo.typeGroup = 15;
      }
      if (this.$parent.isAdd) {
        const [err, res] = await addMaterialInfo(this.pyqInfo);
        if (err) {
          this.$utils.postMessage({
            type: 'error',
            message: err.msg || '网络错误，请稍候重试',
          });
          return Promise.reject(err);
        }
        this.$utils.postMessage({
          type: 'success',
          message: res.msg || '修改成功',
        });
        this.backManage('all', this.pyqInfo.typeGroup);
      } else {
        const parmes = {
          id: this.$parent.editId,
          typeGroup: this.pyqInfo.typeGroup,
          description: this.pyqInfo.description,
          delRegIdList: JSON.stringify(this.delRegIdList),
          addRegList: JSON.stringify(this.addRegList),
          nowRegIdList: JSON.stringify(nowRegIdList),
        };
        const [err, res] = await setTsWxWorkMaterial(parmes);
        if (err) {
          this.$utils.postMessage({
            type: 'error',
            message: err.msg || '网络错误，请稍候重试',
          });
          return Promise.reject(err);
        }
        this.$utils.postMessage({
          type: 'success',
          message: res.msg || '修改成功',
        });
        this.backManage('part', this.pyqInfo.typeGroup);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.addPyqMaterial {
  .materialInfo {
    max-width: 870px;
    margin: 40px auto;
    .contentItem {
      display: flex;
      margin-bottom: 30px;
      &:nth-of-type(3) {
        .title {
          line-height: 40px;
        }
      }
    }
    .title {
      min-width: 70px;
      margin-right: 20px;
      font-size: 14px;
      color: $color-53;
      text-align: right;
    }
  }
  .redColor {
    color: $error-color;
  }
  .imgBoxList {
    display: flex;
    width: 460px;
    flex-wrap: wrap;
    .imgBox {
      position: relative;
      margin-right: 10px;
      &:nth-child(-n + 5) {
        margin-bottom: 10px;
      }
    }
    .img {
      display: block;
      width: 80px;
      height: 80px;
      border: 1px solid $border-color;
      border-radius: 4px;
      box-sizing: border-box;
    }
    .operation {
      position: absolute;
      top: 0;
      left: 0;
      width: 80px;
      height: 80px;
      font-size: 24px;
      line-height: 82px;
      color: #ffffff;
      text-align: center;
      background-color: rgba(0, 0, 0, 0.5);
      opacity: 0;
      &:hover {
        opacity: 1;
      }
    }
  }
  .materialUploadBox {
    position: relative;
  }
  .gfwBox {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 80px;
    height: 34px;
    margin: auto;
    font-size: 12px;
    line-height: 34px;
    color: $error-color;
    text-align: center;
    background: #fef0f0;
    .helpIcon {
      &.icon {
        width: 12px;
        height: 12px;
        margin: 0 2px 0 0;
        color: $error-color;
      }
    }
  }
  .avatar-uploader-icon {
    width: 80px;
    height: 80px;
    font-size: 28px;
    line-height: 80px;
    color: #8c939d;
    text-align: center;
  }
}
.addPyqMaterial .tshu_select .tshu_select_input,
.addPyqMaterial .tshu_select .tshu_select_option {
  width: 440px;
}
</style>

<style lang="scss">
.addPyqMaterial .materialInfo .description > textarea {
  width: 440px;
  height: 210px;
  font-size: 14px;
  background: #ffffff;
  border: 1px solid #dadada;
  box-sizing: border-box;
}
.addPyqMaterial .materialUploadBox .el-upload {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  background: #f7f7f7;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
}
.addPyqMaterial .materialUploadBox .el-upload:hover {
  border: 1px dashed #247af3;
}
.addPyqMaterial .disabled .el-upload--picture-card {
  display: none;
}
</style>
