(function(global){
  function trapFocus(container, onClose) {
    var f = container.querySelectorAll('a[href], button, input, textarea, [tabindex]:not([tabindex="-1"])');
    if (!f.length) return function(){};
    var first = f[0];
    var last = f[f.length-1];
    return function(e){
      if (e.key === 'Escape') return onClose();
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
  }

  function setupModal(modal, trigger){
    if(!modal) return;
    var closeBtn = modal.querySelector('.modal__close');
    var onKey;
    function hide(){
      modal.classList.remove('modal--open');
      modal.setAttribute('aria-hidden','true');
      document.removeEventListener('keydown', onKey);
      trigger && trigger.focus();
    }
    onKey = trapFocus(modal, hide);
    function show(){
      modal.classList.add('modal--open');
      modal.setAttribute('aria-hidden','false');
      modal.focus();
      document.addEventListener('keydown', onKey);
    }
    trigger && trigger.addEventListener('click', show);
    closeBtn && closeBtn.addEventListener('click', hide);
    return {show: show, hide: hide};
  }

  function initModal(triggerSel, modalSel){
    var trigger = triggerSel ? document.querySelector(triggerSel) : null;
    var modal = document.querySelector(modalSel);
    return setupModal(modal, trigger);
  }

  function openModal(modalSel){
    var modal = document.querySelector(modalSel);
    var api = setupModal(modal, null);
    api && api.show();
  }
  var api = { initModal: initModal, openModal: openModal };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else global.modalUtils = api;
})(this);
