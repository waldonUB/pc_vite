<!--
 * @Author       : ADI
 * @Date         : 2021-06-21 13:52:40
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-24 11:27:39
-->
<template>
  <div class="posterItem">
    <div class="posterImgWrap">
      <img class="posterImg cardInWhite" :src="item.isGfwCloseName ? banIMG : item.src || item.url" alt="海报图片" />
      <div class="posterMask">
        <div class="posterOpt">
          <svg class="icon" v-if="!item.isGfwCloseName" aria-hidden="true" @click="downloadPoster(item)">
            <use xlink:href="#icon-xiazai"></use>
          </svg>
          <svg
            v-if="(type == 2 && isManage) || type == 3"
            class="icon"
            aria-hidden="true"
            @click="deletePoster(item.id)"
          >
            <use xlink:href="#icon-icon-10"></use>
          </svg>
        </div>
      </div>
      <div class="posterTip" v-if="item.isGfwCloseName">
        <span class="circle"></span>
        <span>审查关闭</span>
        <global-ts-tool-tips class="item tanshu_linkColor" offset="10" effect="dark" content="" placement="top-start">
          <div slot="content">
            您的海报已被关闭，请删除后再提交申诉。<br />
            原因：{{ item.closeReason }}
          </div>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-bianzu"></use>
          </svg>
        </global-ts-tool-tips>
      </div>
    </div>
    <div class="posterTitle tanshu-ellipsis">{{ item.title || item.name }}</div>
    <div class="posterInfo" v-if="type == 1">
      分享<span class="tanshu_linkColor">{{ item.useNum }}</span>
    </div>
    <div class="posterInfo" v-if="type == 2">
      创建 <span class="tanshu_linkColor">{{ item.createNum }}</span>
    </div>
    <div class="posterInfo" v-if="[1, 2].indexOf(type) != -1">
      获客 <span class="tanshu_linkColor">{{ item.addNum || item.newViewersName }}</span>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { createPosterFromTemp, createKtPoster, delPoster } from '@/api/modules/views/customer-tools/poster-manage';
import { confirm } from '@/utils';
import banIMG from '@/assets/image/createPoster/ban.png';

export default {
  name: 'poster-item',
  components: {},
  props: {
    item: {
      // 海报数据
      type: Object,
      default: () => {},
    },
    type: {
      // 所属一级分类
      type: Number,
      default: 1, // 1：热门海报 2：企业海报 3：我的海报
    },
  },
  data() {
    return {
      isShowOpt: false,
    };
  },
  computed: {
    ...mapGetters({
      isManage: 'user/isManage',
    }),
    banIMG() {
      return banIMG;
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    /**
     * 下载海报
     * @author lymn
     * @date 2020-07-15
     * @param {Object} item 海报对象
     */
    async downloadPoster(item) {
      if (this.type == 2) {
        // 企业海报
        const [err, res] = await createPosterFromTemp({ templateId: item.id });
        if (err) {
          return Promise.reject(err);
        }
        const tmpUrl = res.data.url;
        if (tmpUrl) window.open(tmpUrl);
      } else if (this.type == 1) {
        // 热门海报
        const param = {
          id: item.id,
          identifier: item.identifier,
          title: item.title,
        };
        const [err, res] = await createKtPoster(param);
        if (err) {
          return Promise.reject(err);
        }
        const tmpUrl = res.data.posterUrl;
        if (tmpUrl) window.open(tmpUrl);
      } else {
        // 我的海报
        window.open(item.pcDownloadPath);
      }
    },
    /**
     * 删除海报
     * @author lymn
     * @date 2020-07-15
     * @param {Number} id 海报id
     */
    deletePoster(id) {
      confirm('是否删除该海报？删除后无法撤回', '删除确认').then(async () => {
        const param = {
          id,
          isTemp: this.type == 2 ? true : false, // 只有删除企业海报才需要传true
        };
        const [err, res] = await delPoster(param);
        if (err) {
          return Promise.reject(err);
        }
        this.$utils.postMessage({
          type: 'success',
          message: res.msg,
        });

        this.$emit('reloadDataList');
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.posterItem {
  display: inline-block;
  width: 136px;
  margin: 0 20px 30px 0;
  text-align: center;
  .posterImgWrap {
    position: relative;
    width: 136px;
    height: 240px;
  }
  .posterTip {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 34px;
    font-size: 14px;
    line-height: 34px;
    color: $error-color;
    background: #fef0f0;
    .circle {
      display: inline-block;
      width: 5px;
      height: 5px;
      vertical-align: middle;
      background: $error-color;
      border-radius: 50%;
    }
  }
  .posterImg {
    display: inline-block;
    width: 100%;
    height: 100%;
  }
  .posterTitle {
    display: inline-block;
    width: 100%;
    height: 14px;
    margin-top: 10px;
    font-size: 14px;
    line-height: 14px;
  }
  .posterInfo {
    margin-top: 10px;
    color: $color-b2;
  }
  .posterMask {
    position: absolute;
    top: 0;
    left: 0;
    display: none;
    width: 100%;
    height: 100%;
    line-height: 256px;
    background: rgba(0, 0, 0, 0.6);
    .posterOpt {
      display: inline-block;
      .icon {
        font-size: 20px;
        color: #ffffff;
        cursor: pointer;
        &:first-child {
          margin-right: 10px;
        }
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
}
.posterImgWrap {
  &:hover {
    .posterMask {
      display: block;
    }
  }
}
</style>
