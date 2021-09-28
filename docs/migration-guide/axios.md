## axios 使用示例

### 新增 api

- 根据接口所属模块(组件、工具类、页面、公用)添加接口
- 通过 esm 按需引入 `import { login } from '@/api/modules/views/user';`
- 使用

```js
// tips: 配合 async await 解决回调地狱的问题
async function handleLogin() {
  const [err, res] = await login(data);
  if (err) {
    // 接口请求错误处理
    postMessage({
      type: 'error',
      message: err.msg,
    });
    // tips: 错误处理完后直接退出
    return;
  }
  // 接口请求成功处理
  const { _TOKEN, _LOGIN_SIGN } = res.data;
}
```

- [阮一峰-async](https://es6.ruanyifeng.com/#docs/async)
  > async 函数返回的 Promise 对象，必须等到内部所有 await 命令后面的 Promise 对象执行完，才会发生状态改变，除非遇到 return 语句或者抛出错误。也就是说，只有 async 函数内部的异步操作执行完，才会执行 then 方法指定的回调函数。
