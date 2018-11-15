import React, {Component} from 'react';
import PropTypes from 'prop-types';

import style from './Banner.module.css'

class Banner extends Component {

  handleTouchStart = (event) => {
    this.startPoint = event.changedTouches[0].pageX;

    console.log('Start:', this.startPoint);
  };
  handleTouchMove = (event) => {
    // console.log(event.changedTouches[0].pageX);

    if (this.banner) {
      this.banner.style.transform()
    }
  };
  handleTouchEnd = (event) => {
    this.endPoint = event.changedTouches[0].pageX;

    console.log('End:', this.endPoint);
  };

  constructor(props) {
    super(props);

    this.state = {
      prev: 0,
      index: 1,
      next: 2,
    }
  }

  componentDidMount() {
    this.timer = setInterval(() => console.log('a'), 3000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {

    return (
      <div className={style.box}>
        {this.props.children ?
          <div className={style.banner}
               onTouchMove={this.handleTouchMove}
               onTouchStart={this.handleTouchStart}
               onTouchEnd={this.handleTouchEnd}
               ref={node => this.banner = node}
          >
            {this.props.children[this.state.prev]}
            {this.props.children[this.state.index]}
            {this.props.children[this.state.next]}
          </div> : null
        }
      </div>
    );
  }
}

Banner.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default Banner;