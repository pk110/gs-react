import React, {Component} from 'react';
import {connect} from 'react-redux';

import {actions} from '../store';

import {kitchen} from '../../../utils';

import style from './GiftGrab.module.css';

import icon_box from '../../../static/images/gift/box.png';
import GiftDetail from "../GiftDetial/GiftDetail";

class GiftGrab extends Component {

  handleGiftBoxOpen = () => {
    const gid = this.props.match.params.gid;

    if (gid) {
      kitchen.grabGift(gid).then(data => {
        console.log(data);
        this.props.setGrabResult(data);
      });
    }
  };

  componentDidMount() {
    const gid = this.props.match.params.gid;

    if (gid) {
      kitchen.getGiftDetail(gid).then(data => {
        if (!data.status) {
          kitchen.grabGift(gid).then(data => {
            this.props.setGrabResult(data);
          });
        }
        this.props.initGiftStatus(data);
      })
    }
  }

  render() {
    return (
      <div className={style.box}>
        {this.props.gift.initialized && !this.props.gift.status ?
          <GiftDetail/> : null
        }

        {this.props.gift.initialized && this.props.gift.status ?
          <div className={style.gift}>
            <div className={style.giftWrap}>
              <div className={style.senderImage}>
                <img src={this.props.gift.sender.image} alt=''/>
              </div>
              <div className={style.senderName}>{this.props.gift.sender.name || 'a'}</div>
              <h3>一掷千金与众人同乐</h3>
              <p>yeah! 抢到一个礼盒!</p>
              <p>快试试自己的手气吧!</p>
              <div className={style.giftBox}>
                <img src={icon_box} alt=''/>
              </div>
              <button onClick={this.handleGiftBoxOpen}>打开礼盒</button>
            </div>
          </div> : null
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    gift: state.gift,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    initGiftStatus: (status) => dispatch(actions.initGiftStatus(status)),
    setGrabResult: (status) => dispatch(actions.setGrabGiftInfo(status)),
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GiftGrab);