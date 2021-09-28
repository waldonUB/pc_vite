<!--
 * @Author       : ADI
 * @Date         : 2021-06-23 16:16:37
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-25 16:07:10
-->
<template>
  <global-ts-card-box class="posterLogo">
    <template #card-box-head>
      <global-ts-tabguide @backToPrePage="backManage">
        <template v-slot:leftPart>海报模板</template>
        <template v-slot:rightPart>企业logo管理</template>
      </global-ts-tabguide>
    </template>
    <template #card-box-body>
      <div class="manager-wrapper">
        <div class="left-part">
          <div class="info-part">
            <div class="title require">企业logo：</div>
            <div class="operate-content">
              <div class="upload-box">
                <global-ts-fai-img-upload-style-box
                  :fileList="posterImgList"
                  @upload-click="
                    () => {
                      tanshuFileSelectUploadVisible = true;
                    }
                  "
                  @remove="handleImgRemove"
                >
                </global-ts-fai-img-upload-style-box>
                <global-ts-file-select-upload-dialog
                  :dialog-visible.sync="tanshuFileSelectUploadVisible"
                  :limit-num="1"
                  accept-type="img"
                  @success="uploadComplete"
                >
                </global-ts-file-select-upload-dialog>
              </div>
              <div class="operate-tip">最佳尺寸：240px*96px</div>
            </div>
          </div>
          <div class="info-part">
            <div class="title">是否启用：</div>
            <div class="operate-content">
              <div class="switch-box">
                <fa-switch v-model="isOpenedCal" :disabled="!logoUrl" defaultChecked @change="changeOpen" />
              </div>
              <div class="operate-tip">启用后将应用到所有海报</div>
            </div>
          </div>
        </div>
        <div class="right-part">
          <global-ts-phoneiframe :showFrame="false">
            <template #header>
              <span class="formTitle ellispsis">我的海报</span>
            </template>
            <template #content>
              <div>
                <div class="img-wrapper">
                  <div class="tip-box">
                    <div class="empty-tip" v-if="!logoUrl">企业logo预览</div>
                    <img class="logo-img" v-else :src="logoUrl" alt="" />
                  </div>
                  <img :src="posterLogoBgCal" class="poster-logo-bg" alt="" />
                </div>
              </div>
            </template>
          </global-ts-phoneiframe>
        </div>
      </div>
    </template>
  </global-ts-card-box>
</template>

<script>
import poster_logo_bgIMG from '@/assets/image/poster/poster_logo_bg.png';
import { post } from '@/utils';
import { Switch } from '@fk/faicomponent';

export default {
  name: 'poster-logo',
  components: {
    [Switch.name]: Switch,
  },
  props: {},
  data() {
    return {
      logoUrl: '',
      isOpened: false, // 是否启用
      tanshuFileSelectUploadVisible: false, // 上传图片
      posterImgList: [],
    };
  },
  computed: {
    posterLogoBgCal() {
      return poster_logo_bgIMG;
    },
    isOpenedCal: {
      set(newVal) {
        this.isOpened = newVal;
      },
      get() {
        return this.isOpened && !!this.logoUrl;
      },
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    /**
     * 返回父级页面
     * @author waldon
     * @date 2020-07-16
     */
    backManage() {
      this.$router.push({
        path: '/posterManage',
      });
    },
    /**
     * 是否启用
     * @author waldon
     * @date 2021/5/31
     */
    changeOpen(newVal) {
      this.isOpened = newVal;
      // todo waldon 是否启用的接口
      const params = {};
      post('', params).then(res => {
        if (res.data && res.data.success) {
          this.$utils.postMessage({
            type: 'success',
            message: this.isOpened ? '已启用' : '已关闭',
          });
        } else {
          this.$utils.postMessage({
            type: 'error',
            message: res.data.msg || '网络错误，请稍候重试',
          });
        }
      });
    },
    /**
     * 图片删除回调
     * @author waldon
     * @date 2021/5/31
     */
    handleImgRemove() {
      this.logoUrl = '';
      this.posterImgList = [];
    },
    /**
     * 上传成功回调
     * @author waldon
     * @date 2021/5/31
     * @param {Object} res) - 返回值
     */
    async uploadComplete(res) {
      const file = res[0];
      this.logoUrl = file.content;
      // todo waldon await 上传接口，判断之前列表是否为空，不为空就自动开启
      this.posterImgList = [
        {
          uid: -1,
          name: '海报logo',
          url: file.content,
        },
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
.posterLogo {
  .require {
    &::after {
      position: absolute;
      top: 50%;
      left: 0;
      font-size: 14px;
      color: $error-color;
      content: '*';
      transform: translate(-12px, -50%);
    }
  }
  .manager-wrapper {
    display: flex;
    flex-flow: row nowrap;
    .left-part {
      padding: 28px 46px;
      box-sizing: border-box;
      flex: 1 1 50%;
      .info-part {
        display: flex;
        margin-bottom: 33px;
        flex-flow: row nowrap;
        .title {
          position: relative;
          height: 21px;
          margin-right: 12px;
          font-size: 14px;
          line-height: 1.5;
          color: $color-53;
        }
        .operate-content {
          .upload-box {
            margin-bottom: 4px;
          }
          .operate-tip {
            font-size: 12px;
            line-height: 14px;
            color: $color-b2;
          }
          .switch-box {
            margin-bottom: 9px;
          }
        }
      }
    }
    .right-part {
      padding: 48px 0;
      box-sizing: border-box;
      flex: 1 1 50%;
      .img-wrapper {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 9;
        width: 210px;
        height: 374px;
        min-height: 374px;
        transform: translate(-50%, -50%);
        .tip-box {
          .empty-tip {
            position: absolute;
            top: 12px;
            left: 12px;
            font-size: 12px;
            line-height: 14px;
            color: $color-53;
          }
          .logo-img {
            position: absolute;
            top: 0.43vw;
            left: 0.43vw;
            height: auto !important;
            max-width: 3.2vw;
            max-height: 1.28vw;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
.posterLogo .fa-upload.fa-upload-select-picture-card {
  margin-bottom: 0;
}
</style>
