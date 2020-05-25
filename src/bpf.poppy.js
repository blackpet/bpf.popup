/**
 * bpf.poppy
 * @author blackpet
 * @date 20.3.31
 * @dependency [ jquery, jsrender ]
 *
 * @releasenote
 *  1.1. (20.4.28) load from css selector
 *
 * @usage
 * <code>
 *   BPF.popup( 'poppyId', {url: '/popup-page-url', ....} );
 * </code>
 *
 * modal dialog layer
 */
require('jquery')
const jsrender = require('jsrender')
require('./bpf.popup.css')

function BpfPopup () {

  let debug = false;

  const poppy = {};
  let template = `
          <div class="bp-body">
              <div class="bp-main">
                  <header class="bp-header">
                      <h1>{{>title}}</h1>
                      <button class="bp-close-btn">Close</button>
                  </header>
                  <article class="bp-article"></article>
              </div>
          </div>
      `;

  let skinOptions = {};

  // logger
  function log(...args) {
    if (debug) {
      console.log(args);
    }
  }

  // getter/setter
  function setTemplate(tmpl) {
    template = tmpl;
  }
  function getTemplate() {
    return template;
  }
  function setSkinOptions(opt) {
    skinOptions = opt;
  }

  function bpfPoppy(id) {

    this.id = id;
    this.el;

    /**
     *
     * @type {
     *  modal: boolean
     *  closeable: boolean
     *  width: number
     *  height: number
     *
     *  buttons: ['ok', 'cancel']
     *  data: {}
     *  className: string
     *  title: string
     *
     *  url: string
     *  selector: css selector
     *  template: html string
     *
     *  ready: null
     *  close: null
     *
     *  TODO blackpet: no implement yet
     *  instance: boolean
     * }
     */
    this.options = {
      instance: false,
      closeable: true,
      modal: true,
      data: {},
      title: 'BPF Poppy',

      ready: null,
      close: null,

      className: '',
      buttons: [],

      skin: {
        ready: () => {
          return new Promise(resolve => resolve)
        },
        close: () => {
          return new Promise(resolve => resolve)
        }
      }
    };

    let localStorage = {};

    this.create = function (options) {
      const $this = this;
      log('bpf.popup()', options);

      this.options = Object.assign({}, this.options, skinOptions, options);

      // create popup!
      this.createPoppy_();

      // load page
      this.options.data = parseToJson(this.options.data);

      const renderBody = (body) => {
        // check jsrender template
        if (/{{[^}]+}}/.test(body)) {
          body = jsrender.templates(body).render(this.options.data);
        }
        this.el.find('article').append(body);
        $('body').append(this.el);
        this.handleEvent();
      };

      // xhr load or selector or html string
      // load from xhr request
      if (!!this.options.url) {
        this.el.find('article').load(this.options.url, this.options.data, () => {
          $('body').append(this.el);
          this.handleEvent();
        });
      }

      // load from selector (inset dom element)
      else if (!!this.options.selector) {
        const poppybody = $(this.options.selector).html();

        renderBody(poppybody);
      }

      // load from html template string
      else if (!!this.options.template) {
        renderBody(this.options.template);
      }

      return this;
    };

    this.createPoppy_ = function () {
      var tmplData = {
        title: this.options.title,
        buttonClass: this.options.buttons.length == 2 ? 'double' : 'single'
      }
      // create poppy elements
      this.el = $(`<div id="${this.id}" class="bpp">`);
      const blockEl = $('<div class="bp-pageblock">');
      const bodyEl = $(jsrender.templates(template).render(tmplData));

      // set popup size
      const wh = {};
      if (this.options.width) wh.width = this.options.width;
      if (this.options.height) wh.height = this.options.height;
      if (Object.keys(wh).length > 0) {
        let _body;
        if (bodyEl.length && bodyEl.length > 1) {
          _body = Object.values(bodyEl).filter(el => el.className && el.className.indexOf('bp-body') > -1);
          _body = $(_body);
        } else {
          _body = bodyEl;
        }
        $(_body).css(wh);
      }

      // set className
      if (!!this.options.className) {
        this.el.addClass(this.options.className);
      }

      // set buttons
      if (this.options.buttons.length == 0) {
        bodyEl.find('footer').remove();
      } else {
        if (!this.options.buttons.includes('ok')) {
          bodyEl.find('.bp-btn-item-ok').remove();
        }
        if (!this.options.buttons.includes('cancel')) {
          bodyEl.find('.bp-btn-item-cancel').remove();
        }
        // [ok]btn abstract binding to close
        bodyEl.find('.bp-btn-item-ok button').click(this.close.bind(this));
        bodyEl.find('.bp-btn-item-cancel button').click(this.close.bind(this));
      }

      if (this.options.modal) {
        this.el.append(blockEl.append(bodyEl));
      } else {
        this.el.append(bodyEl);
      }

      if (!this.options.closeable) {
        this.el.find('.bp-close-btn').hide();
      }
    }

    // [ok]btn binding handler
    this.ok = (fn, label) => {
      this.el.find('footer .bp-btn-item-ok button').unbind('click').click(fn.bind(this));
      if (label && label.length > 0) {
        this.el.find('footer .bp-btn-item-ok span').text(label);
      }
    };

    // [cancel]btn binding handler
    this.cancel = (fn, label) => {
      this.el.find('footer .bp-btn-item-cancel button').unbind('click').click(fn.bind(this));
      if (label && label.length > 0) {
        this.el.find('footer .bp-btn-item-cancel span').text(label);
      }
    };

    this.handleEvent = function () {
      // stop event bubbling for close
      $(`#${this.id} .bp-body`).click(e => {
        // e.preventDefault();
        e.stopPropagation();
      });

      // bind close event
      $(`#${this.id} .bp-close-btn`).click(this.close.bind(this));
      if (this.options.closeable) {
        $(`#${this.id} .bp-pageblock`).click(this.close.bind(this));
      }


      // prevent form submit
      $(`#${this.id} form`).on('submit', function (e) {
        e.preventDefault();
        e.stopPropagation();

        return false;
      });

      // for firb solution pagination
      const $poppy = this;
      $poppy.el.find('.pageNavi [bp-page]').each(function () {
        // remove exist event handler
        this.onclick = null;

        // attach bpf.popup pagination event
        $(this).click(function () {
          $poppy.paginate.call($poppy, $(this).attr('bp-page'));
        });

      });

      // execute skin ready function
      this.options.skin.ready.call(this).then(() => {
        // execute user define ready function
        if (!!this.options.ready && typeof this.options.ready === 'function') {
          this.options.ready.call($poppy);
        }
      });
    };

    /**
     * (for firb)
     * paginated submit
     */
    this.paginate = function (page) {
      log(`paginate to ${page}`, this);
      // 첫번째 FORM 과 p_pageno 파라메터를 가지고 submit을 날리자!
      $(this.submit([this.el.find('form').eq(0), {p_pageno: page}]));
    };

    /**
     * apply callback to parent
     * @param obj object or jquery FORM Elements
     */
    this.callback = function (obj) {
      obj = parseToJson(obj);
      log('bpf.callback()', obj);

      this.options.callback(obj);
      this.close();
    };

    /**
     * close popup
     */
    this.close = function () {
      log('bpf.close()', this);

      // execute skin close function
      this.options.skin.close.call(this).then(() => {
        // if specified close, resolve Promise
        if (!!this.options.close && typeof this.options.close === 'function') {
          this.options.close.call(this).then(() => {
            close_();
          });
        } else {
          close_();
        }
      });
    };

    const close_ = () => {
      $(`#${this.id}.bpp`).remove();
      // delete BPF poppy object
      delete poppy[id];
    };


    this.submit = function (obj, _toUrl, _callback) {
      const $this = this;

      obj = parseToJson(obj);
      obj = $.extend({}, this.options.data, obj);
      log('bpf.submit()', obj, _toUrl, _callback);

      let url, callback;
      if (typeof _toUrl === 'string') {
        url = _toUrl;
      } else if (typeof _toUrl === 'function') {
        callback = _toUrl;
      }
      url = url || this.options.url;

      if (typeof _callback === 'function') {
        callback = _callback;
      }
      if (!callback) {
        callback = function() {};
      }

      // load page
      this.el.find('article').load(url, obj, function () {
        $('body').append($this.el);
        $this.handleEvent();

        callback();
      });

    };

    // data structure
    this.data = {
      // put {key:value} to localStorage
      put: function (key, value) {
        log('data.put()', key, value);
        localStorage[key] = value;
      },

      // push value to array
      push: function (key, value) {
        log('data.push()', key, value);
        if (!(key in localStorage)) {
          localStorage[key] = [value];
        } else {
          localStorage[key].push(value);
        }
      },

      // remove array item of key's value
      remove: function (key, value) {
        var idx = localStorage[key].indexOf(value);
        if (idx > -1) {
          localStorage[key].splice(idx, 1);
        }
      },

      // index of array
      indexOf: function (key, value) {
        if (!(key in localStorage)) return -99;
        return localStorage[key].indexOf(value);
      },

      // get value of key
      get: function (key) {
        log('data.get()', key);
        if (!key) return localStorage;
        return localStorage[key];
      },

      // get data from caller
      _default: function () {
        return this.options.data;
      },

      // delete data of key
      delete: function (key) {
        log('data.delete()', key);
        if (!key) localStorage = {};
        return delete localStorage[key];
      }
    };

  }


  /**
   * static members
   */
  // create popup
  const create = function (id, options) {
    if (options) {
      debug = !!options.debug;
    }

    // Exception!
    if (!!poppy[id]) {
      throw `${id} is already exists!!`;
    }

    log('bpf.popup.create()', id, options);

    const pop = new bpfPoppy(id);
    poppy[id] = pop;
    return pop.create(options);

  }; // end of popup()


  // retrieve popup instance
  const getPoppy = function (id) {
    if (!poppy[id]) {
      throw `${id} poppy does not exists!!`;
    }

    return poppy[id];
  }; // end of getPopup()


  // close popup
  const close = function (id) {
    if (!poppy[id]) {
      throw `${id} poppy does not exists!!`;
    }
    this.getPoppy(id).close();
  };
  // end of static members


  ///////////////////////
  // utilities
  ///////////////////////
  function parseToJson(obj) {
    var json = {};

    if (obj instanceof Array) {
      obj.forEach(function (el) {
        json = Object.assign({}, json, parseToJson(el));
      });
    } else if ((!!jQuery && obj instanceof jQuery) || (!!$ && obj instanceof $)) {
      json = obj.serializeObject();
    } else if (typeof obj === 'object') {
      json = obj;
    }

    return json;
  }

  $.fn.serializeObject = function () {
    var obj = null;
    try {
      if (this[0].tagName && this[0].tagName.toUpperCase() == "FORM") {
        var arr = this.serializeArray();
        if (arr) {
          obj = {};
          $.each(arr, function () {
            if (!!obj[this.name]) {
              if (Array.isArray(obj[this.name])) {
                obj[this.name].push(this.value);
              } else {
                var tmp = obj[this.name];
                obj[this.name] = [tmp];
                obj[this.name].push(this.value);
              }
            } else {
              obj[this.name] = this.value;
            }
          });
        }
      }
    } catch (e) {
      log(e.message);
    } finally {
    }
    return obj;
  }
  // end of utilities
  ///////////////////////

  return {
    setTemplate: setTemplate,
    getTemplate: getTemplate,
    setSkinOptions: setSkinOptions,
    create: create,
    getPoppy: getPoppy,
    close: close
  }
}


module.exports = new BpfPopup();

