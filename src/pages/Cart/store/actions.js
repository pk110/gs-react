export const initCarts = (data) => ({
  type: 'init_carts',
  payload: data,
});

export const incCountInCart = (cartId, skuId) => ({
  type: 'inc_count_in_cart',
  payload: {cartId, skuId},
});

export const decCountInCart = (cartId, skuId) => ({
  type: 'dec_count_in_cart',
  payload: {cartId, skuId},
});

export const checkProductInCart = (cartId, skuId) => ({
  type: 'check_product_in_cart',
  payload: {cartId, skuId},
});

export const checkCart = (cartId) => ({
  type: 'check_cart',
  payload: cartId,
});
