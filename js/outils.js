/* ScolarIA — js/outils.js
   Outils : Pomodoro, calculatrice, convertisseur, conjugueur, moyenne, quiz vocal,
   interro IA (choix du sujet), scanner de cours.
   Chargé par scolaria-home-v2.html, dans l'ordre des <script> (une ligne exécutée au chargement
   ne peut utiliser que les fonctions des fichiers chargés AVANT celui-ci). */

/* ══ MODALES OUTILS ══ */
var TOOL_TITLES = { calc: 'Calculatrice', conv: 'Convertisseur', conj: 'Conjugueur' };

function openTool(name) {
  if (name === 'pomo') {
    document.getElementById('pomo-modal').classList.add('open');
    initPomo();
    return;
  }
  if (name === 'moy') {
    document.getElementById('moy-modal').classList.add('open');
    if (!document.getElementById('nl').children.length) { addNR(); addNR(); addNR(); }
    return;
  }
  /* calc / conv / conj → modal partagé */
  document.getElementById('tool-title').textContent = TOOL_TITLES[name] || name;
  ['calc-panel','conv-panel','conj-panel'].forEach(function(id){
    var p = document.getElementById(id);
    if (p) p.classList.remove('show');
  });
  var panel = document.getElementById(name + '-panel');
  if (panel) panel.classList.add('show');
  document.getElementById('tool-modal').classList.add('open');
  if (name === 'conv') setTimeout(initConv, 50);
  if (name === 'conj') setTimeout(function(){ var i = document.getElementById('conj-verb-inp'); if(i) i.focus(); }, 200);
}

function closeTool(name) {
  if (name === 'pomo' || name === 'moy') {
    var m = document.getElementById(name + '-modal');
    if (m) m.classList.remove('open');
  } else {
    document.getElementById('tool-modal').classList.remove('open');
    ['calc-panel','conv-panel','conj-panel'].forEach(function(id){
      var p = document.getElementById(id);
      if (p) p.classList.remove('show');
    });
  }
}

/* ══ POMODORO ══ */
var PORC = 2 * Math.PI * 75;
var poS = 25*60, poR = false, poI = null, poW = true, poC = 0, poF = 0, poSk = 0;
var POMO_WORK = ['Tu es en mode focus.','25 minutes, tu peux le faire.','Éteins les notifs, c\'est ton moment.','Chaque pomodoro te rapproche de ton objectif.','Allez, concentration !'];
var POMO_BREAK = ['Pause méritée. Lève-toi, bois de l\'eau.','5 minutes pour recharger les batteries.','Étire-toi, ton cerveau le mérite.','Respire profondément. Le focus revient tout seul.'];

function initPomo() { updPoRing(); }

function updPoRing() {
  var tot = poW ? 25*60 : 5*60;
  var off = PORC * (1 - poS / tot);
  var pr = document.getElementById('ppr');
  if (pr) { pr.style.strokeDashoffset = off; pr.style.stroke = poW ? 'var(--accent)' : 'var(--success)'; }
  var m = String(Math.floor(poS/60)).padStart(2,'0');
  var s = String(poS%60).padStart(2,'0');
  var dig = document.getElementById('pdig');
  if (dig) dig.textContent = m + ':' + s;
}

/* Le temps restant est calcule depuis l'heure de fin (poFin) : quand le telephone est
   verrouille, Android gele setInterval ; au deverrouillage le minuteur est quand meme juste. */
var poFin = 0;
function poTick() {
  if (!poR) return;
  var reste = Math.max(0, Math.round((poFin - Date.now()) / 1000));
  if (poW) poF += Math.max(0, poS - reste);
  poS = reste;
  updPoRing();
  if (poS <= 0) poEnd();
}
document.addEventListener('visibilitychange', function() { if (!document.hidden) poTick(); });
function togglePomo() {
  if (poR) {
    poTick();
    clearInterval(poI); poR = false;
    document.getElementById('ppbtn').textContent = '▶';
    document.getElementById('psub').textContent = 'En pause...';
  } else {
    poR = true;
    poFin = Date.now() + poS * 1000;
    document.getElementById('ppbtn').textContent = '⏸';
    document.getElementById('psub').textContent = poW ? 'Focus total !' : 'Pause méritée';
    var q = poW ? POMO_WORK : POMO_BREAK;
    var qel = document.getElementById('pomo-quote');
    if (qel) qel.textContent = q[Math.floor(Math.random()*q.length)];
    poI = setInterval(poTick, 500);
  }
}
function poSkip() { var phase = poW; poTick(); if (poW === phase) poEnd(); }   /* poTick a pu deja finir la phase */

