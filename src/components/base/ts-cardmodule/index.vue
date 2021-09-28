<!--
 * @Author       : ADI
 * @Date         : 2021-03-31 17:22:32
 * @LastEditors  : ADI
 * @LastEditTime : 2021-05-17 09:20:55
-->
<template>
  <div class="card_module">
    <div class="cardHeader" @click="emitEvent">
      <div class="leftPart">
        <div class="contentIcon" :class="foldStatus ? '' : 'unfold'">
          <global-ts-svg-icon class="icon tshu_arrow" name="icon-zhankai" />
        </div>
        <span>{{ cardtitle }}</span>
        <slot name="addLeftPart"></slot>
      </div>
      <div class="rightPart" @click.stop="clickBtn" v-if="showSwitch">
        <fa-switch class="switch_module" v-model="moduleStatus" :disabled="disabled"> </fa-switch>
      </div>
    </div>
    <transition name="slide-fade">
      <div class="cardContentInfo" v-show="foldStatus">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Switch } from '@fk/faicomponent';

export default {
  name: 'ts-cardmodule',
  components: {
    [Switch.name]: Switch,
  },
  props: {
    cardtitle: {
      type: String,
      default: '',
    },
    moduleShow: {
      type: String,
      default: 'open',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    editkey: {
      type: String,
      default: '',
    },
    modulekey: {
      require: true,
      type: String,
      default: '',
    },
    showSwitch: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapState({
      storyKey: state => {
        const userInfo = state.user.info;
        return `ts_cardModule_foldStatus_${userInfo?.acctInfo.aid}_${userInfo?.staffInfo.sid}`;
      },
    }),
  },
  model: {
    prop: 'moduleShow',
    event: 'change',
  },
  data() {
    return {
      foldStatus: false,
      moduleStatus: false,
    };
  },
  methods: {
    clickBtn() {},
    changeStatus(status) {
      this.foldStatus = status;
    },
    emitEvent() {
      this.changeStatus(!this.foldStatus);
      this.$emit('changefold', this.foldStatus);
    },
    getValueByString(value, isBoolean = true) {
      return isBoolean ? value === 'open' : value ? 'open' : 'close';
    },
  },
  mounted() {
    this.moduleStatus = this.getValueByString(this.moduleShow);
  },
  watch: {
    moduleStatus(value) {
      this.$emit('update:moduleShow', this.getValueByString(value, false));
    },
    moduleShow(value) {
      this.moduleStatus = this.getValueByString(value);
    },
  },
};
</script>

<style lang="scss" scoped>
.card_module {
  .cardHeader {
    position: relative;
    height: 54px;
    font-size: 14px;
    color: $color-00;
    cursor: pointer;
    border-bottom: 1px solid #eeeeee;
    .leftPart {
      position: relative;
      position: absolute;
      top: 50%;
      left: 58px;
      cursor: pointer;
      transform: translate(0, -50%);
    }
    .rightPart {
      position: absolute;
      top: 50%;
      right: 30px;
      width: 40px;
      height: 54px;
      cursor: default;
      transform: translate(0, -50%);
      .switch_module {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .contentIcon {
      position: absolute;
      top: 50%;
      left: -24px;
      transform: translate(0, -50%);
      transition: all 0.3s;
      &.unfold {
        transform: translate(0, -50%) rotate(-90deg);
      }
      .icon {
        margin: 0;
        font-size: 24px;
        color: $color-b2;
      }
    }
  }
  .cardContentInfo {
    padding-bottom: 30px;
    padding-left: 56px;
    border-bottom: 1px solid #eeeeee;
  }
}
</style>
