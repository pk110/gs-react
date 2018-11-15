import React, {Component, Fragment} from 'react'
import Toast from 'antd-mobile/lib/toast';

import {connect} from 'react-redux'

import {actions} from './store'

import style from './Payment.module.css'
import 'antd-mobile/lib/toast/style/css';

import into from '../../static/images/pay/into.png'

import logo from '../../static/images/logo.png'
import {kitchen, wx} from "../../utils";
import PaymentCoupons from "./PaymentCoupons/PaymentCoupons";

import icon_dialog_close from '../../static/images/pay/dialog_close.png'
import icon_people_p from '../../static/images/pay/people_p.png'
import icon_people_m from '../../static/images/pay/people_m.png'
import Loading from "../../components/Loading/Loading";

class Payment extends Component {
  handleOrderCreate = () => {
    const {cart, coupons, shop, people: count, receiveTime: index} = this.props.payment;
    const {cartId, price: {total: price}} = cart;

    const usedCoupons = coupons.filter(x => x.used).map(m => m.cid) || [];
    const {shopId: sid} = shop;

    if (!this.state.initialized || this.props.hasSoldOutOrDisable.length > 0) {
      Toast.info('商品售罄, 请返回购物车修改');
      return;
    }

    if (cartId && price && sid && count) {
      const params = {
        cartId,
        coupons: usedCoupons,
        price,
        delivery: 1,
        book: 1,
        sid,
        cid: this.props.address.cid,
        count,
        desc: '',
        time: this.props.receiveTime[index].valueOf(),
      };

      kitchen.createOrder(params)
        .then(data => {
          console.log('获取到订单预付款信息', data);

          const {timeStamp, signType, paySign, packageValue, nonceStr, orderId} = data;

          wx.pay(timeStamp, nonceStr, packageValue, signType, paySign)
            .then((data) => {
              Toast.info('支付成功');
              console.log(data);

              this.props.history.push(`/front/paid/${orderId}`);
            })
            .catch(({errMsg}) => {
              if (errMsg === 'chooseWXPay:cancel') {
                Toast.fail('支付取消');
              } else {
                Toast.fail('支付失败');
              }
              this.props.history.push(`/front/orders`);
            });
        }).catch(err => {
        Toast.fail('订单创建失败,' + err)
      });
    } else {
      console.log(cartId, price, sid, count);
      Toast.fail('订单参数错误');
    }
  };
  handleAddress = () => {
    if (!this.state.initialized || this.props.hasSoldOutOrDisable.length > 0) {
      Toast.info('商品售罄, 请返回购物车修改');
      return;
    }

    if (this.sid) {
      const {user} = this.props;
      if (user.phone) {
        this.props.history.push(`/front/address/near/${this.sid}`);
      } else {
        this.props.history.push({
          pathname: '/front/phone/bind',
          state: {
            sid: this.props.payment.shop.shopId
          }
        });
      }
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      initialized: false,
      loading: false,
    }
  }

  componentDidMount() {
    const cid = this.props.match.params.cid;

    if (cid) {
      kitchen.payCart(cid).then(data => {
        this.setState({initialized: true});
        this.props.initPage(data);
        return data;
      }).then(data => {
        this.sid = data.shop.shopId;
        return kitchen.getAddress(data.shop.shopId);
      }).then(data => this.props.listMemberAddress(data))
        .catch(err => {
          console.log(err);
          this.props.history.goBack();
        });
    } else {
      console.log('无法获得购物车ID');
      this.props.history.replace('/front/cart');
    }
  }

