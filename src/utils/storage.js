/*
 * @Author: ADI
 * @Date: 2021-03-23 09:27:17
 * @LastEditors: ADI
 * @LastEditTime: 2021-03-23 09:33:52
 */

// to use:
// const storage1 = new Storage(24*60*60*1000);
// storage1.set('name', 'nan');
// storage1.set('age', 18, 60*1000);
// const storage2 = new Storage();
// storage2.set('age', 18, 60*1000);

export class Storage {
  constructor(express) {
    this.express = express;
  }
  set(key, value, express) {
    const obj = {
      data: value,
      cTime: Date.now(),
      express: express || this.express,
    };
    localStorage.setItem(key, JSON.stringify(obj));
  }
  get(key) {
    let item = localStorage.getItem(key);
    if (!item) {
      return null;
    }
    item = JSON.parse(item);
    const nowTime = Date.now();
    if (item.express && item.express < nowTime - item.cTime) {
      this.remove(key);
      return null;
    } else {
      return item.data;
    }
  }
  remove(key) {
    localStorage.removeItem(key);
  }
  clear() {
    localStorage.clear();
  }
}
