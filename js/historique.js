/* ScolarIA — js/historique.js
   Historique & favoris, chat gardé sur le téléphone.
   Chargé par scolaria-home-v2.html, dans l'ordre des <script> (une ligne exécutée au chargement
   ne peut utiliser que les fonctions des fichiers chargés AVANT celui-ci). */

/* ══════════════════════════════════════════════
   HISTORIQUE & FAVORIS
══════════════════════════════════════════════ */
var _histCurrentId = null;
var HIST_TYPE_META = {
  fiche:      { label:'Fiche',        bg:'#f0fdf4', stroke:'#16a34a', svgPath:'<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/>' },
  flashcards: { label:'Flashcards',   bg:'#eef2ff', stroke:'#4f46e5', svgPath:'<rect x="4" y="6" width="16" height="12" rx="2"/><rect x="2" y="4" width="16" height="12" rx="2"/>' },
  quiz:       { label:'Interrogation',bg:'#fff1f2', stroke:'#f43f5e', svgPath:'<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>' },
  resume:     { label:'Résumé',       bg:'#fff7ed', stroke:'#f59e0b', svgPath:'<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="11" x2="15" y2="11"/><line x1="3" y1="16" x2="18" y2="16"/>' }
};

function loadHist() {
  try { return JSON.parse(localStorage.getItem('sk_hist') || '[]'); } catch(e) { return []; }
}
function saveHist(h) { try { localStorage.setItem('sk_hist', JSON.stringify(h)); } catch(e) {} scheduleSync(); }

function addToHist(type, topic, label, content) {
  var h = loadHist();
  var idx = -1;
  for (var i = 0; i < h.length; i++) { if (h[i].type === type && h[i].topic === topic) { idx = i; break; } }
  var fav = idx >= 0 ? h[idx].fav : false;
  if (idx >= 0) h.splice(idx, 1);
  var newItem = { id: Date.now(), type: type, topic: topic, label: label, content: content, date: new Date().toLocaleDateString('fr-FR'), fav: fav };
  h.unshift(newItem);
  if (h.length > 25) h = h.slice(0, 25);
  saveHist(h);
  _histCurrentId = newItem.id;
  renderHist();
}

function toggleFav(id, extraIconId) {
  var h = loadHist();
  var isFav = false;
  for (var i = 0; i < h.length; i++) {
    if (h[i].id === id) { h[i].fav = !h[i].fav; isFav = h[i].fav; break; }
  }
  saveHist(h);
  renderHist();
  renderFavs();
  if (_histCurrentId === id) _updateFsStar(isFav);
  if (extraIconId) {
    var ico = document.getElementById(extraIconId);
    if (ico) {
      ico.setAttribute('fill', isFav ? '#f59e0b' : 'none');
      ico.setAttribute('stroke', isFav ? '#f59e0b' : 'var(--mu)');
    }
  }
}
function toggleFavCurrent() { if (_histCurrentId) toggleFav(_histCurrentId); }
function toggleFavGen()     { if (_histCurrentId) toggleFav(_histCurrentId, 'gen-fav-ico'); }
function _updateFsStar(isFav) {
  var ico = document.getElementById('rev-fs-star-ico');
  if (!ico) return;
  ico.setAttribute('fill', isFav ? '#f59e0b' : 'none');
  ico.setAttribute('stroke', isFav ? '#f59e0b' : 'var(--mu)');
}

function deleteHist(id) {
  saveHist(loadHist().filter(function(x){ return x.id !== id; }));
  renderHist();
  renderFavs();
}
function clearHist() {
  saveHist([]);
  renderHist();
  renderFavs();
}

function reopenHist(id) {
  var h = loadHist();
  for (var i = 0; i < h.length; i++) {
    if (h[i].id !== id) continue;
    var item = h[i];
    window._revLastReply = item.content;
    window._revLastTopic = item.topic;
    window._revLastLabel = item.label;
    window._revLastType  = item.type;
    _histCurrentId = item.id;
    closeHistPanel();
    openRevFullscreen();
    return;
  }
}

function openHistPanel() {
  closeDrawer();
  renderHist();
  var p = document.getElementById('hist-panel');
  if (p) p.style.display = 'flex';
}
function closeHistPanel() {
  var p = document.getElementById('hist-panel');
  if (p) p.style.display = 'none';
}

