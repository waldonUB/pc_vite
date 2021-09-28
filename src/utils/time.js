/*
 * @Author: ADI
 * @Date: 2021-03-22 17:18:45
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-16 16:16:33
 */
export const parseDate = (seconds, timeUnit = 'all') => {
  let timeParse = '';
  const getUnit = time => {
    let unit = 1;
    for (let i = 0; i < time; i++) {
      unit *= 60;
    }
    return unit;
  };
  const dayUnit = 24 * getUnit(2);
  const hourUnit = getUnit(2);
  const minuteUnit = getUnit(1);
  const day = Math.floor(seconds / dayUnit);
  const dayremain = seconds % dayUnit;
  if (day > 0) {
    timeParse += day + 'D';
  }

  const hours = Math.floor(dayremain / hourUnit);
  const hourremain = dayremain % hourUnit;
  if (hours > 0) {
    timeParse += hours + 'H';
  }

  const minute = Math.floor(hourremain / minuteUnit);
  const second = hourremain % minuteUnit;
  if (minute > 0) {
    timeParse += minute + 'M';
  }
  if (timeUnit == 'd') {
    return day;
  } else if (timeUnit == 'h') {
    return hours;
  } else if (timeUnit == 'm') {
    return minute;
  } else if (timeUnit == 's') {
    return second;
  }
  timeParse += second + 'S';
  return timeParse;
};

/**
 *校准client和server端的时间差异
 *
 * @param {date|number} time
 * @returns {date|number} time
 */
export const calibrationTime = function(time) {
  if (typeof window.g_timeDeviation !== 'undefined') {
    // var type = $.type(time);
    // if (type == 'date') {
    var type = typeof time;
    if (new Date() instanceof Date) {
      time.setTime(time.getTime() + window.g_timeDeviation);
    } else if (type === 'number') {
      time += window.g_timeDeviation;
    }
  }
  return time;
};
//获取服务器时间
export const getServerTime = function() {
  return calibrationTime(Date.now());
};

// 后续时间戳操作推荐使用轻量级时间库 day.js https://github.com/iamkun/dayjs
export const format = (function() {
  /**
   * 补零
   * @param {String | Number} val 要补零的数
   * @param {Number} len 补零后的长度
   * @return {String} 补零后的字符串
   */
  function leadingZero(val, len) {
    var zero = '';
    var valLen, key;

    val += '';
    valLen = val.length;

    if (valLen >= len) {
      return val;
    }

    while (len--) {
      zero += '0';
    }

    return (zero + val).substr(valLen);
  }

  function Duration(duration) {
    var years = duration.years || 0;
    var months = duration.months || 0;
    var weeks = duration.weeks || 0;
    var days = duration.days || 0;
    var hours = duration.hours || 0;
    var minutes = duration.minutes || 0;
    var seconds = duration.seconds || 0;
    var milliseconds = duration.milliseconds || 0;

    this.milliseconds =
      +milliseconds +
      seconds * 1e3 + // 1000
      minutes * 6e4 + // 1000 * 60
      hours * 1000 * 60 * 60; // 使用 1000 * 60 * 60 而不使用 36e5 避免浮点舍入误差
    this.days = +days + weeks * 7;
    this.months = +months + years * 12;

    return this;
  }

  function createDuration(val, key) {
    var duration = val;

    if (typeof val === 'number') {
      duration = {};
      if (key) {
        duration[key] = val;
      } else {
        duration.milliseconds = val;
      }
    }

    return new Duration(duration);
  }

  /**
   * 把月份转换成天数
   * @param  {Number} months 月份，可超过12个月
   * @return {Number} 月份对应的天数
   */
  function monthsToDays(months) {
    // 每 400 年有 146097 天(包含闰年)
    // 400 年每年有 12 个月 所以 400 * 12 = 4800 (月)
    // 得出式子
    //
    //  months      4800
    // -------- = --------
    //   days      146097
    //
    // days = months * 146097 / 4800
    return (months * 146097) / 4800;
  }

  /**
   * 绝对向上取整
   * @param  {Number} number 要取整的数
   * @return {Number} 取整后的数
   * @example
   * absCeil(5.6); // 6
   * absCeil(-5.6); // -6
   */
  function absCeil(number) {
    if (number < 0) {
      return Math.floor(number);
    } else {
      return Math.ceil(number);
    }
  }

  /**
   * 对日期的加减法运算
   * @param {Date} date 要运算的日期
   * @param {Number | Object} val 要增加或减少的数，Object格式：{ key: Number }
   * @param {String} key 对年月日时分秒哪一位运算，可选值：[years|months|weeks|days|hours|minutes|seconds|milliseconds]
   * @param {String} dir 增加还是减少，可选值[1|-1]
   * @return {Date} 运算完后的日期
   */
  function addSubtract(date, val, key, dir) {
    var duration = createDuration(val, key);
    var days = absCeil(monthsToDays(duration.months) + duration.days);
    var milliseconds = duration.milliseconds + days * 864e5; //864*10^5
    var timestamp = dir * (days + milliseconds);

    return new Date(timestamp + date.getTime());
  }
  /**
   *格式化时间yy-mm-dd hh:mm:ss
   *
   * @author guoyijie
   * @date 2020-04-18
   * @param {*} oldDate
   * @returns
   */
  function dateFormat(oldDate) {
    var date = new Date(oldDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
    const day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
    const hours = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
    const minutes = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
    const seconds = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds();
    const newDate = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
    return newDate;
  }

  /**
   * @description : 线索缺陷
   * @author      : ADI
   * @Date        : 2021-06-17 11:49:19
   * @param        {*} dateStr
   * @return       {*}
   */
  function isOverDate(dateStr) {
    const date = new Date();
    const overDate = new Date(dateStr);
    return date >= overDate;
  }

  /**
   *转化毫秒数
   *
   * @author guoyijie
   * @date 2020-04-18
   * @param {*} oldTime
   * @returns
   */
  function timeFormat(oldTime) {
    const hour = Math.floor(oldTime / 3600);
    const seconds = oldTime % 60;
    const minutes = (oldTime - hour * 3600 - seconds) / 60;
    const time =
      hour == 0
        ? minutes == 0
          ? seconds == 0
            ? '0'
            : seconds + '秒'
          : minutes + '分' + seconds + '秒'
        : hour + '时' + minutes + '分' + seconds + '秒';
    return time;
  }

  return {
    date: function(date, format, notfillZero) {
      if (!(date instanceof Date)) {
        return date;
      }
      var key, result;
      var regexDateObject = {
        'y+': date.getFullYear(), // 年份
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日期
        'H+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分钟
        's+': date.getSeconds(), // 秒
        'S': date.getMilliseconds(), // 毫秒
      };

      for (key in regexDateObject) {
        format = format.replace(new RegExp('(' + key + ')'), function(match, keyMatch, index, input) {
          result = regexDateObject[key];

          if (!notfillZero) {
            result = leadingZero(result, keyMatch.length);
          }

          return result;
        });
      }

      return format;
    },
    addDate: function(date, key, val) {
      return addSubtract(date, key, val, 1);
    },
    subDate: function(date, key, val) {
      return addSubtract(date, key, val, -1);
    },
    formatDate: function(date) {
      return dateFormat(date);
    },
    formatTime: function(time) {
      return timeFormat(time);
    },
    /* 获取提价弹窗
     * @author guoyijie
     * @date 2021-06-07
     * @param {*} dateStr('年/月/日')
     * @returns
     */
    isOverDate: function(dateStr) {
      return isOverDate(dateStr);
    },
  };
})();
