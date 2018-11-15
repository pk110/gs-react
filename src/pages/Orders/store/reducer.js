const defaultState = {
  orders: [],
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'init_order_list': {
      const newState = JSON.parse(JSON.stringify(defaultState));

      return Object.assign(newState, action.payload);
    }

    default : {
      return state;
    }
  }
}