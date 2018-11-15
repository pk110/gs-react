import React, {Component} from 'react'
import {OrderItem} from "../../components/OrderItem/OrderItem";
import Footer from "../../components/Footer/Footer";

import {connect} from 'react-redux';

import {actions} from './store';

import style from './Orders.module.css'
import {kitchen} from "../../utils";

class Orders extends Component {

  componentDidMount() {
    kitchen.getOrders().then(data => {
      console.log(data);

      this.props.initOrderList(data);
    })
  }

  render() {
    const {orders} = this.props;

    return (
      <div className={style.box}>
        <div className={style.scroll}>
          <div className={style.list}>
            {orders.map((v, i) => (
              <div key={i}>
                <OrderItem {...v}/>
              </div>
            ))}
          </div>
        </div>
        <Footer index={3}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    orders: state.order.orders,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    initOrderList: (data) => dispatch(actions.initOrderList(data)),
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Orders)