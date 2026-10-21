/* ScolarIA — js/annales.js
   Annales brevet : écrans, exercices (données dans annales-data.js, chargées à la
   1re ouverture), génération IA, mini chat.
   Chargé par scolaria-home-v2.html, dans l'ordre des <script> (une ligne exécutée au chargement
   ne peut utiliser que les fonctions des fichiers chargés AVANT celui-ci). */

var annStack = [];
var annChatMsgs = [];
var annChatCtx = '';

function annSetBack(show){ var b=document.getElementById('ann-back'); if(b) b.style.display = show ? 'inline-flex' : 'none'; }

/* annales-data.js (300 Ko) : charge seulement quand on ouvre les Annales (avant : a chaque demarrage) */
var _annChargement = null;
function annCharger(){
  if(typeof ANNALES !== 'undefined') return Promise.resolve(true);
  if(!_annChargement) _annChargement = new Promise(function(ok){
    var s=document.createElement('script'); s.src='annales-data.js';
    s.onload=function(){ ok(typeof ANNALES !== 'undefined'); };
    s.onerror=function(){ _annChargement=null; ok(false); };
    document.head.appendChild(s);
  });
  return _annChargement;
}
function annOpen(){
  closeDrawer();
  document.querySelectorAll('.sec').forEach(function(s){ s.classList.remove('active'); });
  document.querySelectorAll('.nav-btn').forEach(function(b){ b.classList.remove('active'); });
  var sec=document.getElementById('s-annales'); if(sec) sec.classList.add('active');
  annSetBack(false);
  if(typeof ANNALES === 'undefined') document.getElementById('ann-view').innerHTML='<div class="rev-loading"><div class="rev-spin"></div><div class="rev-loading-txt">Chargement des exercices…</div></div>';
  annCharger().then(function(ok){
    if(!ok){ document.getElementById('ann-view').innerHTML='<div class="ann-empty">Impossible de charger les exercices. Vérifie ta connexion puis réessaie.<br><br><button class="btn btn-ghost" onclick="annOpen()">Réessayer</button></div>'; return; }
    annHome();
  });
}

function annBack(){
  var d=annStack.pop();
  if(!d){ annHome(); return; }
  var f=window[d[0]];
  if(typeof f==='function'){ f.apply(null, d.slice(1)); } else { annHome(); }
}

/* Les annales sont de niveau 3eme : on le signale aux autres classes */
function annLevelNote(){
  var c=getClasse();
  if(c==='3ème') return '';
  var tx=isLycee()
    ? 'Exercices du brevet : parfait pour revoir les bases du coll&egrave;ge.'
    : 'Le coach IA t&#39;explique les notions que tu n&#39;as pas encore vues en '+esc(c)+'.';
  return '<div class="ann-lvl"><span class="ann-lvl-pill">Niveau 3&egrave;me</span><span>'+tx+'</span></div>';
}

/* ── ECRANS ── */
function annHome(){
  annStack=[];
  annSetBack(false);
  document.getElementById('ann-view').innerHTML =
    '<div class="ann-h1">Annales Brevet</div>'+
    '<div class="ann-sub">Entraîne-toi sur des exercices type brevet, avec correction détaillée et un coach IA.</div>'+
    annLevelNote()+
    '<div class="ann-choice" onclick="annGoMatieres(\'gen\')">'+
      '<div class="ann-choice-ic"><svg viewBox="0 0 24 24"><path d="M9 2h6M10 2v6.5L5.2 18A2 2 0 0 0 7 21h10a2 2 0 0 0 1.8-3L14 8.5V2"/><path d="M8 15h8"/></svg></div>'+
      '<div class="ann-choice-tx"><div class="ann-choice-tt">Demander un exercice</div><div class="ann-choice-ds">Choisis une matière et un chapitre. On te sort un exo, différent à chaque fois.</div></div>'+
      '<div class="ann-choice-ar">&#8250;</div>'+
    '</div>'+
    '<div class="ann-choice" onclick="annGoMatieres(\'lib\')">'+
      '<div class="ann-choice-ic"><svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></div>'+
      '<div class="ann-choice-tx"><div class="ann-choice-tt">Bibliothèque d\'exercices</div><div class="ann-choice-ds">Parcours tous les exos par matière et chapitre, puis choisis celui que tu veux.</div></div>'+
      '<div class="ann-choice-ar">&#8250;</div>'+
    '</div>';
}

