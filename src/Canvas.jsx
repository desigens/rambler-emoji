import React from 'react';

const WIDTH = 560 * 2 + 250;
const HEIGHT = 200 * 2;
const VPADDING = 100;
const HPADDING = 200;

export const Canvas = React.createClass({

  propTypes: {
    logoSrc: React.PropTypes.string.isRequired,
    emoji: React.PropTypes.string,
    code: React.PropTypes.string,
    report: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      report: (code) => console.warn(code + ' is not supported'),
    }
  },

  componentDidMount() {
    const ctx = this.canvas.getContext('2d');

    // No-transparent background color
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, WIDTH + HPADDING * 2, HEIGHT + VPADDING * 2);

    // Emoji size
    ctx.font = 126 * 2 + 'px serif';

    // FIXME In Firefox emoji is too high
    // http://bespin.cz/~ondras/ff-font-bug/
    ctx.textBaseline = 'middle';

    // Async logo draw
    const img = new Image();
    img.onload = () => {
      const ratio = img.width / img.height;
      ctx.drawImage(img, HPADDING, VPADDING, 400 * ratio, 400);
    };
    img.src = this.props.logoSrc;

    this.ctx = ctx;
    this.drawEmoji();
  },

  componentDidUpdate() {
    this.drawEmoji();
  },

  drawEmoji() {

    // Clear area for next emoji
    this.ctx.fillRect(560 * 2 + HPADDING, 0, 300, HEIGHT + VPADDING * 2);

    // Draw emoji as text
    this.ctx.fillText(this.props.emoji, 560 * 2 + HPADDING, 90 + VPADDING + 126);

    this.reportIfEmojiIsNotSupported();
  },

  unsupportedCodes: [],

  reportIfEmojiIsNotSupported() {
    const rgbData = this.ctx.getImageData(560 * 2 + HPADDING, 0, 300, HEIGHT + VPADDING * 2);

    // If image data contains no-white pixel, lets decide current emoji is supported
    if (!rgbData.data.find(i => i !== 255) && !this.unsupportedCodes.find(i => i === this.props.code)) {
      this.unsupportedCodes.push(this.props.code);
      this.props.report(this.props.code);
    }
  },

  openCanvasAsImage() {
    this.a.href = this.canvas.toDataURL('image/png');
    setTimeout(() => {
      this.a.href = '#save'
    }, 1);
  },

  render() {
    return (
      <a target="_blank" href="#save" ref={el => this.a = el} onClick={this.openCanvasAsImage}>
        <canvas width={WIDTH + HPADDING * 2} height={HEIGHT + VPADDING * 2}
                ref={el => this.canvas = el}/>
      </a>
    );
  }
});
