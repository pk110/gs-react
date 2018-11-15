const wechatName = 'WECHAT_ODEV';

/**
 *
 */
const wx = window.wx;

export const pageConfig = (callback) => {
  const url = window.location.href;

  fetch(`${process.env.REACT_APP_URL}/api/v2/open/wechat/sign/js`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "url": url,
      "wechatName": wechatName
    })
  }).then(res => res.json())
    .then(data => data.data)
    .then(data => {
      wx.config({
        debug: false,
        appId: 'wx562ce191772793a0',
        timestamp: data.timestamp,
        nonceStr: data.nonceStr,
        signature: data.signature,
        jsApiList: [
          "chooseWXPay",
          "onMenuShareAppMessage",
          "onMenuShareTimeline",
          "hideAllNonBaseMenuItem",
          "hideMenuItems",
          "showMenuItems",
          "closeWindow",
          "getLocation"]
      });

      wx.ready(
        () => callback(window.wx)
      );
    })
};
/**
 *
 * @param title
 * @param desc
 * @param link
 * @param imgUrl
 */
export const setShareUrl = ({title, desc, link, imgUrl}) => {
  wx.onMenuShareAppMessage({
    title,
    desc,
    link,
    imgUrl,
  });

  wx.onMenuShareTimeline({
    title,
    desc,
    link,
    imgUrl,
  });
};

export const pay = (timestamp, nonce, prepay, st, sign) => (
  new Promise((resolve, reject) => {
    wx.chooseWXPay({
      timestamp,
      nonceStr: nonce,
      package: prepay,
      signType: st,
      paySign: sign,
      success: () => resolve(),
      fail: err => reject(err),
      cancel: err => reject(err),
    });
  })
);

