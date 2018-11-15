import React from 'react'

import {Link} from 'react-router-dom'

import style from './Footer.module.css'

import nav_btn_01_a from '../../static/images/nav/nav_01_a.png'
import nav_btn_01_i from '../../static/images/nav/nav_01_i.png'
import nav_btn_02_a from '../../static/images/nav/nav_02_a.png'
import nav_btn_02_i from '../../static/images/nav/nav_02_i.png'
import nav_btn_03_a from '../../static/images/nav/nav_03_a.png'
import nav_btn_03_i from '../../static/images/nav/nav_03_i.png'
import nav_btn_04_a from '../../static/images/nav/nav_04_a.png'
import nav_btn_04_i from '../../static/images/nav/nav_04_i.png'

export default ({index}) => (
  <div className={style.footer}>
    <Link className={index === 1 ? style.active : style.inactive} to={`/front/`}>
      {index === 1 ? <img src={nav_btn_01_a} alt=""/> : <img src={nav_btn_01_i} alt=""/>}
      <div>首页</div>
    </Link>

    <Link className={index === 2 ? style.active : style.inactive} to={`/front/coupons/`}>
      {index === 2 ? <img src={nav_btn_02_a} alt=""/> : <img src={nav_btn_02_i} alt=""/>}
      <div>美食街</div>
    </Link>

    <Link className={index === 3 ? style.active : style.inactive} to={`/front/orders/`}>
      {index === 3 ? <img src={nav_btn_03_a} alt=""/> : <img src={nav_btn_03_i} alt=""/>}
      <div>订单</div>
    </Link>

    <Link className={index === 4 ? style.active : style.inactive} to={`/front/my/`}>
      {index === 4 ? <img src={nav_btn_04_a} alt=""/> : <img src={nav_btn_04_i} alt=""/>}
      <div>我的</div>
    </Link>
  </div>
);