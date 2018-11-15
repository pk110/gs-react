import {getLocalItem, getParam, setLocalItem} from '../utils'

const getCode = () => {
  const params = window.location.search;
  return getParam(params, 'code');
};

let getting_token = false;

const getTokenFormLocal = () => (
  new Promise((resolve, reject) => {
    let times = 10;
    const i = setInterval(() => {
      if (!getting_token) {
        const token = window.__REDUX_DEVTOOLS_EXTENSION__ ? '20180000000000TEST0MEMBER0TEST' : getLocalItem('token');
        clearInterval(i);
        return resolve(token);
      }
      times--;
      console.log('正在换token');
      if (times <= 0) {
        return reject('timeout');
      }
    }, 2000);
  })
);

const getTokeByCode = (code) => (
  new Promise((resolve, reject) => {
    getting_token = true;
    fetch(`${process.env.REACT_APP_URL}/api/v2/open/member/login`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'code': code,
        'wechatName': 'WECHAT_ODEV'
      })
    }).then(res => res.json())
      .then(json => {
        if (json.code === 200) {
          getting_token = false;
          return resolve(json.data);
        } else {
          console.log('换取Token失败');
          getting_token = false;
          return reject();
        }
      });
  })
);

const redirect = (state = '') => {
  const search = window.location.search;
  let newSearch = search.replace(/&*code=[^&]*/ig, '').replace(/&*state=[^&]*/ig, '');
  const redirect_uri = encodeURIComponent(window.location.origin + window.location.pathname + newSearch);
  const appId = `${process.env.REACT_APP_ID}`;

  window.location.replace('https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appId +
    '&redirect_uri=' + redirect_uri +
    '&response_type=code' +
    '&scope=snsapi_userinfo' +
    '&state=' + state + '#wechat_redirect');
};

const getToken = () => (
  new Promise((resolve, reject) => {
    const code = getCode();
    // const token = getLocalItem('token');
    // const token = '20180000000000TEST0MEMBER0TEST';

    getTokenFormLocal().then(token => {
      if (token && !Object.is(token, '')) {
        return resolve(token);
      } else if (code) {

        getTokeByCode(code).then(token => {
          setLocalItem('token', token);
          return resolve(token);
        }).catch(() => redirect());
      } else {
        redirect();
        return reject();
      }
    }).catch(err => {
      redirect();
      return reject(err)
    });
  })
);

/**
 *
 * @param dto
 * @param {Array} dto.banner
 * @param {Array} dto.tagListorder
 * @param {Array} dto.popularity
 * @param {Array} dto.popularity.products
 * @param {string} dto.popularity.products.productName
 * @param {string} dto.banner.promotionUrl
 */

const indexDTO = (dto) => {
  console.log(dto);

  return {
    banners: dto.banner.map(({image, promotionUrl: url}) => ({image, url})) || [],
    labels: dto.tagListorder.map(({tagName: name, image}) => ({name, image})) || [],
    populars: dto.popularity.map(({image: banner, products}) => ({
      banner,
      products: products.map(p => ({
        name: p.productName,
        image: p.image,
        bid: p.brandId,
        pid: p.productId,
      }))
    })) || [],
  };
};

const cartDTO = (dto) => {
  // console.log(dto);

  let cartVO = [];

  dto && dto.forEach((v) => {
    const {cartId, listProduct, storeName, storeLogo, storeId, brandId} = v.cartListVO;
    const {totalBoxPrice: box, sendPrice: send, totalPrice: total} = v.cartListVO;
    const products = [];

    listProduct.forEach((p) => {
      let cp, op = 0;
      if (p.specialPrice && p.specialPrice > 0) {
        cp = p.specialPrice;
        op = p.price;
      } else {
        cp = p.price;
      }

      products.push({
        bid: p.brandId,
        pid: p.storeProductId,
        skuId: p.specsId,
        specs: p.specsName,
        name: p.productName,
        image: p.image,
        price: {food: cp, box: p.boxPrice, origin: op},
        count: p.total,
        checked: true
      });
    });

    const shop = {
      name: storeName,
      logo: storeLogo,
      shopId: storeId,
      brandId: brandId,
    };

    cartVO.push({
      cartId,
      shop,
      products,
      price: {box, send, total},
      checked: true
    })
  });

  return cartVO;
};

