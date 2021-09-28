# Element UI 自定义主题生成脚本

## Install

```sh
yarn add element-theme --save
yarn add element-theme-chalk --dev
```

> tips: glup 脚本依赖低版本 node，建议版本切换为 10.18.0

## 生成初始化 scss 变量（项目中已生成可以跳过这步）

```node
node_modules/.bin/et -i ./src/styles/element-variables.scss
```

## 生成自定义主题

```sh
# 编译
yarn run element-theme-build
# 实时编译
yarn run element-theme-watch
```

## USE

修改 `babel.config.js`

```javascript
// config plugins Array
plugins: [
  [
    'component',
    {
      libraryName: 'element-ui',
      styleLibraryName: '~src/styles/element-theme', // 修改为生成的自定义目录
    },
    'element-ui',
  ],
];
```

## END
