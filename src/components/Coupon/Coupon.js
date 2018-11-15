import React from 'react'
import PropTypes from 'prop-types';

import style from "./Coupon.module.sass"
import icon_coupon_g from '../../static/images/coupon/coupon_gifts.png'
import icon_coupon_b from '../../static/images/coupon/coupon_red_package.png'
import icon_coupon_d from "../../static/images/coupon/coupon_discount.png";
import icon_coupon_v from '../../static/images/coupon/coupon_v.png';

// export default class CouponA extends Component {
//
//   couponImage = () => {
//     switch (this.state.effects[0].keys) {
//       case 'brandId':
//       case 'redPackage':
//         return (<img className={style.couponImage} src={coupon_red_package} alt=""/>);
//       case 'discount':
//         return (<img className={style.couponImage} src={coupon_discount} alt=""/>);
//       case 'gifts':
//         return (<img className={style.couponImage} src={coupon_gifts} alt=""/>);
//       case 'vouchers':
//         return (<img className={style.couponImage} src={coupon_vouchers} alt=""/>);
//       default :
//         return null;
//     }
//   };
//   couponImageInfo = () => {
//     switch (this.state.effects[0].keys) {
//       case 'brandId':
//       case 'redPackage':
//         return (<div className={style.discount}>{this.state.effects[0].value[0] / 100.0}<span>元</span></div>);
//       case 'discount':
//         return (<div className={style.discount}>{this.state.effects[0].value[0] / 10.0}<span>折</span></div>);
//       case 'gifts':
//         return (<div className={style.gifts}>赠送</div>);
//       case 'vouchers':
//         return (<div className={style.vouchers}>免费</div>);
//       default :
//         return null;
//     }
//   };
//   couponInfo = () => {
//     switch (this.state.effects[0].keys) {
//       case 'discount':
//         return (<div className={style.price}>￥20<span className={style.originPrice}>原价Y25</span></div>);
//       case 'gifts':
//         return (<div className={style.note}>赠送: <span>{this.state.effects[0].value[0].name}</span></div>);
//       default:
//         return null;
//     }
//   };
//   couponSelector = () => {
//     switch (this.state.selector[0].keys) {
//       case 'brand':
//         return (<div className={style.couponCondition}>只对相应品牌使用<span className={style.time}>剩2天</span></div>);
//       default:
//         return (<div className={style.couponCondition}>无门槛使用<span className={style.time}>剩2天</span></div>);
//     }
//   };
//
//   constructor(props) {
//     super();
//
//     this.state = {
//       cid: props.cid,
//       couponClassId: props.couponClassId,
//       effects: props.effects,
//       name: props.name,
//       selector: props.selector,
//       toleration: props.toleration,
//       receive: {status: 'none'},
//       share: {status: 'none'}
//     }
//   }
//
//   render() {
//     const {name, share, receive} = this.state;
//     return (
//       <div className={style.box}>
//
//         {/*分享状态*/}
//         {share && share.status !== 'none' ?
//           <div className={style.send}>
//             {share.status === 'received' ?
//               <div style={{width: '100%', display: 'flex'}}>
//                 <img src={head} alt="" className={style.logo}/>
//                 <span className={style.receiverName}>{share.to.name}</span>
//                 <span className={style.receiverNote}>接收你的赠送</span>
//                 <span className={style.received}>已领取</span>
//               </div> : <span className={style.sending}>未领取</span>
//             }
//           </div> : null
//         }
//
//         {receive && receive.status !== 'none' ?
//           <div className={style.send}>
//             <div style={{width: '100%', display: 'flex'}}>
//               <img src={head} alt="" className={style.logo}/>
//               <span className={style.receiverName}>{receive.from.name}</span>
//               <span className={style.receiverNote}>的赠送</span>
//               <span className={style.received}>已领取</span>
//             </div>
//           </div> : null
//         }
//
//         <div className={style.coupon}>
//
//           <div className={style.left}>
//             {this.couponImage()}
//             {this.couponImageInfo()}
//           </div>
//
//           <div className={style.center}>
//             <div className={style.name}>{name}</div>
//             {this.couponInfo()}
//             {this.couponSelector()}
//           </div>
//
//           <div className={style.right}>
//             {this.props.share && this.props.share.status === 'sending' ?
//               <div className={style.returnTime}>返回时间: 2:50:30</div> : null
//             }
//             <div style={{margin: 'auto'}}>
//
//               {!this.props.share || this.props.share.status === 'sending' ?
//                 <button className={style.gift}>赠送好友</button> : null
//               }
//
//               {!this.props.share ?
//                 <button className={style.use}>立即使用</button> : null
//               }
//             </div>
//           </div>
//
//         </div>
//       </div>
//     )
//   }
// }

