// ==UserScript==
// @name         RG ping (diagnostic)
// @namespace    https://arobase.alsace/
// @version      1.0.0
// @description  Script minimal : prouve que Tampermonkey s'exécute sur RG System (bordure rouge + message console).
// @match        https://dashboard.rg-supervision.com/*
// @match        https://example.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_getValue
// ==/UserScript==

(function () {
  'use strict';
  console.log('[RG PING] exécuté sur', location.href, '| GM_addStyle:', typeof GM_addStyle, '| GM_getValue:', typeof GM_getValue);
  const css = 'html{outline:6px solid #e11d48 !important;outline-offset:-6px}';
  let ok = false;
  try { const el = GM_addStyle(css); ok = !!(el && el.isConnected); console.log('[RG PING] GM_addStyle a retourné', el); } catch (e) { console.log('[RG PING] GM_addStyle erreur', e); }
  if (!ok) {
    const s = document.createElement('style');
    s.textContent = css;
    (document.head || document.documentElement).appendChild(s);
    console.log('[RG PING] repli : balise <style> ajoutée');
  }
})();
