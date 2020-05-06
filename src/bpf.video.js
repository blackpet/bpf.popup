/**
 * Customize video.js by blackpet
 *
 * @see https://videojs.com
 * @author blackpet
 * @date 2020.5.4
 */
// import videojs from 'video.js'
// import 'videojs-youtube'
// import 'video.js/dist/video-js.css'
// import '@videojs/themes/dist/fantasy/index.css'
// import './bpf.video.css'
const videojs = require('video.js')
require('videojs-youtube')
require('video.js/dist/video-js.css')
require('@videojs/themes/dist/fantasy/index.css')
require('./bpf.video.css')

import * as $ from 'jquery'

let videoId;

const bpfOption = {
  debug: false,

  callback: null,
  callbackParam: null,
  callbackInterval: 5,

  ready: null
}

const videoOption = {
  width: 800,
  height: 450,
  // autoplay: true,
  controls: true,
  preload: 'auto',

  // youtube only allows limits up to x2
  playbackRates: [0.2, 0.5, 1, 1.2, 1.5, 2],
}

const timer = {
  played: 0,
  opened: 0,

  timestamp: 0,
  elapsed: 0,
  interval: 5, // 진도체크 갱신 단위 (s)

  /**
   * start timer
   */
  start: () => {
    timer.timestamp = new Date().getTime();
  },

  /**
   * count-up timer
   * @param player
   */
  increaseTime: (player, updateProgress) => {
    log(timer);
    if (updateProgress) log('forced updateProgress!');

    timer.elapsed = (new Date().getTime() - timer.timestamp) / 1000;
    // played time
    timer.played += player.paused() ? 0 : timer.elapsed * player.playbackRate();
    // opened time
    timer.opened += timer.elapsed;

    timer.timestamp = new Date().getTime();

    // update study progress
    if (updateProgress || timer.opened % timer.interval < 1) {
      timer.updateProgress();
    }
  },

  /**
   * update study progress
   */
  updateProgress: () => {
    if (!!bpfOption.callback && typeof bpfOption.callback === 'function') {
      log(`callback!!! (played: ${timer.played} / opened: ${timer.opened})`);
      const param = bpfOption.callbackParam || {};
      bpfOption.callback(param);
    } else {
      log(`abstract updateProgress(). Be sure to overwrite it! (played: ${timer.played} / opened: ${timer.opened})`);
    }
  }
} // end of timer

// logger
function log(...args) {
  if (bpfOption.debug) {
    console.log(videoId, args);
  }
}

function initVideo(id) {
  videoId = id;
  return videojs.default(id, videoOption);
}

function readyVideo() {
  const $video = this;

  log('currentSrc', $video.currentSrc());
  log('currentType', $video.currentType());
  log($video.el().dataset);

  let options = {};

  if ($video.currentType() === 'video/youtube') {
    options = Object.assign(options, {
      techOrder: ['youtube'],
      forceSSL: true,
      forceHTML5: true,
      Origin: 'http://localhost:4000'
    });
  }

  $video.options(options);
  $video.play();

  // start timer
  timer.start();
  $video.setInterval(function () {
    console.log('interval each 1 sec');

    timer.increaseTime($video);

    // 최초에 자동재생 되지 않은 경우는 재생 하자!
    if(timer.opened < 2 && $video.paused()) this.play();
  }, 1000);

  // execute user define ready function
  if (!!bpfOption.ready && typeof bpfOption.ready === 'function') {
    bpfOption.ready();
  }
}

function bpfVideojs(id, _bpfOption = {}, _videoOption = {}) {

  // extends options...
  Object.assign(bpfOption, _bpfOption);
  Object.assign(videoOption, _videoOption);

  log(bpfOption, videoOption);

  this.video = initVideo(id);
  this.video.ready(readyVideo);
  this.video.on('ended', () => timer.increaseTime(this.video, true));


  // this.foo = () => {
  //   console.log('fooooooooooo~');
  // }

  return this;
}



module.exports = bpfVideojs