function annGoMatieres(mode){ annStack.push(['annHome']); annMatieres(mode); }
function annMatieres(mode){
  annSetBack(true);
  var html='<div class="ann-chip">'+(mode==='gen'?'Demander un exercice':'Bibliothèque')+'</div>'+
    '<div class="ann-h1" style="font-size:20px">Choisis une matière</div>'+
    '<div class="ann-sub">D\'autres matières arriveront bientôt.</div>';
  Object.keys(ANNALES).forEach(function(matId){
    var m=ANNALES[matId]; var n=0; m.themes.forEach(function(t){ n+=t.exos.length; });
    html+='<div class="ann-row" onclick="annGoChapitres(\''+mode+'\',\''+matId+'\')">'+
      '<div class="ann-row-n">'+esc(m.nom.replace(/[^A-Za-z]/g,'').slice(0,2).toUpperCase())+'</div>'+
      '<div class="ann-row-tx"><div class="ann-row-tt">'+esc(m.nom)+'</div><div class="ann-row-ds">'+n+' exercices &middot; '+m.themes.length+' chapitres</div></div>'+
      '<div class="ann-row-ar">&#8250;</div></div>';
  });
  document.getElementById('ann-view').innerHTML=html;
}

function annGoChapitres(mode,matId){ annStack.push(['annMatieres',mode]); annChapitres(mode,matId); }
function annChapitres(mode,matId){
  annSetBack(true);
  var m=ANNALES[matId]; var seen=annSeenGet();
  var html='<div class="ann-chip">'+esc(m.nom)+'</div>'+
    '<div class="ann-h1" style="font-size:20px">Choisis un chapitre</div>'+
    '<div class="ann-sub">'+(mode==='gen'?'On te donnera un exercice au hasard du chapitre.':'Tu choisiras ensuite ton exercice dans la liste.')+'</div>';
  m.themes.forEach(function(t,i){
    var key=annThemeKey(matId,t.id); var arr=seen[key]||[]; var tot=t.exos.length;
    var sub=(mode==='gen') ? (arr.length>=tot ? 'Tous vus &middot; l\'IA en génère un nouveau' : (arr.length+' / '+tot+' déjà vus')) : (tot+' exercices');
    var leaf=(mode==='gen') ? 'annPickAndShow' : 'annGoExoList';
    html+='<div class="ann-row" onclick="'+leaf+'(\''+matId+'\',\''+t.id+'\')">'+
      '<div class="ann-row-n">'+(i+1)+'</div>'+
      '<div class="ann-row-tx"><div class="ann-row-tt">'+esc(t.titre)+'</div><div class="ann-row-ds">'+sub+'</div></div>'+
      '<div class="ann-row-ar">&#8250;</div></div>';
  });
  document.getElementById('ann-view').innerHTML=html;
}

function annGoExoList(matId,themeId){ annStack.push(['annChapitres','lib',matId]); annExoList(matId,themeId); }
function annExoList(matId,themeId){
  annSetBack(true);
  var th=annGetTheme(matId,themeId); if(!th){ annHome(); return; }
  var html='<div class="ann-chip">'+esc(th.titre)+'</div>'+
    '<div class="ann-h1" style="font-size:20px">Choisis un exercice</div>'+
    '<div class="ann-sub">'+th.exos.length+' exercices disponibles.</div>';
  th.exos.forEach(function(e,i){
    var nq=e.questions?e.questions.length:0; var dm=annDiffMeta(e.diff||'moyen');
    html+='<div class="ann-row" onclick="annGoExo(\''+matId+'\',\''+themeId+'\',\''+e.id+'\')">'+
      '<div class="ann-row-n">'+(i+1)+'</div>'+
      '<div class="ann-row-tx"><div class="ann-row-tt">'+esc(e.titre)+'</div><div class="ann-row-ds">'+nq+' questions</div></div>'+
      '<span class="ann-diff '+dm.c+'">'+dm.l+'</span></div>';
  });
  document.getElementById('ann-view').innerHTML=html;
}

/* ── DONNEES / SUIVI ── */
function annThemeKey(matId,themeId){ return matId+'/'+themeId; }
function annGetTheme(matId,themeId){
  var m=ANNALES[matId]; if(!m) return null;
  for(var i=0;i<m.themes.length;i++){ if(m.themes[i].id===themeId) return m.themes[i]; }
  return null;
}
function annSeenGet(){ try{ return JSON.parse(localStorage.getItem('sk_ann_seen')||'{}'); }catch(e){ return {}; } }
function annSeenSave(o){ try{ localStorage.setItem('sk_ann_seen', JSON.stringify(o)); }catch(e){} scheduleSync(); }

