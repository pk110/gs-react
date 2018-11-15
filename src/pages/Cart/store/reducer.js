const defaultState = {
  carts: [],
};

const updateCarts = (cart) => {
  let boxPrice = 0, foodPrice = 0;
  const sendPrice = cart.price.send;

  cart.products.forEach(v => {
    if (v.checked) {
      boxPrice += v.price.box * v.count;
      foodPrice += v.price.food * v.count;
    }
  });

  cart.price.box = boxPrice;
  cart.price.total = foodPrice + boxPrice + sendPrice;
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'init_carts': {
      const newState = JSON.parse(JSON.stringify(state));

      newState.carts = action.payload;
      return newState;
    }

    case 'check_cart': {
      const newState = JSON.parse(JSON.stringify(state));
      const cartId = action.payload;

      const cart = newState.carts.find(x => x.cartId === cartId);

      cart.checked = !cart.checked;

      cart.products.forEach(v => {
        v.checked = cart.checked;
      });

      updateCarts(cart);
      return newState;
    }

    case 'check_product_in_cart': {
      const newState = JSON.parse(JSON.stringify(state));
      const {cartId, skuId} = action.payload;

      const cart = newState.carts.find(x => x.cartId === cartId);
      const product = cart.products.find(s => s.skuId === skuId);

      product.checked = !product.checked;
      updateCarts(cart);

      return newState;
    }

    case 'inc_count_in_cart': {
      const newState = JSON.parse(JSON.stringify(state));

      const {cartId, skuId} = action.payload;

      const cart = newState.carts.find(x => x.cartId === cartId);
      const product = cart.products.find(s => s.skuId === skuId);

      const count = product.count + 1;

      if (count >= 0 && count <= 999) {
        product.count = count;
        updateCarts(cart);
      }

      return newState;
    }
    case 'dec_count_in_cart': {
      const newState = JSON.parse(JSON.stringify(state));

      const {cartId, skuId} = action.payload;

      const cart = newState.carts.find(x => x.cartId === cartId);
      const product = cart.products.find(s => s.skuId === skuId);

      const count = product.count - 1;

      if (count >= 0 && count <= 999) {
        product.count = count;
        updateCarts(cart);
      }

      return newState;
    }


    default: {
      return state;
    }
  }
}

