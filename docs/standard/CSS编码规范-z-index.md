<!--
 * @Author: ADI
 * @Date: 2021-03-12 15:38:20
 * @LastEditors: ADI
 * @LastEditTime: 2021-03-12 15:39:28
-->
**# CSS 编码规范 - z-index**

\```

普通元素/小交互组件 : 0 ~ 100

float/吸顶/吸底 : 101 ~ 200

交互元素/大交互组件: 201 ~ 300

弹窗 : 1001 ~ 2000

loading/分享蒙层: 2001 ~ 3000

其它/AD : 3001 ~ 9999

\```

\> 在可控环境下，期望显示在最上层的元素，z-index 指定为 9999。不建议取值为 2147483647。以便于自身产品线被其他产品线引用时，当遇到层级覆盖冲突的情况，留出向上调整的空间。

\```

 <!-- element-ui -->

$--index-normal: 1 !default;

$--index-top: 1000 !default;

$--index-popper: 2000 !default;

\```

\```

 <!-- antd -->

@zindex-badge: 1;

@zindex-table-fixed: 1;

@zindex-affix: 10;

@zindex-back-top: 10;

@zindex-picker-panel: 10;

@zindex-popup-close: 10;

@zindex-modal: 1000;

@zindex-modal-mask: 1000;

@zindex-message: 1010;

@zindex-notification: 1010;

@zindex-navbar: 1000;

@zindex-dropdown: 1000;

@zindex-preview-mask: 1000;

@zindex-popover: 1030;

@zindex-navbar-fixed: 1030;

@zindex-modal-background: 1040;

@zindex-dropdown: 1050;

@zindex-picker: 1050;

@zindex-modal: 1050;

@zindex-tooltip: 1060;

@zindex-popover: 1060;

@zindex-tooltip: 1070;

@zindex-image: 1080;

\```

\```

 <!-- bootstrap -->

// Warning: Avoid customizing these values. They're used for a bird's eye view

// of components dependent on the z-axis and are designed to all work together.

@zindex-navbar: 1000;

@zindex-dropdown: 1000;

@zindex-popover: 1060;

@zindex-tooltip: 1070;

@zindex-navbar-fixed: 1030;

@zindex-modal-background: 1040;

@zindex-modal: 1050;

\```

[](https://pic4.zhimg.com/c4ab4bb3c2e53ebce4211353805a8be4_r.jpg?source=1940ef5c)

\> 在页面里，z-index 越少越好管理。
