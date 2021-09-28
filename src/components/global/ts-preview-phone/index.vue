<!--
 * @Description  : 手机预览效果
 * @Author       : turbo
 * @Date         : 2021-07-30 16:40:52
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-30 17:37:00
-->

<template>
  <div class="ts-preview-phone">
    <div class="ts-preview-phone__head">
      <div class="name">邝经理</div>
      <div>@企业微信</div>
    </div>
    <div class="ts-preview-phone__content">
      <div class="time">12:00</div>
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TsPreviewPhone',
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.ts-preview-phone {
  width: 288px;
  height: 512px;
  margin-top: 60px;
  background: #ededed;
  border: 12px solid $color-ff;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 55, 130, 0.07);
  box-sizing: border-box;

  .ts-preview-phone__head {
    @include flex-column-center;

    height: 55px;
    font-size: 10px;
    line-height: 16px;
    border-bottom: 1px solid $color-da;

    .name {
      font-size: 16px;
      font-weight: bold;
      line-height: 22px;
    }
  }

  .ts-preview-phone__content {
    height: 428px;
    padding: 8px 12px;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;

    .time {
      margin-bottom: 17px;
      font-size: 12px;
      color: #8f9094;
      text-align: center;
    }

    .chat-item {
      @include flex-top-left;

      margin-bottom: 20px;
    }

    .chat-box {
      position: relative;

      &::before {
        position: absolute;
        top: 10px;
        left: -6px;
        width: 6px;
        height: 10px;
        content: url('@/assets/image/wxCorpMsgSend/arrow.png');
      }
    }

    .head-img {
      width: 32px;
      height: 32px;
      margin-right: 12px;
      border-radius: 2px;
    }

    .chat-text {
      max-width: 184px;
      padding: 8px;
      font-size: 12px;
      line-height: 16px;
      color: $color-00;
      word-wrap: break-word;
      background: $color-ff;
      border-radius: 4px;
      box-sizing: border-box;
    }

    .chat-img {
      width: 140px;
      background: $color-ff;
      border-radius: 4px;
    }

    .chat-article {
      width: 184px;
      padding: 8px;
      background: $color-ff;
      border-radius: 4px;
      box-sizing: border-box;

      .title {
        @include line-clamp(2);

        font-size: 14px;
        line-height: 19px;
        color: $color-53;
      }

      .cover-info {
        @include flex-top-between;
      }

      .cover-title {
        @include line-clamp(3);

        max-height: 50px;
        font-size: 12px;
        color: $color-89;
      }

      .cover-img {
        width: 56px;
        height: 56px;
        border-radius: 2px;
      }
    }
  }
}
</style>
