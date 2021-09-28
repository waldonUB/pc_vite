<!--
 * @Description  : 侧边栏
 * @Author       : turbo
 * @Date         : 2021-02-19 18:10:24
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-20 17:53:40
-->

<template>
  <div class="sidebar-wrap">
    <fa-menu
      theme="mixed"
      :openKeys.sync="openKeys"
      :selectedKeys="selectedKeys"
      :openAnimation="false"
      @click="clickMenu"
    >
      <template v-for="item in routerList">
        <fa-sub-menu
          v-if="Array.isArray(item.children) && item.children.length"
          :key="item.url"
          triggerSubMenuAction="click"
          @titleClick="handleTitleClick"
        >
          <div slot="title">
            <global-ts-svg-icon
              class="sidebar__router-icon"
              :name="item.iconName"
              :width="18"
              :height="18"
            ></global-ts-svg-icon>
            <span>{{ item.name }}</span>
            <global-ts-svg-icon
              v-if="newTypeCal(item.url)"
              class="sidebar__new-icon"
              name="icon-zu29"
              :width="28"
              :height="28"
              color="#ff4d4d"
            ></global-ts-svg-icon>
          </div>
          <template v-for="subItem in item.children">
            <fa-sub-menu
              mode="inline"
              v-if="Array.isArray(subItem.children) && subItem.children.length > 0"
              :key="subItem.url"
              triggerSubMenuAction="click"
              @titleClick="handleTitleClick"
            >
              <div slot="title">
                {{ subItem.name }}
                <global-ts-svg-icon
                  v-if="newTypeCal(subItem.url)"
                  class="sidebar__new-icon"
                  name="icon-zu29"
                  :width="28"
                  :height="28"
                  color="#ff4d4d"
                ></global-ts-svg-icon>
              </div>
              <template v-for="lastItem in subItem.children">
                <fa-menu-item :key="lastItem.url">
                  {{ lastItem.name }}
                  <global-ts-svg-icon
                    v-if="newTypeCal(lastItem.url)"
                    class="sidebar__new-icon"
                    name="icon-zu29"
                    :width="28"
                    :height="28"
                    color="#ff4d4d"
                  ></global-ts-svg-icon>
                </fa-menu-item>
              </template>
            </fa-sub-menu>
            <fa-menu-item v-else :key="subItem.url">
              {{ subItem.name }}
              <global-ts-svg-icon
                v-if="newTypeCal(subItem.url)"
                class="sidebar__new-icon"
                name="icon-zu29"
                :width="28"
                :height="28"
                color="#ff4d4d"
              ></global-ts-svg-icon>
            </fa-menu-item>
          </template>
        </fa-sub-menu>
        <fa-menu-item v-else :key="item.url">
          <div>
            <global-ts-svg-icon
              class="sidebar__router-icon"
              :name="item.iconName"
              :width="18"
              :height="18"
            ></global-ts-svg-icon>
            <span>{{ item.name }}</span>
          </div>
        </fa-menu-item>
      </template>
    </fa-menu>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getServerTime as getServerTimeUtils } from '@/utils';

const rePathMap = {
  createForm: 'formManage',
  createPoster: 'posterManage',
  posterLogo: 'posterManage',
  orderCheckIn: 'orderCheck',
  orderCheckEdit: 'orderCheck',
};

