import {combineReducers} from 'redux';
import {reducer as HomeReducer} from '../pages/Home/store';
import {reducer as ShopReducer} from '../pages/Shop/store';
import {reducer as CartReducer} from '../pages/Cart/store';
import {reducer as PaymentReducer} from '../pages/Payment/store';
import {reducer as AddressReducer} from '../pages/Address/store';
import {reducer as GiftReducer} from '../pages/Gift/store';
import {reducer as UserReducer} from '../pages/User/store';
import {reducer as CouponsReducer} from '../pages/Coupons/store';
import {reducer as OrdersReducer} from '../pages/Orders/store';

const defaultState = {
  position: '114.410281,30.483276',
  address: '庭瑞大厦',
  near: {addresses: []},
  city: '武汉',
  cities: ['武汉', '北京', '上海'],
  manual: {address: '', position: ''},
  search: [],
};

const LocateReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'init_location': {
      const newState = JSON.parse(JSON.stringify(state));
      newState.position = action.payload;
      return newState;
    }
    case 'set_geo_address': {
      const newState = JSON.parse(JSON.stringify(state));
      newState.near.addresses = action.payload;
      return newState;
    }

    case 'set_locate_search_result': {
      const newState = JSON.parse(JSON.stringify(state));
      newState.search = action.payload;
      return newState;
    }

    case 'select_address': {
      const newState = JSON.parse(JSON.stringify(state));
      console.log(newState, action.payload);
      newState.manual.address = action.payload.name;
      newState.manual.position = action.payload.location;

      return newState;
    }

    default : {
      return state;
    }
  }
};

export default combineReducers({
  home: HomeReducer,
  shop: ShopReducer,
  carts: CartReducer,
  locate: LocateReducer,
  payment: PaymentReducer,
  address: AddressReducer,
  gift: GiftReducer,
  user: UserReducer,
  coupon: CouponsReducer,
  order: OrdersReducer,
});

