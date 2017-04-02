import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

(function detectFullscreen() {
  const element = document.querySelector('html');
  if (!element.mozRequestFullScreen && !element.webkitRequestFullScreen) {
    element.classList.add('no-fullscreen');
  }
}());

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
