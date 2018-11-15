import React, {Component} from 'react'

import {connect} from 'react-redux'

import {actions} from '../../store'
import style from './Locate.module.css'

import arrow from '../../static/images/locate/arrow.png'
import close from '../../static/images/locate/close.png'
import normal from '../../static/images/locate/address.png'
import current from '../../static/images/locate/current.png'
import {locate} from "../../utils";


const getDistance = d => d.replace(/([0-9]+)\.[0-9]*/, '$1');

const AddressUI = (props) => (
  <div className={style.addressItem} onClick={props.onClick}>
    <div className={style.addressIcon}>
      {props.index === 0 ?
        <img alt='' src={current} className={style.addressImage}/> :
        <img alt='' src={normal}/>
      }
    </div>
    <div className={style.addressInfo}>
      <div className={style.addressName}>
        {props.name}

        {props.distance !== 0 ?
          <div className={style.addressDistance}>{getDistance(props.distance)}m</div> : null
        }
      </div>
      <div className={style.addressDetail}>{props.address}</div>
    </div>
  </div>
);


class Address extends Component {
  handleClick = () => {
    this.props.onClick({
      name: this.props.name,
      location: this.props.location,
      address: this.props.address,
    });

    this.props.goBack();
  };

  render() {
    return (<AddressUI {...this.props} onClick={this.handleClick}/>);
  }
}

class Locate extends Component {

  goBack = () => {
    console.log('go back');
    this.props.history.goBack();
  };
  selectAddress = (address) => {
    const {edit} = this.props.location.state || {edit: false};
    if (edit) {
      this.props.selectAddressToEdit(address);
    } else {
      this.props.selectAddressToIndex(address);
    }
  };
  handleSearchFocus = () => {
    this.setState({search: true});
  };
  handleSearchChange = event => {
    locate.search(event.target.value).then(data => {
      console.log('搜索完成!!!', data);
      this.props.setSearchResult(data);
    });
  };

  // handleSearchBlur = () => {
  //   this.setState({search:false});
  // };

  constructor(props) {
    super(props);

    this.state = {
      search: false
    }
  }

  render() {
    return (
      <div className={style.box}>
        <div>
          <div className={style.title}>
            <div className={style.input}>
              <div className={style.city}>
                <div className={style.cityName}>{this.props.city}</div>
                <img alt='' src={arrow} className={style.cityArrow}/>
              </div>
              <input type="text"
                     placeholder='输入小区名/写字楼/学校等'
                     onFocus={this.handleSearchFocus}
                     onChange={this.handleSearchChange}
                     onBlur={this.handleSearchBlur}
                     className={style.search}/>

              <img alt="" src={close} className={style.close}/>
            </div>

            <div className={style.cancel} onClick={this.goBack}>取消</div>
          </div>
        </div>


        <div className={style.bottom}>
          <div className={style.scroll}>
            {this.state.search ?
              <div className={style.addressList}>
                {this.props.search.map((v, i) => (
                  <div key={v.id}>
                    <Address index={i} {...v} goBack={this.goBack} onClick={this.selectAddress}/>
                  </div>
                ))}
              </div> :
              <div className={style.addressList}>
                {this.props.addresses.map((v, i) => (
                  <div key={v.id}>
                    <Address index={i} {...v} goBack={this.goBack} onClick={this.selectAddress}/>
                  </div>
                ))}
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    city: state.locate.city,
    addresses: state.locate.near.addresses,
    cities: state.locate.cities,
    position: state.locate.position,
    address: state.locate.address,
    search: state.locate.search,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    selectAddressToIndex: (address) => dispatch(actions.selectAddressToIndex(address)),
    selectAddressToEdit: (address) => dispatch(actions.selectAddressToEdit(address)),
    setSearchResult: (result) => dispatch(actions.setSearchResult(result)),
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Locate);