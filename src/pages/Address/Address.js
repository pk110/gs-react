import React, {Component} from 'react'

import {connect} from 'react-redux'

import {actions} from './store'

import style from './Address.module.css'

import edit from '../../static/images/address/edit.png'
import edit_inactive from '../../static/images/address/edit_inactive.png'

import {kitchen} from "../../utils";

class Address extends Component {

  handleClick = (address) => {
    if (this.props.match.params && this.props.match.params.sid && address.status) {
      this.props.selectAddress(address);
      this.props.history.goBack();
    }
  };
  handleAddressAdd = () => {
    this.props.addNewAddress();
    this.props.history.push({
      pathname: '/front/address/edit',
      state: {
        cid: 0
      }
    });
  };
  handleAddressEdit = (cid) => {
    this.props.editAddress(cid);
    this.props.history.push({
      pathname: '/front/address/edit',
      state: {
        cid
      }
    });
  };

  componentDidMount() {
    if (this.props.match.path === '/front/address/near/:sid') {
      const sid = this.props.match.params.sid;
      kitchen.getAddress(sid).then(data => this.props.listMemberAddress(data));
    } else {
      kitchen.getAllAddress().then(data => this.props.listMemberAddress(data));
    }
  }

  render() {
    return (
      <div className={style.box}>
        <div className={style.scroll}>
          <div style={{paddingTop: '0.3rem', paddingBottom: '1.5rem'}}>

            {this.props.address.list.map(v => (
              <div key={v.cid} className={style.addressItem}>
                {v.status ?
                  null : <div className={style.notInRange}>该地址不在服务范围</div>
                }
                <div className={v.status ? style.item : style.itemInactive}>

                  <div className={style.address} onClick={() => this.handleClick(v)}>
                    <div className={style.addressName}>{v.address.name}</div>
                    <div className={style.addressDetail}>{v.address.address} {v.address.detail}</div>
                    <div className={style.user}>{v.name} {v.gender === '1' ? '先生' : '女士'} {v.phone}</div>
                  </div>

                  <div className={style.edit}>
                    {v.status ?
                      <img src={edit} alt='' className={style.editImage}/> :
                      <img src={edit_inactive} alt='' className={style.editImage}/>
                    }
                    <div onClick={() => this.handleAddressEdit(v.cid)}>编辑</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={style.footer}>
          <div className={style.addAddress} onClick={this.handleAddressAdd}>添加地址</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    address: state.address,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    listMemberAddress: (data) => dispatch(actions.listMemberAddress(data)),
    selectAddress: (address) => dispatch(actions.selectAddress(address)),
    editAddress: (cid) => dispatch(actions.editAddress(cid)),
    addNewAddress: () => dispatch(actions.addNewAddress()),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Address);