## 项目目录组成

```js
tsportal_vuecli
├── config // 配置文件
├── docs // 项目说明文档
├── public // 存放 不需要 webpack打包的静态资源
├── scripts // 脚本集
|  ├── copy-to-dir.js
|  ├── element-ui // 自定义主题色配置
|  |  ├── README.md
|  |  ├── theme-build.js
|  |  ├── theme-watch.js
|  |  └── utils.js
|  └── vite-fix-file.js // vite@2兼容处理
├── src
|  ├── api // ajax管理中心
|  |  ├── index.js
|  |  └── modules
|  ├── assets // 存放 需要 webpack打包的静态资源
|  |  ├── font
|  |  └── image
|  ├── components
|  |  ├── base  // 业务组件
|  |  └── global // 基础组件
|  ├── config // 项目变量字典
|  |  ├── log-list.js
|  |  ├── manager-def.js
|  |  ├── ts-comm-def.js
|  |  └── version-def.js
|  ├── directives // 全局指令
|  ├── filters // 全局过滤器
|  ├── layout // 布局组件
|  ├── main.js
|  ├── plugins // 第三方插件配置
|  |  ├── element-ui
|  |  └── fai-component
|  ├── router // 前端路由
|  |  ├── index.js
|  |  └── navigationGuard.js // 路由拦截器
|  ├── store // 数据中心
|  |  ├── index.js
|  |  └── modules
|  ├── styles
|  |  ├── base.scss // 统一css标签配置(基本不变)
|  |  ├── element-theme // 自定义主题色生成的样式文件(基本不变)
|  |  ├── element-ui.scss // 覆盖element-ui样式
|  |  ├── element-variables.scss // element-ui主题色配置文件
|  |  ├── faicomponent.scss // 覆盖faicomponent样式
|  |  ├── mixins.scss // scss mixins声明
|  |  ├── normalize.scss // 统一css标签配置(基本不变)
|  |  ├── project-custom.scss // 项目样式工具类
|  |  ├── reset.scss // 统一css标签配置(基本不变)
|  |  ├── tanshu-style.scss // 项目原有的标签配置
|  |  ├── utils.scss // 公用scss工具类
|  |  ├── variables.scss // 项目scss变量
|  |  └── __element-variables.scss // 自定义主题色生成的样式文件(基本不变)
|  ├── utils // 项目工具方法
|  └── views // 项目页面
```
