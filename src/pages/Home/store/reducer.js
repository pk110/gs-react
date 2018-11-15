const defaultState = {
  city: 'C430000',
  address: '庭瑞大厦',
  initialized: false,
  banners: [],
  labels: [],
  populars: [],
  coupons: {},
  dialog: {}
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'init_home_page': {
      const newState = JSON.parse(JSON.stringify(state));
      return Object.assign(newState, {...action.payload, initialized: true});
    }

    case 'init_home_coupons': {
      const newState = JSON.parse(JSON.stringify(state));
      console.log(action.payload);

      return Object.assign(newState, {coupons: action.payload})
    }

    default : {
      return state;
    }
  }
};