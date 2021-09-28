## 公用组件添加与使用

> 公用组件分为两种: 一种是全局公用的业务组件、一种是全局公用的基础组件

公用基础组件添加与使用:

- 添加
  - 在`src/componets/global/`目录下新建组件文件夹 ts-[xxx]
  - 新建 index.vue 文件，设置组件名
  ```js
  export default {
    name: 'ts-xxx',
  };
  ```
- 使用
  - 添加完成后可以直接到 template 中使用组件
  ```html
  <global-ts-xxx></global-ts-xxx>
  ```

公用业务组件添加与使用:

- 添加
  - 在`src/componets/base/`目录下新建组件文件夹 ts-[xxx]
  - 新建 index.vue 文件，设置组件名
  ```js
  export default {
    name: 'ts-xxx',
  };
  ```
- 使用
  - 引入组件 `import xxx from '@/components/base/ts-xxx/index.vue';`
  - 注册组件
  ```js
  export default {
    components: {
      xxx,
    },
  };
  ```
  - template 中使用组件
  ```html
  <ts-xxx></ts-xxx>
  ```
