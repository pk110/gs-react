import React, {Component} from 'react';
import Toast from 'antd-mobile/lib/toast';
import {connect} from 'react-redux';

import {actions} from '../Address/store';

import {kitchen} from '../../utils';

import style from './AddressEdit.module.css';
import 'antd-mobile/lib/toast/style/css';

import del from '../../static/images/address/del.png';
import set from '../../static/images/address/set.png';

class AddressEdit extends Component {

  handleGenderF = () => {
    this.props.handleGenderChange('0');
  };

  handleGenderM = () => {
    this.props.handleGenderChange('1');
  };

  handleAddressSelect = () => {
    this.props.history.push({pathname: '/front/home/locate', state: {edit: true}});
  };

  handleAddressSave = () => {
    const {cid} = this.props.address.edit || this.props.location.state || {cid: 0};

    const {name, gender, phone} = this.props.address.edit;
    const {name: addressName, address, detail: addressDetail, lng, lat} = this.props.address.edit.address;

    if (name !== '' && phone !== '') {
      if (this.commitBtn) {
        this.commitBtn.disabled = true;
      }

      if (cid === 0) {
        Toast.info('正在添加地址信息');
        kitchen.createAddress({name, phone, gender, address, addressName, addressDetail, lng, lat, tags: ''})
          .then(data => {
            if (data === 'ok') {
              Toast.hide();
              this.props.history.goBack();
            }
          });
      } else {
        Toast.info('正在更新地址信息');
        kitchen.updateAddress({cid, name, phone, gender, address, addressName, addressDetail, lng, lat, tags: ''})
          .then(data => {
            if (data === 'ok') {
              Toast.hide();
              this.props.history.goBack();
            }
          });
      }

      if (this.commitBtn) {
        this.commitBtn.disabled = false;
      }
    } else {
      Toast.fail('信息不能为空');
    }
  };

  render() {
    const {name, gender, phone, address} = this.props.address.edit;

    return (
      <div className={style.box}>
        <div className={style.del}>
          <img alt='' src={del} className={style.delImage}/>
          删除
        </div>

        <div className={style.context}>

          <div className={style.name}>
            <div className={style.itemKey}>
              <label className={style.itemName}>联系人</label>
            </div>
            <div className={style.itemValue}>
              <input placeholder={'点击输入姓名'} type='text' value={name} onChange={this.props.handleNameChange}/>
            </div>
          </div>

          <div className={style.gender}>
            <button className={gender === '1' ? style.active : ''} onClick={this.handleGenderM}>先生</button>
            <button className={gender === '0' ? style.active : ''} onClick={this.handleGenderF}>女士</button>
          </div>

          <div className={style.phone}>
            <div className={style.itemKey}>
              <div className={style.itemName}>手&nbsp;&nbsp;&nbsp;&nbsp;机</div>
            </div>
            <div className={style.itemValue}>
              <input type='number' value={phone} placeholder={'请输入手机号'} onChange={this.props.handlePhoneChange}/>
            </div>
          </div>

          <div className={style.address} onClick={this.handleAddressSelect}>
            <div className={style.itemKey}>地&nbsp;&nbsp;&nbsp;&nbsp;址</div>
            <div className={style.itemValue}>
              <div className={style.addressInfo}>
                <div className={style.addressContent}>
                  <div>{address.name}</div>
                  <div>{address.address}</div>
                </div>
                <img src={set} alt='' className={style.set}/>
              </div>
            </div>
          </div>

          <div className={style.addressDetail}>
            <div className={style.itemKey}>
              <div className={style.itemName}>门牌号</div>
            </div>
            <div className={style.itemValue}>
              <input type='text' value={address.detail} placeholder={'例如: 2号楼402室'}
                     onChange={this.props.handleDetailChange}/>
            </div>
          </div>

        </div>

        <div className={style.save}>
          <button ref={n => this.commitBtn = n} onClick={this.handleAddressSave}>保存</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    address: state.address,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleNameChange: (event) => dispatch(actions.changeName(event.target.value)),
    handlePhoneChange: (event) => dispatch(actions.changePhone(event.target.value)),
    handleDetailChange: (event) => dispatch(actions.changeDetail(event.target.value)),
    handleGenderChange: (gender) => dispatch(actions.changeGender(gender)),
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddressEdit);