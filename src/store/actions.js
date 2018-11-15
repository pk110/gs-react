export const selectAddressToIndex = (address) => ({
  type: 'select_address',
  payload: address,
});

export const selectAddressToEdit = (address) => ({
  type: 'select_address_to_edit',
  payload: address,
});

export const setSearchResult = (address) => ({
  type: 'set_locate_search_result',
  payload: address,
});