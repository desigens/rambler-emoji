import React from 'react';
import './App.css';
import svg from './logo.svg';

import { Canvas } from './Canvas.jsx';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import excluded from './excluded.js';

// http://apps.timwhitlock.info/emoji/tables/unicode
const allEmojis = [
      [0x1F601, 0x1F64F],
      [0x2702, 0x27B0],
      [0x1F600, 0x1F636],
      [0x1F681, 0x1F6C5],
      [0x1F680, 0x1F6C0],
      [0x1F30D, 0x1F567],
    ].reduce((sum, range) => {
      return sum.concat(Array.from({length: range[1] - range[0]}, (a, i) => {
        return range[0] + i;
      }));
    }, []).filter(i => !excluded.includes(i));

const RamblerEmoji = React.createClass({

  propTypes: {
    frames: React.PropTypes.array.isRequired
  },

  getInitialState() {
    return {
      frame: 0,
      min: 0,
      max: 0,
      speed: 3000,
      pause: false,
    }
  },

  nextFrame() {
    const next = this.state.frame + 1;
    this.setState({
      frame: next === this.state.max ? 0 : next
    }, () => {
      !this.state.pause &&
        this._intervals.push(setTimeout(this.nextFrame, this.state.speed));
    });
  },

  goToFrame(frame) {
    this.setState({
      frame: frame
    })
  },

  setSpeed(val) {
    this._clearIntervals();
    this.setState({
      speed: val
    }, () => {
      this._intervals.push(setTimeout(this.nextFrame, this.state.speed / 2));
    });
    // TODO нелинейное увеличение скорости
  },

  componentDidMount() {
    this.setState({
      max: this.props.frames.length
    }, () => {
      this.nextFrame()
    });

    window.addEventListener('keydown', this.keys);
  },

  componentWillUnmount() {
    window.removeEventListener('keydown', this.keys);
  },

  keys(e) {
      
      // right
      if (e.keyCode === 39) {
        this._clearIntervals();
        this.nextFrame();
      }

      // left
      if (e.keyCode === 37) {
        this.state.frame && this.goToFrame(this.state.frame - 1);
      }

      // space
      if (e.keyCode === 32) {
        const frame = this.props.frames[this.state.frame];
        const code = '0x' + Number(frame).toString(16).toUpperCase();

        // mark to console
        console.log(code);
      }
  },

  _intervals: [],

  _clearIntervals() {
    this._intervals.map(i => clearInterval(i));
    this._intervals = [];
  },

  pause() {
    this._clearIntervals();
    if (this.state.pause) {
      this.setState({
        pause: false
      }, () => {
        this._intervals.push(setTimeout(this.nextFrame, this.state.speed / 2));
      });
    } else {
       this.setState({
        pause: true
      });
    }
  },

  render() {
    const frame = this.props.frames[this.state.frame];
    const emoji = String.fromCodePoint(frame);
    const code = '0x' + Number(frame).toString(16).toUpperCase();
    const color = this.state.paused ? '#e9e9e9' : '#315EFB';
    return (
      <div className="root">

        <div onClick={enterFullscreen} title="Fullscreen" className="fscreen no-fscreen"/>

        <div className="content">
          <Canvas logoSrc={svg} emoji={emoji}/>
          {/*<img className="logo" src={svg} alt="Рамблер/"/>*/}
          {/*<span className="emoji">*/}
            {/*{emoji}*/}
          {/*</span>*/}
        </div>

        <div className="footer no-fscreen">
          <div className="controls">
            <div>
              Interval:
              <span className="current">{this.state.speed / 1000}s</span>
              <Slider step={100} minimumTrackTintColor={color} max={5000}
                value={this.state.speed} onChange={this.setSpeed} />
            </div>

            <div>
              Frames:
              <span className="current">
                {code} ({this.state.frame + 1}/{this.state.max})
              </span>
              <Slider minimumTrackTintColor={color} max={this.state.max - 1}
                value={this.state.frame} onChange={this.goToFrame} />
            </div>
            <div>
              <PlayPause onClick={this.pause} paused={this.state.pause}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

function PlayPause({ onClick, paused }) {
  return (
    <span className="play-pause" onClick={onClick}>
      {paused ? (<span className="play">▶ Play </span>) :
       (<span className="pause"><span>▎▎</span> Pause</span>)}
    </span>
  )
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function ramdomize(array) {
  const length = array.length;
  const arrayToReduce = [].concat(array);
  const randomizedArray = [];
  for (let i = 0; i < length; i++) {
      randomizedArray.push(
        arrayToReduce.splice(getRandomInt(0, arrayToReduce.length), 1)[0]
      );
  }
  return randomizedArray;
}

function enterFullscreen(){
    const element = document.querySelector('html');
    if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
    }
}

export default () => <RamblerEmoji frames={ramdomize(allEmojis)}/>;
