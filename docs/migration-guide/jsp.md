## jsp 变量迁移与使用

jsp 变量通过伟炽哥的接口以异步的形式返回到客户端的 vuex 中。

- 使用
  - \$store
    - `import store from '@/store';`
    ```js
    mounted() {
      console.log(store.state.user.info.isOem); // use
      // or
      console.log(this.$store.state.user.info.isOem); // use
    }
    ```
  - mapState
    - `import { mapState } from 'vuex';`
    ```js
    computed: {
      ...mapState({
        isOem: state => state.user.info.isOem,
        versionInfo: state => state.user.info.versionInfo,
        userInfo: state => state.user.info,
        addressUrl: state => state.globalData.addressUrl,
      }),
    },
    mounted() {
      console.log(this.isOem); // use
    }
    ```
