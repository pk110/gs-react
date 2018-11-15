import React, {Component} from 'react';
import {connect} from 'react-redux';

import {actions} from '../store';

import PropsType from "prop-types";

import style from "./CartProduct.module.sass";

import icon_checked from "../../../static/images/cart/checked.png";

import icon_unchecked from "../../../static/images/cart/unchecked.png";
import btn_minus from "../../../static/images/cart/minus.png";
import btn_add from "../../../static/images/cart/add.png";

const mapStateToProps = (state, {cartId, skuId}) => {
  return {
    product: state.carts.carts.find(x => x.cartId === cartId).products.find(s => s.skuId === skuId),
  };
};

const mapDispatchToProps = (dispatch, {cartId, skuId}) => {
  return {
    inc: () => dispatch(actions.incCountInCart(cartId, skuId)),
    dec: () => dispatch(actions.decCountInCart(cartId, skuId)),
    check: () => dispatch(actions.checkProductInCart(cartId, skuId)),
  }
};

class CartProduct extends Component {

  render() {
    const {checked, price, name, specs, image, count} = this.props.product;
    return (
      <div className={style.productItem}>
        <div className={style.checked} onClick={this.props.check}>
          {checked ?
            <img src={icon_checked} alt=''/> :
            <img src={icon_unchecked} alt=''/>
          }
        </div>

        <img alt='' src={image} className={style.productImage}/>

        <div className={style.productInfo}>
          <div className={style.productInfoName}>{name}</div>
          <div className={style.productInfoSpecs}>{specs}</div>
          <div className={style.productInfoPrice}>
            ￥{price.food / 100.0}<span>{price.origin ? "￥" + price.origin / 100.0 : null}</span>
          </div>
        </div>

        <img alt='' className={style.productAdd} src={btn_minus} onClick={this.props.dec}/>
        <div className={style.productCount}>{count}</div>
        <img alt='' className={style.productAdd} src={btn_add} onClick={this.props.inc}/>
      </div>
    );
  }
}

CartProduct.propTypes = {
  cartId: PropsType.string.isRequired,
  skuId: PropsType.string.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CartProduct);