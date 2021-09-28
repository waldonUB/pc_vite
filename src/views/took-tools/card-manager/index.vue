<!--
 * @Description  : 全员名片
 * @Author       : turbo
 * @Date         : 2021-03-18 16:31:00
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-08 10:18:54
-->

<template>
  <div class="editCardSetting">
    <div class="pro_listBox nowEditBox">
      <div class="header flexBox">
        <global-ts-slide class="functionSlide" :slidArray="slidArray" @changeStatus="sliderChange" />
        <global-ts-button v-if="isUpperAdm" class="editModel" type="primary" size="small" @click="editCard">
          名片模板编辑
        </global-ts-button>
      </div>
      <component :is="currentCompont"></component>
    </div>
  </div>
</template>

<script>
import allProduct from './components/all-product/index.vue';
import functionSetting from './components/function-setting/index.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'CardManager',
  components: {
    allProduct,
    functionSetting,
  },
  data() {
    return {
      activeNum: 1,
      slidArray: [
        {
          key: '全员名片',
          value: 1,
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      isUpperAdm: 'user/isUpperAdm',
    }),
    currentCompont() {
      return this.activeNum == 1 ? 'allProduct' : 'functionSetting';
    },
  },
  created() {
    // 如果是超级管理员才显示
    if (this.isUpperAdm) {
      this.slidArray.push({
        key: '功能设置',
        value: 2,
      });
    }
  },
  methods: {
    sliderChange(e, value) {
      this.activeNum = value;
    },
    editCard() {
      this.$utils.logDog('cardManager_edit');
      window.open(`${this.$store.getters.tsportalUrl}/editCard.jsp?type=editModel`);
    },
  },
};
</script>

<style lang="scss" scoped>
.editCardSetting {
  .nowEditBox {
    padding: 0;
    .ts-slide-card {
      &::after {
        display: none;
      }
    }
  }
  .header {
    position: relative;
    height: 60px;
    margin-bottom: 20px;
    border-bottom: 1px solid $border-disabled-color;
    align-items: center;
    justify-content: space-between;
    ::v-deep .functionSlide {
      height: 60px;
      margin-left: 40px;
      line-height: 60px;
      & > span {
        height: 60px;
        margin-right: 40px;
        line-height: 60px;
      }
      .editCardSetting {
        .header {
          .bottomBorder {
            .slide-children {
              margin-right: 30px;
            }
          }
        }
      }
    }
    .editModel {
      margin-right: 10px;
    }
  }
}
</style>
