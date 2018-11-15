import React, {Component, Fragment} from 'react'

import style from './PaymentDetail.module.sass'
import logo from "../../../static/images/logo.png";

import {kitchen, wx} from '../../../utils/index'

import icon_share from '../../../static/images/gift/share.png'
import icon_share_dialog from '../../../static/images/gift/dialog.png'

class PaymentDetail extends Component {

  handleShareButtonClick = () => {
    this.setState({dialog: {share: true}});
    wx.setShareUrl({
      title: `这是抢礼盒的链接！`,
      desc: "有一定的几率获得成长菜",
      link: `https://h5.yanss.cn/front/gift/grab/${this.state.gift.giftId}`,
      imgUrl: "https://yanss-kitchen.oss-cn-beijing.aliyuncs.com/logo/logo.jpg",
    });
  };

  constructor(props) {
    super(props);

    this.state = {
      cart: {products: [], price: {box: 500, total: 600, send: 500, origin: 1000}},
      shop: {name: '摇滚米粒'},
      dialog: {share: false},
      gift: {giftId: '', status: 0}
    }
  }

  componentDidMount() {
    const orderId = this.props.match.params.orderId;
    if (orderId) {
      kitchen.createGift(orderId).then(({giftId, status}) => {
        this.setState({gift: {giftId, status}});
      }).catch(() => console.log('生成礼盒失败'));
    }
  }

  render() {
    const {cart, shop} = this.state;

    return (
      <div className={style.box}>
        <div className={style.scroll}>
          <div className={style.payment}>
            <div className={style.orderStatus}>已支付</div>

            <div className={style.receiveTime}>
              <div className={style.sendTime}>预计12：20送达</div>
              <div className={style.buttons}>
                <button className={style.newOrder}>再来一单</button>
                <button className={style.contact}>联系商家</button>
              </div>
            </div>

            <div className={style.products}>
              <div className={style.shop}>
                <img alt='' src={logo} className={style.sLogo}/>
                <div className={style.sName}>{shop.name}</div>
              </div>

              {cart.products.map(v => (
                <div key={v.skuId} className={style.product}>
                  <div className={style.pName}>{v.name}</div>
                  {v.coupons.length > 0 ?
                    <div className={style.pCoupons}>折扣券x{v.coupons.length}</div> : null
                  }
                  <div className={style.pCount}>x{v.count}</div>
                  <div className={style.pPrice}>￥{v.price.food / 100.0}</div>
                </div>
              ))}

              <div className={style.product}>
                <div className={style.pName}>包装费</div>
                <div className={style.pPrice}>￥{cart.price.box / 100.0}</div>
              </div>

              <div className={style.product}>
                <div className={style.pName}>配送费</div>
                <div className={style.pPrice}>￥{cart.price.send / 100.0}</div>
              </div>

              <div className={style.pTotal}>
                <div className={style.tName}>小计</div>
                <div className={style.tPrice}>￥{cart.price.origin / 100.0}</div>
              </div>
            </div>

            <div className={style.coupons}>
              <div className={style.cTitle}>合计价格</div>
              <div className={style.coupon}>
                <div className={style.cName}>meicaiss</div>
                <div className={style.cPrice}>￥{cart.price.box / 100.0}</div>
              </div>

              <div className={style.cTotal}>
                <div className={style.cTName}>实付合计</div>
                <div className={style.cTPrice}>￥{cart.price.total / 100.0}</div>
              </div>
            </div>

            <div className={style.itemGroup}>
              <div className={style.title}>配送信息</div>
              <div className={style.item}>
                <div className={style.key}>送达时间</div>
                <div className={style.value}>尽快送达12:20</div>
              </div>
              <div className={style.item}>
                <div className={style.key}>配送地址</div>
                <div className={style.value}>
                  <div className={style.addressName}> 新华路18号</div>
                  <div className={style.addressDetail}>庭瑞大厦18楼</div>
                  <div className={style.receiver}>钱靖 133333333</div>
                </div>
              </div>
            </div>

            <div className={style.itemGroup}>
              <div className={style.title}>订单信息</div>
              <div className={style.item}>
                <div className={style.key}>订单号</div>
                <div className={style.value}>尽快送达 12:20</div>
              </div>
              <div className={style.item}>
                <div className={style.key}>下单时间</div>
                <div className={style.value}>2018/03/12 12:20</div>
              </div>
              <div className={style.item}>
                <div className={style.key}>口味</div>
                <div className={style.value}>不要辣</div>
              </div>
              <div className={style.item} style={{border: 'none'}}>
                <div className={style.key}>餐具</div>
                <div className={style.value}>4人份</div>
              </div>
            </div>

            <div className={style.tips}>如需发票请联系客服</div>

          </div>
        </div>

        {/*发送礼盒的悬浮按钮*/}
        {this.state.gift.giftId !== '' ?
          <div className={style.share} onClick={this.handleShareButtonClick}>
            <img src={icon_share} alt='' className={style.shareIcon}/>
          </div> : null
        }

        {/*分享礼盒的弹窗*/}
        {this.state.dialog.share ?
          <Fragment>
            <div className={style.dialogCover}/>
            <div className={style.shareDialog}>
              <img src={icon_share_dialog} alt='' className={style.shareDialogImage}/>
            </div>
          </Fragment> : null
        }

      </div>
    );
  }
}

export default PaymentDetail;