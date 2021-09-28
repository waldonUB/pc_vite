/*
 * @Description  : 发布/订阅模式
 * @Author       : turbo
 * @Date         : 2021-06-09 16:51:13
 * @LastEditors  : turbo
 * @LastEditTime : 2021-06-21 09:33:45
 */

const rtypenamespace = /^([^.]*|)(?:\.(.+)|)$/;

class PubSub {
  constructor() {
    this.events = new Map();
  }
  each(type, namespace, callback, mustNamespace) {
    if (this.events.has(type) && (!mustNamespace || namespace.length != 0)) {
      const handlers = this.events.get(type);
      for (let i = 0; i < handlers.length; i++) {
        const handler = handlers[i];
        if (namespace.length == 0 || handler.namespace == namespace) {
          if (callback(handler) === false) {
            handlers.splice(i, 1);
            i--;
          }
        }
      }
      if (handlers.length == 0) {
        this.events.delete(type);
      }
    }
    return this;
  }
  parseType(typeName, callback, mustNamespace) {
    const [type, namespace = ''] = rtypenamespace.exec(typeName) || [typeName];
    callback && this.each(type, namespace, callback, mustNamespace);
    return { type, namespace };
  }
  on(typeName, listener, reset, isOne) {
    const { type, namespace } = this.parseType(typeName);
    return this._on(type, namespace, listener, reset, isOne);
  }
  _on(type, namespace, listener, reset, isOne) {
    if (reset) {
      this._off(type, namespace);
    }
    let handlers = this.events.get(type);
    if (!handlers) {
      this.events.set(type, (handlers = []));
    }
    handlers.push({ isOne, listener, namespace });
    return this;
  }
  off(typeName, listener) {
    const { type, namespace } = this.parseType(typeName);
    return this._off(type, namespace, listener);
  }
  _off(type, namespace, listener) {
    if (!namespace && !listener) {
      this.events.delete(type);
    } else {
      this.each(type, namespace, handler => {
        if (!listener || handler.listener === listener) {
          return false;
        }
      });
    }
    return this;
  }
  emit(typeName, ...args) {
    this.parseType(typeName, handler => {
      handler.listener(...args);
      if (handler.isOne) {
        return false;
      }
    });
    return this;
  }
  one(...arg) {
    arg[3] = true;
    return this.on(...arg);
  }
}

export default {
  install(Vue) {
    Vue.prototype.$pubsub = new PubSub();
  },
};
