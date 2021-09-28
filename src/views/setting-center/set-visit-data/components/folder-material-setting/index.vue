<!-- 文件夹设置
 * @Author       : ADI
 * @Date         : 2021-07-13 11:00:16
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-13 14:20:52
-->
<template>
  <div class="folderMaterialSetting">
    <div class="spaceSettingBox flex flex-vc cardInWhite">
      <img :src="spaceIconIMG" class="spaceImg" />
      <div class="spaceInfo">
        <div class="title">容量设置</div>
        <div class="info">限制每个成员个人文件夹的容量上限，达到上限后，将无法上传文件</div>
      </div>
      <div class="spaceBtn" @click="showSpaceSetDialog">设置</div>
    </div>
    <spaceSetDialog :dialogVisible.sync="dialogVisible"></spaceSetDialog>
  </div>
</template>

<script>
import spaceIconIMG from '@/assets/image/material/spaceIcon.png';
import spaceSetDialog from '../space-set-dialog/index.vue';

export default {
  name: 'folder-material-setting',
  components: {
    spaceSetDialog,
  },
  props: {},
  data() {
    return {
      dialogVisible: false,
    };
  },
  computed: {
    spaceIconIMG() {
      return spaceIconIMG;
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    /**
     * 显示空间设置弹窗
     * @author lymn
     * @date 2020-11-09
     * @param {Boolean} param
     * @return {Boolean} return
     */
    showSpaceSetDialog() {
      this.dialogVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.folderMaterialSetting {
  .spaceSettingBox {
    width: 537px;
    height: 120px;
    padding: 20px;
    box-sizing: border-box;
    .spaceImg {
      width: 80px;
      height: 80px;
      margin-right: 20px;
    }
    .spaceInfo {
      width: 338px;
      margin-top: 17px;
      margin-right: 29px;
      .title {
        margin-bottom: 12px;
        font-size: 16px;
      }
      .info {
        font-size: 14px;
        color: $color-b2;
      }
    }
    .spaceBtn {
      font-size: 14px;
      color: #247af3;
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
</style>
