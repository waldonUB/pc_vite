<!-- 文件夹设置-空间设置弹窗
 * @Author       : ADI
 * @Date         : 2021-07-13 14:17:06
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-13 14:17:07
-->
<template>
  <global-ts-dialog
    class="spaceSetDialog"
    dialog-title="空间设置"
    :dialog-visible.sync="dialogVisible"
    @cancel="cancelDialog"
    @sure="save"
  >
    <div class="setBox">
      <div class="title">每个成员个人文件夹容量上限</div>
      <div class="spaceSet flex flex-vc">
        <div class="optionBox" @click="changeDef(false)">
          <input type="radio" id="unlimit" :value="false" v-model="requestParam.openMaterialCapLimit" />
          <label for="unlimit">无限制</label>
        </div>
        <div class="optionBox flex flex-vc" @click="changeDef(true)">
          <input type="radio" id="custom" :value="true" v-model="requestParam.openMaterialCapLimit" />
          <label for="custom">自定义</label>
          <span v-if="requestParam.openMaterialCapLimit">
            <global-ts-input limitInput="int" placeholder="" v-model="requestParam.materialCapLimit"></global-ts-input>M
          </span>
        </div>
      </div>
    </div>
  </global-ts-dialog>
</template>

<script>
import { setTsProfConf, getMaterialResInfo } from '@/api/modules/views/setting-center/set-visit-data';

export default {
  name: 'space-set-dialog',
  components: {},
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      sizeInfo: {
        staffUsedCaps: '', // 个人文件已经使用的容量
        openMatCapLimit: false, // 是否限制个人容量
        capacityName: '', // 企业中心已经使用的容量
        maxCapacityName: '', // 总容量
        limit: '', // 自定义个人容量
      },
      requestParam: {
        // 请求数据
        openMaterialCapLimit: false, // 是否自定义限制 true:自定义 false:无限制
        materialCapLimit: '', // 自定义个人容量
      },
    };
  },
  computed: {
    // opacity() {
    //     return `总容量：`
    // }
  },
  watch: {
    dialogVisible(newVal) {
      if (newVal) {
        this.getSpaceInfo();
      }
    },
  },
  created() {
    this.getSpaceInfo();
  },
  mounted() {},
  methods: {
    cancelDialog() {
      this.$emit('update:dialogVisible', false);
    },
    /**
     * 保存空间设置
     * @author lymn
     * @date 2020-11-09
     * @param {Boolean} param
     * @return {Boolean} return
     */
    async save() {
      const { openMaterialCapLimit, materialCapLimit } = this.requestParam;
      const [err, res] = await setTsProfConf({
        openMaterialCapLimit: openMaterialCapLimit ? 1 : 0,
        materialCapLimit: materialCapLimit,
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '系统错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.getSpaceInfo(); // 刷新数据
      this.$emit('update:dialogVisible', false);
      this.$utils.postMessage({
        type: 'success',
        message: '设置成功！',
      });
    },
    /**
     * 获取空间容量信息
     * @author lymn
     * @date 2020-11-09
     * @param {Boolean} param
     * @return {Boolean} return
     */
    async getSpaceInfo() {
      const params = {
        isCorp: true, // 是否为企业文件夹
        setCap: true, // 是否为设置容量页面
      };
      const [err, res] = await getMaterialResInfo(params);
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '系统错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.sizeInfo = res.data.resSizeInfo;
      this.requestParam.openMaterialCapLimit = this.sizeInfo.openMatCapLimit;
      this.requestParam.materialCapLimit = this.sizeInfo.limit;
    },
    /**
     * 切换限制
     * @author lymn
     * @date 2020-11-09
     * @param {Boolean} isDef 是否自定义
     */
    changeDef(isDef) {
      this.requestParam.openMaterialCapLimit = isDef;
    },
  },
};
</script>

<style lang="scss" scoped>
.spaceSetDialog {
  .setBox {
    .title {
      margin-bottom: 10px;
      font-size: 14px;
      color: $color-53;
    }
    .spaceSet {
      height: 40px;
      .optionBox {
        margin-right: 24px;
        label {
          margin-right: 0;
        }
        .ts-input {
          display: inline-block;
          width: 83px;
          margin: 0 8px;
        }
      }
    }
  }
}
</style>