/**
 *
 * @param dto
 * @param {{storeName,storeLogo,storeBanner, startSendPrice, saleCount}} dto.shop
 * @param {number} dto.sales
 * @param {Array} dto.classList
 * @param {String} dto.classList.products.specsList
 * @param {String} dto.classList.products.specsList.specialPrice
 * @param {String} dto.classList.products.storeProductId
 * @param {Array} dto.coupons
 * @param {Array} dto.cartProducts.listProduct
 * @param {string} dto.cartProducts.listProduct.specsName
 * @param {string} dto.cartProducts.listProduct.specsId
 * @param {string} dto.cartProducts.listProduct.productId
 * @param {array} dto.cartProducts.listProduct
 */
const rackDTO = (dto) => {
  // console.log(dto);

  let rackVO = {};

  let cart = {};
  let cartSkuList = [];
  // let cartSkuItems = {};

  let productList = {};
  let skuList = {};

  let classes = [];

  // rackVO.shop = dto.shop;

  rackVO.shop = {
    name: dto.store.storeName,
    logo: dto.store.storeLogo,
    banner: dto.store.storeBanner,
    sendPrice: dto.store.sendPrice,
    minPrice: dto.store.startSendPrice,
    intro: dto.store.intro,
    sales: dto.store.saleCount,
    shopId: dto.store.storeId,
    bid: dto.store.brandId,
  };

  dto.classList.forEach(v => {
    let products = [];

    const classId = v.classId;
    const name = v.className;

    v.products.forEach((p) => {
      let sku = [];

      p.specsList.forEach(s => {
        let cp, np = 0;
        if (s.specialPrice && s.specialPrice > 0) {
          cp = s.specialPrice;
          np = s.price;
        } else {
          cp = s.price;
        }

        const sk = {
          name: s.specsName,
          skuId: s.specsId,
          price: {food: cp, origin: np, box: s.boxPrice},
          pid: p.storeProductId,
        };

        sku.push(sk);

        skuList[sk.skuId] = {...sk, productName: p.productName};
      });

      const product = {
        image: p.image,
        name: p.productName,
        pid: p.storeProductId,
        intro: p.intro,
        bid: p.brandId,
        sales: p.count,
        stock: p.count,
        status: p.status,
        sortId: p.listorder,
        sku,
      };

      products.push(p.storeProductId);
      productList[product.pid] = product;
    });

    products.sort((a, b) => productList[a].sortId - productList[b].sortId);

    classes.push({
      name,
      classId,
      products
    })
  });


  rackVO.classes = classes;
  rackVO.products = productList;
  rackVO.sku = skuList;

  rackVO.sales = dto.sales;

  rackVO.coupons = dto.coupons;

  dto.cartProducts && dto.cartProducts.listProduct.forEach(v => {
    // cartSkuList.push(v.specsId);
    // cartSkuItems[v.specsId] = {
    //   skuId: v.specsId,
    //   pid: v.storeProductId,
    //   count: v.total
    // };

    cartSkuList.push({
      skuId: v.specsId,
      pid: v.storeProductId,
      count: v.total
    });
  });

  cart.sku = cartSkuList;
  // cart.items = cartSkuItems;

  rackVO.cart = cart;

  // console.log(rackVO);
  return rackVO;
};

const orderListDTO = (dto) => {
  console.log(dto);
  return {
    orders: dto.map(o => ({
      orderId: o.orderId,
      shop: {name: o.storeBrandInfo.storeName, image: o.storeBrandInfo.storeLogo},
      cart: {
        sku: o.cartInfo.listProduct.map(s => ({
          name: s.productName,
          image: s.image,
          skuId: s.specsId
        }))
      },
      price: {total: o.payPrice},
      status: o.orderStatus,
    })) || [],
  };
};
/**
 *
 * @param {{mycoupon:{couponId,couponName,selectorArray,taintArray,tolerationsArray,effectsArray}}} dto
 * @returns {{coupons: *}}
 */
