import React, {Component, Fragment} from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'

import Carousel from 'nuka-carousel'

import {actions} from './store'

import style from './Home.module.css'

import location_btn from '../../static/images/index/location.png'
import label_brand from '../../static/images/index/label_brand.png'
import icon_hot from '../../static/images/index/hot.png'
import close from '../../static/images/index/close_a.png'
import dialog_title_b from '../../static/images/index/dialog_title_b.png'
import icon_cart from '../../static/images/index/cart.png';
import icon_coupons from '../../static/images/index/coupons.png';

import {kitchen} from "../../utils";
import Footer from "../../components/Footer/Footer";
import Loading from "../../components/Loading/Loading";

class Home extends Component {

  handlePopularClick = (pos, bid) => {
    this.props.history.push({
      pathname: `/front/shop/${bid}`,
      state: {pos}
    })
  };
  handleDialogClose = () => {
    this.setState({
      dialog: false
    })
  };

  constructor(props) {
    super(props);

    this.state = {
      dialog: false,
      loading: false,
    }
  }

  componentDidMount() {

    kitchen.getIndexByCity('C430000').then(data => {
      console.log(data);

      this.props.initHomePage(data);
    });

    console.log('aaa');

    kitchen.getIndexCoupons().then(data => {
      console.log(data);

      this.props.initHomeCoupons(data);
    });
  }

  render() {
    const {banners, labels, populars} = this.props;
    const {initialized} = this.props;

    return (
      <div className={style.box}>
        {initialized ?
          <Fragment>
            <div className={style.scroll}>

              {/* 定位搜索 */}
              <div className={style.location}>
                <img src={location_btn} alt="" className={style.locationBtn}/>
                <div className={style.locationName}>
                  <Link to='/front/home/locate'>
                    {this.props.address}
                  </Link>
                </div>
                {/*<input type="text" placeholder='搜索品牌、商品名称' className={style.locationSearch}/>*/}
              </div>


              {/* 菜品标签 */}
              <div className={style.labels}>
                <div>
                  <img className={style.labelImage} src={label_brand} alt="图片"/>
                  <div className={style.labelName}>{"品牌"}</div>
                </div>

                {labels.map((v, i) => (
                  <div key={i}>
                    <img className={style.labelImage} src={v.image} alt="图片"/>
                    <div className={style.labelName}>{v.name}</div>
                  </div>
                ))}
              </div>

              {/* banner */}
              <div className={style.banners}>
                <Carousel autoplay={banners.length > 1} wrapAround={banners.length > 1} withoutControls={true}>
                  {banners.map((v, i) => (
                    <a href={v.url} key={i} className={style.banner}>
                      <img src={v.image} className={style.bannerImage} alt=""/>
                    </a>
                  ))}

                  {banners.length === 0 ? <div className={style.banner}/> : null}
                </Carousel>
              </div>

              <div className={style.line}/>

              {/* 人气网红 */}
              <div className={style.popular}>
                <div className={style.popularTitle}>
                  <img src={icon_hot} alt="" className={style.popularTitleImage}/>
                </div>

                {populars.map((v, i) => (
                  <div key={i} style={{marginBottom: '0.3rem', overflow: 'hidden'}}>
                    <div style={{padding: '0 0.22rem'}}>
                      <img src={v.banner} alt="" className={style.popularBannerImage}/>
                    </div>

                    <div className={style.popularProductList}>
                      {v.products.map((v, i) => (
                        <div key={i}>
                          <div className={style.popularProduct} onClick={() =>
                            this.handlePopularClick(this.props.position, v.bid)
                          }>
                            <img src={v.image} alt="" className={style.popularProductImage}/>
                            <div className={style.popularProductName}>{v.name}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div style={{height: "1.1rem"}}/>
              </div>
            </div>

            <div className={style.dialogCover} style={{display: this.state.dialog ? 'block' : 'none'}}/>

            <div className={style.dialog} style={{display: this.state.dialog ? 'block' : 'none'}}>
              <div className={style.dialogBox}>
                <div className={style.dialogWrap}>
                  <div className={style.dialogBody}>
                    <img alt='' src={dialog_title_b} className={style.dialogContextImage}/>
                    <div className={style.dialogContextCoupon}/>
                    <div className={style.dialogContextCoupon}/>
                  </div>
                  <img alt='' className={style.dialogClose} src={close} onClick={this.handleDialogClose}/>
                </div>
              </div>
            </div>

            <div className={style.cart}>
              <div className={style.couponsIcon}>
                <Link to={'/front/coupons'}>
                  <img src={icon_coupons} alt=''/>
                  <div>{this.props.coupons.count}</div>
                </Link>
              </div>

              <div className={style.cartIcon}>
                <Link to={'/front/cart'}>
                  <img src={icon_cart} alt=''/>
                  <div>{this.props.coupons.count}</div>
                </Link>
              </div>

            </div>

            <Footer index={1}/>
          </Fragment> : <Loading/>
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    address: state.locate.manual.address || state.locate.address,
    position: state.locate.manual.position || state.locate.position,
    banners: state.home.banners,
    labels: state.home.labels,
    populars: state.home.populars,
    initialized: state.home.initialized,
    coupons: state.home.coupons,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    initHomePage: data => dispatch(actions.initHomePage(data)),
    initHomeCoupons: data => dispatch(actions.initHomeCoupons(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);