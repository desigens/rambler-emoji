import React from 'react';

const WIDTH = 560 * 2 + 250;
const HEIGHT = 200 * 2;
const VPADDING = 100;
const HPADDING = 200;

export const Canvas = React.createClass({

    propTypes: {
        logoSrc: React.PropTypes.string.isRequired,
        emoji: React.PropTypes.string
    },

    componentDidMount() {
        const ctx = this.canvas.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, WIDTH + HPADDING * 2, HEIGHT + VPADDING * 2);
        this.ctx = ctx;

        const img = new Image();
        img.onload = () => {
            const ratio = img.width / img.height;
            this.ctx.drawImage(img, HPADDING, VPADDING, 400 * ratio, 400);
        };
        img.src = this.props.logoSrc;

        this.draw();
    },

    componentDidUpdate() {
        this.draw();
    },

    draw() {
        const ctx = this.ctx;
        ctx.fillRect(560 * 2 + HPADDING, 0, 300, HEIGHT + VPADDING * 2);
        ctx.font = 126 * 2 + 'px serif';

        // FIXME In Firefox emoji is too high
        // http://bespin.cz/~ondras/ff-font-bug/
        ctx.textBaseline = 'middle';
        ctx.fillText(this.props.emoji, 560 * 2 + HPADDING, 90 + VPADDING + 126);
    },

    open() {
        this.a.href = this.canvas.toDataURL('image/png');
        setTimeout(() => {
            this.a.href = '#save'
        }, 1);
    },

    render() {
        return (
            <a target="_blank" href="#save" ref={el => this.a = el} onClick={this.open}>
                <canvas width={WIDTH + HPADDING * 2} height={HEIGHT + VPADDING * 2}
                        ref={el => this.canvas = el}/>
            </a>
        );
    }
});
