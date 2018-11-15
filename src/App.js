import React, {Component} from 'react';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom'
import {Provider} from 'react-redux'
import Coupons from "./pages/Coupons/Coupons";
import User from "./pages/User/User";
import Orders from "./pages/Orders/Orders";
import OrderDetail from "./pages/OrderDetial/OrderDetail";
import Cart from "./pages/Cart/Cart";
import Home from "./pages/Home/Home";
import Locate from "./pages/Locate/Locate";
import Shop from "./pages/Shop/Shop";
import Pay from "./pages/Payment/Payment";

import {kitchen, locate, wx} from './utils'

import store from './store'
import Address from "./pages/Address/Address";
import GiftGrab from "./pages/Gift/GiftGrab/GiftGrab";
import AddressEdit from "./pages/AddressEdit/AddressEdit";
import BindPhone from "./pages/BindPhone/BindPhone";
import SharedCoupon from "./pages/Coupons/Shared/SharedCoupon";

// import Debug from 'vconsole';
// export const debug = new Debug();

class App extends Component {

  updateLocation = (res) => {
    console.log('获取到微信定位信息');

    const location = res.longitude + ',' + res.latitude;

    store.dispatch({
      type: 'init_location',
      payload: location,
    });

    console.log('获取定位点附近的地理信息');
    locate.reGeo(location).then(data => {
      console.log(data);

      store.dispatch({
        type: 'set_geo_address',
        payload: data.map(v => ({
          id: v.id,
          name: v.name,
          location: v.location,
          distance: v.distance,
          address: v.address,
        })),
      });
      return data
    });
  };

  updateUserInfo = data => {
    store.dispatch({
      type: 'update_user_info',
      payload: data,
    });
  };

  /**
   * @param {{updateAppMessageShareData,updateTimelineShareData,getLocation}}wxx
   */
  wxConfigCallBack = (wxx) => {
    // alert('微信配置成功');
    wxx.getLocation({
      type: 'gcj02',
      success: this.updateLocation,
    });

    wx.setShareUrl({
      title: `摇滚米粒礼盒限量抢啦，一起吃掉不开心！`,
      desc: "天大地大，吃货最大！摇滚米粒礼盒等你来拆~",
      link: `https://h5.yanss.cn/front/`,
      imgUrl: "https://yanss-kitchen.oss-cn-beijing.aliyuncs.com/logo/logo.jpg",
    });
  };

  componentDidMount() {
    kitchen.getUserInfo().then(data => this.updateUserInfo(data));
    wx.pageConfig(this.wxConfigCallBack);
  }

  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <Route exact path={'/front'} component={Home}/>
            <Route exact path={'/front/home'} component={Home}/>
            <Route path={'/front/home/locate'} component={Locate}/>
            <Route exact path={'/front/shop/:bid'} component={Shop}/>
            <Route path={'/front/shop/:bid/:sid'} component={Shop}/>
            <Route path={'/front/pay/:cid'} component={Pay}/>
            <Route path={'/front/paid/:orderId'} component={Pay}/>
            <Route path={'/front/gift/grab/:gid'} component={GiftGrab}/>
            <Route path={'/front/phone/bind'} component={BindPhone}/>
            <Route path={'/front/my'} component={User}/>
            <Route path={'/front/coupons'} component={Coupons}/>
            <Route path={'/front/coupon/grab/:cid'} component={SharedCoupon}/>
            <Route path={'/front/orders'} component={Orders}/>
            <Route path={'/front/order/detail'} component={OrderDetail}/>
            <Route path={'/front/cart'} component={Cart}/>
            <Route exact path={'/front/address'} component={Address}/>
            <Route exact path={'/front/address/near/:sid'} component={Address}/>
            <Route exact path={'/front/address/edit'} component={AddressEdit}/>
            <Redirect to={'/front'}/>
          </Switch>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
