const defaultState = {
  list: [],
  select: null,
  auto: null,
  edit: {
    cid: 0,
    name: '',
    gender: '1',
    phone: '',
    address: {
      name: '',
      detail: '',
      address: '',
      lng: '',
      lat: ''
    }
  },
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'list_member_address': {
      console.log('更新用户地址列表', action.payload);
      const newState = JSON.parse(JSON.stringify(state));
      if (action.payload.consignee) {
        newState.list = action.payload.consignee;
      }
      return newState;
    }

    case 'select_member_address': {
      console.log('选择用户地址', action.payload);
      const newState = JSON.parse(JSON.stringify(state));
      newState.select = action.payload;
      return newState;
    }

    case 'edit_member_address': {
      const newState = JSON.parse(JSON.stringify(state));
      const address = newState.list.find(x => x.cid === action.payload);
      newState.edit = JSON.parse(JSON.stringify(address));

      return newState;
    }
    case 'add_new_member_address': {
      const newState = JSON.parse(JSON.stringify(state));
      newState.edit.cid = 0;
      return newState;
    }

    case 'change_consignee_name': {
      const newState = JSON.parse(JSON.stringify(state));
      newState.edit.name = action.payload;
      return newState;
    }

    case 'change_consignee_phone': {
      const newState = JSON.parse(JSON.stringify(state));
      newState.edit.phone = action.payload;
      return newState;
    }

    case 'change_address_detail': {
      const newState = JSON.parse(JSON.stringify(state));
      newState.edit.address.detail = action.payload;
      return newState;
    }

    case 'change_consignee_gender': {
      const newState = JSON.parse(JSON.stringify(state));
      newState.edit.gender = action.payload;
      return newState;
    }

    case 'select_address_to_edit': {
      const newState = JSON.parse(JSON.stringify(state));
      const {name, location, address} = action.payload;
      const pos = location.split(',');

      newState.edit.address.name = name;
      newState.edit.address.address = address;
      newState.edit.address.lng = pos[0];
      newState.edit.address.lat = pos[1];

      newState.edit.address.detail = '';

      return newState;
    }

    default: {
      return state;
    }
  }
}