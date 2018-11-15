import React from 'react';
import PropTypes from 'prop-types';
import style from "../../pages/Payment/Payment.module.css";
import logo from "../../static/images/logo.png";

const PaymentCart = props => {
  return (
    <div className={style.products}>
      <div className={style.shop}>
        <img alt='' src={logo} className={style.shopLogo}/>
        <div className={style.shopName}>{props.shop.name}</div>
      </div>

      <div className={style.tips}>温馨提示：主食是单独点的哦!</div>

      {props.products.map(v => (
        <div key={v.skuId} className={style.product}>
          <div className={style.productName}>{v.name}</div>
          {v.coupons.length > 0 ?
            <div className={style.productCoupons}>折扣券x{v.coupons.length}</div> : null
          }
          <div className={style.productCount}>x{v.count}</div>
          <div className={style.productPrice}>￥{v.price.food / 100.0}</div>
        </div>
      ))}

      <div className={style.product}>
        <div className={style.productName}>包装费</div>
        <div className={style.productPrice}>￥{props.price.box / 100.0}</div>
      </div>

      <div className={style.product}>
        <div className={style.productName}>配送费</div>
        <div className={style.productPrice}>￥{props.price.send / 100.0}</div>
      </div>

      <div className={style.total}>
        <div className={style.productTotal}>总计</div>
        <div className={style.productTotalPrice}>￥{cart.price.total / 100.0}</div>
      </div>
    </div>
  );
};

PaymentCart.propTypes = {
  products: PropTypes.array.isRequired,
  shop: PropTypes.object.isRequired,
};

export default PaymentCart;