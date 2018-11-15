export const selectAddress = (address) => ({
  type: 'select_member_address',
  payload: address
});

export const editAddress = (cid) => ({
  type: 'edit_member_address',
  payload: cid
});

export const addNewAddress = (cid) => ({
  type: 'add_new_member_address',
});

export const deleteAddress = (cid) => ({
  type: 'delete_member_address',
  payload: cid
});

export const listMemberAddress = (addresses) => ({
  type: 'list_member_address',
  payload: addresses
});

export const changeName = (name) => ({
  type: 'change_consignee_name',
  payload: name
});

export const changePhone = (phone) => ({
  type: 'change_consignee_phone',
  payload: phone
});

export const changeDetail = (detail) => ({
  type: 'change_address_detail',
  payload: detail
});

export const changeGender = (gender) => ({
  type: 'change_consignee_gender',
  payload: gender
});