function annPickExo(matId,themeId){
  var th=annGetTheme(matId,themeId); if(!th) return null;
  var key=annThemeKey(matId,themeId);
  var seen=annSeenGet(); var arr=seen[key]||[];
  var remaining=th.exos.filter(function(e){ return arr.indexOf(e.id)<0; });
  if(remaining.length===0){ return { exhausted:true, theme:th }; }
  var pick=remaining[Math.floor(Math.random()*remaining.length)];
  arr.push(pick.id); seen[key]=arr; annSeenSave(seen);
  return { exo:pick, theme:th };
}

/* ── AFFICHAGE EXERCICE ── */
function annPickAndShow(matId,themeId){ annStack.push(['annChapitres','gen',matId]); annPickAndRender(matId,themeId); }
function annPickAndRender(matId,themeId){
  var r=annPickExo(matId,themeId);
  if(!r){ toast('Aucun exercice'); return; }
  if(r.exhausted){ annGenerateExo(matId,themeId,r.theme); return; }
  annRenderExo(matId,themeId,r.exo,true);
}

function annGoExo(matId,themeId,exoId){ annStack.push(['annExoList',matId,themeId]); annShowExo(matId,themeId,exoId,false); }
function annShowExo(matId,themeId,exoId,fromGen){
  var th=annGetTheme(matId,themeId); var e=null;
  if(th){ for(var i=0;i<th.exos.length;i++){ if(th.exos[i].id===exoId){ e=th.exos[i]; break; } } }
  if(!e){ annHome(); return; }
  annRenderExo(matId,themeId,e,!!fromGen);
}

function annDiffMeta(d){
  var map={ facile:{c:'facile',l:'Facile'}, moyen:{c:'moyen',l:'Moyen'}, difficile:{c:'difficile',l:'Difficile'}, expert:{c:'expert',l:'Très difficile'} };
  return map[d] || map.moyen;
}

function annTableHtml(rows){
  var h='<table>';
  rows.forEach(function(r,ri){
    h+='<tr>';
    r.forEach(function(c){ h+='<td'+(ri===0?' class="ann-th"':'')+'>'+esc(c)+'</td>'; });
    h+='</tr>';
  });
  return h+'</table>';
}

function annCorrIcon(){ return '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>'; }
function annPiegeHtml(p){ return '<div class="ann-piege"><svg viewBox="0 0 24 24"><path d="M12 9v4M12 17h.01M10.3 3.86l-8.5 14.7A1.5 1.5 0 0 0 3.1 21h17.8a1.5 1.5 0 0 0 1.3-2.44l-8.5-14.7a1.5 1.5 0 0 0-2.6 0z"/></svg><div><b>Piège brevet :</b> '+esc(p)+'</div></div>'; }

function annRenderExo(matId,themeId,e,fromGen){
  annSetBack(true);
  var th=annGetTheme(matId,themeId);
  var html='<div class="ann-exo">';
  var dm=annDiffMeta(e.diff||'moyen');
  html+='<div class="ann-exo-top"><span class="ann-exo-badge">'+esc(th?th.titre:'')+'</span><span class="ann-diff '+dm.c+'">'+dm.l+'</span></div>';
  html+='<div class="ann-exo-tt">'+esc(e.titre||'Exercice')+'</div>';
  html+='<div class="ann-exo-enonce">'+esc(e.enonce||'').replace(/\n/g,'<br>')+'</div>';
  if(e.schema){ html+='<div class="ann-schema">'+e.schema+'</div>'; }
  if(e.table && e.table.length){ html+=annTableHtml(e.table); }
  if(e.questions && e.questions.length){
    html+='<div class="ann-q">Questions</div><ol>';
    e.questions.forEach(function(q){ html+='<li>'+esc(q)+'</li>'; });
    html+='</ol>';
  }
  html+='<button class="btn btn-primary btn-full ann-corr-btn" onclick="annToggleCorr(this)">Voir la correction</button>';
  html+='<div class="ann-corr"><div class="ann-corr-tt">'+annCorrIcon()+'Correction</div>';
  if(e.correction && e.correction.length){
    e.correction.forEach(function(c,i){ html+='<div class="ann-corr-step"><b>'+(i+1)+'.</b> '+esc(c)+'</div>'; });
  }
  if(e.piege){ html+=annPiegeHtml(e.piege); }
  html+='</div>';
  if(fromGen){ html+='<button class="btn btn-ghost btn-full" style="margin-top:10px" onclick="annPickAndRender(\''+matId+'\',\''+themeId+'\')">Un autre exercice</button>'; }
  html+='</div>';
  html+=annChatHtml();
  var v=document.getElementById('ann-view');
  v.innerHTML=html;
  if(v.parentNode) v.parentNode.scrollTop=0;
  var ctx='EXERCICE : '+(e.titre||'')+'\n'+(e.enonce||'')+'\n';
  if(e.questions) ctx+='QUESTIONS :\n'+e.questions.map(function(q,i){ return (i+1)+'. '+q; }).join('\n')+'\n';
  if(e.correction) ctx+='CORRECTION :\n'+e.correction.map(function(c,i){ return (i+1)+'. '+c; }).join('\n')+'\n';
  if(e.piege) ctx+='PIEGE : '+e.piege;
  annChatReset(ctx);
  annRenderChat();
}

