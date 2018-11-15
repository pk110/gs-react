import React, {Component} from 'react';

import {connect} from 'react-redux';

import {actions} from './store';

import btn_close from '../../static/images/btn_close.png';
import icon_share from '../../static/images/icon_share.png';

import style from './Coupons.module.sass';
import {kitchen, wx} from "../../utils";
import Coupon from "../../components/Coupon/Coupon";

class Coupons extends Component {

  handleCouponShare = (e) => {
    const cid = e.target.dataset.cid;

    this.setState({sharing: true});

    console.log("分享优惠券: ", e.target.dataset.cid);

    kitchen.shareCoupon(cid).then(data => {
      console.log(data);
      wx.setShareUrl({
        title: `这是分享优惠券的链接`,
        desc: "分享优惠券",
        link: `https://h5.yanss.cn/front/coupon/grab/${cid}`,
        imgUrl: "https://yanss-kitchen.oss-cn-beijing.aliyuncs.com/logo/logo.jpg",
      });

      this.setState({
        dialog: true,
        sharing: false
      })
    });


  };
  onCouponUse = (c) => {
    console.log("使用优惠券: ", c);
  };

  onShareDialogClose = () => {
    this.setState({
      dialog: false
    })
  };

  handleBarClick = (e) => {
    const index = Number(e.target.dataset.index);

    console.log(index);

    this.setState({
      index
    });
  };
  updateStatusCallback = () => {
    this.props.shared.filter(x => x.receiver.status === 1).forEach(v => {
      if (v.receiver.overdue) {
      }
    })
  };
  tabStyle = (i) => {
    return this.state.index === i ? style.active : style.inactive;
  };

  constructor() {
    super();

    this.state = {
      index: 1,
      dialog: false,
      sharing: false,
    }
  }

  componentDidMount() {
    kitchen.getCoupons('0').then(data => {
      this.props.initCoupons(data);

      if (data.shared.filter(x => x.receiver.status === 1).length > 0) {
        this.iv = setInterval(this.updateStatusCallback, 1000);
      }
    });
  }

  componentWillUnmount() {
    if (this.iv) {
      clearInterval(this.iv);
    }
  }

  render() {
    const {dialog, sharing, index} = this.state;

    const {coupons, shared, received} = this.props;

    return (
      <div className={style.box}>
        <div className={style.scroll}>
          <div className={style.titleBar}>
            <div data-index="1" onClick={this.handleBarClick} className={this.tabStyle(1)}>全部</div>
            <div data-index="2" onClick={this.handleBarClick} className={this.tabStyle(2)}>送出的</div>
            <div data-index="3" onClick={this.handleBarClick} className={this.tabStyle(3)}>好友赠送的</div>
          </div>

          <div className={style.list}>
            {index === 1 ?
              coupons.map((v, i) => (
                <Coupon key={i} {...v} onShare={this.handleCouponShare} onUse={this.onCouponUse}/>
              )) : null
            }
            {index === 2 ?
              shared.map((v, i) => (
                <Coupon key={i} {...v} onShare={this.handleCouponShare} onUse={this.onCouponUse}/>
              )) : null
            }
            {index === 3 ?
              received.map((v, i) => (
                <Coupon key={i} {...v} onShare={this.handleCouponShare} onUse={this.onCouponUse}/>
              )) : null
            }
          </div>
        </div>

        {dialog ?
          <div className={style.shareDialog}>
            <img src={icon_share} alt=""/>
            <img src={btn_close} onClick={this.onShareDialogClose} alt=""/>
          </div> : null
        }

        {sharing ?
          <div className={style.sharing}>正在生成分享链接</div> : null
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  console.log(state);

  return {
    coupons: state.coupon.coupons,
    shared: state.coupon.shared,
    received: state.coupon.received,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    initCoupons: (data) => dispatch(actions.initCoupons(data)),
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Coupons);