// Service worker : affiche les notifications Edge demandées par content.js (création, relance, clôture de ticket)
// et ouvre le bon écran de RG System au clic. Il ne fait AUCUN appel réseau et ne lit rien : il reçoit des messages
// uniquement de notre propre script de contenu (vérifié par l'identifiant de l'extension).
const BASE = 'https://dashboard.rg-supervision.com/dashboard';
const HASH_OK = /^#\/node\/[A-Za-z0-9-]+\/page\/[a-z]+(\/[a-z]+)*$/;   // seule forme de lien acceptée (ex. #/node/240097/page/ticket)

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (!sender || sender.id !== chrome.runtime.id || !msg || msg.type !== 'rgx-notify' || !Array.isArray(msg.items)) return;
  for (const it of msg.items.slice(0, 5)) {
    if (!it || typeof it.title !== 'string') continue;
    const hash = HASH_OK.test(it.hash || '') ? it.hash : '';
    const id = 'rgx|' + encodeURIComponent(hash) + '|' + Date.now() + Math.random().toString(36).slice(2, 6);   // le lien voyage dans l'identifiant : rien à mémoriser si le worker s'endort
    chrome.notifications.create(id, {
      type: 'basic',
      iconUrl: 'icons/icon-128.png',
      title: it.title.slice(0, 80),
      message: String(it.message || '').slice(0, 220),
      priority: 1,
    });
  }
});

chrome.notifications.onClicked.addListener(async (id) => {
  chrome.notifications.clear(id);
  const hash = decodeURIComponent(id.split('|')[1] || '');
  const tabs = await chrome.tabs.query({ url: 'https://dashboard.rg-supervision.com/*' });
  if (tabs.length) {
    const tab = tabs.find((t) => t.active) || tabs[0];
    await chrome.tabs.update(tab.id, { active: true });
    await chrome.windows.update(tab.windowId, { focused: true });
    if (HASH_OK.test(hash)) chrome.tabs.sendMessage(tab.id, { type: 'rgx-open', hash }).catch(() => {});
  } else {
    chrome.tabs.create({ url: BASE + (HASH_OK.test(hash) ? hash : '') });
  }
});