export default {
  name: 'ts-sidebar',
  data() {
    return {
      openKeys: [], // 当前展开的 SubMenu 菜单项 key 数组
      selectedKeys: ['indexManage'], // 当前选中的菜单项 key 数组
      showPointIconList: [
        {
          name: 'functionSetting',
          isShowIcon: true,
          versionDate: '2020-12-23', // icon显示的版本，icon更新后需要改
        },
        {
          name: 'powerManage',
          isShowIcon: true,
          versionDate: '2021-02-24', // icon显示的版本，icon更新后需要改
        },
        {
          name: 'card',
          isShowIcon: true,
          versionDate: '2021-04-21', // icon显示的版本，icon更新后需要改
        },
        {
          name: 'clientOperate', // 客户运营
          isShowIcon: true,
          versionDate: '2021-05-26', // icon显示的版本，icon更新后需要改
        },
        {
          name: 'wxWorkMsgManager', // 企微存档
          isShowIcon: true,
          versionDate: '2021-06-03', // icon显示的版本，icon更新后需要改
        },
        {
          name: 'customPullGroup',
          isShowIcon: true,
          versionDate: '2021-06-09', // icon显示的版本，icon更新后需要改
        },
        {
          name: 'clientOperate',
          isShowIcon: true,
          versionDate: '2021-06-17', // icon显示的版本，icon更新后需要改
        },
        {
          name: 'customerTools',
          isShowIcon: true,
          versionDate: '2021-06-17', // icon显示的版本，icon更新后需要改
        },
        {
          name: 'groupOssTools',
          isShowIcon: true,
          versionDate: '2021-06-17', // icon显示的版本，icon更新后需要改
        },
        {
          name: 'sensitiveBlock',
          isShowIcon: true,
          versionDate: '2021-06-17', // icon显示的版本，icon更新后需要改
        },
        {
          name: 'groupBlackList',
          isShowIcon: true,
          versionDate: '2021-06-17', // icon显示的版本，icon更新后需要改
        },
        {
          name: 'wxDoubleAdd',
          isShowIcon: true,
          versionDate: '2021-06-17', // icon显示的版本，icon更新后需要改
        },
      ],
    };
  },
  computed: {
    ...mapState({
      routerList: state => state.globalData.routerList,
      unfoldRouterList: state => state.router.unfoldRouterList,
      openTime: state => state.user.info.openTime,
    }),
  },
  watch: {
    $route() {
      this.getActiveMenu();
    },
  },
  created() {
    this.initIconState();
  },
  mounted() {
    this.getActiveMenu();
  },
  methods: {
    /**
     * @description : 获取当前选中的菜单项
     * @author      : turbo
     * @Date        : 2021-03-29 14:09:36
     * @param        {*}
     * @return       {*}
     */
    getActiveMenu() {
      const routeName = this.$route.name,
        selectedKeys = rePathMap[routeName] || routeName,
        openKeys = [];
      let route = this.unfoldRouterList.filter(item => item.url === selectedKeys)[0];
      while (route?.parentName) {
        openKeys.unshift(route.parentName);
        route = this.unfoldRouterList.filter(item => item.url === route.parentName)[0];
      }
      this.openKeys = openKeys;
      this.selectedKeys = [selectedKeys];
    },
    /**
     * @description : 是否显示 “new” 的 icon
     * @author      : turbo
     * @Date        : 2021-03-30 10:15:46
     * @param        {String} url - 路由名
     * @return       {Boolean}
     */
    newTypeCal(url) {
      const routerInfo = this.showPointIconList.find(item => item.name === url);
      return routerInfo?.isShowIcon;
    },
    /**
     * @description : 设置 icon 状态
     * @author      : turbo
     * @Date        : 2021-03-30 10:16:10
     * @param        {String} url - 路由名
     * @return       {*}
     */
    setIconState(url) {
      const index = this.showPointIconList.findIndex(item => item.name === url);
      if (index !== -1) {
        this.$set(this.showPointIconList, index, {
          name: url,
          isShowIcon: false,
          versionDate: this.showPointIconList[index]?.versionDate,
        });
        localStorage.setItem('showPointIconList', JSON.stringify(this.showPointIconList));
      }
    },
    /**
     * @description : 初始化 icon 状态
     * @author      : turbo
     * @Date        : 2021-03-30 11:14:54
     * @param        {*}
     * @return       {*}
     */
    initIconState() {
      const showPointIconStr = localStorage.getItem('showPointIconList');
      if (showPointIconStr) {
        if (Array.isArray(JSON.parse(showPointIconStr))) {
          this.showPointIconList = this.showPointIconList.reduce((pre, cur) => {
            const routerItem = JSON.parse(showPointIconStr).find(item => item.name === cur.name);
            if (routerItem) {
              pre.push(routerItem);
            } else {
              pre.push(cur);
            }
            return pre;
          }, []);
        }
      }
      if (this.openTime) {
        const getServerTime = getServerTimeUtils(); // 服务器时间
        this.showPointIconList = this.showPointIconList.filter(item => {
          const verisonDate = new Date(item.versionDate).getTime();
          return (
            verisonDate >= new Date(this.openTime).getTime() && getServerTime - verisonDate <= 3600 * 1000 * 24 * 30
          ); // 是旧用户并且当前时间在上线时间的一个月内
        });
      }
      localStorage.setItem('showPointIconList', JSON.stringify(this.showPointIconList));
    },
    /**
     * @description : 选中菜单，用 click 事件而不用 select 的原因是，每次点击菜单都会触发，有刷新页面的作用
     * @author      : turbo
     * @Date        : 2020-09-02 16:07:57
     * @param        {Object} e - 选中的菜单对象
     * @return       {*}
     */
    clickMenu(e) {
      this.setIconState(e.key);
      this.changeRouter(e.key);
    },
    /**
     * @description : 点击父导航，默认选中第一个子菜单
     * @author      : turbo
     * @Date        : 2020-09-02 14:40:41
     * @param        {Object} e - 选中的父导航对象
     * @return       {*}
     */
    handleTitleClick(e) {
      const key = e.key,
        currentRoute = this.unfoldRouterList.filter(item => item.url === this.selectedKeys[0])[0];

      // 如果该二级菜单有子菜单被选中，则收起二级菜单，不再默认选中第一个子菜单
      // 如果上次已经选中了该二级菜单的某个子菜单，则展开之后显示上次默认的
      if (this.openKeys.includes(key) || currentRoute.parentName === key) return;
      this.setIconState(e.key);

      let route = this.unfoldRouterList.filter(item => item.url === key)[0];
      while (route?.children?.length > 0) {
        route = route.children[0];
      }
      this.changeRouter(route.url);
    },
    /**
     * @description : 跳转到指定 name 的路由
     * @author      : turbo
     * @Date        : 2021-03-29 14:15:29
     * @param        {String} name
     * @return       {*}
     */
    changeRouter(name) {
      if (this.$route.name === name) return this.$emit('reload');
      this.$router.push({ name });
    },
  },
};
</script>

