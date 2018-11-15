import React from 'react'
import style from './OrderItem.module.sass'

const getOrderStatus = (status) => {
  switch (status) {
    case 0: {
      return '待支付';
    }

    case 1: {
      return '已支付';
    }

    case 2: {
      return '已接单';
    }

    case 3: {
      return '配送中';
    }

    case 4: {
      return '已送达';
    }

    case 5: {
      return '已完成';
    }

    case 6: {
      return '已取消';
    }

    default: {
      return ''
    }
  }
};

const canCancel = (status) => {
  return [0, 1, 2, 3].indexOf(status) !== -1;
};

const canCallShop = (status) => {
  return [2, 3, 5, 6].indexOf(status) !== -1;
};

const canCallDelivery = (status) => {
  return [3, 4].indexOf(status) !== -1;
};

const canBuyAgain = (status) => {
  return [1, 2, 3, 4, 5, 6].indexOf(status) !== -1;
};

const canConfirm = (status) => {
  return [4].indexOf(status) !== -1;
};

export const OrderItem = ({shop, cart, price, status}) => (
  <div className={style.order}>
    <div className={style.title}>
      <img alt="" src={shop.image}/>
      <div>{shop.name}</div>
    </div>

    <div className={style.status}>
      <div>{getOrderStatus(status)}</div>
      <div>美团专送</div>
    </div>

    <div className={style.items}>
      {cart.sku.slice(0, 3).map((v, i) => (
        <img alt='' key={i} src={v.image}/>
      ))}
    </div>

    <div className={style.summary}>
      <div>预计 12:45 送达</div>
      <div>共计 {cart.sku.length} 件商品</div>
      <div>实付<span>￥{price.total / 100.0}</span></div>
    </div>

    <div className={style.buttons}>
      {canCallDelivery(status) ? <button className={style.callDelivery}>联系骑手</button> : null}
      {canCallShop(status) ? <button className={style.callShop}>联系商家</button> : null}
      {canCancel(status) ? <button className={style.cancel}>取消订单</button> : null}
      {canBuyAgain(status) ? <button className={style.callShop}>再次购买</button> : null}
      {canConfirm(status) ? <button className={style.confirm}>确认收餐</button> : null}
    </div>

  </div>
);