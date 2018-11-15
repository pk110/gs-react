import React, {Component} from 'react'

import style from './OrderDetail.module.css'

import logo from '../../static/images/logo.png'

export default class OrderDetail extends Component {

  constructor() {
    super();

    this.state = {
      brand: {name: '摇滚米粒'},
      products: [
        {
          name: '梅菜扣肉',
          coupon: '折扣券x1',
          count: 2,
          price: 14.4,
        },
        {
          name: '番茄鸡蛋',
          // coupon: '折扣券x1',
          count: 1,
          price: 5,
        },
        {
          name: '梅菜扣肉',
          count: 1,
          price: 2,
        },
        {
          name: '梅菜扣肉',
          count: 1,
          price: 8,
        }
      ],
      coupons: [
        {
          name: '梅菜扣肉折扣券',
          count: 1,
          effect: 15
        }

      ]
    }
  }

  render() {
    return (
      <div className={style.box}>
        <div className={style.status}>
          商家已接单
          <div className={style.statusNote}>预计12:20送达</div>
        </div>

        <div className={style.map}>
          test
        </div>

        <div className={style.detail}>
          <div className={style.products}>

            <div className={style.brand}>
              <img alt='' src={logo} className={style.brandImage}/>
              <div className={style.brandName}>摇滚米粒</div>
            </div>

            {this.state.products.map((v, i) => (
              <div key={i} className={style.product}>
                <div className={style.productName}>{v.name}</div>
                <div className={style.productCoupon} style={{borderStyle: v.coupon ? 'solid' : 'none'}}>{v.coupon}</div>
                <div className={style.productCount}>x{v.count}</div>
                <div className={style.productPrice}
                     style={{color: v.coupon ? '#ff3b21' : '#000'}}>￥{v.count * v.price}</div>
              </div>
            ))}

            <div className={style.packagePrice}>
              <div className={style.productName}>餐盒费</div>
              <div className={style.productPrice}>￥100</div>
            </div>

            <div className={style.packagePrice}>
              <div className={style.productName}>配送费</div>
              <div className={style.productPrice}>￥100</div>
            </div>

            {this.state.coupons.map((v, i) => (
              <div key={i} className={style.packagePrice}>
                <div className={style.productName}>{v.name}</div>
                <div className={style.productCount}>x{v.count}</div>
                <div className={style.productPrice} style={{color: '#ff3b21'}}>-￥{v.effect}</div>
              </div>
            ))}

            <div className={style.total}>
              <div className={style.totalOriginPrice}>总计 <span>$33.6</span></div>
              <div className={style.totalDiscountPrice}>已优惠￥16</div>
              <div className={style.totalPrice}>实付合计<span>￥30.8</span></div>
            </div>

          </div>

          <div className={style.delivery}>
            <div className={style.infoTitle}>配送信息</div>
            <div className={style.infoItem}>
              <div className={style.infoKey}>送达时间</div>
              <div className={style.infoValue}>尽快送达 12:20</div>
            </div>
            <div className={style.infoItem} style={{border: 'none'}}>
              <div className={style.infoKey}>配送地址</div>
              <div className={style.infoValue}>
                <div style={{marginTop: '0.44rem'}}> 新华路18号</div>
                <div>庭瑞大厦18楼</div>
                <div>钱靖 133333333</div>
              </div>
            </div>
          </div>

          <div className={style.order}>
            <div className={style.infoTitle}>订单信息</div>
            <div className={style.infoItem}>
              <div className={style.infoKey}>订单号</div>
              <div className={style.infoValue}>尽快送达 12:20</div>
            </div>
            <div className={style.infoItem}>
              <div className={style.infoKey}>下单时间</div>
              <div className={style.infoValue}>2018/03/12 12:20</div>
            </div>
            <div className={style.infoItem}>
              <div className={style.infoKey}>口味</div>
              <div className={style.infoValue}>不要辣</div>
            </div>
            <div className={style.infoItem} style={{border: 'none'}}>
              <div className={style.infoKey}>餐具</div>
              <div className={style.infoValue}>4人份</div>
            </div>
          </div>

          <div className={style.tips}>如需发票请联系客服</div>
        </div>
        <div className={style.buttons}>
          <div style={{width: '0.45rem'}}/>
          <div className={style.callDelivery}>联系骑手</div>
          <div className={style.callStore}>联系商家</div>
          <div className={style.cancel}>取消订单</div>
        </div>
      </div>
    )
  }
}