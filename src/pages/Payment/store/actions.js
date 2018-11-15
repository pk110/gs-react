export const initPage = (data) => ({
  type: 'init_payment',
  payload: data,
});

export const showCouponsDialog = () => ({
  type: 'show_coupons_dialog'
});

export const showPeopleDialog = () => ({
  type: 'show_people_dialog'
});

export const showTimeDialog = () => ({
  type: 'show_time_dialog'
});

export const closeDialog = () => ({
  type: 'close_all_payment_dialog'
});


export const unCheckAll = () => ({
  type: 'uncheck_all'
});

export const checkCoupon = (cid) => ({
  type: 'check_coupon',
  payload: cid
});

export const useCoupons = (cart) => ({
  type: 'use_coupons',
  payload: cart
});

export const listMemberAddress = (addresses) => ({
  type: 'list_member_address',
  payload: addresses
});

export const peopleCountInc = () => ({
  type: 'people_count_inc'
});

export const peopleCountDec = () => ({
  type: 'people_count_dec'
});

export const selectReceiveTime = (i) => ({
  type: 'select_receive_time',
  payload: i
});