<style lang="scss">
.sidebar-wrap {
  .fa-menu {
    width: 124px;
    background: #020c17;
  }
}

.sidebar__router-icon {
  position: relative;
  top: 2px;
  margin-right: 12px;
}

.sidebar__new-icon {
  position: absolute;
  top: -9px;
  right: 4px;
  z-index: 9;
  margin-right: 0;
}

.fa-menu-submenu .fa-menu-submenu-content .fa-menu-item {
  overflow: visible;
}

.fa-menu-submenu .fa-menu-submenu-content .fa-menu-item .sidebar__new-icon,
.fa-menu-submenu.fa-menu-submenu-inline .sidebar__new-icon {
  top: -15px;
}

.fa-menu-mixed.fa-menu-inline > .fa-menu-item:active,
.fa-menu-mixed.fa-menu-inline > .fa-menu-item-active,
.fa-menu-mixed.fa-menu-inline > .fa-menu-submenu-selected > .fa-menu-submenu-title,
.fa-menu-mixed.fa-menu-inline > .fa-menu-submenu-open > .fa-menu-submenu-title,
.fa-menu-mixed.fa-menu-inline > .fa-menu-submenu > .fa-menu-submenu-title:active,
.fa-menu-mixed.fa-menu-vertical > .fa-menu-item:active,
.fa-menu-mixed.fa-menu-vertical > .fa-menu-item-active,
.fa-menu-mixed.fa-menu-vertical > .fa-menu-submenu-selected > .fa-menu-submenu-title,
.fa-menu-mixed.fa-menu-vertical > .fa-menu-submenu-open > .fa-menu-submenu-title,
.fa-menu-mixed.fa-menu-vertical > .fa-menu-submenu > .fa-menu-submenu-title:active {
  color: $primary-color;
}

.fa-menu-mixed.fa-menu-inline > .fa-menu-item:hover,
.fa-menu-mixed.fa-menu-inline > .fa-menu-submenu > .fa-menu-submenu-title:hover,
.fa-menu-mixed.fa-menu-vertical > .fa-menu-item:hover,
.fa-menu-mixed.fa-menu-vertical > .fa-menu-submenu > .fa-menu-submenu-title:hover {
  color: #ffffff;
}

.fa-menu.fa-menu-mixed.fa-menu-inline > .fa-menu-item-selected,
.fa-menu.fa-menu-mixed.fa-menu-inline > .fa-menu-submenu-selected > .fa-menu-submenu-title,
.fa-menu.fa-menu-mixed.fa-menu-vertical > .fa-menu-item-selected,
.fa-menu.fa-menu-mixed.fa-menu-vertical > .fa-menu-submenu-selected > .fa-menu-submenu-title {
  color: $primary-color;
}

.fa-menu-mixed.fa-menu-inline > .fa-menu-item::after,
.fa-menu-mixed.fa-menu-inline > .fa-menu-submenu > .fa-menu-submenu-title::after,
.fa-menu-mixed.fa-menu-vertical > .fa-menu-item::after,
.fa-menu-mixed.fa-menu-vertical > .fa-menu-submenu > .fa-menu-submenu-title::after {
  border-right-color: $primary-color;
}

