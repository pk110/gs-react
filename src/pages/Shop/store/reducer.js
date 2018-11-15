const defaultState = {
  shop: {banner: '', name: '', logo: '', sales: 0, intro: '', sid: '', minPrice: 0, sendPrice: 0},
  sales: [],
  classes: [],
  coupons: [],
  cart: {sku: [], count: {total: 0, product: []}, price: {total: 0, box: 0}},
  sku: {},
  products: {},
  select: {pid: '', skuId: '', sku: []},
  activeLabel: 0,
  isCartOpen: false,
  isDialogShow: false,
  isSkuDialogShow: false
};

export default (state = defaultState, action) => {

  switch (action.type) {
    case 'init_page' :
      const newState = JSON.parse(JSON.stringify(state));
      return Object.assign(newState, action.payload);

    default:
      return state;
  }
}