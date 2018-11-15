import React, {Component} from 'react';
import style from './Loading.module.sass';

import icon_loading from '../../static/images/loading/loading.gif';

export default class Loading extends Component {
  render() {
    return (
      <div className={style.loading}>
        <img src={icon_loading} alt=''/>
      </div>
    );
  }
}