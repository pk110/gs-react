import React from 'react';
import PropTypes from 'prop-types';

import style from './Discount.module.sass';

import icon_discount from '../../../../static/images/coupon/coupon_discount.png';

const Discount = props => {
  return (
    <div className={style.discount}>
      <img src={icon_discount} alt=''/>

    </div>
  );
};

Discount.propTypes = {
  discount: PropTypes.number.isRequired,
};

export default Discount;