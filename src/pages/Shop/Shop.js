import React, {Component} from 'react'
import style from './Shop.module.sass'

import {connect} from 'react-redux'
import {kitchen} from "../../utils";

import Toast from 'antd-mobile/lib/toast';
import 'antd-mobile/lib/toast/style/css';

import coupon from '../../static/images/shop/coupon_a.png'
import icon_hot_title from '../../static/images/shop/hot.png'

import icon_back from '../../static/images/shop/back.png'
import icon_cart from '../../static/images/shop/cart.png'
import icon_cart_open from '../../static/images/shop/cart_open.png'
import icon_cart_clear from '../../static/images/shop/cart_clear.png'
import icon_cart_item_p from '../../static/images/shop/cart_item_p.png'
import icon_cart_item_m from '../../static/images/shop/cart_item_m.png'
import icon_add from '../../static/images/shop/add.png'
import icon_del from '../../static/images/shop/delete.png'
import dialog_close from '../../static/images/shop/dialog_close.png'
import {Link} from "react-router-dom";
import Loading from "../../components/Loading/Loading";

const Coupon = ({type}) => {
  if (type === 1) {
    return (
      <div className={style.couponA}>
        <img alt='' src={coupon} className={style.couponImage}/>
        <div className={style.couponDetail}>
          <div style={{margin: 'auto 0 0.25rem 0.2rem'}}>￥</div>
          <div style={{margin: 'auto 0 0.25rem', fontSize: '0.3rem'}}>18</div>
          <div style={{margin: 'auto auto 0.25rem 0.21rem'}}>满30可用</div>
          <div style={{margin: 'auto 0.27rem 0.25rem auto'}}>领取</div>
        </div>
      </div>
    );
  }
  return null;
};

const Product = ({name, image, intro, sales, sku, index = 0}) => (
  <div className={style.stackProduct}>
    <img alt='' src={image} className={style.stackProductImage}/>
    <div className={style.stackProductDescription}>
      <div className={style.stackProductName}>{index === 0 ? name : name + '(' + sku[index].name + ')'}</div>
      <div className={style.stackProductIntro}>{intro}</div>
      <div className={style.stackProductSales}>月销{sales}份</div>

      {sku.length > 0 ?
        <div className={style.stackProductPrice}>
          <div style={{display: 'inline', width: '1rem'}}>￥{sku[index].price.food / 100.0}</div>
          {sku[0].price.origin > 0 ?
            <div className={style.stackProductSPrice}>￥{sku[index].price.origin / 100.0}</div> : null
          }
        </div> : null}
    </div>
  </div>
);

class Shop extends Component {

  handleScroll = (event) => {
    const scrollTop = event.target.scrollTop;
    const clientHeight = event.target.clientHeight;

    if (this.label) {
      // const labelTop = this.label.offsetTop;
      // this.isLabelOnTop = scrollTop > labelTop;
      // console.log(this.isLabelOnTop);
      this.setState({isLabelOnTop: scrollTop > this.label.offsetTop})
    }
    //
    if (this.stacks) {
      for (let i = 0; i < this.stacks.length; i++) {
        const offsetTop = this.stacks[i].offsetTop;

        if (offsetTop <= scrollTop + clientHeight && offsetTop >= scrollTop) {
          this.setState({
            activeLabel: i
          });
          break;
        }
      }
    }
    //
    // if (this.classes) {
    //
    // }
    //

  };

  onLabelClick = (e, i) => {

    if (this.box && this.stacks[i]) {
      this.box.scrollTo(0, this.stacks[i].offsetTop);
    }

    this.setState({
      activeLabel: i
    })
  };