function annToggleCorr(btn){
  var corr=btn.parentNode.querySelector('.ann-corr');
  if(!corr) return;
  var show=corr.classList.toggle('show');
  btn.textContent = show ? 'Masquer la correction' : 'Voir la correction';
  if(show) haptic(18);
}

/* ── GENERATION IA (quand la bibliotheque du theme est vide) ── */
function annGenerateExo(matId,themeId,th){
  annSetBack(true);
  var v=document.getElementById('ann-view');
  v.innerHTML='<div class="ann-exo"><div class="ann-exo-top"><span class="ann-exo-badge">'+esc(th.titre)+'</span></div><div class="ann-empty">Tu as fait tous les exercices de ce chapitre.<br>L\'IA t\'en prépare un nouveau...</div></div>';
  var sys="Tu rediges des exercices scolaires clairs et corrects, en francais, niveau college (3eme).";
  var usr="Cree UN exercice type brevet original sur le theme : "+th.titre+". Niveau 3eme, calculs simples et exacts. "+
    "Respecte EXACTEMENT ce format, sans rien ecrire d autre :\n"+
    "TITRE: <titre court>\n<enonce puis 3 ou 4 questions numerotees 1. 2. 3.>\n===CORRECTION===\n<correction detaillee, question par question>\nPIEGE: <un piege classique du brevet a retenir>";
  callGroq([{role:'system',content:sys},{role:'user',content:usr}],1200,{noNiveau:true}).then(function(txt){
    annRenderGenExo(matId,themeId,th,txt);
  }).catch(function(err){
    v.innerHTML='<div class="ann-exo"><div class="ann-empty">Erreur : '+esc(err.message)+'<br><br><button class="btn btn-ghost" onclick="annPickAndRender(\''+matId+'\',\''+themeId+'\')">Réessayer</button></div></div>';
  });
}

function annRenderGenExo(matId,themeId,th,txt){
  annSetBack(true);
  var title='Exercice', piege='';
  var mt=txt.match(/TITRE:\s*([^\n]+)/i); if(mt) title=mt[1].trim();
  var parts=txt.split(/===\s*CORRECTION\s*===/i);
  var top=(parts[0]||txt).replace(/TITRE:\s*[^\n]+\n?/i,'').trim();
  var rest=parts[1]||'';
  var pm=rest.match(/PIEGE\s*:?\s*([\s\S]*)$/i);
  if(pm){ piege=pm[1].trim(); rest=rest.slice(0,pm.index); }
  var corr=rest.trim();
  var html='<div class="ann-exo">';
  html+='<div class="ann-exo-top"><span class="ann-exo-badge">'+esc(th.titre)+'</span><span class="ann-diff moyen">généré par IA</span></div>';
  html+='<div class="ann-exo-tt">'+esc(title)+'</div>';
  html+='<div class="ann-exo-enonce">'+esc(top).replace(/\n/g,'<br>')+'</div>';
  html+='<button class="btn btn-primary btn-full ann-corr-btn" onclick="annToggleCorr(this)">Voir la correction</button>';
  html+='<div class="ann-corr"><div class="ann-corr-tt">'+annCorrIcon()+'Correction</div>';
  html+='<div class="ann-corr-step">'+esc(corr).replace(/\n/g,'<br>')+'</div>';
  if(piege){ html+=annPiegeHtml(piege); }
  html+='</div>';
  html+='<button class="btn btn-ghost btn-full" style="margin-top:10px" onclick="annPickAndRender(\''+matId+'\',\''+themeId+'\')">Un autre exercice</button>';
  html+='</div>';
  html+=annChatHtml();
  var v=document.getElementById('ann-view');
  v.innerHTML=html;
  if(v.parentNode) v.parentNode.scrollTop=0;
  var ctx='EXERCICE (genere) : '+title+'\n'+top+'\nCORRECTION :\n'+corr+(piege?'\nPIEGE : '+piege:'');
  annChatReset(ctx);
  annRenderChat();
}

