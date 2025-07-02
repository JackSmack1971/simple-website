(function(global){
  class FormError extends Error {
    constructor(msg, cause){
      super(msg); this.name='FormError'; this.cause=cause;
    }
  }

  function validEmail(val){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  async function postForm(url, data, timeout){
    const controller = new AbortController();
    const timer = setTimeout(()=>controller.abort(), timeout);
    try{
      const res = await globalThis.fetch(url,{method:'POST',body:data,signal:controller.signal});
      clearTimeout(timer);
      if(!res.ok) throw new FormError('Bad response', res.statusText);
      return await res.json();
    }catch(err){
      clearTimeout(timer);
      throw new FormError('Request failed', err);
    }
  }

  function initNewsletterForm(selector){
    const form = document.querySelector(selector);
    if(!form) return;
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const email = form.querySelector('input[type=email]');
      if(!email || !validEmail(email.value)) {
        const CE = form.ownerDocument.defaultView.CustomEvent;
        form.dispatchEvent(new CE('formerror', { detail: 'invalid' }));
        return;
      }
      try{
        await postForm(form.action || '/subscribe', new FormData(form), 8000);
        form.reset();
        const modal = document.getElementById('subscribe-modal');
        if(global.modalUtils && modal){
          global.modalUtils.openModal('#subscribe-modal');
        }
      }catch(_){
        const CE2 = form.ownerDocument.defaultView.CustomEvent;
        form.dispatchEvent(new CE2('formerror', { detail: 'submit' }));
      }
    });
  }

  const api = { initNewsletterForm, FormError };
  if(typeof module==='object' && module.exports) module.exports = api;
  else global.formUtils = api;
})(this);