function pomoAlert() {
  try { if (navigator.vibrate) navigator.vibrate([350, 120, 350, 120, 350, 120, 450]); } catch(e) {}
  try {
    var Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    var ac = new Ctx();
    if (ac.state === 'suspended') { try { ac.resume(); } catch(e) {} }
    var master = ac.createGain();
    master.gain.value = 0.9;
    master.connect(ac.destination);
    // Carillon ascendant joué 2 fois pour bien se faire entendre
    var notes = [880, 1108, 1318, 1760];
    for (var rep = 0; rep < 2; rep++) {
      notes.forEach(function(freq, i) {
        var o = ac.createOscillator(), g = ac.createGain();
        o.type = 'triangle'; o.frequency.value = freq;
        o.connect(g); g.connect(master);
        var t = ac.currentTime + rep * 0.95 + i * 0.2;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.6, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
        o.start(t); o.stop(t + 0.34);
      });
    }
    setTimeout(function(){ try { ac.close(); } catch(e) {} }, 2500);
  } catch(e) {}
}

function poEnd() {
  clearInterval(poI); poR = false;
  pomoAlert();
  document.getElementById('ppbtn').textContent = '▶';
  if (poW) {
    poC++; poSk++;
    document.getElementById('pc').textContent = poC;
    document.getElementById('psk').textContent = poSk;
    document.getElementById('pf').textContent = Math.floor(poF/60);
    poW = false; poS = 5*60;
    var ph = document.getElementById('pph'); ph.textContent = 'PAUSE'; ph.style.background = 'rgba(22,163,74,.15)'; ph.style.color = 'var(--success)';
    document.getElementById('psub').textContent = 'Pause 5 min !';
    document.getElementById('pomo-quote').textContent = 'Bien mérité ! Détends-toi.';
    markActivity();
  } else {
    poW = true; poS = 25*60;
    var ph2 = document.getElementById('pph'); ph2.textContent = 'TRAVAIL'; ph2.style.background = 'var(--accent-l)'; ph2.style.color = 'var(--accent)';
    document.getElementById('psub').textContent = 'On repart !';
  }
  updPoRing();
}

function resetPomo() {
  clearInterval(poI); poR = false; poW = true; poS = 25*60;
  document.getElementById('ppbtn').textContent = '▶';
  var ph = document.getElementById('pph'); ph.textContent = 'TRAVAIL'; ph.style.background = 'var(--accent-l)'; ph.style.color = 'var(--accent)';
  document.getElementById('psub').textContent = 'Prêt à bosser ?';
  document.getElementById('pomo-quote').textContent = 'Lance le timer pour commencer';
  updPoRing();
}

/* ══ CALCULATRICE ══ */
var calcExpr = '';

function calcInput(v) {
  calcExpr += v;
  document.getElementById('calc-expr').textContent = calcExpr;
  try {
    var r = Function('"use strict";return (' + calcExpr + ')')();
    if (isFinite(r)) document.getElementById('calc-result').textContent = parseFloat(r.toFixed(10)).toString();
  } catch(e) {}
}

function calcEquals() {
  try {
    var r = Function('"use strict";return (' + calcExpr + ')')();
    var result = parseFloat(r.toFixed(10)).toString();
    document.getElementById('calc-result').textContent = result;
    document.getElementById('calc-expr').textContent = calcExpr + ' =';
    calcExpr = result;
  } catch(e) { document.getElementById('calc-result').textContent = 'Erreur'; }
}

function calcClear() { calcExpr = ''; document.getElementById('calc-expr').textContent = ''; document.getElementById('calc-result').textContent = '0'; }
function calcDel() { calcExpr = calcExpr.slice(0,-1); document.getElementById('calc-expr').textContent = calcExpr; if (!calcExpr) document.getElementById('calc-result').textContent = '0'; }
function calcSci(v) { calcInput(v); }

/* ══ CONVERTISSEUR ══ */
var CONV_DATA = {
  longueur:    { units:['mm','cm','dm','m','km','pouce','pied','mile'], toM:{mm:1e-3,cm:0.01,dm:0.1,m:1,km:1000,pouce:0.0254,pied:0.3048,mile:1609.34} },
  masse:       { units:['mg','g','kg','tonne','once','lb'],             toM:{mg:1e-6,g:0.001,kg:1,tonne:1000,once:0.02835,lb:0.4536} },
  temperature: { units:['°C','°F','K'], toM:null },
  vitesse:     { units:['m/s','km/h','mph'], toM:{'m/s':1,'km/h':0.2778,mph:0.4470} },
  aire:        { units:['mm²','cm²','m²','km²','ha'], toM:{'mm²':1e-6,'cm²':1e-4,'m²':1,'km²':1e6,ha:1e4} },
  volume:      { units:['mL','cL','dL','L','m³'],    toM:{mL:0.001,cL:0.01,dL:0.1,L:1,'m³':1000} }
};
var convCat = 'longueur';

