## package.json/scripts 说明

打包部署相关:

```json
"scripts": {
  // vue-cli
  "dev": "npm-run-all vite-fix:remove && vue-cli-service serve",
  "build": "npm-run-all vite-fix:remove && vue-cli-service build",
  "postbuild": "node scripts/copy-to-dir.js",
  "pre": "npm-run-all vite-fix:remove && vue-cli-service serve --mode pre-serve",
  "build:pre": "npm-run-all vite-fix:remove && vue-cli-service build --mode pre-build",
  "postbuild:pre": "node scripts/copy-to-dir.js",
  "svr": "npm-run-all vite-fix:remove && vue-cli-service serve --mode svr-serve",
  "build:svr": "npm-run-all vite-fix:remove && vue-cli-service build --mode svr-build",
  "postbuild:svr": "node scripts/copy-to-dir.js",
  "build:svr-gray": "npm-run-all vite-fix:remove && vue-cli-service build --mode svr-gray",
  "postbuild:svr-gray": "node scripts/copy-to-dir.js",
  // vite
  "vite": "npm-run-all vite-fix:add vite:start",
  "vite:start": "node ./bin/vite",
  "vite-fix:add": "node ./scripts/vite-fix-file.js add",
  "vite-fix:remove": "node ./scripts/vite-fix-file.js remove",
},
```

工具相关:

```json
"scripts": {
  // 项目自动格式化配置
  "lint": "vue-cli-service lint",
  "lint:stylelint": "stylelint --fix \"**/*.{vue,less,postcss,css,scss}\" --cache --cache-location node_modules/.cache/stylelint/",
  "lint:lint-staged": "lint-staged -c ./.husky/lintstagedrc.js",
  // element自定义主题配置
  "element-theme-build": "node scripts/element-ui/theme-build.js",
  "element-theme-watch": "node scripts/element-ui/theme-watch.js",
  // 删除文件相关
  "clean:lib": "rimraf node_modules",
  "clean:cache": "rimraf node_modules/.cache/",
  "clean:vite": "rimraf node_modules/.vite/",
  // 自动化代码检查相关
  "bootstrap": "yarn install",
  "reinstall": "rimraf yarn.lock && rimraf package.lock.json && rimraf node_modules && yarn run bootstrap",
  "prepare": "husky install",
  "postinstall": "yarn run prepare",
}
```

## 项目启动

> vue/cli

```cmd
yarn dev
```

> vite

```cmd
yarn vite
```