const couponsDTO = (dto) => {
  console.log(dto);
  return {
    coupons: dto.mycoupon.map(v => ({
      cid: v.couponId,
      couponClassId: v.couponClassId,
      name: v.couponName,
      selector: v.selectorArray,
      taint: v.taintArray,
      toleration: v.tolerationsArray,
      effects: v.effectsArray,
      dead: v.deadDay,
      sharable: v.shareStatus,
    })),

    shared: dto.receiveList.map(v => ({
      cid: v.couponId,
      couponClassId: v.couponClassId,
      name: v.couponName,
      selector: v.selectorArray,
      taint: v.taintArray,
      toleration: v.tolerationsArray,
      effects: v.effectsArray,
      dead: v.deadDay,
      sharable: v.sendStatus,
      receiver: {
        name: decodeURI(v.giveName),
        image: v.giveImage,
        status: v.sendStatus,
        overdue: v.overdueSecond,
        back: ''
      },
    }))
  }
};

/**
 *
 * @param {[{consigneeId, consigneeName, consigneeSex, consigneePhone, addressName, addressDetail, status}]} dto
 * @returns {{consignee: *}}
 */
const addressDTO = (dto) => {
  console.log(dto);
  return {
    consignee: dto ? dto.map(v => ({
      cid: v.consigneeId,
      name: v.consigneeName,
      gender: v.consigneeSex,
      phone: v.consigneePhone,
      address: {name: v.addressName, detail: v.addressDetail, address: v.consigneeAddress, lng: v.lng, lat: v.lat},
      status: v.status === undefined ? 1 : v.status,
    })).sort((a, b) => b.status - a.status) : []
  }
};

const sortCoupons = (type) => {
  switch (type) {
    case 'redPackage':
      return 0;
    case 'brandId':
      return 1;
    case 'gifts':
      return 2;
    case 'discount':
      return 3;
    case 'vouchers':
      return 4;
    default :
      return 99;
  }
};

const handleTokenError = (data) => {

  // console.log('判断是否token错误', data);

  if (data.code === 400010) {
    window.localStorage.clear();
    redirect();
    return Promise.reject('Token错误');
  } else {
    return Promise.resolve(data);
  }
};

export const login = (code) => {
  getTokeByCode(code).then(data => setLocalItem('token', data));
};

export const getIndexByCity = (cityId) => (
  new Promise((resolve, reject) => {
    console.log("获取城市首页: ", cityId);
    getToken().then(token => {
      fetch(`${process.env.REACT_APP_URL}/api/v2/open/product/index?cityId=${cityId}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          "content-type": "application/json",
          token: token
        }
      }).then(res => res.json())
        .then(res => handleTokenError(res))
        .then(json => resolve(json.data))
        .catch(err => reject(err));
    })
  }).then(data => (indexDTO(data)))
);

export const getNearbyStore = (location, cityId) => (
  new Promise((resolve, reject) => {
    console.log("查找附近的店铺: ", location);
    getToken().then(token => {
      fetch(`${process.env.REACT_APP_URL}/api/v2/open/product/stores`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          "content-type": "application/json",
          token: token
        },
        body: JSON.stringify({
          location: location,
          cityId: cityId
        })
      }).then(res => res.json())
        .then(json => resolve(json))
        .catch(err => reject(err));
    })
  })
);

export const getCart = () => (
  new Promise((resolve, reject) => {
    console.log('查询购物车');

    getToken().then(token => {
      fetch(`${process.env.REACT_APP_URL}/api/v2/open/product/get/carts`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          "content-type": "application/json",
          token: token
        }
      }).then(res => res.json())
        .then(res => handleTokenError(res))
        .then(json => resolve(json.data))
        .catch(err => reject(err));
    })

  }).then(data => cartDTO(data))
);

export const commitCart = (storeId, brandId, {sku}) => (
  new Promise((resolve, reject) => {

    const params = {
      storeId,
      brandId,
      products: sku.map(v => ({
        storeProductId: v.pid,
        specsId: v.skuId,
        total: v.count,
      })),
    };

    console.log('更新购物车', params);

    getToken().then(token => {
      fetch(`${process.env.REACT_APP_URL}/api/v2/open/product/create/cart`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          "content-type": "application/json",
          token: token
        },
        body: JSON.stringify(params)
      }).then(res => res.json())
        .then(json => {
          if (json.code === 200) {
            resolve(json.data);
          } else {
            reject(json);
          }
        })
        .catch(err => reject(err));
    })
  })
);

export const getRack = (brandId, storeId, location) => (
  new Promise((resolve, reject) => {
    console.log('查询店铺货架');

    getToken().then(token => {
      fetch(`${process.env.REACT_APP_URL}/api/v2/open/product/store/rack`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          "content-type": "application/json",
          token: token
        },
        body: JSON.stringify({
          location: location,
          brandId: brandId,
          storeId: storeId,
        })
      }).then(res => res.json())
        .then(data => handleTokenError(data))
        .then(json => {
          if (json.code === 200 || json.code === 400107) {
            resolve(json.data);
          } else {
            reject(json)
          }
        })
        .catch(err => reject(err));
    })
  }).then(data => rackDTO(data)).catch(err => console.log(err))
);

export const getOrders = (index = 0, count = 10) => (
  new Promise((resolve, reject) => {
    console.log('查询订单列表');

    getToken().then(token => {
      fetch(`${process.env.REACT_APP_URL}/api/v2/open/order/list/${index}/${count}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          "content-type": "application/json",
          token: token
        }
      }).then(res => res.json())
        .then(json => {
          // console.log(json);

          if (json.code === 200) {
            resolve(json.data);
          } else {
            reject(json)
          }
        })
        .catch(err => reject(err));
    })
  }).then(data => orderListDTO(data))
);

