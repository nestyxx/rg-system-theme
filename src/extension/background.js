// Clic sur l'icône de l'extension = interrupteur du thème (interrupteur général).
// Le réglage est stocké dans le localStorage du site RG System ; la page est rechargée.
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const on = localStorage.getItem('rgx.enabled') !== '0';
      localStorage.setItem('rgx.enabled', on ? '0' : '1');
      location.reload();
    },
  });
});