  render() {
    const {cart, coupons, shop, people, dialog, receiveTime} = this.props.payment;
    const {address} = this.props;
    const {peopleCountInc, peopleCountDec, selectReceiveTime} = this.props;

    return (
      <div className={style.box}>
        {this.state.initialized ?
          <Fragment>
            <div className={style.scroll}>

              {/*结算*/}
              <div className={style.payment}>
                <div className={style.address} onClick={this.handleAddress}>
                  {address && address.address ?
                    <div className={style.addressContext}>
                      <div className={style.addressName}>{address.address.name}</div>
                      <div className={style.addressInfo}>{address.address.detail}</div>
                      <div className={style.receiverInfo}>
                        <div>{address.name}</div>
                        <div>{address.gender === '1' ? '先生' : '女士'} </div>
                        <div>{address.phone}</div>
                      </div>
                    </div> : <div className={style.noAddress}>请先选择收货地址</div>
                  }
                  <img src={into} className={style.into} alt=''/>
                </div>

                {/*配送时间*/}
                <div className={style.time}>
                  <div className={style.itemName}>送达时间</div>
                  {address && address.address ?
                    <div onClick={this.props.showTimeDialog}>
                      预计送达 {this.props.receiveTime[receiveTime].toString().slice(15, 21)}
                    </div> : <div>请先选择收货地址</div>
                  }
                  <img src={into} className={style.into} alt=''/>
                </div>

                {cart.products.length > 0 ?
                  <div className={style.products}>
                    <div className={style.shop}>
                      <img alt='' src={logo} className={style.shopLogo}/>
                      <div className={style.shopName}>{shop.name}</div>
                    </div>

                    <div className={style.tips}>温馨提示：主食是单独点的哦!</div>
                    {cart.products.map(v => (
                      <div key={v.skuId} className={style.product}>
                        {console.log(v)}
                        <div className={style.productName}>
                          {v.name} {!v.status || v.stock <= 0 ? <span className={style.soldOut}>售罄</span> : null}
                        </div>
                        {v.coupons.length > 0 ?
                          <div className={style.productCoupons}>折扣券x{v.coupons.length}</div> : null
                        }
                        <div className={style.productCount}>x{v.count}</div>
                        <div className={style.productPrice}>￥{v.price.food / 100.0}</div>
                      </div>
                    ))}

                    <div className={style.product}>
                      <div className={style.productName}>包装费</div>
                      <div className={style.productPrice}>￥{cart.price.box / 100.0}</div>
                    </div>

                    <div className={style.product}>
                      <div className={style.productName}>配送费</div>
                      <div className={style.productPrice}>￥{cart.price.send / 100.0}</div>
                    </div>

                    <div className={style.total}>
                      <div className={style.productTotal}>总计</div>
                      <div className={style.productTotalPrice}>￥{cart.price.total / 100.0}</div>
                    </div>

                  </div> : null
                }

                {/*优惠券*/}
                <div className={style.coupons} onClick={this.props.showCouponsDialog}>
                  <div className={style.itemName}>优惠券</div>
                  {cart.coupons.length > 0 ?
                    <div className={style.couponPrice}>
                      -{cart.coupons.map(({facePrice}) => facePrice).reduce((a, b) => a + b) / 100.0}元
                    </div> :
                    <div className={style.couponCount}>可用{coupons.length || 0}个</div>
                  }
                  <img src={into} className={style.into} alt=''/>
                </div>

                {/*<div className={style.time}>*/}
                {/*<div className={style.itemName}>口味</div>*/}
                {/*<div>变态辣</div>*/}
                {/*<img src={into} className={style.into} alt=''/>*/}
                {/*</div>*/}

                <div className={style.time} onClick={this.props.showPeopleDialog}>
                  <div className={style.itemName}>餐具</div>
                  <div>{people > 0 ? people + '人' : '用餐人数'}</div>
                  <img src={into} className={style.into} alt=''/>
                </div>

                <div className={style.summary}>
                  <div style={{margin: 'auto 0.08rem auto 0.2rem'}}>合计</div>
                  <div className={style.totalPrice}>￥{cart.price.total / 100.0}</div>
                  <div className={style.pay} onClick={this.handleOrderCreate}>确认支付</div>
                </div>

              </div>

              {/*选择优惠券弹窗*/}
              {dialog.coupons ?
                <div className={style.couponDialog}>
                  <PaymentCoupons/>
                </div> : null
              }
            </div>

            {/*就餐人数选择*/}
            {dialog.people ?
              <Fragment>
                <div className={style.peopleDialogCover}/>
                <div className={style.peopleDialog}>
                  <div className={style.peopleDialogTitle}>
                    <div className={style.peopleDialogTitleName}>选择人数</div>
                    <img className={style.dialogClose} src={icon_dialog_close} alt='' onClick={this.props.closeDialog}/>
                  </div>
                  <div className={style.peopleDialogBody}>
                    <div className={style.peopleDialogContent}>
                      <img alt='' className={style.peopleCountDec} src={icon_people_m} onClick={peopleCountDec}/>
                      <div className={style.peopleCount}>{this.props.payment.people}人</div>
                      <img alt='' className={style.peopleCountInc} src={icon_people_p} onClick={peopleCountInc}/>
                    </div>
                  </div>
                  <div className={style.peopleDialogCommit} onClick={this.props.closeDialog}>确定</div>
                </div>
              </Fragment> : null
            }

            {/*配送时间选择*/}
            {dialog.time ?
              <Fragment>
                <div className={style.peopleDialogCover}/>
                <div className={style.peopleDialog}>
                  <div className={style.peopleDialogTitle}>
                    <div className={style.peopleDialogTitleName}>选择时间</div>
                    <img className={style.dialogClose} src={icon_dialog_close} alt='' onClick={this.props.closeDialog}/>
                  </div>

                  <div className={style.peopleDialogBody}>
                    <div className={style.sendTimeDialogContent}>
                      <div className={style.sendTimeDate}>
                        <div className={style.sendTimeDateItemActive}>今日(周六)</div>
                        <div className={style.sendTimeDateItem}>明日(周日)</div>
                      </div>
                      <div className={style.sendTimeTime}>
                        {this.props.receiveTime.map((v, i) => (
                          <div key={i} className={style.sendTimeTimeItem} data-index={i} onClick={selectReceiveTime}>
                            {i === 0 ? <label>尽快送达 | </label> : null}
                            <label>{'预计' + v.toString().slice(15, 21)}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Fragment> : null
            }

            {/*口味选择*/}
            {dialog.taste ?
              <Fragment>
                <div className={style.peopleDialogCover}/>
                <div className={style.peopleDialog}>
                  <div className={style.peopleDialogTitle}>
                    <div className={style.peopleDialogTitleName}>选择口味</div>
                    <img className={style.dialogClose} src={icon_dialog_close} alt='' onClick={this.props.closeDialog}/>
                  </div>
                  <div className={style.peopleDialogBody}>
                    <div className={style.tasteDialogContent}>
                      <div>口味</div>
                      <div>
                        <div>不要</div>
                      </div>
                    </div>
                  </div>
                  <div className={style.peopleDialogCommit} onClick={this.props.closeDialog}>确定</div>
                </div>
              </Fragment> : null
            }
          </Fragment> : <Loading/>
        }

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    locate: state.locate,
    payment: state.payment,
    address: state.address.select || state.address.list.filter(x => x.status)[0],
    receiveTime: [0, 1, 2, 3, 4].map(x => new Date(Date.now() + x * 900000 + state.payment.shop.receiveTime * 60000)),
    hasSoldOutOrDisable: state.payment.cart.products.filter(x => !x.status || x.stock <= 0),
    user: state.user,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    initPage: (data) => dispatch(actions.initPage(data)),
    showCouponsDialog: () => dispatch(actions.showCouponsDialog()),
    showPeopleDialog: () => dispatch(actions.showPeopleDialog()),
    showTimeDialog: () => dispatch(actions.showTimeDialog()),
    closeDialog: () => dispatch(actions.closeDialog()),

    listMemberAddress: (data) => dispatch(actions.listMemberAddress(data)),
    peopleCountInc: () => dispatch(actions.peopleCountInc()),
    peopleCountDec: () => dispatch(actions.peopleCountDec()),
    selectReceiveTime: (e) => dispatch(actions.selectReceiveTime(e.target.dataset.index)),
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Payment);