  handleCartIconClick = () => {
    this.setState(prevState => {
      return {
        isCartOpen: !prevState.isCartOpen,
        isDialogShow: !prevState.isCartOpen,
        isSkuDialogShow: false,
      }
    });
  };
  updateCart = (cart) => {
    const count = {total: 0, product: {}};
    const price = {total: 0, box: 0};
    // const sku = [];

    cart.sku.forEach(({skuId, count: c}) => {

      const {pid, price: {box: boxPrice, food: foodPrice}} = this.sku[skuId];

      if (c > 0) {
        if (isNaN(count.product[pid])) {
          count.product[pid] = 0;
        }
        count.product[pid] += c;
        count.total += c;

        price.total += c * foodPrice;
        price.box += c * boxPrice;
      }
    });

    price.total += price.box;

    const sku = cart.sku.filter(v => v.count > 0);

    return {count, price, sku};
  };
  handleCartCountDel = (skuId) => {
    const items = JSON.parse(JSON.stringify(this.state.cart.sku));

    const sku = items.find(v => v.skuId === skuId);

    if (sku) {
      const count = sku.count - 1;
      if (count >= 0 && count <= 999) {
        sku.count = count;

        this.setState({
          cart: this.updateCart({sku: items.filter(v => v.count > 0)})
        });
      }
    }
  };
  handleCartCountAdd = (skuId) => {
    const items = JSON.parse(JSON.stringify(this.state.cart.sku));

    const sku = items.find(v => v.skuId === skuId);

    if (sku) {
      const count = sku.count + 1;
      if (count >= 0 && count <= 999) {
        sku.count = count;

        this.setState({
          cart: this.updateCart({sku: items})
        });
      }
    }
  };
  handleSkuDialogClose = () => {

    this.setState({
      isCartOpen: false,
      isDialogShow: false,
      isSkuDialogShow: false
    });
  };
  handleCartCommit = () => {
    const {shop, cart} = this.state;

    Toast.loading('去购物车');

    kitchen.commitCart(shop.shopId, shop.bid, cart)
      .then(() => {
        // console.log('更新购物车成功:', v);
        Toast.hide();
        this.props.history.push('/front/cart');
      });
  };
  handleAddProductToCart = (event) => {

    const pid = event.target.dataset.pid;
    console.log(this.products);

    /*查出商品的规格列表*/
    const product = JSON.parse(JSON.stringify(this.products[pid]));

    const sku = product.sku;


    if (sku.length > 1) {

      this.setState({
        select: {pid, skuId: sku[0].skuId, sku},
        isSkuDialogShow: true,
        isCartOpen: false,
        isDialogShow: true
      });

    } else {
      this.setState({select: {pid, skuId: sku[0].skuId, sku}}, this.handleAddSkuToCart);
    }
  };

  handleSkuSelect = (event) => {
    const {pid, skuId} = event.target.dataset;

    this.setState(prevState => {
      console.log(prevState);
      return {select: Object.assign({}, prevState.select, {pid, skuId})}
    });

  };
  handleAddSkuToCart = () => {
    this.setState((prevState) => {
      const {select, cart} = prevState;
      const skuId = select.skuId;
      const sku = JSON.parse(JSON.stringify(cart.sku));
      // const items = JSON.parse(JSON.stringify(cart.sku));
      const item = sku.find(v => v.skuId === skuId);

      console.log('加之前SKU', cart, sku);

      if (item) {
        const count = item.count + 1;
        if (count >= 0 && count <= 999) {
          item.count = count;
        }
      } else {
        sku.push({
          skuId: skuId,
          pid: this.sku[skuId].pid,
          count: 1
        });
      }

      return {
        cart: this.updateCart({sku}),
        isCartOpen: false,
        isDialogShow: false,
        isSkuDialogShow: false,
      }
    });
  };
  handleClearCart = () => {
    this.setState({cart: this.updateCart({sku: [], items: {}})});
  };

  constructor(props) {
    super(props);

    this.stacks = [];

    this.state = {
      shop: {banner: '', name: '', logo: '', sales: 0, intro: '', sid: '', minPrice: 2000, sendPrice: 0},
      sales: [],
      classes: [],
      cart: {sku: [], count: {total: 0, product: []}, price: {total: 0, box: 0}},
      coupons: [],
      select: {index: 0, sku: []},
      activeLabel: 0,
      isLabelOnTop: false,
      isCartOpen: false,
      isDialogShow: false,
      isSkuDialogShow: false,
      initialized: false,
      loading: false,
    }
  }

  componentDidMount() {
    if (this.box) {
      this.box.addEventListener('scroll', this.handleScroll);
    }

    const {bid, sid} = this.props.match.params;
    const {pos} = this.props.location.state || {pos: ''};

    if (bid && (sid || pos)) {
      kitchen.getRack(bid, Number(sid), pos).then(data => {

        this.products = data.products;
        this.sku = data.sku;

        this.setState({
          cart: this.updateCart(data.cart),
          classes: data.classes,
          shop: data.shop,
          coupons: data.coupons,
          sales: data.sales,
          initialized: true,
        });
      }).catch(err => console.log(err));
    } else {
      this.props.history.replace('/front/');
    }
  }

