export const getParam = (params, name) => {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  let res = params.substr(1).match(reg);
  if (res != null) {
    return res[2];
  } else {
    return null;
  }
};

export const setLocalItem = (name, data) => {
  window.localStorage.setItem(name, JSON.stringify(data))
};

export const getLocalItem = (name) => {
  let item = window.localStorage.getItem(name);
  if (item) {
    try {
      const fmtItem = JSON.parse(item);
      let hasExpiredTime;
      hasExpiredTime = Object.keys(fmtItem).some(v => v === `expired_time`);
      if (hasExpiredTime) {
        return fmtItem.data
      }
      return fmtItem
    }
    catch (err) {
      console.log(JSON.stringify(err));
      window.localStorage.removeItem(name);
      return null
    }
  }
  return null
};

// export const removeLocalItem = ()