import React, {Component} from 'react';
import CartItem from './CartItem/CartItem';
import {actions} from './store';

import style from './Cart.module.css';

import {connect} from 'react-redux';

import Toast from 'antd-mobile/lib/toast';
import 'antd-mobile/lib/toast/style/css';

import logo from "../../static/images/logo.png";
import icon_more from '../../static/images/cart/more.png';

import icon_empty from '../../static/images/cart/empty.png';

import coupon_a from '../../static/images/coupon/coupon_a.png';
import coupon_b from '../../static/images/coupon/lingquan3.png';
import {kitchen} from "../../utils";
import Loading from "../../components/Loading/Loading";

const Coupon = ({type, name}) => {

  if (type === '1') {
    return (
      <div className={style.coupon_a}>
        <img alt='' src={coupon_a} style={{width: '100%'}}/>
        <div className={style.coupon_context}>
          <div className={style.coupon_context_left}>18<span>元</span></div>
          <div className={style.coupon_context_center}>
            <div>现金券</div>
            <div style={{fontSize: '0.24rem'}}>满￥30元可用</div>
          </div>
          <div className={style.coupon_context_right}>领取</div>
        </div>
      </div>
    );
  } else if (type === '2') {
    return (
      <div className={style.coupon_a}>
        <img alt='' src={coupon_b} style={{width: '100%'}}/>
        <div className={style.coupon_context}>
          <div className={style.coupon_context_left} style={{fontSize: '0.48rem'}}>赠品</div>
          <div className={style.coupon_context_center}>
            <div>{name}</div>
            <div style={{display: 'flex'}}>
              <div>赠送:</div>
              <div>
                <div>蒸鸡蛋x2</div>
                <div>酸梅汤x1</div>
              </div>
            </div>
          </div>
          <div className={style.coupon_context_right}>领取</div>
        </div>
      </div>
    );
  }

  return null;
};

class Cart extends Component {

  /**
   * 提交购物车
   * @param cart
   */
  handleCartCommit = (cart) => {
    const {shop: {shopId, brandId}, products} = cart;
    const sku = products.filter(v => v.count > 0).map(v => ({
      pid: v.pid,
      skuId: v.skuId,
      count: v.count,
    }));

    Toast.loading('去下单');

    kitchen.commitCart(shopId, brandId, {sku})
      .then(data => {
        Toast.hide();
        this.props.history.push(`/front/pay/${data}`);
        return 'ok';
      });
  };

  constructor(props) {
    super(props);

    this.state = {
      initialized: false,
      loading: false,
    };
  }

  componentDidMount() {
    kitchen.getCart().then(carts => {
      this.setState({initialized: true});
      this.props.initCarts(carts);
    }).catch(e => console.log(e));
  }

  render() {
    const {carts, more} = this.props;

    console.log(carts);

    return (
      <div className={style.box}>
        {this.state.initialized ?
          <div>
            {carts.length > 0 ?
              <div className={style.list}>
                {carts.map(v => (
                  <CartItem key={v.cartId} cartId={v.cartId} onCommit={() => this.handleCartCommit(v)}/>
                ))}
              </div> :
              <img src={icon_empty} alt='' className={style.empty}/>
            }

            {more.length > 0 ?
              <div className={style.more}>
                <img alt='' src={icon_more} className={style.moreTitle}/>
                <div className={style.moreProductList}>
                  {more.map((v, i) => (
                    <div key={i} className={style.moreProduct}>
                      <div className={style.moreProductImage}/>
                      <div>{v.name}</div>
                      <div>￥{v.price / 100.0}</div>
                    </div>
                  ))}
                </div>
              </div> : null
            }

            <div className={style.dialogCover} style={{display: 'none'}}/>

            <div className={style.couponDialogBox} style={{display: 'none'}}>
              <div className={style.couponDialog}>
                <div className={style.dialogTitle}>领取优惠券</div>

                <div className={style.dialogBody}>
                  <div className={style.dialogBodyTitle}>
                    <img alt='' src={logo} className={style.dialogBodyLogo}/>
                    <div className={style.dialogBodyName}>摇滚米粒</div>
                  </div>

                  <div className={style.couponList}>
                    <Coupon type={'1'} name={'现金券'}/>
                    <Coupon type={'2'} name={'鱼香肉丝赠品券'}/>
                    <Coupon type={'1'} name={'现金券'}/>
                    <Coupon type={'1'} name={'现金券'}/>
                    <Coupon type={'1'} name={'现金券'}/>
                    <Coupon type={'1'} name={'现金券'}/>
                  </div>
                </div>

              </div>
            </div>

          </div> : <Loading/>
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    locate: state.locate,
    carts: state.carts.carts,
    more: []
  };
};

function mapDispatchToProps(dispatch) {
  return {
    initCarts: (carts) => dispatch(actions.initCarts(carts)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Cart);