export const getCoupons = (storeId) => (
  new Promise((resolve, reject) => {
    console.log('查询优惠券');

    getToken().then(token => {
      fetch(`${process.env.REACT_APP_URL}/api/v2/open/marketing/coupon/list`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          "content-type": "application/json",
          token: token
        },
        body: JSON.stringify({
          storeId
        })
      }).then(res => res.json())
        .then(data => handleTokenError(data))
        .then(json => {
          if (json.code === 200) {
            resolve(json.data);
          } else {
            reject(json)
          }
        })
        .catch(err => reject(err));
    })
  }).then(data => couponsDTO(data))
);

export const shareCoupon = (cid) => (
  new Promise((resolve, reject) => {
    console.log('分享优惠券!!!');

    getToken().then(token => {
      fetch(`${process.env.REACT_APP_URL}/api/v2/open/marketing/coupon/friendCoupon`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          "content-type": "application/json",
          token: token
        },
        body: JSON.stringify({
          couponId: cid
        })
      }).then(res => res.json())
        .then(data => handleTokenError(data))
        .then(json => {
          if (json.code === 200) {
            resolve('ok');
          } else {
            reject('err')
          }
        })
        .catch(err => reject(err));
    })
  })
);

export const getSharedCoupon = (cid) => (
  new Promise((resolve, reject) => {
    console.log('获取分享的优惠券!');

    getToken().then(token => {
      fetch(`${process.env.REACT_APP_URL}/api/v2/open/marketing/coupon/getFriendCoupon`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          "content-type": "application/json",
          token: token
        },
        body: JSON.stringify({
          couponId: cid
        })
      }).then(res => res.json())
        .then(data => handleTokenError(data))
        .then(json => {
          if (json.code === 200) {
            resolve(json.data);
          } else {
            reject('err')
          }
        })
        .catch(err => reject(err));
    })
  })
);

