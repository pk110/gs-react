import React, {Component, Fragment} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

import style from './GiftDetail.module.sass';

import icon_details from '../../../static/images/gift/detials.png';
import icon_rules from '../../../static/images/gift/rule.png';
import icon_qr from '../../../static/images/gift/qr.png';

import icon_coupon_d from '../../../static/images/coupon/coupon_discount.png';
import icon_coupon_b from '../../../static/images/coupon/coupon_red_package.png';
import icon_coupon_g from '../../../static/images/coupon/coupon_gifts.png';

class GiftDetail extends Component {

  getResultCoupon = (coupon) => {
    switch (coupon.effects[0].keys) {
      case 'discount': {
        return (
          <div className={style.couponDiscount}>
            <div>
              <img src={icon_coupon_d} alt=''/>
              <p>{coupon.effects[0].value / 10.0}<span>折</span></p>
            </div>
            <div className={style.couponName}>
              <p>{coupon.name}</p>
              <p>X1</p>
            </div>
            <div className={style.couponUse}>
              <p>已放入囤货库</p>
              <Link to={'/front/'}>立即使用</Link>
              <p>有效期<span>{coupon.effectiveDay}天</span></p>
            </div>
          </div>
        );
      }

      case 'brandId': {
        return (
          <div className={style.couponDiscount}>
            <div>
              <img src={icon_coupon_b} alt=''/>
              <p>{(coupon.effects[0].value[0] / 100.0).toFixed(1)}<span>元</span></p>
            </div>
            <div className={style.couponName}>
              <p>{coupon.name}</p>
              <p>X1</p>
            </div>
            <div className={style.couponUse}>
              <p>已放入囤货库</p>
              <Link to={'/front/'}>立即使用</Link>
              <p>有效期<span>{coupon.effectiveDay}天</span></p>
            </div>
          </div>
        );
      }

      case 'gifts': {
        return (
          <div className={style.couponDiscount}>
            <div>
              <img src={icon_coupon_g} alt=''/>
              <h2>赠送</h2>
            </div>
            <div className={style.couponName}>
              <p>{coupon.name}</p>
              <div>赠送: {coupon.effects[0].value.map(x => x.name + "x" + x.count).reduce((x, y) => x + '、' + y)}</div>
              <p>X1</p>
            </div>
            <div className={style.couponUse}>
              <p>已放入囤货库</p>
              <Link to={'/front/'}>立即使用</Link>
              <p>有效期<span>{coupon.effectiveDay}天</span></p>
            </div>
          </div>
        );
      }

      default :
        return null;
    }
  };

  render() {
    const {result, sender, subscribed, detail} = this.props;

    const banner = 'https://image.yanss.cn/banner/package_banner_01.png';

    return (
      <div className={style.box}>
        <div className={style.scroll}>

          {/*顶部Banner*/}
          <img src={banner} alt='' className={style.banner}/>

          {/*抢礼盒的结果*/}
          <div className={style.result}>
            {result.type === 'none' ?
              <Fragment>
                <div className={style.grabbed}>抢光啦! 下次加油吧~</div>
                <Link to={'/front/'}>
                  <div className={style.goStore}>看看我的囤货库</div>
                </Link>
              </Fragment> :
              <Fragment>
                <div className={style.item}>
                  {console.log(result)}
                  {result.type === 'coupon' ?
                    this.getResultCoupon(result.coupon) : null
                  }
                </div>

                <div className={style.grabbed}>耶! 抢到了{sender.name}送的礼盒惊喜啦~!</div>
                {subscribed ?
                  <Link to={'/front/'}>
                    <div className={style.goStore}>看看我的囤货库</div>
                  </Link> :
                  <div className={style.requestSubscribe}>
                    <img src={icon_qr} alt='' className={style.qr}/>
                    <div>
                      <p>恭喜你获得新人好礼</p>
                      <p>长按二维码关注『宴十三』</p>
                      <p>享用朋友的心意</p>
                    </div>
                  </div>
                }
              </Fragment>
            }

          </div>

          {/*结果列表*/}
          <div className={style.detail}>
            <img src={icon_details} alt='' className={style.detailTitle}/>

            {detail.map((v, i) => (
              <div key={i} className={style.detailItems}>
                <img alt='' src={v.image} className={style.detailImage}/>
                <div className={style.detailName}>
                  <p>{v.name}</p>
                  <p>{v.date}</p>
                </div>
                <div className={style.detailItem}> {v.item}</div>
              </div>
            ))}
          </div>

          {/*活动细则*/}
          <div className={style.rule}>
            <img src={icon_rules} alt='' className={style.ruleTitle}/>
            <p>1、奖池中共设有菜品及0.XX份成长菜品两种奖品，点击领取之后随即获得。每人每次只能获得一种奖品；</p>
            <p>2、领取某款指定菜品或套餐的用户，能以优惠价格享用；</p>
            <p>3、领取万能菜品的用户，可以在囤货库中选择任意菜品进行兑换，兑换之后以优惠价格支付即可享用；</p>
            <p>4、成长菜品可以累计，满整份即可享用；</p>
            <p>5、请在有效期内使用菜品；</p>
            <p>6、宴十三保留法律范围内允许的对活动的解释权。</p>
          </div>

          <div className={style.footer}>
            <div className={style.footerTitle}>关注公众号领取新人红包</div>
            <img src={icon_qr} alt='' className={style.footerQr}/>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    sender: state.gift.sender,
    result: state.gift.result,
    subscribed: state.user.subscribe,
    detail: state.gift.detail,
  };
}

export default connect(
  mapStateToProps,
)(GiftDetail);