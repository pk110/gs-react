import React from 'react';
import PropTypes from 'prop-types';

import style from './RedPackage.module.sass';

import red_package from '../../../../static/images/coupon/coupon_red_package.png';

const RedPackage = props => {
  return (
    <div className={style.redPackage}>
      <img alt='' src={red_package}/>
    </div>
  );
};

RedPackage.propTypes = {
  money: PropTypes.number.isRequired,
};

export default RedPackage;