export const getAddress = (storeId) => (
  new Promise((resolve, reject) => {
    console.log('地址列表');

    getToken().then(token => {
      fetch(`${process.env.REACT_APP_URL}/api/v2/open/member/address/in/range?storeId=${storeId}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          "content-type": "application/json",
          token: token
        }
      }).then(res => res.json())
        .then(json => {
          if (json.code !== 500) {
            resolve(json.data);
          } else {
            reject(json)
          }
        })
        .catch(err => reject(err));
    })
  }).then(data => addressDTO(data))
);

export const getAllAddress = () => (
  new Promise((resolve, reject) => {
    console.log('地址列表');

    getToken().then(token => {
      fetch(`${process.env.REACT_APP_URL}/api/v2/open/member/list/address`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          "content-type": "application/json",
          token: token
        }
      }).then(res => res.json())
        .then(json => {
          if (json.code !== 500) {
            resolve(json.data);
          } else {
            reject(json)
          }
        })
        .catch(err => reject(err));
    })
  }).then(data => addressDTO(data))
);


/**
 *
 * @param cart
 * @param {[{couponName: string, couponId}]} coupon
 * @returns {{cart: *}}
 */
const paymentDTO = ({cartListVO: cart, coupon}) => {
  const coupons = [];

  coupon && coupon.forEach(v => {
    coupons.push({
      name: v.couponName,
      cid: v.couponId,
      classId: v.couponClassId,
      selector: v.selectorArray,
      effects: v.effectsArray,
      toleration: v.tolerationsArray,
      dead: v.deadTime,
      used: false,
      disabled: false,
    });
  });

  coupons.sort((a, b) => {
    return sortCoupons(a.effects[0].keys) - sortCoupons(b.effects[0].keys);
  });

  return {
    cart: {
      cartId: cart.cartId,
      products: cart.listProduct.map(v => ({
        pid: v.storeProductId,
        skuId: v.specsId,
        name: v.productName + '(' + v.specsName + ')',
        count: v.total,
        stock: v.count,
        status: v.status,
        price: {food: v.specialPrice > 0 ? v.specialPrice : v.price, origin: v.specialPrice > 0 ? v.price : 0},
        coupons: []
      })),
      coupons: [],
      price: {total: cart.totalPrice, box: cart.totalBoxPrice, send: cart.sendPrice, min: cart.startSendPrice}
    },
    shop: {name: cart.storeName, logo: cart.storeLogo, shopId: cart.storeId, receiveTime: cart.receiveTime},
    coupons
  }
};

export const payCart = (cartId) => (
  new Promise((resolve, reject) => {
    console.log('去下单');

    getToken().then(token => {
      fetch(`${process.env.REACT_APP_URL}/api/v2/open/product/go/cart?cartId=${cartId}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          "content-type": "application/json",
          token: token
        }
      }).then(res => res.json())
        .then(json => {
          if (json.code !== 500 && json.code !== 400109) {
            return resolve(json.data);
          } else {
            return reject(json);
          }
        })
        .catch(err => reject(err));
    })
  }).then(data => {
    console.log(data);
    return paymentDTO(data)
  }).catch(err => console.log(err))
);

/**
 *
 * @param {{listOrderCoupon, totalPrice, totalBoxPrice, sendPrice, startSendPrice, listProduct: {listCoupon}}} cart
 * @returns {{cart: *}}
 */
const updatePaymentDTO = (cart) => {
  console.log(cart);
  return {
    cart: {
      cartId: cart.cartId,
      products: cart.listProduct.map(v => ({
        pid: v.storeProductId,
        skuId: v.specsId,
        name: v.productName + '(' + v.specsName + ')',
        count: v.total,
        stock: v.count,
        status: v.status,
        price: {food: v.specialPrice > 0 ? v.specialPrice : v.price, origin: v.specialPrice > 0 ? v.price : 0},
        coupons: v.listCoupon || [],
      })),
      coupons: cart.listOrderCoupon || [],
      price: {total: cart.totalPrice, box: cart.totalBoxPrice, send: cart.sendPrice, min: cart.startSendPrice}
    },
  }
};

export const useCoupons = (cartId, coupons) => (
  new Promise((resolve, reject) => {
    console.log('使用优惠券');

    getToken().then(token => {
      fetch(`${process.env.REACT_APP_URL}/api/v2/open/product/check/price`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          "content-type": "application/json",
          token: token
        },
        body: JSON.stringify({
          cartId,
          useCoupon: coupons
        })
      }).then(res => res.json())
        .then(json => {
          if (json.code !== 500) {
            resolve(json.data);
          } else {
            reject(json)
          }
        })
        .catch(err => reject(err));
    })
  }).then(data => updatePaymentDTO(data)).catch(err => console.log(err))
);

/**
 *
 * @param location
 * @returns {Promise<any>}
 */
export const getNearbyService = (location) => (
  new Promise((resolve, reject) => {
    console.log("查找附近的服务: ", location);
    getToken().then(token => {
      fetch(`${process.env.REACT_APP_URL}/api/v2/open/product/location`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          "content-type": "application/json",
          token: token
        },
        body: JSON.stringify({
          location: location
        })
      }).then(res => res.json())
        .then(json => resolve(json))
        .catch(err => reject(err));
    });
  })
);

