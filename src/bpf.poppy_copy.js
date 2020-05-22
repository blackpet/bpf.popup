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

(function (w, _debug) {

  'use strict';

  function BPF() {
    this.poppy = {};
    this.template = `
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
  }

  // logger
  function log(...args) {
    if (_debug) {
      console.log(args);
    }
  }

  function bpfPoppy(id) {

    this.id = id;
    this.el;

    this.options = {
      instance: false,
      closeable: true,
      modal: true,
      data: {},
      title: 'BPF Poppy'
    };

    var localStorage = {};

    this.popup = function (options) {
      var $this = this;
      log('bpf.popup()', options);

      this.options = $.extend({}, this.options, options);

      // create poppy elements
      this.el = $(`<div id="${this.id}" class="bpp">`);
      var blockEl = $('<div class="bp-pageblock">');
      var bodyEl = $($.templates(w.BPF.template).render({title:this.options.title}));

      // options setting!
      var wh = {};
      if (this.options.width) wh.width = this.options.width;
      if (this.options.height) wh.height = this.options.height;
      if (Object.keys(wh).length > 0) bodyEl.css(wh);

      if (this.options.modal) {
        this.el.append(blockEl.append(bodyEl));
      } else {
        this.el.append(bodyEl);
      }

      if (!this.options.closeable) {
        this.el.find('.bp-close-btn').hide();
      }

      // load page
      this.options.data = parseToJson(this.options.data);

      // xhr load or selector
      // load from xhr request
      if (!!this.options.url) {
        this.el.find('article').load(this.options.url, this.options.data, function () {
          $('body').append($this.el);
          $this.handleEvent();
        });
      }
      // load from selector (inset dom element)
      else if (!!this.options.selector) {
        var poppybody = $(this.options.selector).html();
        // check jsrender template
        if (/{{[^}]+}}/.test(poppybody)) {
          poppybody = $.templates(poppybody).render(this.options.data);
        }
        this.el.find('article').append(poppybody);
        $('body').append(this.el);
        this.handleEvent();
      }


      return this;
    };

    this.handleEvent = function () {
      // bind close event
      $(`#${this.id} .bp-close-btn`).click(this.close.bind(this));

      // prevent form submit
      $(`#${this.id} form`).on('submit', function (e) {
        e.preventDefault();
        e.stopPropagation();

        return false;
      });

      // for firb solution pagination
      var $poppy = this;
      $poppy.el.find('.pageNavi [bp-page]').each(function () {
        // remove exist event handler
        this.onclick = null;

        $(this).click(function () {
          $poppy.paginate.call($poppy, $(this).attr('bp-page'));
        });

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

      // remove element
      $(`#${this.id}.bpp`).remove();

      // delete BPF poppy object
      delete w.BPF.poppy[id];
    };

    this.submit = function (obj, _toUrl, _callback) {
      var $this = this;

      obj = parseToJson(obj);
      obj = $.extend({}, this.options.data, obj);
      log('bpf.submit()', obj, _toUrl, _callback);

      var url, callback;
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
        log('bpf.put()', key, value);
        localStorage[key] = value;
      },

      // push value to array
      push: function (key, value) {
        log('bpf.push()', key, value);
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
        log('bpf.data.get()', key);
        if (!key) return localStorage;
        return localStorage[key];
      },

      // get data from caller
      _default: function () {
        return this.options.data;
      },

      // delete data of key
      delete: function (key) {
        log('bpf.data.delete()', key);
        if (!key) localStorage = {};
        return delete localStorage[key];
      }
    };

  }


  /**
   * static members
   */
  // create popup
  BPF.prototype.popup = function (id, options) {
    if (options && options.debug) {
      _debug = options.debug;
    }

    log('BPF.prototype.popup()', id, options);


    // Exception!
    if (!!w.BPF.poppy[id]) {
      throw `${id} is already exists!!`;
    }

    var poppy = new bpfPoppy(id);
    w.BPF.poppy[id] = poppy;
    poppy.popup(options);

  }; // end of popup()


  // retrieve popup instance
  BPF.prototype.getPoppy = function (id) {
    if (!w.BPF.poppy[id]) {
      throw `${id} poppy does not exists!!`;
    }

    return w.BPF.poppy[id];
  }; // end of getPopup()


  // close popup
  BPF.prototype.close = function (id) {
    if (!w.BPF.poppy[id]) {
      throw `${id} poppy does not exists!!`;
    }
    this.getPoppy(id).close();
  };
  // end of static members


  // global variable creation for BPF
  if (!w.BPF) {
    w.BPF = new BPF();
  } else {
    return;
  }

  ///////////////////////
  // utilities
  ///////////////////////
  function parseToJson(obj) {
    var json = {};

    if (obj instanceof Array) {
      obj.forEach(function (el) {
        json = $.extend({}, json, parseToJson(el));
      });
    } else if (obj instanceof jQuery) {
      json = obj.serializeObject();
    } else if (typeof obj === 'object') {
      json = obj;
    }

    return json;
  }

  jQuery.fn.serializeObject = function () {
    var obj = null;
    try {
      if (this[0].tagName && this[0].tagName.toUpperCase() == "FORM") {
        var arr = this.serializeArray();
        if (arr) {
          obj = {};
          jQuery.each(arr, function () {
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

})(window, false);

