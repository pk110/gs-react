import React, {Component} from 'react'
import {connect} from 'react-redux'

import {actions} from '../store/index'

import {kitchen} from '../../../utils/index'

import style from './PaymentCoupons.module.css'

import icon_checked from '../../../static/images/pay/checked.png'
import icon_unchecked from '../../../static/images/pay/unchecked.png'
import icon_coupon_a from '../../../static/images/pay/coupon_a.png'

class PaymentCoupons extends Component {


  checkedImage = (used, disable) => {

    if (used) {
      return <img alt='' src={icon_checked} className={style.checkedImage}/>
    }

    if (disable) {
      return null;
    }

    return <img alt='' src={icon_unchecked} className={style.checkedImage}/>
  };

  closeDialog = () => {
    console.log('使用优惠券');

    const {cart: {cartId}, coupons} = this.props.payment;

    const usedCoupons = coupons.filter(v => v.used).map(x => x.cid);

    kitchen.useCoupons(cartId, usedCoupons).then(data => this.props.useCoupons(data))

  };

  render() {
    const {coupons} = this.props.payment;

    return (
      <div className={style.box}>
        <div className={style.scroll}>
          <div>
            <div className={style.items}>
              <div className={style.itemNoUse} onClick={this.props.unCheckAll}>
                <div style={{margin: 'auto 0 auto 0.14rem', flex: 1}}>不使用优惠券</div>
                {coupons.filter(v => v.used).length === 0 ?
                  <img alt='' src={icon_checked} className={style.checkedImage}/> :
                  <img alt='' src={icon_unchecked} className={style.checkedImage}/>
                }
              </div>

              {coupons.map(({cid, name, dead, used, disabled}) => (
                <div key={cid} className={style.item} onClick={() => this.props.checkCoupon(cid)}>
                  <div className={style.coupon}>
                    <img alt='' src={icon_coupon_a} className={style.couponImage}/>
                    <div className={style.couponContext}>
                      <div className={style.couponName}>{name}</div>
                      <div className={style.couponNote}>满10元使用</div>
                      <div className={style.couponDate}>{dead}到期</div>
                    </div>
                  </div>

                  <div className={style.checked}>
                    {this.checkedImage(used, disabled)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={style.footer}>
          <div className={style.commit} onClick={this.closeDialog}>确认</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    payment: state.payment,
  }
};

const mapDispatchToProps = (dispatch) => ({
  useCoupons: (data) => dispatch(actions.useCoupons(data)),
  unCheckAll: () => dispatch(actions.unCheckAll()),
  checkCoupon: (cid) => dispatch(actions.checkCoupon(cid)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaymentCoupons);
