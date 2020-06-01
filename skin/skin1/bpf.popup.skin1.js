/**
 * BPF Poppy Body Template
 * for Nongshim User System
 *
 * @author blackpet
 * @date 20.4.29
 * @requires [ bpf.poppy ]
 * @type {string}
 */
(function () {

  var skin1Tmpl =
    `<i class="align_maker"></i>
      <div class="popup_default bp-body">
          <div class="pop_inner bp-main">
              <header class="pop_header">
                  <h1 class="tit_s24cDGrayFB">{{>title}}</h1>
              </header>
              <article class="pop_content bp-article">
              </article>
              <footer class="pop_footer bp-footer">
                  <ul class="items_btn_{{:buttonClass}} bp-btn-items">
                      <li class="item_list bp-btn-item-cancel">
                          <button type="button" class="btn_grayLineh50_close">
                              <span class="txt_s16">취소</span>
                          </button>
                      </li>
                      <li class="item_list bp-btn-item-ok">
                          <button type="button" class="btn_brownh50">
                              <span class="txt_s16">확인</span>
                          </button>
                      </li>
                  </ul>
              </footer>
              <button type="button" class="btnIcon_close_gray bp-close-btn">
                  <span class="ir">닫기</span>
              </button>
          </div>
      </div>`;

  bpf.popup.setTemplate(skin1Tmpl);
  bpf.popup.setSkinOptions({
    title: 'NS Campus',
    skin: {
      ready: function () {
        var poppy = this;
        return new Promise(resolve => {
          setTimeout(function () {
            poppy.el.find('.bp-body').addClass('show');
            resolve();
          }, 50);
        })
      },
      close: function () {
        return new Promise(resolve => {
          document.querySelector(`#${this.id}.bpp`).addEventListener(
            'transitionend', () => {
              resolve();
            }
          );

          $(`#${this.id}.bpp .bp-body`).removeClass('show');
        });
      }
    }
  });

})();


/**
 * !!!! bpf.popup.js 보다 후행으로 선언되어야 한다 !!!!
 *
 * alert / confirm overwrite funcdtions
 * @author blackpet
 * @date 20.5.21
 */
function alert(message, fn) {
  var id = 'alert-' + Math.random().toString(36).substring(2, 10);
  var poppy = bpf.popup.create(id, {
    debug: true,
    template: '<div>{{:message}}</div>',
    width: 500,
    title: '',
    closeable: true,
    buttons: ['ok'],
    data: {
      message: message
    }
  });

  if (!!fn && typeof fn === 'function') {
    poppy.ok(fn);
  }
}

function confirm(message, fnOk, fnCancel) {
  var id = 'confirm-' + Math.random().toString(36).substring(2, 10);
  var poppy = bpf.popup.create(id, {
    debug: true,
    template: '<div>{{:message}}</div>',
    width: 500,
    title: '',
    closeable: false,
    buttons: ['ok', 'cancel'],
    data: {
      message: message
    }
  });

  if (!!fnOk && typeof fnOk === 'function') {
    poppy.ok(fnOk);
  }
  if (!!fnCancel && typeof fnCancel === 'function') {
    poppy.cancel(fnCancel);
  }
}

