import React, {Component} from 'react';

import {Link} from 'react-router-dom';

import {kitchen} from '../../../utils';

import style from './SharedCoupon.module.sass';

import logo from '../../../static/images/logo.png';

import share_a from '../../../static/images/coupon/share_a.png';

class SharedCoupon extends Component {

  getCoupon = (coupon) => {

  };

  componentDidMount() {
    const cid = this.props.match.params.cid;

    kitchen.getSharedCoupon(cid).then(data => console.log(data));
  }

  render() {
    return (
      <div className={style.box}>
        <div className={style.sender}>
          <img src={logo} alt=''/>
        </div>
        <div className={style.senderName}>猫</div>

        <div className={style.info}>
          <img src={share_a} alt=''/>
          {/*<img src={share_b} alt=''/>*/}
          <div>

          </div>
        </div>

        <Link to={'/front/'}>去使用</Link>

      </div>
    );
  }
}

SharedCoupon.propTypes = {};

export default SharedCoupon;