function initConv() { setConvCat('longueur', document.querySelector('.conv-cat')); }

function setConvCat(cat, el) {
  convCat = cat;
  document.querySelectorAll('.conv-cat').forEach(function(b){ b.classList.remove('on'); });
  if (el) el.classList.add('on');
  var d = CONV_DATA[cat];
  var from = document.getElementById('conv-from');
  var to   = document.getElementById('conv-to');
  if (!from || !to || !d) return;
  from.innerHTML = d.units.map(function(u){ return '<option>' + u + '</option>'; }).join('');
  to.innerHTML   = d.units.map(function(u,i){ return '<option' + (i===1?' selected':'') + '>' + u + '</option>'; }).join('');
  doConvert();
}

function doConvert() {
  var val  = parseFloat(document.getElementById('conv-val').value) || 0;
  var from = document.getElementById('conv-from').value;
  var to   = document.getElementById('conv-to').value;
  var res  = document.getElementById('conv-result');
  if (!res) return;
  if (from === to) { res.textContent = val + ' ' + to; return; }
  if (convCat === 'temperature') {
    var r;
    if (from==='°C'&&to==='°F') r=val*9/5+32;
    else if (from==='°F'&&to==='°C') r=(val-32)*5/9;
    else if (from==='°C'&&to==='K')  r=val+273.15;
    else if (from==='K'&&to==='°C')  r=val-273.15;
    else if (from==='°F'&&to==='K')  r=(val-32)*5/9+273.15;
    else if (from==='K'&&to==='°F')  r=(val-273.15)*9/5+32;
    else r = val;
    res.textContent = parseFloat(r.toFixed(4)) + ' ' + to;
    return;
  }
  var d = CONV_DATA[convCat];
  if (!d) return;
  var inM = val * (d.toM[from] || 1);
  var result = inM / (d.toM[to] || 1);
  res.textContent = parseFloat(result.toFixed(6)) + ' ' + to;
}

/* ══ CONJUGUEUR — 100% IA : vraies conjugaisons, tout verbe, tous les temps (FR/EN/ES) ══ */
var CONJ_CACHE = {};   /* cache par "lang:verbe" pour eviter de rappeler l IA */
var conjTimer  = null; /* debounce de la saisie */
var conjReqId  = 0;    /* garde anti-course entre requetes concurrentes */

var CONJ_PROMPTS = {
  fr: function(v){ return 'Conjugue le verbe francais "' + v + '". Corrige l orthographe si l entree est approximative et conjugue le vrai verbe. '
    + 'Reponds UNIQUEMENT avec des tableaux markdown, un par temps, dans cet ordre exact :\n'
    + 'Present, Imparfait, Passe compose, Futur simple, Conditionnel present, Subjonctif present, Imperatif.\n'
    + 'Avant chaque tableau, mets un titre de la forme "### Nom du temps".\n'
    + 'Chaque tableau a 2 colonnes : | Pronom | Forme | avec la ligne de separation | --- | --- |.\n'
    + 'Pronoms : je, tu, il/elle, nous, vous, ils/elles. Pour l Imperatif, seulement tu, nous, vous.\n'
    + 'Termine par une ligne : "**Participe passe :** ...".\n'
    + 'Aucune phrase d introduction ni de conclusion. Uniquement les titres et les tableaux.'; },
  en: function(v){ return 'Conjugate the English verb "' + v + '". Fix the spelling if the input is approximate and conjugate the real verb. '
    + 'Reply ONLY with markdown tables, one per tense, in this exact order:\n'
    + 'Present simple, Present continuous, Past simple, Past continuous, Present perfect, Future (will), Conditional (would).\n'
    + 'Before each table, add a title of the form "### Tense name".\n'
    + 'Each table has 2 columns: | Pronoun | Form | with the separator row | --- | --- |.\n'
    + 'Pronouns: I, you, he/she/it, we, you, they.\n'
    + 'End with a line: "**Past participle:** ...".\n'
    + 'No introduction and no conclusion. Only the titles and the tables.'; },
  es: function(v){ return 'Conjuga el verbo espanol "' + v + '". Corrige la ortografia si la entrada es aproximada y conjuga el verbo real. '
    + 'Responde SOLO con tablas markdown, una por tiempo, en este orden exacto:\n'
    + 'Presente, Preterito imperfecto, Preterito indefinido, Futuro simple, Condicional, Presente de subjuntivo, Imperativo.\n'
    + 'Antes de cada tabla, pon un titulo de la forma "### Nombre del tiempo".\n'
    + 'Cada tabla tiene 2 columnas: | Pronombre | Forma | con la fila separadora | --- | --- |.\n'
    + 'Pronombres: yo, tu, el/ella, nosotros, vosotros, ellos/ellas. Para el Imperativo: tu, usted, nosotros, vosotros, ustedes.\n'
    + 'Termina con una linea: "**Participio:** ...".\n'
    + 'Sin introduccion ni conclusion. Solo los titulos y las tablas.'; }
};
var CONJ_LOADING = { fr:'ScolarIA conjugue', en:'ScolarIA is conjugating', es:'ScolarIA está conjugando' };
var CONJ_SYS = 'Tu es un conjugueur expert et rigoureux (francais, anglais, espagnol). Tes conjugaisons sont toujours correctes, y compris pour les verbes irreguliers. Tu ne renvoies que des tableaux markdown, sans commentaire.';

