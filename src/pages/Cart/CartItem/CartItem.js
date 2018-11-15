import React, {Component} from 'react';
import PropsType from 'prop-types'

import {actions} from '../store'

import {Link} from 'react-router-dom';

import style from "./CartItem.module.sass";
import icon_checked from "../../../static/images/cart/checked.png";
import icon_unchecked from "../../../static/images/cart/unchecked.png";
import logo from "../../../static/images/logo.png";
import arrow from "../../../static/images/cart/arrow.png";
import btn_delete from "../../../static/images/cart/delete.png";
import connect from "react-redux/es/connect/connect";
import CartProduct from "../CartProduct/CartProduct";

const mapStateToProps = (state, props) => {
  return {
    cart: state.carts.carts.find(x => x.cartId === props.cartId),
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    check: () => dispatch(actions.checkCart(props.cartId)),
  }
};

class CartItem extends Component {


  render() {
    const {shop, products, price, cartId, checked} = this.props.cart;

    return (
      <div className={style.cart}>
        <div className={style.title}>
          <div className={style.checked} onClick={this.props.check}>
            {checked ?
              <img src={icon_checked} alt=''/> :
              <img src={icon_unchecked} alt=''/>
            }
          </div>

          <div className={style.shop}>
            <img src={logo} alt=''/>
            <Link to={`/front/shop/${shop.brandId}/${shop.shopId}`}>
              <div>{shop.name}</div>
            </Link>
            <img src={arrow} alt=''/>
          </div>

          <img src={btn_delete} alt='' className={style.delete}/>
        </div>

        {products.map(v => (
          <CartProduct key={v.skuId} cartId={cartId} skuId={v.skuId}/>
        ))}

        <div className={style.other}>
          <div className={style.otherKey}>包装</div>
          <div className={style.otherPrice}>￥{price.box / 100.0}</div>
        </div>

        <div className={style.other}>
          <div className={style.otherKey}>配送费</div>
          <div className={style.otherPrice}>￥{price.send / 100.0}</div>
        </div>

        <div className={style.total}>
          <div>总价<span>￥{price.total / 100.0}</span></div>
          <div className={style.coupon}>领券</div>
          <div className={style.pay} onClick={this.props.onCommit}>下单</div>
        </div>
      </div>
    );
  }
}

CartItem.propTypes = {
  cartId: PropsType.string.isRequired,
  onCommit: PropsType.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CartItem);