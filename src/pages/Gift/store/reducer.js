const defaultState = {
  giftId: '',
  sender: {name: '', image: ''},
  result: {type: 'none', coupon: null},
  detail: [],
  subscribed: 0,
  status: 0,
  count: 0,
  initialized: false,
};

export default (state = defaultState, action) => {

  switch (action.type) {
    case 'init_gift_status': {
      const newState = JSON.parse(JSON.stringify(state));
      return Object.assign(newState, action.payload);
    }

    case 'grab_success': {
      const newState = JSON.parse(JSON.stringify(state));
      return Object.assign(newState, action.payload);
    }

    default : {
      return state;
    }
  }
}