  componentWillUnmount() {
    if (this.box) {
      this.box.removeEventListener('scroll', this.handleScroll)
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.shop !== nextState.shop ||
      this.state.sales !== nextState.sales ||
      this.state.classes !== nextState.classes ||
      this.state.cart !== nextState.cart ||
      this.state.coupons !== nextState.coupons ||
      this.state.select !== nextState.select ||
      this.state.activeLabel !== nextState.activeLabel ||
      this.state.isLabelOnTop !== nextState.isLabelOnTop ||
      this.state.isCartOpen !== nextState.isCartOpen ||
      this.state.isDialogShow !== nextState.isDialogShow ||
      this.state.isSkuDialogShow !== nextState.isSkuDialogShow ||
      this.state.initialized !== nextState.initialized ||
      this.state.loading !== nextState.loading
    );
  }

  render() {
    const {activeLabel: label, shop, cart, select} = this.state;
    console.log('a');

    return (
      <div className={style.box}>
        {this.state.initialized ? null : <Loading/>}

        <div className={style.scroll} ref={node => this.box = node}>

          {/*店铺信息*/}
          <div className={style.storeInfo}>
            <img alt='' src={shop.banner} className={style.storeBanner}/>

            <div>
              <div className={style.storeNameAndSales}>
                <div>
                  <img alt='' src={shop.logo}/>
                </div>
                <div className={style.storeName}>{shop.name}</div>
                <div className={style.storeSales}> 在售商品 <span>{shop.sales}</span>个</div>
              </div>
              <div className={style.storeDescription}>{shop.intro}</div>
            </div>
          </div>

          {/*优惠券*/}
          {this.state.coupons.length > 0 ?
            <div className={style.coupons}>
              {this.state.coupons.map((v, i) => (
                <div key={i}>
                  <Coupon type={1}/>
                </div>
              ))}
            </div> : null
          }

          {/*热销*/}
          <div className={style.hot}>
            <img alt='' src={icon_hot_title}/>
            <div className={style.hotProductScroll}>
              <div className={style.hotProducts}>
                {this.state.sales.map((v, i) => (
                  <div key={i}>
                    <img alt='' src={v.image}/>
                    <div>{v.productName}</div>
                    <div>￥18</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {this.state.isLabelOnTop ?
            <div className={style.labelOnTop}>
              {this.state.classes.map((v, i) => (
                <div key={i} className={label === i ? style.stackLabelActive : style.stackLabel}>{v.name}</div>
              ))}
            </div> : null
          }

          {/*上边标签*/}
          <div ref={n => this.label = n} className={style.label}>
            {this.state.classes.map((v, i) => (
              <div key={i} className={label === i ? style.stackLabelActive : style.stackLabel}>{v.name}</div>
            ))}
          </div>

          {/*货架*/}
          <div className={style.stack} ref={node => this.stack = node}>
            {this.state.classes.map((v, i) => (
              <div key={i} ref={node => this.stacks[i] = node}>
                {v.products.map(pid => (
                  <div key={pid} className={style.product}>

                    <img src={this.products[pid].image} alt=''/>

                    <div className={style.productInfo}>
                      <div>{this.products[pid].name}</div>
                      <div>{this.products[pid].intro}</div>
                      <div>月销{this.products[pid].sales}份</div>
                      <div>￥{this.products[pid].sku[0].price.food / 100.0}
                        {this.products[pid].sku[0].price.origin ?
                          <div>￥{this.products[pid].sku[0].price.origin / 100.0}</div> : null
                        }
                      </div>
                    </div>

                    <div className={style.productCount}>
                      {cart.count.product[pid] > 0 ? <img alt='' src={icon_del}/> : null}
                      <div>{cart.count.product[pid]}</div>
                      <img alt='' data-pid={pid} src={icon_add} onClick={this.handleAddProductToCart}/>
                    </div>
                  </div>
                ))}
              </div>
            ))}

            <div className={style.stackPlaceHolder}/>

          </div>
        </div>

        {/*底部按钮*/}
        {this.state.initialized ?
          <div className={style.footer}>
            <div className={style.back}>
              <Link to={'/front/'}>
                <img alt='' src={icon_back} className={style.backImage}/>
              </Link>
            </div>

            {cart.price.total >= shop.minPrice ?
              <div onClick={this.handleCartCommit} className={style.enableCommit}>
                <div>合计￥{cart.price.total / 100.0}</div>
                <div>去购物车</div>
              </div> :
              <div className={style.disableCommit}>还差￥{(shop.minPrice - cart.price.total) / 100.0}起送</div>
            }

            <div className={style.cart} onClick={this.handleCartIconClick}>
              {this.state.isCartOpen ?
                <img alt='' src={icon_cart_open} className={style.cartImageOpen}/> :
                <img alt='' src={icon_cart} className={style.cartImage}/>
              }
              <div className={style.cartCount}>{cart.count.total}</div>
            </div>
          </div> : null
        }

        {/*弹窗遮罩*/}
        {this.state.isDialogShow ?
          <div className={style.dialogCover}/> : null
        }

        {/*购物车弹窗*/}
        {this.state.isCartOpen ?
          <div className={style.dialogCart}>
            <div className={style.dialogCartTitle}>
              <div>已选商品</div>
              <img alt='' src={icon_cart_clear}/>
              <div onClick={this.handleClearCart}>清空</div>
            </div>

            <div className={style.dialogCartBody}>
              {cart.sku.length > 0 ?
                <div className={style.dialogCartTips}>温馨提示: 主食是单独点的哦!</div> :
                <div className={style.dialogCartTips}>温馨提示: 购物车空空如也!</div>
              }
              {cart.sku.map(({skuId, count}) => (
                <div key={skuId} className={style.dialogCartItem} style={{borderBottom: 'solid 0.02rem #dcdcdc'}}>
                  <div>{this.sku[skuId].productName + '(' + this.sku[skuId].name + ')'}</div>

                  <div>￥{this.sku[skuId].price.food / 100.0}</div>
                  <img alt='' src={icon_cart_item_m} className={style.dialogCartItemOps} onClick={() => {
                    this.handleCartCountDel(skuId)
                  }}/>
                  <div>{count}</div>
                  <img alt='' src={icon_cart_item_p} className={style.dialogCartItemOps} onClick={() => {
                    this.handleCartCountAdd(skuId)
                  }}/>
                </div>
              ))}

              {cart.sku.length > 0 ?
                <div className={style.dialogCartItem}>
                  <div>包装</div>
                  <div>￥{cart.price.box / 100.0}</div>
                  <div style={{width: '1.43rem'}}/>
                </div> : null
              }
            </div>
          </div> : null
        }

        {/*商品属性弹窗*/}
        {this.state.isSkuDialogShow ?
          <div className={style.dialogSku}>
            <div className={style.dialogSkuTitle}>
              <div>商品属性</div>
              <img alt='' src={dialog_close} onClick={this.handleSkuDialogClose}/>
            </div>

            {console.log(select)}
            <div className={style.dialogSkuBody}>
              <div className={style.selectProduct}>
                <img alt='' src={this.products[select.pid].image}/>

                <div className={style.selectProductInfo}>
                  <div>{this.products[select.pid].name}</div>
                  <div>{this.products[select.pid].intro}</div>
                  <div>月销{this.products[select.pid].sales}份</div>

                  {this.products[select.pid].sku.length > 0 ?
                    <div>
                      <div>￥{this.sku[select.skuId].price.food / 100.0}</div>
                      {this.sku[select.skuId].price.origin > 0 ?
                        <div>￥{this.sku[select.skuId].price.origin / 100.0}</div> : null
                      }
                    </div> : null
                  }

                </div>
              </div>

              <div style={{margin: '0.28rem 0'}}>规格</div>

              <div className={style.skuList}>
                {select.sku.map(v => (
                  <div key={v.skuId} data-pid={v.pid} data-sku-id={v.skuId}
                       className={select.skuId === v.skuId ? style.skuActive : style.skuInactive}
                       onClick={this.handleSkuSelect}>{v.name}</div>
                ))}
              </div>

              <div className={style.skuSelect} onClick={this.handleAddSkuToCart}>选入</div>

            </div>
          </div> : null
        }


      </div>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    locate: state.locate,
  };
};

export default connect(
  mapStateToProps
)(Shop);