/**
 *
 * @param cartId 购物车ID
 * @param coupons 优惠券列表
 * @param price 价格
 * @param delivery 配送方式
 * @param book 预定单
 * @param shopId 店铺ID
 * @param cid 收货信息
 * @param count 用餐人数
 * @param desc 备注
 * @returns {Promise<any>}
 */
export const createOrder = ({cartId, coupons, price, delivery, book, sid, cid, count, desc, time}) => (
  new Promise((resolve, reject) => {
    console.log('创建订单');

    getToken().then(token => {
      fetch(`${process.env.REACT_APP_URL}/api/v2/open/order/create`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          "content-type": "application/json",
          token: token
        },
        body: JSON.stringify({
          cartId,
          couponIds: coupons,
          payType: 1,
          payPrice: price,
          deliveryType: delivery,
          bookingType: book,
          storeId: sid,
          consigneeId: cid,
          diningCount: count,
          description: desc,
          serviceTime: time,
          wechatName: "WECHAT_ODEV"
        })
      }).then(res => res.json())
        .then(data => handleTokenError(data))
        .then(json => {
          if (json.code === 200) {
            resolve(json.data);
          } else {
            reject(json)
          }
        })
        .catch(err => reject(err));
    })
  })
);

export const getOrderDetail = (orderId) => (
  new Promise((resolve, reject) => {
  })
);

export const createGift = (orderId) => (
  new Promise((resolve, reject) => {
    console.log('生成礼盒');

    getToken().then(token => {
      fetch(`${process.env.REACT_APP_URL}/api/v2/open/marketing/gift/create`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          "content-type": "application/json",
          token: token
        },
        body: JSON.stringify({
          orderId
        })
      }).then(res => res.json())
        .then(json => handleTokenError(json))
        .then(json => {
          if (json.code !== 500) {
            return resolve(json.data);
          } else {
            return reject(json)
          }
        })
    })
  })
);

const giftDetailDTO = (dto) => {
  console.log(dto);

  return {
    giftId: dto.giftId,
    status: dto.isGrabStatus,
    initialized: true,
    sender: {name: decodeURI(dto.shareName), image: dto.shareImage},
  }
};

export const getGiftDetail = (giftId) => (
  new Promise((resolve, reject) => {
    console.log('查询礼盒详情');

    getToken().then(token => {
      fetch(`${process.env.REACT_APP_URL}/api/v2/open/marketing/gift/details`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          "content-type": "application/json",
          token: token
        },
        body: JSON.stringify({
          giftId
        })
      }).then(res => res.json())
        .then(json => handleTokenError(json))
        .then(json => {
          if (json.code !== 500) {
            return resolve(json.data);
          } else {
            return reject(json)
          }
        })
    })
  }).then(data => giftDetailDTO(data))
);


const grabGiftDTO = (dto) => {
  console.log(dto);
  console.log(decodeURI(dto.shareGift.shareName), dto.shareGift.shareName);
  return {
    giftId: dto.shareGift.giftId,
    status: dto.shareGift.isGrabStatus,
    initialized: true,
    sender: {name: dto.shareGift.shareName, image: dto.shareGift.shareImage},
    detail: dto.detailList.map(x => ({
      name: decodeURI(x.receiveName),
      image: x.image,
      date: x.receiveTime,
      item: x.receiveProductName
    })),
    result: {
      type: 'coupon',
      coupon: {
        effects: dto.couponResult.effectsArray,
        effectiveDay: dto.couponResult.effectiveDay,
        name: dto.couponResult.couponName,
      }
    }
  }
};

export const grabGift = (giftId) => (
  new Promise((resolve, reject) => {
    console.log('抢礼盒!');

    getToken().then(token => {
      fetch(`${process.env.REACT_APP_URL}/api/v2/open/marketing/gift/grab`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          "content-type": "application/json",
          token: token
        },
        body: JSON.stringify({
          giftId
        })
      }).then(res => res.json())
        .then(json => handleTokenError(json))
        .then(json => {
          if (json.code !== 500) {
            return resolve(json.data);
          } else {
            return reject(json)
          }
        })
    })
  }).then(data => {
    console.log(data);
    return grabGiftDTO(data);
  })
);

