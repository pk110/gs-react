const defaultState = {
  cart: {
    cartId: '',
    products: [],
    price: {total: 0, box: 0, send: 0},
    coupons: [],
  },
  shop: {name: '', logo: '', shopId: ''},
  coupons: [],
  dialog: {coupons: false, people: false, time: false, taste: false},
  people: 0,
  receiveDate: [0, 1],
  receiveTime: 0
};

const isToleration = (a, b) => (
  a.toleration[0].value.indexOf(parseInt(b.classId)) >= 0 && b.toleration[0].value.indexOf(parseInt(a.classId)) >= 0
);

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'init_payment': {
      const newState = JSON.parse(JSON.stringify(state));
      return Object.assign(newState, action.payload);
    }

    case 'show_coupons_dialog': {
      const newState = JSON.parse(JSON.stringify(state));
      if (newState.coupons.length > 0) {
        newState.dialog.coupons = true;
        newState.dialog.people = false;
        newState.dialog.time = false;
      }
      return newState;
    }

    case 'show_people_dialog': {
      const newState = JSON.parse(JSON.stringify(state));
      newState.dialog.coupons = false;
      newState.dialog.people = true;
      newState.dialog.time = false;
      newState.people = 1;
      return newState;
    }

    case 'show_time_dialog': {
      const newState = JSON.parse(JSON.stringify(state));
      newState.dialog.coupons = false;
      newState.dialog.people = false;
      newState.dialog.time = true;
      return newState;
    }

    case 'close_all_payment_dialog': {
      const newState = JSON.parse(JSON.stringify(state));
      newState.dialog.coupons = false;
      newState.dialog.people = false;
      newState.dialog.time = false;
      return newState;
    }

    case 'uncheck_all': {
      const newState = JSON.parse(JSON.stringify(state));
      // newState.coupons = {};
      newState.coupons.forEach(v => v.used = v.disabled = false);
      return newState;
    }

    case 'check_coupon': {
      const newState = JSON.parse(JSON.stringify(state));
      const coupon = newState.coupons.find(v => (v.cid === action.payload));

      coupon.used = !coupon.used;

      if (coupon.used) {
        coupon.disabled = false;

        newState.coupons.filter(v => (v.cid !== coupon.cid && v.used))
          .forEach(other => {
            if (!isToleration(coupon, other)) {
              console.log('不能叠加使用: ', coupon, other);
              other.used = false;
            }
          });
      }

      const usedCoupons = newState.coupons.filter(v => v.used);
      const unusedCoupons = newState.coupons.filter(v => !v.used);

      console.log(usedCoupons, unusedCoupons);

      unusedCoupons.forEach(v => {
        v.disabled = false;
        usedCoupons.forEach(u => {
          if (!isToleration(v, u)) {
            v.disabled = true;
          }
        })
      });

      return newState;
    }

    case 'use_coupons': {
      const newState = JSON.parse(JSON.stringify(state));
      newState.dialog.coupons = false;
      newState.dialog.people = false;
      newState.dialog.time = false;
      return Object.assign(newState, action.payload);
    }

    case 'people_count_inc': {
      const newState = JSON.parse(JSON.stringify(state));

      const count = newState.people + 1;

      if (count > 0 && count <= 99) {
        newState.people = count
      }

      return newState;
    }

    case 'people_count_dec': {
      const newState = JSON.parse(JSON.stringify(state));

      const count = newState.people - 1;

      if (count > 0 && count <= 99) {
        newState.people = count
      }

      return newState;
    }

    case 'select_receive_time': {
      const newState = JSON.parse(JSON.stringify(state));

      newState.receiveTime = action.payload;

      newState.dialog.coupons = false;
      newState.dialog.people = false;
      newState.dialog.time = false;

      return newState;
    }

    default:
      return state;
  }
}