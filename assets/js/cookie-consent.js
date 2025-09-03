/* Simple Cookie Consent Banner for Helionis
 * Responsibilities:
 *  - Inject banner if no stored consent
 *  - Allow Accept All / Reject (essentials only) / Settings (granular)
 *  - Persist choice in localStorage under 'helionisConsent'
 *  - On accept analytics (or enabling in settings) call window.enableAnalytics()
 *  - Provide reopen via #cookie-settings-link
 */

(function(){
  const LS_KEY = 'helionisConsent';
  const existing = getStored();
  if (!existing) {
    injectBanner();
  } else {
    // update link to reopen settings
    prepareSettingsLink();
  }

  function getStored(){
    try { return JSON.parse(localStorage.getItem(LS_KEY)||''); } catch(e){ return null; }
  }
  function store(value){
    localStorage.setItem(LS_KEY, JSON.stringify(value));
  }

  function injectBanner(openSettingsMode=false){
    if (document.getElementById('cookie-consent-banner')) return;
    const banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.innerHTML = `
      <div class="cc-inner" role="dialog" aria-modal="true" aria-labelledby="cc-title">
        <div class="cc-header">
          <h2 id="cc-title">Cookies</h2>
        </div>
        <p>Wir verwenden essentielle Cookies um die Grundfunktionen der Seite sicherzustellen. Optional kannst du analytische Cookies (Firebase Analytics) erlauben, um uns bei der Verbesserung zu helfen.</p>
        <div class="cc-buttons">
          <button id="cc-accept-all" class="cc-primary">Alle akzeptieren</button>
          <button id="cc-reject" class="cc-secondary">Nur essentielle</button>
          <button id="cc-settings" class="cc-link" aria-expanded="false">Einstellungen</button>
        </div>
        <form id="cc-settings-panel" class="cc-settings" hidden>
          <fieldset>
            <legend>Präferenzen</legend>
            <label class="cc-option">
              <input type="checkbox" checked disabled> Essenziell (immer aktiv)
            </label>
            <label class="cc-option">
              <input type="checkbox" id="cc-analytics"> Analytik (Firebase Analytics)
            </label>
          </fieldset>
          <div class="cc-settings-actions">
            <button type="button" id="cc-save" class="cc-primary">Speichern</button>
          </div>
        </form>
      </div>`;
    document.body.appendChild(banner);
    applyStyles();
    wireEvents();
    if(openSettingsMode) toggleSettings(true);
    focusFirst();
  }

  function destroyBanner(){
    const b = document.getElementById('cookie-consent-banner');
    if (b) b.remove();
  }

  function wireEvents(){
    const acceptAll = document.getElementById('cc-accept-all');
    const reject = document.getElementById('cc-reject');
    const settingsBtn = document.getElementById('cc-settings');
    const saveBtn = document.getElementById('cc-save');
    const panel = document.getElementById('cc-settings-panel');
    const analyticsCb = document.getElementById('cc-analytics');

    acceptAll.addEventListener('click', () => {
      store({ version:1, date:Date.now(), analytics:true });
      if (window.enableAnalytics) window.enableAnalytics();
      destroyBanner();
      prepareSettingsLink();
    });
    reject.addEventListener('click', () => {
      store({ version:1, date:Date.now(), analytics:false });
      destroyBanner();
      prepareSettingsLink();
    });
    settingsBtn.addEventListener('click', () => {
      const expanded = settingsBtn.getAttribute('aria-expanded') === 'true';
      toggleSettings(!expanded);
    });
    saveBtn.addEventListener('click', () => {
      const consent = { version:1, date:Date.now(), analytics: !!analyticsCb.checked };
      store(consent);
      if (consent.analytics && window.enableAnalytics) window.enableAnalytics();
      destroyBanner();
      prepareSettingsLink();
    });
    document.addEventListener('keydown', escHandler);
    function escHandler(e){ if(e.key==='Escape'){ destroyBanner(); document.removeEventListener('keydown', escHandler);} }
  }

  function toggleSettings(show){
    const panel = document.getElementById('cc-settings-panel');
    const btn = document.getElementById('cc-settings');
    if(!panel || !btn) return;
    if(show){ panel.hidden = false; btn.setAttribute('aria-expanded','true'); }
    else { panel.hidden = true; btn.setAttribute('aria-expanded','false'); }
  }

  function focusFirst(){
    const btn = document.getElementById('cc-accept-all');
    if(btn) btn.focus();
  }

  function applyStyles(){
    if (document.getElementById('cookie-consent-styles')) return;
    const s = document.createElement('style');
    s.id = 'cookie-consent-styles';
    s.textContent = `#cookie-consent-banner{position:fixed;inset:auto 1rem 1rem 1rem;z-index:4000;background:rgba(20,22,30,.92);color:#fff;border:1px solid rgba(255,255,255,.15);border-radius:12px;box-shadow:0 10px 30px -5px rgba(0,0,0,.5);backdrop-filter:blur(6px);font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;padding:1.25rem;}#cookie-consent-banner .cc-inner{display:flex;flex-direction:column;gap:.75rem;}#cookie-consent-banner h2{margin:0 0 .25rem;font-size:1.25rem;letter-spacing:.5px;}#cookie-consent-banner p{margin:0;font-size:.9rem;line-height:1.35rem;}#cookie-consent-banner .cc-buttons{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.5rem;}#cookie-consent-banner button{cursor:pointer;font:inherit;}#cookie-consent-banner .cc-primary{background:linear-gradient(135deg,#ff9800,#ff5722);color:#fff;border:none;padding:.55rem 1rem;border-radius:6px;font-weight:600;box-shadow:0 2px 6px rgba(0,0,0,.4);}#cookie-consent-banner .cc-secondary{background:#2d313d;color:#fff;border:1px solid #444;padding:.55rem 1rem;border-radius:6px;}#cookie-consent-banner .cc-link{background:transparent;color:#bbb;border:none;padding:.55rem .75rem;text-decoration:underline;}#cookie-consent-banner .cc-link:hover{color:#fff;}#cookie-consent-banner .cc-settings{border-top:1px solid rgba(255,255,255,.15);padding-top:.75rem;margin-top:.25rem;}#cookie-consent-banner fieldset{border:none;padding:0;margin:0;display:flex;flex-direction:column;gap:.35rem;}#cookie-consent-banner legend{font-size:.85rem;font-weight:600;margin-bottom:.25rem;}#cookie-consent-banner label.cc-option{font-size:.8rem;display:flex;align-items:center;gap:.35rem;}#cookie-consent-banner input[type=checkbox]{width:16px;height:16px;cursor:pointer;}#cookie-consent-banner .cc-settings-actions{margin-top:.5rem;display:flex;justify-content:flex-end;}@media (max-width:640px){#cookie-consent-banner{left:.5rem;right:.5rem;bottom:.5rem;padding:1rem;}}
    `;
    document.head.appendChild(s);
  }

  function prepareSettingsLink(){
    const link = document.getElementById('cookie-settings-link');
    if(!link) return;
    link.addEventListener('click', (e)=>{ e.preventDefault(); injectBanner(true); const stored = getStored(); if(stored){ const cb = setTimeout(()=>{ const analyticsCb = document.getElementById('cc-analytics'); if(analyticsCb) analyticsCb.checked = !!stored.analytics;},50); }
    });
  }

  // In case link appears after script load
  const obs = new MutationObserver(()=>prepareSettingsLink());
  obs.observe(document.documentElement,{childList:true,subtree:true});
  prepareSettingsLink();
})();