function doConj(verb) {
  var res    = document.getElementById('conj-result');
  var langEl = document.getElementById('conj-lang');
  var lang   = langEl ? langEl.value : 'fr';
  if (!res) return;
  verb = (verb || '').toLowerCase().trim().replace(/[^a-zàâäéèêëîïôöùûüçñ' -]/gi, '');
  if (conjTimer) clearTimeout(conjTimer);
  conjReqId++;
  if (!verb || verb.length < 2) { res.innerHTML = ''; return; }

  var key = lang + ':' + verb;
  if (CONJ_CACHE[key]) { res.innerHTML = CONJ_CACHE[key]; return; }

  res.innerHTML = '<div class="conj-ai-loading"><span class="conj-ai-spin"></span>' + CONJ_LOADING[lang] + '…</div>';
  var myId = conjReqId;
  conjTimer = setTimeout(function(){
    callGroq([{ role:'system', content:CONJ_SYS }, { role:'user', content:CONJ_PROMPTS[lang](verb) }], 2200, { noNiveau: true })
      .then(function(reply){
        if (myId !== conjReqId) return; /* une saisie plus recente a pris le relais */
        var html = '<div class="conj-box"><div class="conj-title">' + esc(verb) + '</div>' + mdToHtml(reply) + '</div>';
        CONJ_CACHE[key] = html;
        res.innerHTML = html;
      })
      .catch(function(e){
        if (myId !== conjReqId) return;
        res.innerHTML = '<div style="color:var(--danger);font-size:13px;padding:12px;text-align:center">Erreur : ' + esc(e.message) + '</div>';
      });
  }, 650);
}

/* ══ MOYENNE ══ */
function addNR() {
  var l = document.getElementById('nl');
  var r = document.createElement('div');
  r.className = 'nr';
  r.innerHTML = '<label>Note</label><input type="number" placeholder="14" min="0" max="20" step="0.5" class="ni-i"><label style="margin-left:4px">Coef</label><input type="number" placeholder="1" min="0.5" value="1" class="ci-i" style="width:48px"><button class="ndel" onclick="this.closest(\'.nr\').remove()">✕</button>';
  l.appendChild(r);
}

function calcMoy() {
  var ns = document.querySelectorAll('#nl .ni-i');
  var cs = document.querySelectorAll('#nl .ci-i');
  var tot = 0, totC = 0;
  ns.forEach(function(n,i){ var v=parseFloat(n.value),c=parseFloat(cs[i]?cs[i].value:1)||1; if(!isNaN(v)&&v>=0&&v<=20){tot+=v*c;totC+=c;} });
  if (!totC) { document.getElementById('mbig').textContent='—'; document.getElementById('mmsg').textContent='Remplis au moins une note !'; return; }
  var moy = (tot/totC).toFixed(2);
  var col = moy>=14 ? 'var(--success)' : moy>=10 ? 'var(--accent)' : 'var(--danger)';
  var msg = moy>=16?'Excellente moyenne !':moy>=14?'Très bien !':moy>=12?'Bien, continue !':moy>=10?'Ça passe, encore un effort !':'Du travail en perspective...';
  document.getElementById('mbig').style.color = col;
  document.getElementById('mbig').textContent = moy + '/20';
  document.getElementById('mmsg').textContent = msg;
}

/* ══════════════════════════════════════════════
   QUIZ VOCAL
══════════════════════════════════════════════ */
var vqCards=[], vqIdx=0, vqOk=0;
var vqSpeech=null, vqListening=false, vqManualStop=false, vqCurrentAnswer='';

function openVocalQuiz() {
  document.getElementById('vq-modal').classList.add('open');
  showVQForm();
}
function closeVocalQuiz() {
  stopVocalListening();
  document.getElementById('vq-modal').classList.remove('open');
}
function showVQForm() {
  document.getElementById('vq-content').innerHTML =
    '<label class="rev-topic-lbl">Sujet ou thème</label>' +
    '<input id="vq-topic" class="rev-topic-inp" placeholder="ex: Pythagore, la photosynthèse..." style="margin-bottom:14px" oninput="this.classList.remove(\'err\')">' +
    '<button class="rev-go-btn" onclick="startVQ()">' +
      '<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 12a7 7 0 0014 0"/><line x1="12" y1="19" x2="12" y2="22"/></svg>' +
      'Générer les questions' +
    '</button>';
}
async function startVQ() {
  var topic = document.getElementById('vq-topic') ? document.getElementById('vq-topic').value.trim() : '';
  if (!topic) { var i=document.getElementById('vq-topic'); if(i)i.classList.add('err'); return; }
  document.getElementById('vq-content').innerHTML =
    '<div class="rev-loading"><div class="rev-spin"></div>' +
    '<div class="rev-loading-txt">Génération des questions...</div>' +
    '<div class="rev-loading-sub">Quelques secondes</div></div>';
  try {
    var prompt = 'Génère exactement 8 flashcards sur le sujet EXACT : "' + topic + '" (niveau ' + getClasse() + ').\nFORMAT OBLIGATOIRE — uniquement ce tableau, rien d\'autre :\n| Question | Réponse |\n| --- | --- |\nToutes les questions doivent porter UNIQUEMENT sur "' + topic + '".';
    var reply;
    reply = await callGroq([{role:'system',content:SCOLARIA_SYSTEM},{role:'user',content:prompt}], undefined, { niveau: 'revision' });
    vqCards = parseFlashCards(reply, 8);
    if (!vqCards.length) throw new Error('Aucune question générée — réessaie avec un autre sujet');
    vqIdx=0; vqOk=0;
    renderVQCard();
  } catch(e) {
    document.getElementById('vq-content').innerHTML =
      '<div class="rev-err-box">'+esc(e.message)+'<br><button onclick="showVQForm()">Réessayer</button></div>';
  }
}
function renderVQCard() {
  if (vqIdx >= vqCards.length) {
    /* Sauvegarder les stats quiz vocal pour la progression */
    try {
      var qStats = JSON.parse(localStorage.getItem('sk_quiz_stats') || '{"ok":0,"total":0}');
      qStats.total += vqCards.length;
      qStats.ok    += vqOk;
      localStorage.setItem('sk_quiz_stats', JSON.stringify(qStats));
    } catch(e) {}
    markActivity();
    updateHomeProgression();
    var pct = Math.round(vqOk / vqCards.length * 100);
    var clr = pct>=80?'var(--success)':pct>=50?'var(--accent)':'var(--danger)';
    document.getElementById('vq-content').innerHTML =
      '<div style="text-align:center;padding:20px 0">' +
        '<div class="vq-score-circle" style="border-color:'+clr+';color:'+clr+';background:'+clr+'22">'+pct+'%</div>' +
        '<div style="font-size:20px;font-weight:900;color:var(--tx);margin-bottom:6px">'+(pct>=80?'Excellent !':pct>=50?'Bien joué !':'Continue !')+'</div>' +
        '<div style="font-size:13px;color:var(--mu);margin-bottom:24px">'+vqOk+' / '+vqCards.length+' correctes</div>' +
        '<button class="rev-go-btn" onclick="startVQ()">Rejouer</button>' +
        '<button class="rev-ia-btn-sec" style="margin-top:10px" onclick="showVQForm()">Nouveau sujet</button>' +
      '</div>';
    return;
  }
  var card = vqCards[vqIdx];
  vqCurrentAnswer=''; vqManualStop=false; vqListening=false;
  document.getElementById('vq-content').innerHTML =
    '<div style="text-align:center;font-size:12px;color:var(--mu);margin-bottom:8px;font-weight:700">'+(vqIdx+1)+' / '+vqCards.length+' &nbsp;·&nbsp; ✅ '+vqOk+'</div>' +
    '<div class="vq-card">' +
      '<div class="vq-q">'+esc(card.q)+'</div>' +
      '<button class="vq-mic" id="vq-mic-btn" onclick="toggleVocalAnswer()" aria-label="Enregistrer">' +
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 12a7 7 0 0014 0"/><line x1="12" y1="19" x2="12" y2="22"/></svg>' +
      '</button>' +
      '<div class="vq-transcript" id="vq-transcript">Appuie sur le micro et réponds à voix haute</div>' +
      '<div class="vq-feedback" id="vq-feedback" style="display:none"></div>' +
      '<div style="display:flex;gap:10px;margin-top:12px">' +
        '<button id="vq-send-btn" onclick="vqSendAnswer()" style="display:none;flex:1;background:var(--accent);color:#fff;border:none;border-radius:12px;padding:13px;font-size:14px;font-weight:700;cursor:pointer;font-family:var(--fb)">Envoyer</button>' +
        '<button id="vq-next-btn" onclick="vqNext()" style="display:none;flex:1;background:var(--success);color:#fff;border:none;border-radius:12px;padding:13px;font-size:14px;font-weight:700;cursor:pointer;font-family:var(--fb)">Suivant →</button>' +
      '</div>' +
    '</div>';
}
function toggleVocalAnswer() {
  if (vqListening) { stopVocalListening(); return; }
  vqCurrentAnswer=''; vqManualStop=false;
  startVocalListening();
}
function startVocalListening() {
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { toast('Reconnaissance vocale non supportée — utilise Chrome'); return; }
  vqSpeech = new SR();
  vqSpeech.lang='fr-FR'; vqSpeech.continuous=false; vqSpeech.interimResults=true;
  var segFinal='';
  vqSpeech.onstart = function() {
    vqListening=true; segFinal='';
    var mb=document.getElementById('vq-mic-btn'); if(mb) mb.classList.add('listening');
    var tr=document.getElementById('vq-transcript');
    if(tr && !vqCurrentAnswer) tr.textContent='🎤 Parle... (reclique pour arrêter)';
  };
  vqSpeech.onresult = function(e) {
    var interim='', final='';
    for(var i=e.resultIndex;i<e.results.length;i++){
      if(e.results[i].isFinal) final+=e.results[i][0].transcript;
      else interim+=e.results[i][0].transcript;
    }
    if(final) segFinal+=final;
    var shown=(vqCurrentAnswer+(vqCurrentAnswer&&(segFinal||interim)?' ':'')+segFinal+interim).trim();
    var tr=document.getElementById('vq-transcript'); if(tr) tr.textContent=shown||'🎤 Parle...';
  };
  vqSpeech.onend = function() {
    if(segFinal) {
      vqCurrentAnswer=(vqCurrentAnswer+(vqCurrentAnswer?' ':'')+segFinal).trim();
      var tr=document.getElementById('vq-transcript'); if(tr) tr.textContent=vqCurrentAnswer;
    }
    if(!vqManualStop && vqListening) { setTimeout(function(){if(!vqManualStop)startVocalListening();},120); return; }
    vqListening=false;
    var mb=document.getElementById('vq-mic-btn'); if(mb) mb.classList.remove('listening');
    if(vqCurrentAnswer.trim()) { var sb=document.getElementById('vq-send-btn'); if(sb) sb.style.display='block'; }
  };
  vqSpeech.onerror = function(ev) {
    if(ev.error==='no-speech'||ev.error==='aborted') return;
    vqManualStop=true; vqListening=false;
    var mb=document.getElementById('vq-mic-btn'); if(mb) mb.classList.remove('listening');
    toast('Erreur micro : '+ev.error);
  };
  try{ vqSpeech.start(); } catch(e){ toast('Micro non disponible'); }
}
function stopVocalListening() {
  vqManualStop=true; vqListening=false;
  try{ if(vqSpeech) vqSpeech.stop(); }catch(e){}
  var mb=document.getElementById('vq-mic-btn'); if(mb) mb.classList.remove('listening');
}
function vqSendAnswer() {
  var t=(vqCurrentAnswer||'').trim();
  if(!t){toast('Dicte d\'abord ta réponse');return;}
  if(vqListening) stopVocalListening();
  var sb=document.getElementById('vq-send-btn'); if(sb) sb.style.display='none';
  checkVQAnswer(t);
}
async function checkVQAnswer(answer) {
  var card=vqCards[vqIdx];
  var fbEl=document.getElementById('vq-feedback'); if(!fbEl) return;
  fbEl.style.display='block'; fbEl.textContent='⚡ Vérification...'; fbEl.className='vq-feedback';
  try{
    var c=await corrigerReponse(card.q, card.a, answer);
    if(c.ok){vqOk++; fbEl.className='vq-feedback vq-ok';}
    else{fbEl.className='vq-feedback vq-ko';}
    fbEl.textContent=(c.ok?'✅ ':'❌ ')+c.expl;
  }catch(e){fbEl.className='vq-feedback vq-ko';fbEl.textContent='Correction impossible. Exemple de bonne réponse : '+card.a;}
  var nb=document.getElementById('vq-next-btn'); if(nb) nb.style.display='block';
}
function vqNext(){ vqIdx++; renderVQCard(); }

/* ══════════════════════════════════════════════
   INTERROGATION IA
   La fenetre sert seulement a choisir le sujet et le nombre de questions : l'interrogation
   se deroule dans le chat (fonctions cq* : QCM a boutons, correction, bilan, historique).
   Avant : un 2e systeme en double, qui demandait des QCM sans jamais afficher les choix.
══════════════════════════════════════════════ */
function openInterroAI() {
  document.getElementById('interro-ai-modal').classList.add('open');
  showInterroForm();
}
function closeInterroAI() { document.getElementById('interro-ai-modal').classList.remove('open'); }
function showInterroForm() {
  var bouton = function(n, on) {
    return '<button id="iq-' + n + '" onclick="setIQ(' + n + ',this)" style="cursor:pointer;flex:1;padding:8px;border-radius:10px;border:1.5px solid ' + (on ? 'var(--accent)' : 'var(--bord)') + ';background:' + (on ? 'var(--accent-l)' : 'transparent') + ';color:' + (on ? 'var(--accent)' : 'var(--mu)') + ';font-weight:700;font-family:var(--fb);font-size:13px">' + n + '</button>';
  };
  document.getElementById('interro-ai-content').innerHTML =
    '<label class="rev-topic-lbl">Sujet</label>' +
    '<input id="interro-topic" class="rev-topic-inp" placeholder="ex : La Révolution française, les fonctions..." style="margin-bottom:10px" oninput="this.classList.remove(\'err\')" onkeydown="if(event.key===\'Enter\')startInterroAI()">' +
    '<label class="rev-topic-lbl">Nombre de questions</label>' +
    '<div style="display:flex;gap:8px;margin-bottom:14px">' + bouton(5, true) + bouton(8, false) + bouton(10, false) + '</div>' +
    '<div class="vc-hint" style="margin:-4px 0 4px">L\'interrogation se fait dans le chat : QCM à toucher ou réponse à écrire, correction après chaque question, puis ton bilan.</div>' +
    '<button class="rev-go-btn" onclick="startInterroAI()">' +
      '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' +
      'Lancer l\'interrogation' +
    '</button>';
  window._interroNb = 5;
  setTimeout(function() { var i = document.getElementById('interro-topic'); if (i) i.focus(); }, 200);
}
function setIQ(n, el) {
  window._interroNb = n;
  document.querySelectorAll('#iq-5,#iq-8,#iq-10').forEach(function(b){
    b.style.borderColor='var(--bord)'; b.style.background='transparent'; b.style.color='var(--mu)';
  });
  el.style.borderColor='var(--accent)'; el.style.background='var(--accent-l)'; el.style.color='var(--accent)';
}
function startInterroAI() {
  var inp = document.getElementById('interro-topic');
  var topic = inp ? inp.value.trim() : '';
  if (!topic) { if (inp) { inp.classList.add('err'); inp.focus(); } return; }
  if (_cq) { toast('Une interrogation est déjà en cours dans le chat'); return; }
  if (_chatBusy) { toast('Attends la fin de la réponse dans le chat…'); return; }
  closeInterroAI();
  goSec('s-chat', document.querySelector('.nav-btn[onclick*="s-chat"]'));
  collapseShortcuts();
  var demande = 'Interroge-moi sur ' + topic;
  addMsg(demande, 'user');
  cqStart({ sujet: topic, nb_questions: window._interroNb || 5 }, addMsg('', 'ai thinking'), demande);
}

/* ══════════════════════════════════════════════
   SCANNER DE COURS
══════════════════════════════════════════════ */
var scanImageData=null;

function openScanCours() { document.getElementById('scan-modal').classList.add('open'); }
function closeScanCours() {
  document.getElementById('scan-modal').classList.remove('open');
  scanImageData=null;
  var prev=document.getElementById('scan-preview'); if(prev){prev.style.display='none';prev.src='';}
  var res=document.getElementById('scan-result'); if(res) res.innerHTML='';
  var acts=document.getElementById('scan-actions'); if(acts) acts.style.display='none';
  var choice=document.getElementById('scan-choice'); if(choice) choice.style.display='grid';
  var camInp=document.getElementById('scan-file-cam'); if(camInp) camInp.value='';
  var galInp=document.getElementById('scan-file-gal'); if(galInp) galInp.value='';
}
/* Reduit une photo (souvent 3-5 Mo sur telephone) : max 2000 px, JPEG 0,85.
   Reste tres lisible pour l'IA et passe sous la limite d'image de Groq. */
function imageReduite(file, cb) {
  var url = URL.createObjectURL(file);
  var img = new Image();
  img.onload = function() {
    var max = 2000, w = img.naturalWidth, h = img.naturalHeight, k = Math.min(1, max / Math.max(w, h));
    var cv = document.createElement('canvas');
    cv.width = Math.round(w * k); cv.height = Math.round(h * k);
    cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
    URL.revokeObjectURL(url);
    cb(cv.toDataURL('image/jpeg', 0.85));
  };
  img.onerror = function() { URL.revokeObjectURL(url); cb(null); };
  img.src = url;
}
/* Meme chose en promesse : var dataUrl = await imageReduiteP(fichier) (null si illisible) */
function imageReduiteP(file) { return new Promise(function(r) { imageReduite(file, r); }); }
function handleScanFile(file) {
  if(!file) return;
  imageReduite(file, function(dataUrl){
    if(!dataUrl){ toast('Impossible de lire cette image'); return; }
    var prev=document.getElementById('scan-preview');
    if(prev){prev.src=dataUrl;prev.style.display='block';}
    scanImageData={b64:dataUrl.split(',')[1],mime:'image/jpeg',full:dataUrl};
    var acts=document.getElementById('scan-actions'); if(acts) acts.style.display='block';
  });
}
/* Scanner -> transcription fidele, sauvegardee dans « Mes cours » */
async function scanTranscrire() {
  if(!scanImageData){toast('Charge une image d\'abord');return;}
  var res=document.getElementById('scan-result');
  var acts=document.getElementById('scan-actions'); if(acts) acts.style.display='none';
  res.innerHTML='<div class="rev-loading" style="padding:30px 0"><div class="rev-spin"></div><div class="rev-loading-txt">ScolarIA recopie ton cours...</div><div class="rev-loading-sub">Environ 10 secondes</div></div>';
  try {
    var t = await mcTranscrire(scanImageData.full);
    var c = mcDepuisScan(t);
    closeScanCours();
    openMesCours(c.id);
    toast('Cours sauvegardé dans « Mes cours »');
  } catch(e) {
    res.innerHTML='<div class="rev-err-box">'+esc(e.message)+'<br><button onclick="scanTranscrire()">Réessayer</button></div>';
    if(acts)acts.style.display='block';
  }
}
/* Galerie : une photo -> choix (transcrire, fiche, flashcards) ; plusieurs -> un cours de plusieurs pages */
function scanFichiers(files) {
  if (!files || !files.length) return;
  if (files.length > 1) scanTranscrirePlusieurs(files); else handleScanFile(files[0]);
}
async function scanTranscrirePlusieurs(files) {
  files = Array.prototype.slice.call(files).filter(function(f) { return /^image\//.test(f.type); });
  var res = document.getElementById('scan-result'), c = null, erreur = '';
  for (var i = 0; i < files.length; i++) {
    res.innerHTML = '<div class="rev-loading" style="padding:30px 0"><div class="rev-spin"></div><div class="rev-loading-txt">ScolarIA recopie la page ' + (i + 1) + ' / ' + files.length + '…</div><div class="rev-loading-sub">Environ 10 secondes par page</div></div>';
    try {
      var dataUrl = await imageReduiteP(files[i]);
      if (!dataUrl) throw new Error('Image illisible');
      var t = await mcTranscrire(dataUrl);
      if (!c) c = mcDepuisScan(t);
      else { c = mcGet(c.id); var pages = mcPagesDe(c); pages.push(mcMd(t.texte)); mcFixerPages(c, pages); mcPut(c); }
    } catch(e) { erreur = e.message; }
  }
  if (!c) {
    res.innerHTML = '<div class="rev-err-box">' + esc(erreur || 'Aucune image lisible') + '</div>';
    var ch = document.getElementById('scan-choice'); if (ch) ch.style.display = 'grid';
    return;
  }
  closeScanCours();
  openMesCours(c.id);
  toast('Cours de ' + mcPagesDe(mcGet(c.id)).length + ' pages sauvegardé' + (erreur ? ' (une photo n\'a pas pu être lue)' : ''), 3500);
}