function renderFavs() {
  var section = document.getElementById('rev-fav-section');
  var list    = document.getElementById('rev-fav-list');
  if (!section || !list) return;
  var h = loadHist().filter(function(x){ return x.fav; });
  if (!h.length) { section.style.display = 'none'; return; }
  section.style.display = 'block';
  list.innerHTML = h.map(function(item) {
    var m = HIST_TYPE_META[item.type] || HIST_TYPE_META.fiche;
    return '<div class="hist-row">' +
      '<div class="hist-icon" style="background:' + m.bg + '">' +
        '<svg viewBox="0 0 24 24" stroke="' + m.stroke + '" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + m.svgPath + '</svg>' +
      '</div>' +
      '<div class="hist-info" onclick="reopenHist(' + item.id + ')">' +
        '<div class="hist-title">' + esc(item.topic) + '</div>' +
        '<div class="hist-sub">' + m.label + ' &middot; ' + esc(item.date || '') + '</div>' +
      '</div>' +
      '<button class="hist-star" onclick="toggleFav(' + item.id + ')">' +
        '<svg viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' +
      '</button>' +
    '</div>';
  }).join('');
}

function renderHist() {
  var list = document.getElementById('hist-panel-list');
  if (!list) return;
  var h = loadHist();
  if (!h.length) {
    list.innerHTML = '<div class="hist-empty" style="padding-top:32px">Aucune génération pour l\'instant<br><span style="font-size:10px">Tes fiches, flashcards et quiz apparaîtront ici</span></div>';
    return;
  }
  var sorted = h.slice().sort(function(a, b) {
    if (a.fav && !b.fav) return -1;
    if (!a.fav && b.fav) return 1;
    return b.id - a.id;
  });
  list.innerHTML = sorted.map(function(item) {
    var m = HIST_TYPE_META[item.type] || HIST_TYPE_META.fiche;
    var sf = item.fav ? '#f59e0b' : 'none';
    var ss = item.fav ? '#f59e0b' : 'var(--mu)';
    return '<div class="hist-row">' +
      '<div class="hist-icon" style="background:' + m.bg + '">' +
        '<svg viewBox="0 0 24 24" stroke="' + m.stroke + '" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + m.svgPath + '</svg>' +
      '</div>' +
      '<div class="hist-info" onclick="reopenHist(' + item.id + ')">' +
        '<div class="hist-title">' + esc(item.topic) + '</div>' +
        '<div class="hist-sub">' + m.label + ' &middot; ' + esc(item.date || '') + '</div>' +
      '</div>' +
      '<button class="hist-star" onclick="toggleFav(' + item.id + ')">' +
        '<svg viewBox="0 0 24 24" fill="' + sf + '" stroke="' + ss + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' +
      '</button>' +
      '<button class="hist-del" onclick="deleteHist(' + item.id + ')">' +
        '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
      '</button>' +
    '</div>';
  }).join('');
}

/* ══════════════════════════════════════════════
   CHAT PERSISTANT
══════════════════════════════════════════════ */
function saveChatLS() {
  try { localStorage.setItem('sk_chat', JSON.stringify(chatHistory.slice(-20))); } catch(e) {}
  scheduleSync();
}
function loadChatLS() {
  try {
    var msgs = document.getElementById('chat-msgs');
    /* Évite les doublons si initApp() est rappelé par l'auth */
    if (msgs) Array.prototype.forEach.call(msgs.querySelectorAll('.msg'), function(m){ m.remove(); });
    var h = JSON.parse(localStorage.getItem('sk_chat') || '[]');
    if (!h.length) { resetShortcuts(); return; }
    chatHistory = h;
    var welcome = msgs ? msgs.querySelector('.chat-welcome') : null;
    if (welcome) welcome.remove();
    h.forEach(function(m) {
      var div = document.createElement('div');
      div.className = 'msg msg-' + (m.role === 'user' ? 'user' : 'ai');
      div.innerHTML = m.role === 'user' ? esc(m.content) : mdToHtml(m.content);
      if (msgs) msgs.appendChild(div);
    });
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
    collapseShortcuts();
    updateHomeStats();
  } catch(e) {}
}