const Receiver = props => (
  <div className={style.receiver}>
    {!props.status ? <img src={props.image} alt=""/> : null}
    {!props.status ? <div>{props.name}</div> : null}
    {!props.status ? <div>接收你的的赠送</div> : null}
    <div>{props.status ? '未领取' : <span>已领取</span>}</div>
  </div>
);

const Sender = props => (
  <div className={style.receiver}>
    <img src={props.image} alt=""/>
    <div>{props.name}</div>
    <div>的赠送</div>
    <div><span>已领取</span></div>
  </div>
);

const Buttons = props => (
  <div className={style.couponUse}>
    {props.receiver && props.receiver.status === 1 ?
      <div>返回时间 {props.receiver.overdue}</div> : null
    }
    {props.sharable && (!props.receiver || props.receiver.status === 1) ?
      <button className={style.gift} data-cid={props.cid} onClick={props.onShare}>赠送好友</button> : null
    }
    {!props.receiver ?
      <button className={style.use} data-cid={props.cid} onClick={props.onUse}>立即使用</button> : null
    }
  </div>
);

const Coupon = props => {
  switch (props.effects[0].keys) {
    case 'discount': {
      return (
        <div className={style.couponWarp}>

          {props.receiver ?
            <Receiver {...props.receiver}/> : null
          }

          {props.sender ?
            <Sender {...props.sender}/> : null
          }

          <div className={style.coupon}>
            <div>
              <img src={icon_coupon_d} alt=''/>
              <p>{props.effects[0].value / 10.0}<span>折</span></p>
            </div>

            <div className={style.couponName}>
              <p>{props.name}</p>
              <div>{props.effects[0].value / 10.0}折</div>
              <p>只对应相应品牌使用 <span>剩{props.dead}天</span></p>
            </div>

            <Buttons {...props} />
          </div>
        </div>
      );
    }

    case 'brandId': {
      return (
        <div className={style.couponWarp}>

          {props.receiver ?
            <Receiver {...props.receiver}/> : null
          }

          {props.sender ?
            <Sender {...props.sender}/> : null
          }

          <div className={style.coupon}>
            <div>
              <img src={icon_coupon_b} alt=''/>
              <p>{props.effects[0].value[0] / 100.0}<span>元</span></p>
            </div>

            <div className={style.couponName}>
              <p>{props.name}</p>
              <div>满{props.effects[0].value[1] / 100.0}元可用</div>
              <p>只对应相应品牌使用 <span>剩{props.dead}天</span></p>
            </div>

            <Buttons {...props} />
          </div>
        </div>
      );
    }

    case 'redPackage': {
      return (
        <div className={style.couponWarp}>

          {props.receiver ?
            <Receiver {...props.receiver}/> : null
          }

          {props.sender ?
            <Sender {...props.sender}/> : null
          }

          <div className={style.coupon}>
            <div>
              <img src={icon_coupon_b} alt=''/>
              <p>{props.effects[0].value[0] / 100.0}<span>元</span></p>
            </div>

            <div className={style.couponName}>
              <p>{props.name}</p>
              <div>无门槛使用</div>
              <p>只对应相应品牌使用 <span>剩{props.dead}天</span></p>
            </div>

            <Buttons {...props} />
          </div>
        </div>
      );
    }

    case 'gifts' : {
      return (
        <div className={style.couponWarp}>

          {props.receiver ?
            <Receiver {...props.receiver}/> : null
          }

          {props.sender ?
            <Sender {...props.sender}/> : null
          }

          <div className={style.coupon}>
            <div>
              <img src={icon_coupon_g} alt=''/>
              <h2>赠送</h2>
            </div>

            <div className={style.couponName}>
              <p>{props.name}</p>
              <div>赠送: {props.effects[0].value.map(x => x.name + "x" + x.count).reduce((x, y) => x + '、' + y)}</div>
              <p>只对应相应品牌使用 <span>剩{props.dead}天</span></p>
            </div>

            <Buttons {...props} />
          </div>
        </div>
      );
    }

    case 'vouchers': {
      return (
        <div className={style.couponWarp}>

          {props.receiver ?
            <Receiver {...props.receiver}/> : null
          }

          {props.sender ?
            <Sender {...props.sender}/> : null
          }

          <div className={style.coupon}>
            <div>
              <img src={icon_coupon_v} alt=''/>
              <h2>免费</h2>
            </div>

            <div className={style.couponName}>
              <p>{props.name}</p>
              <div/>
              <p>只对应相应品牌使用 <span>剩{props.dead}天</span></p>
            </div>

            <Buttons {...props} />
          </div>
        </div>
      );
    }

    default: {
      return null;
    }
  }
};

Coupon.propTypes = {
  onShare: PropTypes.func.isRequired,
  onUse: PropTypes.func.isRequired,
};

export default Coupon;