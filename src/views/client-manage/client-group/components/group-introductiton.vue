<!--
 * @Description  : 客户群介绍页面
 * @Author       : turbo
 * @Date         : 2021-07-20 15:11:31
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-20 16:11:24
-->

<template>
  <div v-if="isShow" class="group-introductiton">
    <div class="group-introductiton__head">
      <div class="group-img"></div>
      <div class="group-desc">
        <div class="first-line">企业微信客户群</div>
        <div class="second-line">智能化社群管理，构建私域流量池</div>
      </div>
      <global-ts-tool-tips
        :disabled="isFinishWxWork"
        class="item"
        offset="10"
        effect="dark"
        content="接入企业微信后免费试用"
        placement="top"
      >
        <global-ts-button type="primary" size="small" @click="handleClick">
          {{ isFinishWxWork ? '立即使用' : '接入企微' }}
        </global-ts-button>
      </global-ts-tool-tips>
    </div>
    <div class="group-introductiton__content">
      <div class="group-introductiton__content-title">
        <span class="icon left-icon"></span>
        <span>为什么要用企业微信做社群运营</span>
        <span class="icon right-icon"></span>
      </div>
      <el-table min-width="1010px" border cell-class-name="cellStyle" :data="introductList">
        <el-table-column label="功能" prop="ability" class-name="introduction-column-comm"></el-table-column>
        <el-table-column label="微信" prop="wx" class-name="introduction-column-comm column-wx"></el-table-column>
        <el-table-column label="企业微信" prop="companyWx" class-name="introduction-column-comm"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

// utils
import { confirm, gotoWxCorpSet } from '@/utils';

export default {
  name: 'GroupIntroductiton',
  props: {
    isShow: {
      // 是否显示介绍页面, 没有群数据、没有接入企微时显示
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      introductList: [
        {
          ability: '监控群聊天记录',
          wx: '不支持',
          companyWx: '企业管理员可监控所有客户群聊天记录',
        },
        {
          ability: '防骚扰',
          wx: '不支持',
          companyWx: '发广告、刷屏的群用户将被自动移出群聊，并设为禁止入群',
        },
        {
          ability: '进群欢迎语',
          wx: '不支持',
          companyWx: '客户进群后，群主自动发送文字/图片/链接/小程序',
        },
        {
          ability: '员工离职后群归属',
          wx: '员工离职即群资源被带走',
          companyWx: '支持将离职员工的客户群分配给其他销售员继续运营跟进',
        },
        {
          ability: '快捷回复',
          wx: '不支持',
          companyWx: '支持将常用话术一键发送到群内',
        },
        {
          ability: '群发消息',
          wx: '只能由销售自己操作',
          companyWx: '支持企业管理员针对指定客户群进行群发消息',
        },
        {
          ability: '客户群信息一览',
          wx: '只查看到客户昵称和头像',
          companyWx: '支持查看群成员详细信息，统计群成员变动信息',
        },
        {
          ability: '带企业标识',
          wx: '不支持',
          companyWx: '群主可向客户展示职业头像、实名认证和企业名称，对外形象更专业，快速赢取客户信任',
        },
      ],
    };
  },
  computed: {
    ...mapState({
      isFinishWxWork: state => state.globalData.wxWorkConf?.wxWorkSysConf?.available,
    }),
    ...mapGetters({
      isUpperAdm: 'user/isUpperAdm',
    }),
  },
  methods: {
    handleClick() {
      if (this.isFinishWxWork) {
        this.$emit('update:isShow', false);
      } else {
        if (!this.isUpperAdm) {
          // 如果不是超级管理员
          return confirm({
            msg: '暂无权限，请联系超级管理员处理',
          });
        }
        gotoWxCorpSet();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.group-introductiton {
  background-color: $color-ff;
  border-radius: 4px;

  .group-introductiton__head {
    @include flex-left;

    padding: 20px 20px 20px 24px;
    border-bottom: 1px solid $color-ee;
  }

  .group-img {
    width: 140px;
    height: 140px;
    background-image: url('~@/assets/image/groupList/introductIcon.png');
  }

  .group-desc {
    flex: 1;
    margin-left: 16px;

    .first-line {
      margin-bottom: 20px;
      font-size: 16px;
      font-weight: bold;
      line-height: 21px;
      color: $color-00;
    }

    .second-line {
      font-size: 14px;
      line-height: 19px;
      color: $color-53;
    }
  }

  .group-introductiton__content {
    padding: 24px 20px 20px;
  }

  .group-introductiton__content-title {
    @include flex-center;

    margin-bottom: 24px;
    // font-family: MicrosoftYaHei-Bold;
    font-size: 20px;
    font-weight: bold;
    line-height: 26px;
    color: $primary-color;

    .icon {
      width: 20px;
      height: 20px;
      margin: 0 8px;
    }

    .left-icon {
      background-image: url('~@/assets/image/groupList/introduct-left.png');
    }

    .right-icon {
      background-image: url('~@/assets/image/groupList/introduct-right.png');
    }
  }

  ::v-deep {
    .el-table__body {
      .introduction-column-comm {
        color: $color-53;

        &.column-wx {
          color: $color-b2;
        }
      }
    }
  }
}
</style>
