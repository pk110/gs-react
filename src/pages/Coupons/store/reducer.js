const defaultState = {
  coupons: [],
  shared: [],
  received: [],
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'init_coupon_list': {
      const newState = JSON.parse(JSON.stringify(defaultState));

      return Object.assign({}, newState, action.payload);
    }

    default : {
      return state;
    }
  }
}