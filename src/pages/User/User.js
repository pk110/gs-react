import React, {Component} from 'react'
import Footer from "../../components/Footer/Footer";

import style from './User.module.css'

import icon_kitchen from "../../static/images/my.jpg"
import habit_arrow from "../../static/images/habit_arraw.png"
import {Link} from "react-router-dom";

export default class User extends Component {

  state = {
    image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1538816549&di=6c88c048552b0a8607f4fbc8bf01dc28&imgtype=jpg&er=1&src=http%3A%2F%2Fwww.qqzhi.com%2Fuploadpic%2F2015-01-25%2F151315859.jpg',
    nickname: 'www'
  };

  render() {
    return (
      <div className={style.bg}>
        <div className={style.a}>
          <div className={style.top}>
            <img src={this.state.image} alt="" className={style.head}/>
            <div className={style.name}>{this.state.nickname}</div>
            <Link className={style.habit} to='/front/my'>我的饮食习惯
              <img src={habit_arrow} alt="" className={style.habit_arrow}/>
            </Link>
          </div>
          <div className={style.center}>
            <img alt='' className={style.kitchen} src={icon_kitchen}/>
          </div>
          <div className={style.bottom}>
            <div className={style.share}> 分享现金券给好友</div>
          </div>
        </div>
        <Footer index={4}/>
      </div>
    );
  }
}

