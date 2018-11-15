const defaultState = {
  "phone": null,
  "status": 0,
  "openid": null,
  "headPic": "",
  "nickname": "",
  "sex": 0,
  "subscribe": null,
  "subscribeTime": null,
  "subscribePath": null,
  "province": "",
  "city": "",
  "country": ""
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'update_user_info': {
      const newState = JSON.parse(JSON.stringify(state));
      return Object.assign({}, newState, action.payload);
    }

    default: {
      return state;
    }
  }
}