.fa-menu-mixed.fa-menu-inline > .fa-menu-submenu > .fa-menu-sub > .fa-menu-submenu > .fa-menu-submenu-title:hover,
.fa-menu-mixed.fa-menu-inline > .fa-menu-submenu > .fa-menu-sub > .fa-menu-submenu > .fa-menu-submenu-title:active,
.fa-menu-mixed.fa-menu-submenu-popup .fa-menu-vertical > .fa-menu-submenu > .fa-menu-submenu-title:hover,
.fa-menu-mixed.fa-menu-submenu-popup .fa-menu-vertical > .fa-menu-submenu > .fa-menu-submenu-title:active {
  color: $primary-color;
}

.fa-menu.fa-menu-mixed.fa-menu-inline > .fa-menu-submenu > .fa-menu-sub > .fa-menu-submenu .fa-menu-item-selected,
.fa-menu-mixed.fa-menu-submenu-popup .fa-menu-sub > .fa-menu-submenu .fa-menu-item-selected,
.fa-menu-mixed.fa-menu-submenu-popup .fa-menu-sub > .fa-menu-submenu .fa-menu-item-selected:hover,
.fa-menu-mixed.fa-menu-submenu-popup .fa-menu-sub > .fa-menu-submenu .fa-menu-item-selected:active {
  color: $primary-color;
  background: $primary-color-bg;
}

.fa-menu-mixed.fa-menu-inline > .fa-menu-submenu > .fa-menu-sub > .fa-menu-submenu .fa-menu-item:hover,
.fa-menu-mixed.fa-menu-inline > .fa-menu-submenu > .fa-menu-sub > .fa-menu-submenu .fa-menu-item:active,
.fa-menu-mixed.fa-menu-submenu-popup .fa-menu-sub > .fa-menu-submenu .fa-menu-item:hover,
.fa-menu-mixed.fa-menu-submenu-popup .fa-menu-sub > .fa-menu-submenu .fa-menu-item:active {
  color: $primary-color;
}

.fa-menu-mixed.fa-menu-submenu-popup
  .fa-menu-vertical
  > .fa-menu-submenu.fa-menu-submenu-open
  > .fa-menu-submenu-title:hover {
  color: #333333;
}

.fa-menu-mixed.fa-menu-inline > .fa-menu-submenu > .fa-menu-sub > .fa-menu-item:hover,
.fa-menu-mixed.fa-menu-inline > .fa-menu-submenu > .fa-menu-sub > .fa-menu-item:active,
.fa-menu-mixed.fa-menu-inline > .fa-menu-submenu > .fa-menu-sub > .fa-menu-item-active,
.fa-menu-mixed.fa-menu-submenu-popup .fa-menu-vertical > .fa-menu-item:hover,
.fa-menu-mixed.fa-menu-submenu-popup .fa-menu-vertical > .fa-menu-item:active,
.fa-menu-mixed.fa-menu-submenu-popup .fa-menu-vertical > .fa-menu-item-active {
  color: $primary-color;
}

.fa-menu.fa-menu-mixed.fa-menu-inline > .fa-menu-submenu > .fa-menu-sub > .fa-menu-item-selected,
.fa-menu-mixed.fa-menu-submenu-popup .fa-menu-vertical > .fa-menu-item-selected,
.fa-menu-mixed.fa-menu-submenu-popup .fa-menu-vertical > .fa-menu-item-selected:hover,
.fa-menu-mixed.fa-menu-submenu-popup .fa-menu-vertical > .fa-menu-item-selected:active {
  color: $primary-color;
  background: $primary-color-bg;
}

/* style: flx 新版本标识显示不全的问题 */
.sidebar-wrap .fa-menu-vertical .fa-menu-item,
.fa-menu-vertical-left .fa-menu-item,
.fa-menu-vertical-right .fa-menu-item,
.fa-menu-inline .fa-menu-item,
.fa-menu-vertical .fa-menu-submenu-title,
.fa-menu-vertical-left .fa-menu-submenu-title,
.fa-menu-vertical-right .fa-menu-submenu-title,
.fa-menu-inline .fa-menu-submenu-title {
  overflow: visible;
}

/* 隐藏二级导航的收起按钮 */
.fa-menu-mixed .fa-menu-expand-open-btn.is-show {
  display: none;
}

.fa-menu-submenu-popup {
  z-index: $zindex-float;
}
</style>
