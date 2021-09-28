## Ts_utils 迁移与使用

> Ts_utils 改为通过按需引入的方式; 移除 jq 写法; 按模块迁移。

- 使用
- old: `Ts_utils.cookie, Ts_utils.logDog, Ts_utils.postMessage`
- new: `import { cookie, logDog, postMessage } from '@/utils';`

### tips:

工具方法已全部按模块迁移完成。 `isPlainObject` 等`lodash`方法通过 `import { isPlainObject } from 'lodash';`引入使用，避免重复打包。

jsx 组件: `Ts_util.loading / Ts_util.getGuide / Ts_util.getLoginCard / Ts_util.getOpenPoup / Ts_util.getPoup / Ts_util.newVersionMinAppPopup / Ts_util.versionChangePopup`等 vue jsx 组件迁移到 `@/utils/jsx-components/`目录下。