export const getUserInfo = () => (
  new Promise((resolve, reject) => {
    console.log('获取用户信息');

    getToken().then(token => {
      fetch(`${process.env.REACT_APP_URL}/api/v2/open/member/token`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          "content-type": "application/json",
          token: token
        }
      }).then(res => res.json())
        .then(json => handleTokenError(json))
        .then(json => {
          if (json.code !== 500) {
            return resolve(json.data);
          } else {
            return reject(json);
          }
        })
        .catch(err => reject(err))
    })
  }).catch(err => Promise.reject(err))
);

export const sendPhoneCode = (phone) => (
  new Promise((resolve, reject) => {
    console.log('发送手机验证码');

    getToken().then(token => {
      fetch(`${process.env.REACT_APP_URL}/api/v2/open/member/send?phone=${phone}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          "content-type": "application/json",
          token: token
        }
      }).then(res => res.json())
        .then(json => handleTokenError(json))
        .then(json => {
          if (json.code === 200) {
            return resolve('ok');
          } else {
            return reject(json);
          }
        })
        .catch(err => reject(err))
    })
  })
);

export const bindPhone = (phone, code) => (
  new Promise((resolve, reject) => {
    console.log('绑定用户手机');

    getToken().then(token => {
      fetch(`${process.env.REACT_APP_URL}/api/v2/open/member/binding?phone=${phone}&code=${code}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          "content-type": "application/json",
          token: token
        }
      }).then(res => res.json())
        .then(json => handleTokenError(json))
        .then(json => {
          if (json.code === 200) {
            return resolve('ok');
          } else {
            return reject(json);
          }
        })
        .catch(err => reject(err))
    })
  })
);

export const createAddress = ({name, phone, gender, address, addressName, addressDetail, lng, lat, tags}) => (
  new Promise((resolve, reject) => {
    console.log('添加收货地址');

    getToken().then(token => {
      fetch(`${process.env.REACT_APP_URL}/api/v2/open/member/create/address`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          "content-type": "application/json",
          token: token
        },
        body: JSON.stringify({
          "consigneeName": name,
          "consigneePhone": phone,
          "consigneeSex": gender,
          "consigneeAddress": address,
          "addressName": addressName,
          "addressDetail": addressDetail,
          "isDefault": 0,
          "consigneeLng": lng,
          "consigneeLat": lat,
          "tags": tags
        }),
      }).then(res => res.json())
        .then(json => handleTokenError(json))
        .then(json => {
          if (json.code === 200) {
            return resolve('ok');
          } else {
            return reject(json);
          }
        })
        .catch(err => reject(err))
    })
  })
);

export const updateAddress = ({cid, name, phone, gender, address, addressName, addressDetail, lng, lat, tags}) => (
  new Promise((resolve, reject) => {
    console.log('添加收货地址');

    getToken().then(token => {
      fetch(`${process.env.REACT_APP_URL}/api/v2/open/member/update/address`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          "content-type": "application/json",
          token: token
        },
        body: JSON.stringify({
          "consigneeId": cid,
          "consigneeName": name,
          "consigneePhone": phone,
          "consigneeSex": gender,
          "consigneeAddress": address,
          "addressName": addressName,
          "addressDetail": addressDetail,
          "isDefault": 0,
          "consigneeLng": lng,
          "consigneeLat": lat,
          "tags": tags
        }),
      }).then(res => res.json())
        .then(json => handleTokenError(json))
        .then(json => {
          if (json.code === 200) {
            return resolve('ok');
          } else {
            return reject(json);
          }
        })
        .catch(err => reject(err))
    })
  })
);

export const getIndexCoupons = () => (
  new Promise((resolve, reject) => {
    console.log('获取首页优惠券信息');

    getToken().then(token => {
      fetch(`${process.env.REACT_APP_URL}/api/v2/open/marketing/coupon/index/coupon`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          "content-type": "application/json",
          token: token
        }
      }).then(res => res.json())
        .then(json => handleTokenError(json))
        .then(json => {
          if (json.code !== 500) {
            return resolve(json.data);
          } else {
            return reject(json);
          }
        })
        .catch(err => reject(err))
    })
  })
);