/* ── MINI CHAT IA ── */
function annChatHtml(){
  return '<div class="ann-chat">'+
    '<div class="ann-chat-hd"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>Coach IA &middot; explique-moi</div>'+
    '<div class="ann-quick">'+
      '<button onclick="annQuick(\'Explique-moi la méthode pour résoudre cet exercice, étape par étape\')">Explique-moi</button>'+
      '<button onclick="annQuick(\'Donne-moi juste un indice pour démarrer, sans la réponse\')">Un indice</button>'+
      '<button onclick="annQuick(\'Par où je commence ?\')">Par où commencer ?</button>'+
    '</div>'+
    '<div class="ann-chat-msgs" id="ann-chat-msgs"></div>'+
    '<div class="ann-chatbar"><textarea id="ann-chat-input" rows="1" placeholder="Pose ta question sur l\'exercice..." oninput="annAutoGrow(this)" onkeydown="annKey(event)"></textarea>'+
    '<button class="ann-send" id="ann-send" onclick="annSend()"><svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button></div>'+
    '</div>';
}

function annChatReset(ctx){ annChatMsgs=[]; annChatCtx=ctx; }
function annAutoGrow(ta){ ta.style.height='auto'; ta.style.height=Math.min(90,ta.scrollHeight)+'px'; }
function annKey(ev){ if(ev.key==='Enter' && !ev.shiftKey){ ev.preventDefault(); annSend(); } }
function annQuick(t){ var ta=document.getElementById('ann-chat-input'); if(ta) ta.value=t; annSend(); }

function annRenderChat(){
  var box=document.getElementById('ann-chat-msgs'); if(!box) return;
  if(!annChatMsgs.length){ box.innerHTML='<div class="ann-chat-empty">Bloqué sur l\'exercice ? Demande une explication, un indice, ou fais vérifier ta réponse.</div>'; return; }
  var h='';
  annChatMsgs.forEach(function(m){
    if(m.role==='assistant' && !m.content){ h+='<div class="ann-msg a">...</div>'; return; }
    /* reponses de l'IA : markdown rendu (gras, listes) au lieu des ** affiches tels quels */
    h+= m.role==='user' ? '<div class="ann-msg u">'+esc(m.content)+'</div>' : '<div class="ann-msg a">'+mdToHtml(m.content)+'</div>';
  });
  box.innerHTML=h;
  box.scrollTop=box.scrollHeight;
}

function annSend(){
  var ta=document.getElementById('ann-chat-input'); if(!ta) return;
  var q=ta.value.trim(); if(!q) return;
  ta.value=''; ta.style.height='auto';
  markActivity();
  annChatMsgs.push({ role:'user', content:q });
  var sys={ role:'system', content:"Tu es un professeur de maths et de physique-chimie de college, patient et tres clair. Tu aides un eleve a comprendre UN exercice precis du brevet (niveau 3eme). Si l eleve n est pas en 3eme, explique avec les mots de sa classe et rappelle les notions qu il n a pas encore vues.\n\nREGLES IMPORTANTES :\n- Reste concentre UNIQUEMENT sur cet exercice et sur la question que pose l'eleve. Ne parle de rien d'autre.\n- Explique la METHODE etape par etape, avec des phrases courtes et simples, adaptees a sa classe.\n- Rappelle d'abord la formule ou la propriete utile, puis montre comment l'appliquer ICI, avec les valeurs de l'enonce.\n- Si l'eleve demande un indice, donne seulement la prochaine etape, sans donner le resultat final.\n- Si l'eleve demande la solution, detaille le calcul jusqu'au resultat, puis donne la reponse.\n- N'invente aucune donnee : utilise seulement l'enonce ci-dessous.\n- Quand l'eleve dit qu'il n'a pas compris, reformule ton explication plus simplement (d'autres mots, un petit exemple concret) jusqu'a ce qu'il comprenne, mais SANS ajouter d'etapes inutiles ni partir sur autre chose.\n- Reste bref et va droit au but : reponds a ce qui est demande, sans bla-bla et sans poser de question en retour a l'eleve.\n\nVoici l'exercice (enonce, questions et correction de reference) :\n\n"+annChatCtx };
  var msgs=[sys].concat(annChatMsgs.map(function(m){ return { role:m.role, content:m.content }; }));
  annChatMsgs.push({ role:'assistant', content:'' });
  var idx=annChatMsgs.length-1;
  annRenderChat();
  var btn=document.getElementById('ann-send'); if(btn) btn.disabled=true;
  callGroqStream(msgs, function(full){ annChatMsgs[idx].content=full; annRenderChat(); }, 1100).then(function(){
    if(btn) btn.disabled=false;
  }).catch(function(err){
    annChatMsgs[idx].content='Oups, une erreur est survenue : '+err.message;
    annRenderChat();
    if(btn) btn.disabled=false;
  });
}
