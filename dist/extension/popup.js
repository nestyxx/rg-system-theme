// Panneau de réglages de l'extension (clic sur l'icône). Les réglages vivent dans le localStorage du site RG System
// (lecture synchrone par content.js, donc sans clignotement) : ce panneau les lit et les écrit dans l'onglet actif
// avec chrome.scripting (permission « activeTab » : accordée par le clic sur l'icône, limitée à l'onglet courant).
// content.js applique ensuite le changement en direct (événement DOM « rgx-set »), sans recharger la page, sauf pour l'interrupteur général.
const $ = (id) => document.getElementById(id);
const HOST = /^https:\/\/dashboard\.rg-supervision\.com\//;

async function activeTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}
async function inPage(tab, func, args = []) {
  const [res] = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func, args });
  return res && res.result;
}
function readSettings() {
  const g = (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } };
  return { enabled: g('rgx.enabled', '1') !== '0', theme: g('rgx.theme', 'auto'), density: g('rgx.density', 'comfortable'), autoReload: g('rgx.autoReload', '1') !== '0', notify: g('rgx.notify', '0') === '1', nNew: g('rgx.notify.new', '1') !== '0', nRaise: g('rgx.notify.raise', '1') !== '0', nClose: g('rgx.notify.close', '1') !== '0' };
}
function writeSetting(key, value, reload) {
  try { localStorage.setItem(key, value); } catch (e) { /* stockage indisponible */ }
  if (reload) location.reload();
  else document.dispatchEvent(new CustomEvent('rgx-set', { detail: { key, value } }));
}
function resetTree() {
  try { localStorage.removeItem('rgx.treeWidth'); } catch (e) { /* stockage indisponible */ }
  document.dispatchEvent(new CustomEvent('rgx-set', { detail: { key: 'rgx.treeWidth', value: '' } }));
}

function paintSeg(id, value) {
  $(id).querySelectorAll('button').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.v === value)));
}

(async () => {
  $('ver').textContent = 'Version ' + chrome.runtime.getManifest().version;
  const tab = await activeTab();
  if (!tab || !tab.url || !HOST.test(tab.url)) { $('off').hidden = false; return; }
  const s = await inPage(tab, readSettings);
  if (!s) { $('off').hidden = false; return; }
  $('panel').hidden = false;
  $('enabled').checked = s.enabled;
  $('autoReload').checked = s.autoReload;
  $('notify').checked = s.notify; $('notifyKinds').hidden = !s.notify;
  $('nNew').checked = s.nNew; $('nRaise').checked = s.nRaise; $('nClose').checked = s.nClose;
  paintSeg('theme', s.theme);
  paintSeg('density', s.density);

  $('enabled').addEventListener('change', async (e) => { await inPage(tab, writeSetting, ['rgx.enabled', e.target.checked ? '1' : '0', true]); window.close(); });
  $('autoReload').addEventListener('change', (e) => inPage(tab, writeSetting, ['rgx.autoReload', e.target.checked ? '1' : '0', false]));
  for (const [id, key] of [['theme', 'rgx.theme'], ['density', 'rgx.density']]) {
    $(id).addEventListener('click', async (e) => {
      const b = e.target.closest('button'); if (!b) return;
      paintSeg(id, b.dataset.v);
      await inPage(tab, writeSetting, [key, b.dataset.v, false]);
    });
  }
  $('notify').addEventListener('change', (e) => { $('notifyKinds').hidden = !e.target.checked; inPage(tab, writeSetting, ['rgx.notify', e.target.checked ? '1' : '0', false]); });
  for (const [id, key] of [['nNew', 'rgx.notify.new'], ['nRaise', 'rgx.notify.raise'], ['nClose', 'rgx.notify.close']]) $(id).addEventListener('change', (e) => inPage(tab, writeSetting, [key, e.target.checked ? '1' : '0', false]));
  $('notifyTest').addEventListener('click', () => inPage(tab, writeSetting, ['rgx.notifyTest', String(Date.now()), false]));
  $('treeReset').addEventListener('click', () => inPage(tab, resetTree));
})().catch(() => { $('off').hidden = false; });
