/* ══════════════════════════════════════════════════════════
   ESPOIRETVIE.TD — Application JavaScript Complète
   Association Espoir & Vie | Solidarité - Humanité - Dignité
   ══════════════════════════════════════════════════════════ */

"use strict";

// ─── BASE DE DONNÉES MOCK (remplacer par API réelle) ─────
const DB = {
  docs: [
    { id:1, title:"Rapport annuel Espoir & Vie — Exercice 2024", type:"Rapport", cat:"rapport", fmt:"PDF", size:"2,4 Mo", pages:48, date:"2026-06-05", dateStr:"5 juin 2026", author:"Admin AEV", access:"Public", dl:347, views:1284, tags:["Annuel","2024","Bilan","Activités"], status:"published", desc:"Bilan complet des activités et résultats de l'association pour l'exercice 2024, couvrant les programmes santé, éducation et actions communautaires." },
    { id:2, title:"Contrat de partenariat — Forum Santé juin 2026", type:"Contrat", cat:"contrat", fmt:"Word", size:"845 Ko", pages:12, date:"2026-06-03", dateStr:"3 juin 2026", author:"A. Ngaradoum", access:"Public", dl:89, views:342, tags:["Partenariat","2026","Santé"], status:"published", desc:"Accord de partenariat entre l'Association Espoir & Vie et les parties prenantes du Forum Santé 2026." },
    { id:3, title:"Facture fournisseur #2026-089", type:"Facture", cat:"facture", fmt:"PDF", size:"340 Ko", pages:4, date:"2026-06-01", dateStr:"1 juin 2026", author:"S. Mahamat", access:"Membres", dl:12, views:45, tags:["Fournisseur","2026"], status:"published", desc:"Facture de prestation de service émise par le fournisseur référencé sous le numéro 089." },
    { id:4, title:"Rapport financier Q1 2025", type:"Rapport", cat:"rapport", fmt:"Excel", size:"1,1 Mo", pages:22, date:"2025-04-15", dateStr:"15 avr. 2025", author:"F. Adoum", access:"Public", dl:210, views:890, tags:["Financier","Q1","2025"], status:"published", desc:"Rapport financier détaillé du premier trimestre 2025 incluant les recettes, dépenses et analyse des écarts." },
    { id:5, title:"Rapport annuel Espoir & Vie — Exercice 2023", type:"Rapport", cat:"rapport", fmt:"PDF", size:"2,1 Mo", pages:44, date:"2024-01-10", dateStr:"10 jan. 2024", author:"Admin AEV", access:"Public", dl:520, views:2100, tags:["Annuel","2023","Bilan"], status:"published", desc:"Rapport d'activité complet pour l'exercice 2023." },
    { id:6, title:"Contrat prestation médicale — Mai 2026", type:"Contrat", cat:"contrat", fmt:"Word", size:"620 Ko", pages:8, date:"2026-05-28", dateStr:"28 mai 2026", author:"M. Dupont", access:"Membres", dl:5, views:18, tags:["Prestation","2026","Médical"], status:"pending", desc:"Contrat de prestation de services médicaux en attente de validation." },
    { id:7, title:"Bilan financier 2024", type:"Rapport", cat:"rapport", fmt:"Excel", size:"890 Ko", pages:18, date:"2025-03-05", dateStr:"5 mars 2025", author:"F. Adoum", access:"Public", dl:180, views:720, tags:["Financier","2024","Bilan"], status:"published", desc:"Bilan financier annuel pour l'exercice 2024." },
    { id:8, title:"Facture fournisseur #2026-091", type:"Facture", cat:"facture", fmt:"Excel", size:"280 Ko", pages:3, date:"2026-06-06", dateStr:"6 juin 2026", author:"S. Mahamat", access:"Membres", dl:0, views:4, tags:["Fournisseur","2026"], status:"pending", desc:"Facture numéro 091 en attente de validation administrative." },
    { id:9, title:"Programme de santé communautaire 2025-2026", type:"Rapport", cat:"rapport", fmt:"PDF", size:"3,2 Mo", pages:60, date:"2025-07-20", dateStr:"20 juil. 2025", author:"Admin AEV", access:"Public", dl:430, views:1650, tags:["Santé","Programme","2025"], status:"published", desc:"Programme détaillé des actions de santé communautaire pour la période 2025-2026." },
    { id:10, title:"Contrat de don — Partenaire International 2026", type:"Contrat", cat:"contrat", fmt:"PDF", size:"560 Ko", pages:10, date:"2026-04-12", dateStr:"12 avr. 2026", author:"Admin AEV", access:"Public", dl:67, views:290, tags:["Don","International","2026"], status:"published", desc:"Convention de don signée avec un partenaire international pour le financement des programmes." },
  ],
  users: [
    { id:1, name:"Admin AEV", initials:"AA", role:"admin",   roleLabel:"Administrateur", email:"admin@espoiretvie.td",    docs:18, status:"active", joined:"Depuis 2022" },
    { id:2, name:"Aïcha Ngaradoum", initials:"AN", role:"member", roleLabel:"Membre", email:"a.ngaradoum@espoiretvie.td", docs:12, status:"active", joined:"Mars 2024"  },
    { id:3, name:"Souleymane Mahamat", initials:"SM", role:"member", roleLabel:"Membre", email:"s.mahamat@espoiretvie.td", docs:4,  status:"new",    joined:"Juin 2026"  },
    { id:4, name:"Fidèle Adoum",    initials:"FA", role:"member", roleLabel:"Membre", email:"f.adoum@espoiretvie.td",    docs:7,  status:"active", joined:"Jan. 2025"  },
    { id:5, name:"Marc Dupont",     initials:"MD", role:"member", roleLabel:"Membre", email:"m.dupont@espoiretvie.td",   docs:3,  status:"active", joined:"Avr. 2025"  },
  ],
  activity: [
    { msg:"M. Dupont a soumis un rapport", time:"Il y a 43 min", isNew:true  },
    { msg:"Admin a approuvé un contrat",   time:"Il y a 2h",     isNew:false },
    { msg:"S. Mahamat a rejoint l'espace", time:"Hier à 16:00",  isNew:false },
    { msg:"Rapport annuel téléchargé 18×", time:"Hier",          isNew:false },
    { msg:"Nouvelle facture déposée",      time:"Avant-hier",    isNew:false },
  ]
};

// ─── ÉTAT GLOBAL ────────────────────────────────────────
const APP = {
  page:        "home",
  user:        null,   // null = visiteur public
  docId:       null,
  adminSec:    "dashboard",
  memberSec:   "dashboard",
  uploadStep:  1,
  authTab:     "login",
  searchQ:     "",
  catFilter:   "",
};

// ─── UTILITAIRES ────────────────────────────────────────
const $  = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => [...ctx.querySelectorAll(sel)];

function docIconHtml(fmt, sz="40px", h="46px") {
  const map = { PDF:["ti-file-type-pdf","di-pdf"], Word:["ti-file-type-doc","di-doc"], Excel:["ti-file-spreadsheet","di-xls"] };
  const [ic, cls] = map[fmt] || ["ti-file","di-pdf"];
  return `<div class="doc-icon ${cls}" style="width:${sz};height:${h};font-size:calc(${sz} * 0.52)"><i class="ti ${ic}"></i></div>`;
}
function tagHtml(type) {
  const map = { Rapport:"tag-blue", Contrat:"tag-red", Facture:"tag-gray" };
  return `<span class="tag ${map[type]||"tag-gray"}">${type}</span>`;
}
function statusHtml(s) {
  const map = { published:["s-published","✓ Publié"], pending:["s-pending","⏳ En attente"], rejected:["s-rejected","✗ Rejeté"] };
  const [cls, label] = map[s] || ["s-pending","Inconnu"];
  return `<span class="status ${cls}">${label}</span>`;
}
function fmtDate(d) { return d ? new Date(d).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"}) : ""; }

// ─── TOAST ──────────────────────────────────────────────
function toast(msg, type="ok") {
  const c = $("#toast-wrap");
  const el = document.createElement("div");
  const ic = { ok:"ti-circle-check", err:"ti-alert-circle", info:"ti-info-circle" }[type] || "ti-info-circle";
  el.className = `toast toast-${type}`;
  el.innerHTML = `<i class="ti ${ic}" style="font-size:17px;flex-shrink:0"></i><span>${msg}</span>`;
  c.appendChild(el);
  setTimeout(()=>{ el.style.opacity="0"; el.style.transform="translateX(20px)"; setTimeout(()=>el.remove(),320); }, 3200);
}

// ─── MODAL ──────────────────────────────────────────────
function openModal(html, title="") {
  $("#modal-title").textContent = title;
  $("#modal-body").innerHTML = html;
  $("#modal-overlay").classList.add("open");
}
function closeModal() { $("#modal-overlay").classList.remove("open"); }

// ─── NAVIGATION ─────────────────────────────────────────
function navigate(page, data={}) {
  $$(".page").forEach(p => p.classList.remove("active"));
  const el = $(`#page-${page}`);
  if (!el) return;
  el.classList.add("active");
  window.scrollTo({ top:0, behavior:"smooth" });
  APP.page = page;
  // Navbar actifs
  $$(".nav-link[data-p]").forEach(l => l.classList.toggle("active", l.dataset.p === page));
  // Rendu spécifique
  const renders = {
    home:       () => renderHome(),
    catalogue:  () => renderCatalogue(data.cat||APP.catFilter||""),
    search:     () => renderSearch(data.q||""),
    doc:        () => renderDoc(data.id),
    auth:       () => renderAuth(data.tab||"login"),
    member:     () => renderMember(data.sec||"dashboard"),
    admin:      () => renderAdmin(data.sec||"dashboard"),
    about:      () => renderAbout(),
  };
  if (renders[page]) renders[page]();
}

// ══════════════════════════════════════════════════════════
//  PAGE : ACCUEIL
// ══════════════════════════════════════════════════════════
function renderHome() {
  const recent = DB.docs.filter(d=>d.status==="published").slice(0,5);
  $("#home-recent").innerHTML = recent.map(d=>`
    <div class="doc-row" onclick="navigate('doc',{id:${d.id}})">
      ${docIconHtml(d.fmt)}
      <div style="flex:1;min-width:0">
        <div class="doc-name">${d.title}</div>
        <div class="doc-meta">${d.dateStr} · ${d.fmt} · ${d.size} · <i class="ti ti-download" style="font-size:11px"></i> ${d.dl}</div>
      </div>
      ${tagHtml(d.type)}
      <div class="doc-actions gap-6">
        <div class="btn-icon" onclick="event.stopPropagation();dlDoc(${d.id})" title="Télécharger"><i class="ti ti-download"></i></div>
        <div class="btn-icon" onclick="event.stopPropagation();shareDoc(${d.id})" title="Partager"><i class="ti ti-share"></i></div>
      </div>
    </div>`).join("");
}

function homeSearch() {
  const q = $("#home-q").value.trim();
  navigate("search", { q });
}

// ══════════════════════════════════════════════════════════
//  PAGE : CATALOGUE
// ══════════════════════════════════════════════════════════
function renderCatalogue(cat="") {
  APP.catFilter = cat;
  // Update chips
  $$(".cat-chip").forEach(c => c.classList.toggle("on", c.dataset.cat === cat));
  const docs = DB.docs.filter(d => d.status==="published" && (!cat || d.cat===cat));
  $("#cat-count").textContent = `${docs.length} document${docs.length>1?"s":""}`;
  $("#cat-list").innerHTML = docs.length
    ? docs.map(d=>`
      <div class="result-card" onclick="navigate('doc',{id:${d.id}})">
        ${docIconHtml(d.fmt,"44px","52px")}
        <div style="flex:1;min-width:0">
          <div class="flex-b gap-8">
            <div class="doc-name" style="font-size:15px;font-weight:700">${d.title}</div>
            <div class="flex-c gap-6" style="flex-shrink:0">
              <div class="btn-icon" onclick="event.stopPropagation();dlDoc(${d.id})"><i class="ti ti-download"></i></div>
              <div class="btn-icon" onclick="event.stopPropagation();shareDoc(${d.id})"><i class="ti ti-share"></i></div>
            </div>
          </div>
          <div class="doc-meta mt-4">${d.dateStr} · ${d.fmt} · ${d.size} · <i class="ti ti-download" style="font-size:11px"></i> ${d.dl} téléchargements</div>
          <div class="flex-c gap-6 mt-8 flex-wrap">${tagHtml(d.type)}${d.tags.slice(0,3).map(t=>`<span class="tag tag-gray">${t}</span>`).join("")}<span class="tag tag-pub">${d.access}</span></div>
        </div>
      </div>`).join("")
    : `<div class="empty"><i class="ti ti-folder-open"></i><h3>Aucun document</h3><p>Aucun document dans cette catégorie pour le moment.</p></div>`;
}

// ══════════════════════════════════════════════════════════
//  PAGE : RECHERCHE
// ══════════════════════════════════════════════════════════
function renderSearch(q="") {
  APP.searchQ = q;
  $("#search-q").value = q;
  applySearch();
}

function applySearch() {
  const q    = $("#search-q").value.toLowerCase().trim();
  const types  = $$(".f-type:checked").map(el=>el.value);
  const fmts   = $$(".f-fmt:checked").map(el=>el.value);
  const period = $(".f-period:checked")?.value || "";
  const access = $(".f-access:checked")?.value || "";

  let res = DB.docs.filter(d=>d.status==="published");
  if (q)        res = res.filter(d=>d.title.toLowerCase().includes(q)||d.tags.some(t=>t.toLowerCase().includes(q))||d.type.toLowerCase().includes(q)||d.author.toLowerCase().includes(q));
  if (types.length) res = res.filter(d=>types.includes(d.type));
  if (fmts.length)  res = res.filter(d=>fmts.includes(d.fmt));
  if (period)   res = res.filter(d=>d.date.startsWith(period));
  if (access)   res = res.filter(d=>d.access===access);

  $("#search-count").textContent = `${res.length} résultat${res.length>1?"s":""}`;
  $("#search-results").innerHTML = res.length
    ? res.map(d=>`
      <div class="result-card" onclick="navigate('doc',{id:${d.id}})">
        ${docIconHtml(d.fmt,"44px","52px")}
        <div style="flex:1;min-width:0">
          <div class="flex-b gap-8">
            <div class="doc-name" style="font-size:14px;font-weight:700">${d.title}</div>
            <div class="flex-c gap-6" style="flex-shrink:0">
              <div class="btn-icon" onclick="event.stopPropagation();dlDoc(${d.id})"><i class="ti ti-download"></i></div>
              <div class="btn-icon" onclick="event.stopPropagation();shareDoc(${d.id})"><i class="ti ti-share"></i></div>
            </div>
          </div>
          <div class="doc-meta mt-4">${d.dateStr} · ${d.fmt} · ${d.size}</div>
          <div class="flex-c gap-6 mt-8 flex-wrap">${tagHtml(d.type)}${d.tags.map(t=>`<span class="tag tag-gray">${t}</span>`).join("")}</div>
        </div>
      </div>`).join("")
    : `<div class="empty"><i class="ti ti-search"></i><h3>Aucun résultat</h3><p>Essayez avec d'autres mots-clés ou réinitialisez les filtres.</p></div>`;
}

function resetFilters() {
  $$(".f-type,.f-fmt,.f-period,.f-access").forEach(el=>el.checked=false);
  applySearch();
}

// ══════════════════════════════════════════════════════════
//  PAGE : FICHE DOCUMENT
// ══════════════════════════════════════════════════════════
function renderDoc(id) {
  const d = DB.docs.find(x=>x.id===id);
  if (!d) return;
  APP.docId = id;
  const related = DB.docs.filter(x=>x.id!==id&&x.type===d.type&&x.status==="published").slice(0,3);
  const fmtIcon = { PDF:"ti-file-type-pdf", Word:"ti-file-type-doc", Excel:"ti-file-spreadsheet" }[d.fmt]||"ti-file";

  $("#doc-content").innerHTML = `
    <!-- HERO -->
    <div style="background:linear-gradient(135deg,var(--blue-deep),var(--blue-darker));padding:24px 36px 30px">
      <div class="breadcrumb mb-12">
        <i class="ti ti-home"></i>
        <span onclick="navigate('home')">Accueil</span>
        <i class="ti ti-chevron-right"></i>
        <span onclick="navigate('catalogue')">Catalogue</span>
        <i class="ti ti-chevron-right"></i>
        <span onclick="navigate('catalogue',{cat:'${d.cat}'})">${d.type}s</span>
        <i class="ti ti-chevron-right"></i>
        <span style="color:rgba(255,255,255,.8)">${d.title.substring(0,38)}…</span>
      </div>
      <div class="flex-b gap-16" style="flex-wrap:wrap">
        <div style="flex:1;min-width:0">
          <div class="flex-c gap-8 mb-10">
            ${tagHtml(d.type)}
            <span class="tag" style="background:rgba(255,255,255,.1);color:rgba(255,255,255,.7)">${d.access}</span>
          </div>
          <h1 style="font-family:var(--font-display);font-size:22px;font-weight:700;color:white;line-height:1.3;margin-bottom:12px">${d.title}</h1>
          <div class="flex-c gap-16 flex-wrap" style="font-size:12px;color:rgba(255,255,255,.55)">
            <span><i class="ti ti-calendar"></i> ${d.dateStr}</span>
            <span><i class="ti ti-file"></i> ${d.fmt} · ${d.size} · ${d.pages} pages</span>
            <span><i class="ti ti-download"></i> ${d.dl} téléchargements</span>
            <span><i class="ti ti-eye"></i> ${d.views} vues</span>
            <span><i class="ti ti-user"></i> ${d.author}</span>
          </div>
        </div>
        <div class="flex-c gap-8">
          <button class="btn btn-ghost btn-sm" onclick="shareDoc(${d.id})"><i class="ti ti-share"></i>Partager</button>
          <button class="btn btn-ghost btn-sm" id="fav-btn-${d.id}" onclick="toggleFav(${d.id})"><i class="ti ti-star"></i>Favori</button>
        </div>
      </div>
    </div>

    <!-- BODY -->
    <div style="display:flex;gap:0;background:var(--gray-50);min-height:calc(100vh - 300px)">
      <!-- MAIN -->
      <div style="flex:1;padding:24px;display:flex;flex-direction:column;gap:16px;min-width:0">

        <!-- APERÇU -->
        <div class="card">
          <div class="card-header">
            <span class="card-title"><i class="ti ti-eye" style="color:var(--blue);margin-right:6px"></i>Aperçu du document</span>
            <div class="flex-c gap-8">
              <div class="flex-c gap-6" style="background:var(--blue-light);padding:5px 14px;border-radius:var(--r-xl);font-size:12px;font-weight:600;color:var(--blue-dark)">
                <i class="ti ti-chevron-left" style="cursor:pointer" onclick="toast('Page précédente','info')"></i>
                Page 1 / ${d.pages}
                <i class="ti ti-chevron-right" style="cursor:pointer" onclick="toast('Page suivante','info')"></i>
              </div>
              <button class="btn btn-outline btn-sm" onclick="toast('Ouverture plein écran','info')"><i class="ti ti-maximize"></i>Plein écran</button>
            </div>
          </div>
          <div class="doc-preview-wrap">
            <div class="pdf-page-sim">
              <div style="display:flex;align-items:center;gap:12px;border-bottom:3px solid var(--blue);padding-bottom:16px">
                <div style="width:44px;height:44px;border-radius:50%;overflow:hidden;border:2px solid var(--blue);background:white;flex-shrink:0"><img src="assets/logo-aev.png" style="width:100%;height:100%;object-fit:cover" alt="AEV"></div>
                <div>
                  <div style="font-size:11px;font-weight:800;color:var(--blue-deep);letter-spacing:.04em">ASSOCIATION ESPOIR & VIE</div>
                  <div style="font-size:9px;color:var(--red);font-style:italic;font-weight:600">Solidarité - Humanité - Dignité</div>
                </div>
                <div style="margin-left:auto;text-align:right">
                  <div style="font-size:9px;color:var(--text-sec)">espoiretvie.td</div>
                  <div style="font-size:9px;color:var(--text-sec)">N'Djaména, Tchad</div>
                </div>
              </div>
              <div style="text-align:center;padding:12px 0">
                <div style="font-size:9px;color:var(--blue);font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:6px">${d.type}</div>
                <div style="font-size:17px;font-weight:800;color:var(--blue-deep);line-height:1.3;font-family:var(--font-display)">${d.title.length>50?d.title.substring(0,48)+"…":d.title}</div>
              </div>
              <div class="grid-2 gap-8" style="margin:4px 0">
                <div style="background:var(--blue-light);border-radius:6px;padding:8px;text-align:center"><div style="font-size:14px;font-weight:800;color:var(--blue)">${d.dl}</div><div style="font-size:8px;color:var(--blue-dark);text-transform:uppercase;letter-spacing:.06em">Téléch.</div></div>
                <div style="background:var(--red-light);border-radius:6px;padding:8px;text-align:center"><div style="font-size:14px;font-weight:800;color:var(--red)">${d.pages}</div><div style="font-size:8px;color:var(--red-dark);text-transform:uppercase;letter-spacing:.06em">Pages</div></div>
              </div>
              ${[100,88,95,72,84,90].map(w=>`<div class="pdf-skel" style="width:${w}%"></div>`).join("")}
            </div>
          </div>
        </div>

        <!-- DESCRIPTION -->
        <div class="card card-body">
          <div class="card-title mb-10">Description</div>
          <p style="font-size:14px;color:var(--text-sec);line-height:1.8">${d.desc}</p>
          <div class="flex-c gap-6 mt-14 flex-wrap">
            ${d.tags.map(t=>`<span class="tag tag-blue">${t}</span>`).join("")}
            ${tagHtml(d.type)}
          </div>
        </div>

        <!-- BOUTON PUBLIC -->
        ${!APP.user ? `
        <div style="background:var(--blue-deep);border-radius:var(--r-xl);padding:20px 24px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap">
          <div>
            <div style="font-size:14px;font-weight:700;color:white;margin-bottom:4px">Téléchargement gratuit et immédiat</div>
            <div style="font-size:12px;color:var(--blue)">Ce document est en accès libre — aucune inscription requise.</div>
          </div>
          <button class="btn btn-red btn-lg" onclick="dlDoc(${d.id})"><i class="ti ti-download"></i>Télécharger gratuitement</button>
        </div>` : ""}
      </div>

      <!-- SIDEBAR DOC -->
      <div style="width:260px;flex-shrink:0;padding:20px;display:flex;flex-direction:column;gap:14px;border-left:1px solid var(--border-lt);background:var(--white)">

        <!-- DOWNLOAD -->
        <div class="card card-body" style="text-align:center">
          <div style="width:58px;height:68px;border-radius:10px;display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:30px" class="${{PDF:"di-pdf",Word:"di-doc",Excel:"di-xls"}[d.fmt]||"di-pdf"}">
            <i class="ti ${fmtIcon}"></i>
          </div>
          <div style="font-size:12px;color:var(--text-sec);margin-bottom:16px">${d.fmt} · ${d.size} · ${d.pages} pages</div>
          <button class="btn btn-primary w-full mb-8" onclick="dlDoc(${d.id})"><i class="ti ti-download"></i>Télécharger</button>
          <button class="btn btn-outline w-full" style="font-size:12px" onclick="toast('Ouverture en cours…','info')"><i class="ti ti-eye"></i>Aperçu plein écran</button>
          <div style="font-size:11px;color:var(--text-sec);margin-top:10px">${d.dl} téléchargements · Gratuit</div>
        </div>

        <!-- SHARE -->
        <div class="card card-body">
          <div class="card-title mb-10">Partager ce document</div>
          <div class="grid-4 gap-6">
            ${[["ti-brand-facebook","#1877F2"],["ti-brand-whatsapp","#25D366"],["ti-mail","var(--blue)"],["ti-link","var(--gray-600)"]].map(([ic,col])=>`
              <div class="btn-icon w-full" style="height:36px;border-radius:var(--r-md);font-size:17px" onclick="shareDoc(${d.id})"><i class="ti ${ic}" style="color:${col}"></i></div>
            `).join("")}
          </div>
        </div>

        <!-- INFOS -->
        <div class="card card-body">
          <div class="card-title mb-10">Informations</div>
          ${[
            ["ti-folder","Catégorie",d.type],
            ["ti-user","Déposé par",d.author],
            ["ti-calendar","Date",d.dateStr],
            ["ti-lock-open","Accès",d.access],
            ["ti-file","Format",d.fmt+" · "+d.size],
          ].map(([ic,lbl,val])=>`
            <div style="display:flex;align-items:flex-start;gap:10px;padding:8px 0;border-bottom:1px solid var(--border-lt)">
              <i class="ti ${ic}" style="font-size:15px;color:var(--blue);margin-top:2px;flex-shrink:0"></i>
              <div><div style="font-size:11px;color:var(--text-sec)">${lbl}</div><div style="font-size:13px;font-weight:600;color:var(--text)">${val}</div></div>
            </div>`).join("")}
        </div>

        <!-- SIMILAIRES -->
        ${related.length ? `
        <div class="card card-body">
          <div class="card-title mb-10">Documents similaires</div>
          ${related.map(r=>`
            <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border-lt);cursor:pointer" onclick="navigate('doc',{id:${r.id}})">
              ${docIconHtml(r.fmt,"30px","36px")}
              <div style="min-width:0;overflow:hidden">
                <div style="font-size:12px;font-weight:600;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${r.title.substring(0,38)}…</div>
                <div style="font-size:11px;color:var(--text-sec)">${r.fmt} · ${r.size}</div>
              </div>
            </div>`).join("")}
        </div>` : ""}
      </div>
    </div>
  `;
}

// ══════════════════════════════════════════════════════════
//  AUTH
// ══════════════════════════════════════════════════════════
function renderAuth(tab="login") {
  switchAuthTab(tab);
}
function switchAuthTab(tab) {
  APP.authTab = tab;
  $$(".auth-tab").forEach(t=>t.classList.toggle("active",t.dataset.tab===tab));
  $("#auth-login").style.display  = tab==="login" ? "flex" : "none";
  $("#auth-register").style.display = tab==="register" ? "flex" : "none";
}
function doLogin() {
  const email = $("#login-email").value.trim();
  const pass  = $("#login-pass").value;
  if (!email||!pass) { toast("Veuillez remplir tous les champs.","err"); return; }
  // Simulation : email admin → admin, sinon membre
  const isAdmin = email.includes("admin");
  APP.user = { name: isAdmin?"Admin AEV":"Aïcha Ngaradoum", initials: isAdmin?"AA":"AN", role: isAdmin?"admin":"member" };
  updateNavbarUser();
  toast(`Bienvenue, ${APP.user.name} !`,"ok");
  navigate(isAdmin ? "admin" : "member");
}
function doRegister() {
  const prenom = $("#reg-prenom").value.trim();
  const nom    = $("#reg-nom").value.trim();
  const email  = $("#reg-email").value.trim();
  const pass   = $("#reg-pass").value;
  if (!prenom||!nom||!email||!pass) { toast("Veuillez remplir tous les champs obligatoires.","err"); return; }
  if (pass.length < 8) { toast("Le mot de passe doit contenir au moins 8 caractères.","err"); return; }
  toast(`Bienvenue, ${prenom} ! Votre compte a été créé.`,"ok");
  switchAuthTab("login");
}
function doAdminDemo() {
  APP.user = { name:"Admin AEV", initials:"AA", role:"admin" };
  updateNavbarUser();
  toast("Accès administrateur activé.","ok");
  navigate("admin");
}
function doLogout() {
  APP.user = null;
  updateNavbarUser();
  toast("Déconnexion réussie.","info");
  navigate("home");
}
function updateNavbarUser() {
  const btnZone = $("#navbar-user-zone");
  if (APP.user) {
    btnZone.innerHTML = `
      <div class="navbar-user" onclick="navigate(APP.user.role==='admin'?'admin':'member')">
        <div class="navbar-user-avatar">${APP.user.initials}</div>
        <span class="navbar-user-name">${APP.user.name.split(" ")[0]}</span>
        <i class="ti ti-chevron-down" style="font-size:12px;color:rgba(255,255,255,.5)"></i>
      </div>
      <button class="btn btn-ghost btn-sm" onclick="doLogout()"><i class="ti ti-logout"></i>Sortir</button>`;
  } else {
    btnZone.innerHTML = `<button class="btn-nav-login" onclick="navigate('auth')"><i class="ti ti-login" style="margin-right:6px"></i>Connexion</button>`;
  }
}

// ══════════════════════════════════════════════════════════
//  PAGE : À PROPOS
// ══════════════════════════════════════════════════════════
function renderAbout() {
  const missions = [
    ["1","ti-speakerphone","Sensibilisation","Sensibiliser les populations sur les questions de santé et de bien-être"],
    ["2","ti-heart-handshake","Appui aux vulnérables","Apporter un appui technique et financier aux personnes et familles vulnérables"],
    ["3","ti-users","Solidarité communautaire","Promouvoir la solidarité et l'entraide communautaire"],
    ["4","ti-building-hospital","Interface sanitaire","Servir de relais entre les populations, les formations sanitaires et les autorités publiques"],
    ["5","ti-map-pin","Orientation","Faciliter l'orientation des personnes vers les services de santé appropriés"],
    ["6","ti-walk","Accompagnement","Accompagner les communautés dans leurs démarches sanitaires et sociales"],
    ["7","ti-star","Engagement citoyen","Encourager l'engagement citoyen, particulièrement celui des jeunes, en faveur de l'intérêt général"],
  ];
  const moyens = [
    ["ti-speakerphone","Campagnes de sensibilisation auprès des communautés"],
    ["ti-stethoscope","Actions directes de terrain : consultations, appui médical, kits sanitaires"],
    ["ti-brain","Accompagnement psychosocial"],
    ["ti-school","Ateliers, conférences, séminaires et sessions de formation"],
    ["ti-map-pin-check","Accompagnement individualisé vers les soins et services publics"],
    ["ti-handshake","Partenariats avec associations, ONG, institutions nationales et internationales"],
    ["ti-speakerphone","Mobilisation sociale, réseautage et plaidoyer"],
    ["ti-file-research","Études, enquêtes, recherches et publications"],
  ];
  const organes = [
    ["Assemblée Générale","Organe suprême de délibération — vote annuel en décembre"],
    ["Bureau Exécutif","Gestion quotidienne — élu pour 5 ans, mandat renouvelable"],
    ["Commissions spécialisées","Santé · Mobilisation sociale · Formation · Projets"],
  ];
  const membres = [
    ["Membres actifs","Participent effectivement à la vie et aux activités — droit de vote"],
    ["Membres sympathisants","Soutiennent moralement, matériellement ou occasionnellement"],
    ["Membres honoraires","Désignés pour contribution, notoriété ou engagement exceptionnel"],
  ];
  const infosLegales = [
    ["ti-calendar","Date de création","20 Avril 2026 (Assemblée Générale constitutive)"],
    ["ti-map-pin","Siège social","N'Djaména, République du Tchad"],
    ["ti-globe","Domaine web","espoiretvie.td (ADETIC)"],
    ["ti-clock","Durée statutaire","99 ans, renouvelable"],
    ["ti-scale","Régime juridique","Ordonnance n°023/PR/2018 du 27 juin 2018"],
    ["ti-mail","Contact","contact@espoiretvie.td"],
  ];

  $("#about-content").innerHTML = `
    <!-- HERO -->
    <div style="background:linear-gradient(135deg,var(--blue-deep) 0%,var(--blue-darker) 50%,var(--blue-dark) 100%);padding:56px 36px;text-align:center;position:relative;overflow:hidden">
      <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 60% 40%,rgba(41,171,226,.2),transparent 60%);pointer-events:none"></div>
      <div style="position:relative;z-index:1">
        <div style="width:90px;height:90px;border-radius:50%;overflow:hidden;border:4px solid var(--blue);background:white;margin:0 auto 20px;box-shadow:0 8px 32px rgba(41,171,226,.4)"><img src="assets/logo-aev.png" alt="Logo AEV" style="width:100%;height:100%;object-fit:cover"></div>
        <h1 style="font-family:var(--font-display);font-size:34px;font-weight:700;color:white;margin-bottom:8px">Association Espoir &amp; Vie</h1>
        <div style="font-size:16px;color:var(--blue);font-style:italic;font-weight:500;margin-bottom:6px">« Servir avec le Cœur, Agir avec Sens »</div>
        <div style="font-size:14px;color:rgba(255,255,255,.55)">Solidarité · Humanité · Dignité</div>
        <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-top:14px;font-size:12px;color:rgba(255,255,255,.4);flex-wrap:wrap">
          <i class="ti ti-map-pin"></i> N'Djaména, République du Tchad
          <span style="margin:0 8px;color:rgba(255,255,255,.2)">·</span>
          <i class="ti ti-calendar"></i> Fondée le 20 Avril 2026
          <span style="margin:0 8px;color:rgba(255,255,255,.2)">·</span>
          <i class="ti ti-globe"></i> espoiretvie.td
        </div>
      </div>
    </div>

    <!-- STATS -->
    <div class="stats-bar">
      <div class="stats-bar-item"><div class="stats-bar-val">99 ans</div><div class="stats-bar-label">Durée statutaire</div></div>
      <div class="stats-bar-item"><div class="stats-bar-val">3</div><div class="stats-bar-label">Domaines d'action</div></div>
      <div class="stats-bar-item"><div class="stats-bar-val">7</div><div class="stats-bar-label">Missions officielles</div></div>
      <div class="stats-bar-item"><div class="stats-bar-val">4</div><div class="stats-bar-label">Commissions permanentes</div></div>
    </div>

    <div class="section" style="max-width:960px;margin:0 auto;display:flex;flex-direction:column;gap:28px">

      <!-- PRÉAMBULE -->
      <div class="card card-body">
        <div style="display:flex;align-items:flex-start;gap:16px">
          <div style="width:46px;height:46px;background:var(--blue-light);border-radius:var(--r-lg);display:flex;align-items:center;justify-content:center;font-size:22px;color:var(--blue);flex-shrink:0"><i class="ti ti-quote"></i></div>
          <div>
            <div style="font-size:13px;font-weight:700;color:var(--blue);text-transform:uppercase;letter-spacing:.07em;margin-bottom:10px">Préambule officiel</div>
            <p style="font-size:15px;line-height:1.9;color:var(--text-sec);font-style:italic">« Conscients des défis liés à la santé, à la précarité et à l'accès aux soins de base, et animés par une volonté commune de promouvoir le bien-être social et la dignité humaine, les membres fondateurs ont décidé de se constituer en association. Ces statuts ont pour objet de définir les règles d'organisation et de fonctionnement de l'Association ESPOIR &amp; VIE, afin de structurer son engagement solidaire, de faciliter l'entraide communautaire et de servir de relais efficace entre les populations vulnérables et les structures sanitaires et sociales compétentes. »</p>
            <div style="font-size:12px;color:var(--gray-400);margin-top:10px">— Statuts officiels adoptés en Assemblée Générale constitutive, N'Djaména, 30 mars 2026</div>
          </div>
        </div>
      </div>

      <!-- NATURE JURIDIQUE -->
      <div>
        <h2 class="section-title"><i class="ti ti-building" style="color:var(--blue);margin-right:8px"></i>Nature juridique</h2>
        <div class="card card-body" style="border-left:4px solid var(--blue)">
          <p style="font-size:14px;line-height:1.8;color:var(--text-sec)">L'Association Espoir &amp; Vie est une association <strong style="color:var(--text)">apolitique, non confessionnelle et à but non lucratif</strong>, régie par l'Ordonnance n°023/PR/2018 du 27 juin 2018 portant régime des associations en République du Tchad.</p>
          <div class="grid-3 gap-12 mt-14">
            <div style="text-align:center;padding:14px;background:var(--blue-light);border-radius:var(--r-xl)"><i class="ti ti-ban" style="font-size:22px;color:var(--blue);display:block;margin-bottom:6px"></i><div style="font-size:12px;font-weight:700;color:var(--blue-dark)">Apolitique</div></div>
            <div style="text-align:center;padding:14px;background:var(--blue-light);border-radius:var(--r-xl)"><i class="ti ti-heart" style="font-size:22px;color:var(--blue);display:block;margin-bottom:6px"></i><div style="font-size:12px;font-weight:700;color:var(--blue-dark)">Non lucratif</div></div>
            <div style="text-align:center;padding:14px;background:var(--blue-light);border-radius:var(--r-xl)"><i class="ti ti-users" style="font-size:22px;color:var(--blue);display:block;margin-bottom:6px"></i><div style="font-size:12px;font-weight:700;color:var(--blue-dark)">Non confessionnelle</div></div>
          </div>
        </div>
      </div>

      <!-- OBJET -->
      <div>
        <h2 class="section-title"><i class="ti ti-target" style="color:var(--red);margin-right:8px"></i>Objet &amp; Vision</h2>
        <div class="card card-body" style="border-left:4px solid var(--red)">
          <p style="font-size:14px;line-height:1.85;color:var(--text-sec)">L'Association Espoir &amp; Vie a pour objet de <strong style="color:var(--text)">contribuer à l'amélioration des conditions de vie des populations</strong>, notamment par la promotion de la santé, de la solidarité, de la dignité humaine et du bien-être social. Elle a également vocation à servir d'<strong style="color:var(--text)">interface entre les communautés, les structures sanitaires et les institutions publiques</strong> nationales et internationales.</p>
        </div>
      </div>

      <!-- MISSIONS -->
      <div>
        <h2 class="section-title"><i class="ti ti-rocket" style="color:var(--blue);margin-right:8px"></i>Nos 7 missions officielles</h2>
        <div class="flex-col gap-10">
          ${missions.map(([n,ic,t,d])=>`
            <div class="card card-body flex-c gap-14 card-hover" style="border-left:3px solid var(--blue)">
              <div style="width:40px;height:40px;border-radius:50%;background:var(--blue);display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;color:white;flex-shrink:0">${n}</div>
              <div style="width:36px;height:36px;border-radius:var(--r-md);background:var(--blue-light);display:flex;align-items:center;justify-content:center;font-size:18px;color:var(--blue);flex-shrink:0"><i class="ti ${ic}"></i></div>
              <div><div style="font-size:14px;font-weight:700;color:var(--text);margin-bottom:3px">${t}</div><div style="font-size:13px;color:var(--text-sec);line-height:1.6">${d}</div></div>
            </div>`).join("")}
        </div>
      </div>

      <!-- DOMAINES -->
      <div>
        <h2 class="section-title"><i class="ti ti-layout-grid" style="color:var(--red);margin-right:8px"></i>Domaines d'intervention</h2>
        <div class="grid-3 gap-14">
          <div class="cat-card" style="border-top:4px solid var(--blue)">
            <div class="cat-icon" style="background:var(--blue-light);color:var(--blue)"><i class="ti ti-stethoscope"></i></div>
            <div class="cat-name">Santé</div>
            <p style="font-size:13px;color:var(--text-sec);line-height:1.7">Promotion de la santé, accès aux soins, campagnes de sensibilisation, consultations, distribution de kits sanitaires.</p>
          </div>
          <div class="cat-card" style="border-top:4px solid var(--red)">
            <div class="cat-icon" style="background:var(--red-light);color:var(--red)"><i class="ti ti-heart-handshake"></i></div>
            <div class="cat-name">Action sociale</div>
            <p style="font-size:13px;color:var(--text-sec);line-height:1.7">Accompagnement des personnes vulnérables, aide sociale, formation, ateliers communautaires et mobilisation sociale.</p>
          </div>
          <div class="cat-card" style="border-top:4px solid #16A34A">
            <div class="cat-icon" style="background:#DCFCE7;color:#166534"><i class="ti ti-world-heart"></i></div>
            <div class="cat-name">Humanitaire</div>
            <p style="font-size:13px;color:var(--text-sec);line-height:1.7">Assistance humanitaire, partenariats avec ONG nationales et internationales, plaidoyer et réseautage.</p>
          </div>
        </div>
      </div>

      <!-- MOYENS D'ACTION -->
      <div>
        <h2 class="section-title"><i class="ti ti-tool" style="color:var(--blue);margin-right:8px"></i>Nos moyens d'action</h2>
        <div class="card card-body">
          <div class="grid-2 gap-10">
            ${moyens.map(([ic,txt])=>`
              <div class="flex-c gap-10" style="padding:10px 12px;border-radius:var(--r-md);background:var(--blue-light)">
                <i class="ti ${ic}" style="font-size:18px;color:var(--blue);flex-shrink:0"></i>
                <span style="font-size:13px;color:var(--blue-dark);font-weight:500">${txt}</span>
              </div>`).join("")}
          </div>
        </div>
      </div>

      <!-- VALEURS -->
      <div>
        <h2 class="section-title"><i class="ti ti-diamond" style="color:var(--red);margin-right:8px"></i>Nos valeurs fondamentales</h2>
        <div class="grid-3 gap-14">
          <div style="text-align:center;padding:28px 20px;background:var(--blue-deep);border-radius:var(--r-2xl);color:white">
            <div style="font-size:36px;margin-bottom:12px"><i class="ti ti-users"></i></div>
            <div style="font-size:18px;font-weight:700;color:var(--blue);margin-bottom:8px">Solidarité</div>
            <p style="font-size:13px;color:rgba(255,255,255,.6);line-height:1.7">L'union entre les membres de la communauté pour surmonter ensemble les défis.</p>
          </div>
          <div style="text-align:center;padding:28px 20px;background:var(--red-dark);border-radius:var(--r-2xl);color:white">
            <div style="font-size:36px;margin-bottom:12px"><i class="ti ti-heart"></i></div>
            <div style="font-size:18px;font-weight:700;color:#FFB3BB;margin-bottom:8px">Humanité</div>
            <p style="font-size:13px;color:rgba(255,255,255,.6);line-height:1.7">Le respect et l'attention portés à chaque personne, sans distinction aucune.</p>
          </div>
          <div style="text-align:center;padding:28px 20px;background:var(--blue-darker);border-radius:var(--r-2xl);color:white">
            <div style="font-size:36px;margin-bottom:12px"><i class="ti ti-award"></i></div>
            <div style="font-size:18px;font-weight:700;color:var(--blue);margin-bottom:8px">Dignité</div>
            <p style="font-size:13px;color:rgba(255,255,255,.6);line-height:1.7">La reconnaissance de la valeur intrinsèque de chaque être humain.</p>
          </div>
        </div>
      </div>

      <!-- GOUVERNANCE -->
      <div>
        <h2 class="section-title"><i class="ti ti-hierarchy" style="color:var(--blue);margin-right:8px"></i>Gouvernance &amp; Organisation</h2>
        <div class="grid-2 gap-14">
          <div class="card card-body">
            <div style="font-size:14px;font-weight:700;color:var(--text);margin-bottom:14px;display:flex;align-items:center;gap:8px"><i class="ti ti-building" style="color:var(--blue)"></i>Organes de l'association</div>
            ${organes.map(([t,d])=>`
              <div style="padding:10px 0;border-bottom:1px solid var(--border-lt)">
                <div style="font-size:13px;font-weight:700;color:var(--text)">${t}</div>
                <div style="font-size:12px;color:var(--text-sec);margin-top:2px">${d}</div>
              </div>`).join("")}
          </div>
          <div class="card card-body">
            <div style="font-size:14px;font-weight:700;color:var(--text);margin-bottom:14px;display:flex;align-items:center;gap:8px"><i class="ti ti-users" style="color:var(--red)"></i>Catégories de membres</div>
            ${membres.map(([t,d])=>`
              <div style="padding:10px 0;border-bottom:1px solid var(--border-lt)">
                <div style="font-size:13px;font-weight:700;color:var(--text)">${t}</div>
                <div style="font-size:12px;color:var(--text-sec);margin-top:2px">${d}</div>
              </div>`).join("")}
          </div>
        </div>
      </div>

      <!-- INFORMATIONS LÉGALES -->
      <div>
        <h2 class="section-title"><i class="ti ti-scale" style="color:var(--red);margin-right:8px"></i>Informations légales</h2>
        <div class="card card-body">
          <div class="grid-2 gap-16">
            ${infosLegales.map(([ic,lbl,val])=>`
              <div class="flex-c gap-12" style="padding:12px;border-radius:var(--r-md);background:var(--blue-light)">
                <div style="width:38px;height:38px;border-radius:var(--r-md);background:var(--blue);display:flex;align-items:center;justify-content:center;font-size:18px;color:white;flex-shrink:0"><i class="ti ${ic}"></i></div>
                <div><div style="font-size:11px;color:var(--text-sec);font-weight:600;text-transform:uppercase;letter-spacing:.05em">${lbl}</div><div style="font-size:13px;font-weight:600;color:var(--text);margin-top:2px">${val}</div></div>
              </div>`).join("")}
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div style="background:linear-gradient(135deg,var(--blue-deep),var(--blue-darker));border-radius:var(--r-2xl);padding:36px;text-align:center;box-shadow:var(--shadow-xl)">
        <h3 style="font-family:var(--font-display);font-size:22px;color:white;margin-bottom:10px">Rejoignez l'Association Espoir &amp; Vie</h3>
        <p style="font-size:14px;color:rgba(255,255,255,.6);margin-bottom:24px;max-width:460px;margin-left:auto;margin-right:auto">Ensemble, servons avec le cœur et agissons avec sens pour les communautés les plus vulnérables.</p>
        <div class="flex-c gap-12" style="justify-content:center;flex-wrap:wrap">
          <button class="btn btn-white btn-lg" onclick="navigate('catalogue')"><i class="ti ti-files"></i>Consulter les archives</button>
          <button class="btn btn-red btn-lg" onclick="navigate('auth',{tab:'register'})"><i class="ti ti-user-plus"></i>Devenir membre</button>
        </div>
      </div>

    </div>

    <footer class="site-footer" style="margin-top:32px">
      <div class="footer-brand"><div class="footer-logo"><img src="assets/logo-aev.png" alt="AEV"></div><div><div class="footer-name">Association Espoir &amp; Vie — espoiretvie.td</div><div class="footer-dev">Conçu par <strong style="color:rgba(255,255,255,.5)">Akora Agency</strong> · N'Djaména, Tchad</div></div></div>
      <div class="footer-links"><span class="footer-link" onclick="navigate('home')">Accueil</span><span class="footer-link" onclick="navigate('catalogue')">Catalogue</span></div>
      <div style="font-size:11px;color:rgba(255,255,255,.25)">© 2026 AEV · Tous droits réservés</div>
    </footer>`;
}

// ══════════════════════════════════════════════════════════
//  MEMBRE
// ══════════════════════════════════════════════════════════
function renderMember(sec="dashboard") {
  APP.memberSec = sec;
  $$("#member-sidebar .sidebar-item").forEach(el=>el.classList.toggle("active",el.dataset.sec===sec));
  const c = $("#member-main");

  if (sec==="dashboard") {
    const myDocs = DB.docs.slice(0,5);
    const pending = myDocs.filter(d=>d.status==="pending").length;
    c.innerHTML = `
      <div class="topbar">
        <div><div class="topbar-title">Bonjour, Aïcha 👋</div><div class="topbar-sub">Bienvenue sur votre espace personnel</div></div>
        <button class="btn btn-primary" onclick="renderMember('upload')"><i class="ti ti-upload"></i>Déposer un document</button>
      </div>
      <div class="page-inner">
        <div class="stats-grid">
          ${[["ti-files","si-blue","12","Mes documents","↑ +2 ce mois"],["ti-clock","si-red",pending,"En attente","À valider"],["ti-star","si-blue","8","Favoris","Sauvegardés"],["ti-download","si-blue","143","Téléchargements","Total cumulé"]].map(([ic,cls,val,lbl,trend])=>`
            <div class="stat-card">
              <div class="stat-icon ${cls}"><i class="ti ${ic}"></i></div>
              <div><div class="stat-val">${val}</div><div class="stat-label">${lbl}</div><div class="stat-trend">${trend}</div></div>
            </div>`).join("")}
        </div>
        <div class="card">
          <div class="card-header"><span class="card-title"><i class="ti ti-files" style="color:var(--blue);margin-right:6px"></i>Mes derniers documents</span><button class="btn btn-outline btn-sm" onclick="renderMember('docs')">Tout voir →</button></div>
          ${myDocs.map(d=>`
            <div class="doc-row" onclick="navigate('doc',{id:${d.id}})">
              ${docIconHtml(d.fmt)}
              <div style="flex:1;min-width:0"><div class="doc-name">${d.title}</div><div class="doc-meta">${d.dateStr} · ${d.fmt} · ${d.size}</div></div>
              ${statusHtml(d.status)}
              <div class="doc-actions gap-6">
                <div class="btn-icon" onclick="event.stopPropagation();dlDoc(${d.id})"><i class="ti ti-download"></i></div>
                <div class="btn-icon red" onclick="event.stopPropagation();delDocMember(${d.id})"><i class="ti ti-trash"></i></div>
              </div>
            </div>`).join("")}
        </div>
        <div>
          <div class="flex-b mb-12"><div class="section-title" style="margin-bottom:0">Mes favoris</div><button class="btn btn-outline btn-sm" onclick="renderMember('favorites')">Voir tout →</button></div>
          <div class="grid-3 gap-14">
            ${DB.docs.slice(0,3).map(d=>`
              <div class="card card-hover" style="cursor:pointer" onclick="navigate('doc',{id:${d.id}})">
                <div class="card-body flex-c gap-10">
                  ${docIconHtml(d.fmt,"36px","42px")}
                  <div style="min-width:0;flex:1"><div class="doc-name" style="font-size:13px">${d.title.substring(0,35)}…</div><div class="doc-meta">${d.fmt} · ${d.size}</div></div>
                  <i class="ti ti-star-filled" style="color:var(--blue);font-size:17px;cursor:pointer;flex-shrink:0" onclick="event.stopPropagation();toggleFav(${d.id})"></i>
                </div>
              </div>`).join("")}
          </div>
        </div>
      </div>`;
  }

  if (sec==="docs") {
    c.innerHTML = `
      <div class="topbar"><div><div class="topbar-title">Mes documents</div><div class="topbar-sub">${DB.docs.length} documents</div></div><button class="btn btn-primary" onclick="renderMember('upload')"><i class="ti ti-upload"></i>Nouveau dépôt</button></div>
      <div class="page-inner">
        <div class="table-wrap">
          <table class="table"><thead><tr><th>Document</th><th>Type</th><th>Format</th><th>Date</th><th>Statut</th><th>Actions</th></tr></thead>
          <tbody>${DB.docs.map(d=>`
            <tr>
              <td><div class="td-doc">${docIconHtml(d.fmt,"30px","36px")}<span style="font-weight:600;max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:block">${d.title}</span></div></td>
              <td>${tagHtml(d.type)}</td><td>${d.fmt}</td><td>${d.dateStr}</td>
              <td>${statusHtml(d.status)}</td>
              <td><div class="flex-c gap-6">
                <div class="btn-icon" onclick="navigate('doc',{id:${d.id}})"><i class="ti ti-eye"></i></div>
                <div class="btn-icon" onclick="dlDoc(${d.id})"><i class="ti ti-download"></i></div>
                <div class="btn-icon red" onclick="delDocMember(${d.id})"><i class="ti ti-trash"></i></div>
              </div></td>
            </tr>`).join("")}</tbody></table>
        </div>
      </div>`;
  }

  if (sec==="upload") {
    APP.uploadStep = 1;
    renderUploadStep(c);
  }

  if (sec==="favorites") {
    c.innerHTML = `
      <div class="topbar"><div class="topbar-title">Mes favoris</div></div>
      <div class="page-inner">
        <div class="grid-3 gap-14">
          ${DB.docs.slice(0,6).map(d=>`
            <div class="card card-hover" style="cursor:pointer" onclick="navigate('doc',{id:${d.id}})">
              <div class="card-body">
                <div class="flex-c gap-10 mb-12">${docIconHtml(d.fmt,"36px","42px")}<div><div style="font-size:13px;font-weight:700;color:var(--text)">${d.title.substring(0,35)}…</div><div class="doc-meta">${d.fmt} · ${d.size}</div></div></div>
                <div class="flex-b">${tagHtml(d.type)}<i class="ti ti-star-filled" style="color:var(--blue);font-size:17px;cursor:pointer" onclick="event.stopPropagation();toggleFav(${d.id})"></i></div>
              </div>
            </div>`).join("")}
        </div>
      </div>`;
  }

  if (sec==="profile") {
    c.innerHTML = `
      <div class="topbar"><div class="topbar-title">Mon profil</div></div>
      <div class="page-inner" style="max-width:580px">
        <div class="card card-body mb-14">
          <div class="flex-c gap-16 mb-20">
            <div style="width:68px;height:68px;border-radius:50%;background:var(--blue);display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:800;color:white;flex-shrink:0">AN</div>
            <div><div style="font-size:18px;font-weight:700;color:var(--text)">Aïcha Ngaradoum</div><div class="doc-meta">Membre actif · Inscrit depuis mars 2024</div><span class="tag tag-blue mt-4" style="display:inline-block">Membre</span></div>
          </div>
          <div class="grid-2 gap-12">
            <div class="form-group"><label class="form-label">Prénom</label><input class="form-control" value="Aïcha"></div>
            <div class="form-group"><label class="form-label">Nom</label><input class="form-control" value="Ngaradoum"></div>
            <div class="form-group"><label class="form-label">Email</label><input class="form-control" value="a.ngaradoum@espoiretvie.td"></div>
            <div class="form-group"><label class="form-label">Organisation</label><input class="form-control" value="AEV"></div>
          </div>
          <button class="btn btn-primary btn-sm mt-16" onclick="toast('Profil mis à jour !','ok')"><i class="ti ti-device-floppy"></i>Enregistrer</button>
        </div>
        <div class="card card-body">
          <div class="card-title mb-12">Changer le mot de passe</div>
          <div class="flex-col gap-10">
            <div class="form-group"><label class="form-label">Mot de passe actuel</label><input type="password" class="form-control" placeholder="••••••••"></div>
            <div class="form-group"><label class="form-label">Nouveau mot de passe</label><input type="password" class="form-control" placeholder="••••••••"></div>
            <button class="btn btn-outline btn-sm" style="align-self:flex-start" onclick="toast('Mot de passe modifié !','ok')">Mettre à jour</button>
          </div>
        </div>
      </div>`;
  }
}

// ─── UPLOAD WIZARD ──────────────────────────────────────
function renderUploadStep(c) {
  const s = APP.uploadStep;
  const steps = ["Fichier","Informations","Permissions","Confirmation"];
  const stepHtml = steps.map((lbl,i)=>{
    const st = i+1<s?"done":i+1===s?"current":"todo";
    return `${i>0?`<div class="step-line ${i<s?"done":""}"></div>`:""}
      <div style="display:flex;align-items:center;gap:7px">
        <div class="step-num ${st}">${st==="done"?`<i class="ti ti-check"></i>`:i+1}</div>
        <span class="step-lbl ${st}" style="font-size:13px">${lbl}</span>
      </div>`;
  }).join("");

  let body = "";
  if (s===1) body=`
    <div class="drop-zone" id="dz" onclick="$('#fi').click()" ondragover="event.preventDefault();this.classList.add('over')" ondragleave="this.classList.remove('over')" ondrop="handleDrop(event)">
      <i class="ti ti-cloud-upload drop-zone-icon"></i>
      <div class="drop-zone-title">Glissez votre fichier ici</div>
      <div class="drop-zone-sub">ou cliquez pour parcourir depuis votre appareil</div>
      <button class="btn btn-primary" onclick="event.stopPropagation();$('#fi').click()"><i class="ti ti-folder-open"></i>Choisir un fichier</button>
      <div style="font-size:11px;color:var(--text-sec);margin-top:14px">PDF, Word, Excel · Taille maximale : 50 Mo</div>
    </div>
    <input type="file" id="fi" style="display:none" onchange="fileSelected(this)">
    <div id="file-preview" style="display:none" class="card card-body flex-c gap-12 mt-12">
      <i class="ti ti-file-check" style="font-size:28px;color:var(--blue)"></i>
      <div><div id="fp-name" style="font-weight:700;color:var(--text)">fichier.pdf</div><div id="fp-size" class="doc-meta">0 Ko</div></div>
      <i class="ti ti-circle-check" style="color:#16A34A;font-size:24px;margin-left:auto"></i>
    </div>`;
  if (s===2) body=`
    <div class="flex-col gap-14">
      <div class="form-group"><label class="form-label">Titre du document <span class="req">*</span></label><input type="text" id="doc-title" class="form-control" placeholder="Ex : Rapport d'activité 2026"></div>
      <div class="grid-2 gap-12">
        <div class="form-group"><label class="form-label">Catégorie <span class="req">*</span></label><select id="doc-cat" class="form-control"><option value="">Choisir…</option><option>Contrat</option><option>Rapport</option><option>Facture</option></select></div>
        <div class="form-group"><label class="form-label">Date du document</label><input type="date" id="doc-date" class="form-control" value="${new Date().toISOString().split("T")[0]}"></div>
      </div>
      <div class="form-group"><label class="form-label">Description courte</label><textarea id="doc-desc" class="form-control" rows="3" placeholder="Résumé du contenu…"></textarea></div>
      <div class="form-group"><label class="form-label">Mots-clés</label>
        <div class="flex-c gap-8 flex-wrap" id="tags-box">
          ${["Association","2026","Rapport","Contrat","Santé","Éducation"].map(t=>`<span class="chip" onclick="this.classList.toggle('on')">${t}</span>`).join("")}
          <span class="chip" style="border-style:dashed;color:var(--blue)" onclick="addTag()"><i class="ti ti-plus"></i>Ajouter</span>
        </div>
      </div>
    </div>`;
  if (s===3) body=`
    <div class="flex-col gap-12">
      ${[["public","Public","Visible par tous sans connexion","ti-world"],["members","Membres","Connexion requise pour accéder","ti-users"],["private","Privé","Administrateurs uniquement","ti-lock"]].map(([v,lbl,desc,ic],i)=>`
        <label style="display:flex;align-items:flex-start;gap:14px;padding:14px 16px;border:2px solid var(--border);border-radius:var(--r-xl);cursor:pointer;transition:var(--t)" onmouseover="this.style.borderColor='var(--blue)'" onmouseout="this.style.borderColor='var(--border)'">
          <input type="radio" name="acc" value="${v}" ${i===0?"checked":""} style="accent-color:var(--blue);margin-top:3px">
          <div style="width:36px;height:36px;border-radius:var(--r-md);background:var(--blue-light);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--blue)"><i class="ti ${ic}"></i></div>
          <div><div style="font-size:14px;font-weight:700;color:var(--text)">${lbl}</div><div style="font-size:12px;color:var(--text-sec)">${desc}</div></div>
        </label>`).join("")}
      <div style="background:var(--blue-light);border-radius:var(--r-xl);padding:16px 18px;border:1px solid var(--blue-mid)">
        <div style="font-size:13px;font-weight:700;color:var(--blue-darker);margin-bottom:10px"><i class="ti ti-info-circle"></i> Processus de validation</div>
        <div class="flex-c gap-10 mb-8"><i class="ti ti-shield-check" style="color:var(--blue);font-size:17px"></i><span style="font-size:13px;color:var(--text-sec)">Approbation manuelle par un administrateur avant publication</span></div>
        <div class="flex-c gap-10"><i class="ti ti-clock" style="color:var(--red);font-size:17px"></i><span style="font-size:13px;color:var(--text-sec)">Délai estimé : 24 à 48 heures ouvrables</span></div>
      </div>
    </div>`;
  if (s===4) body=`
    <div style="text-align:center;padding:36px 20px">
      <div style="width:80px;height:80px;background:var(--blue-light);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:36px;color:var(--blue)"><i class="ti ti-circle-check"></i></div>
      <h2 style="font-family:var(--font-display);font-size:24px;font-weight:700;color:var(--text);margin-bottom:10px">Document soumis avec succès !</h2>
      <p style="font-size:14px;color:var(--text-sec);margin-bottom:28px;max-width:380px;margin-left:auto;margin-right:auto;line-height:1.7">Votre document a été envoyé pour validation. Un administrateur le traitera sous 24 à 48h. Vous serez notifié dès publication.</p>
      <div class="flex-c gap-10" style="justify-content:center">
        <button class="btn btn-primary" onclick="renderMember('docs')"><i class="ti ti-files"></i>Mes documents</button>
        <button class="btn btn-outline" onclick="renderMember('upload')"><i class="ti ti-upload"></i>Nouveau dépôt</button>
      </div>
    </div>`;

  c.innerHTML = `
    <div class="topbar"><div><div class="topbar-title">Déposer un document</div><div class="topbar-sub">Étape ${Math.min(s,4)} sur 4</div></div></div>
    <div class="page-inner">
      <div class="card" style="max-width:700px;margin:0 auto">
        <div style="padding:18px 24px;border-bottom:1px solid var(--border-lt)">
          <div class="stepper">${stepHtml}</div>
        </div>
        <div class="card-body" style="padding:28px">${body}</div>
        ${s<4?`
        <div class="card-footer flex-b">
          <button class="btn btn-outline" ${s===1?"disabled":""} onclick="APP.uploadStep--;renderUploadStep($('#member-main'))"><i class="ti ti-arrow-left"></i>Précédent</button>
          <div class="flex-c gap-8">
            <button class="btn" style="background:var(--gray-100);color:var(--text-sec)" onclick="toast('Brouillon sauvegardé.','info')"><i class="ti ti-device-floppy"></i>Brouillon</button>
            <button class="btn btn-primary" onclick="nextUploadStep()">
              ${s===3?`<i class="ti ti-send"></i>Soumettre`:`Suivant <i class="ti ti-arrow-right"></i>`}
            </button>
          </div>
        </div>` : ""}
      </div>
    </div>`;
}

function nextUploadStep() {
  if (APP.uploadStep===2) {
    const t = $("#doc-title")?.value.trim();
    const cat = $("#doc-cat")?.value;
    if (!t||!cat) { toast("Veuillez remplir le titre et la catégorie.","err"); return; }
  }
  if (APP.uploadStep < 4) {
    APP.uploadStep++;
    renderUploadStep($("#member-main"));
    if (APP.uploadStep===4) toast("Document soumis pour validation !","ok");
  }
}

function fileSelected(input) {
  if (input.files[0]) {
    const f = input.files[0];
    $("#file-preview").style.display = "flex";
    $("#fp-name").textContent = f.name;
    $("#fp-size").textContent = (f.size/1024).toFixed(0)+" Ko";
  }
}
function handleDrop(e) {
  e.preventDefault();
  $("#dz")?.classList.remove("over");
  const f = e.dataTransfer.files[0];
  if (f) { $("#file-preview").style.display="flex"; $("#fp-name").textContent=f.name; $("#fp-size").textContent=(f.size/1024).toFixed(0)+" Ko"; }
}
function addTag() {
  const t = prompt("Nom du tag :");
  if (t?.trim()) {
    const span = document.createElement("span");
    span.className = "chip on";
    span.textContent = t.trim();
    span.onclick = ()=>span.classList.toggle("on");
    const box = $("#tags-box");
    box.insertBefore(span, box.lastElementChild);
  }
}

// ══════════════════════════════════════════════════════════
//  ADMIN
// ══════════════════════════════════════════════════════════
function renderAdmin(sec="dashboard") {
  APP.adminSec = sec;
  $$("#admin-sidebar .sidebar-item").forEach(el=>el.classList.toggle("active",el.dataset.sec===sec));
  const c = $("#admin-main");
  const pending = DB.docs.filter(d=>d.status==="pending");
  // Badge dynamique
  const navDocs = $("#admin-docs-nav");
  if (navDocs) {
    const badge = navDocs.querySelector(".s-badge");
    if (badge) badge.remove();
    if (pending.length) {
      const b = document.createElement("span");
      b.className = "s-badge";
      b.textContent = pending.length;
      navDocs.appendChild(b);
    }
  }

  if (sec==="dashboard") {
    c.innerHTML = `
      <div class="topbar">
        <div><div class="topbar-title">Tableau de bord</div><div class="topbar-sub">${new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div></div>
        <div class="flex-c gap-8">
          <button class="btn btn-outline btn-sm" onclick="navigate('catalogue')"><i class="ti ti-world"></i>Portail public</button>
          <button class="btn btn-primary btn-sm" onclick="renderAdmin('docs')"><i class="ti ti-files"></i>Gérer les documents</button>
        </div>
      </div>
      <div class="page-inner">
        <div class="stats-grid">
          ${[
            ["ti-files","si-blue",DB.docs.filter(d=>d.status==="published").length,"Documents publiés","↑ +47 ce mois"],
            ["ti-clock","si-red",pending.length,"En attente","À valider"],
            ["ti-users","si-blue",DB.users.length,"Utilisateurs","↑ +5 cette semaine"],
            ["ti-download","si-blue","12 480","Téléchargements","↑ +312 cette semaine"],
          ].map(([ic,cls,val,lbl,trend])=>`
            <div class="stat-card"><div class="stat-icon ${cls}"><i class="ti ${ic}"></i></div><div><div class="stat-val">${val}</div><div class="stat-label">${lbl}</div><div class="stat-trend">${trend}</div></div></div>
          `).join("")}
        </div>
        <div style="display:grid;grid-template-columns:1fr 290px;gap:16px">
          <!-- VALIDATION -->
          <div class="card">
            <div class="card-header">
              <span class="card-title">Documents en attente ${pending.length?`<span class="tag tag-red" style="margin-left:8px">${pending.length} à valider</span>`:""}</span>
              <button class="btn btn-outline btn-sm" onclick="renderAdmin('docs')">Tout voir →</button>
            </div>
            ${pending.length ? `
            <table class="table">
              <thead><tr><th>Document</th><th>Auteur</th><th>Type</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                ${pending.map(d=>`
                  <tr id="admin-row-${d.id}">
                    <td><div class="td-doc">${docIconHtml(d.fmt,"30px","36px")}<span style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600">${d.title.substring(0,40)}…</span></div></td>
                    <td class="text-sec">${d.author}</td>
                    <td>${tagHtml(d.type)}</td>
                    <td class="text-sec">${d.dateStr}</td>
                    <td><div class="flex-c gap-6">
                      <div class="btn-icon green" onclick="approveDoc(${d.id})" title="Approuver"><i class="ti ti-check"></i></div>
                      <div class="btn-icon red" onclick="rejectDoc(${d.id})" title="Rejeter"><i class="ti ti-x"></i></div>
                      <div class="btn-icon" onclick="navigate('doc',{id:${d.id}})" title="Aperçu"><i class="ti ti-eye"></i></div>
                    </div></td>
                  </tr>`).join("")}
              </tbody>
            </table>` : `<div class="empty"><i class="ti ti-circle-check"></i><h3>Tout est à jour !</h3><p>Aucun document en attente de validation.</p></div>`}
          </div>
          <!-- DROITE -->
          <div class="flex-col gap-14">
            <div class="card card-body">
              <div class="card-title mb-12">Répartition des documents</div>
              ${[["Rapports",45,false],["Contrats",33,true],["Factures",22,false]].map(([lbl,pct,isRed])=>`
                <div style="margin-bottom:12px">
                  <div class="flex-b text-sm mb-4"><span style="font-weight:600">${lbl}</span><span style="color:${isRed?"var(--red)":"var(--blue)"};font-weight:700">${pct}%</span></div>
                  <div class="progress"><div class="progress-fill ${isRed?"red":""}" style="width:${pct}%"></div></div>
                </div>`).join("")}
            </div>
            <div class="card card-body">
              <div class="card-title mb-10">Activité récente</div>
              ${DB.activity.map(a=>`
                <div class="flex-c gap-10" style="padding:7px 0;border-bottom:1px solid var(--border-lt)">
                  <div style="width:8px;height:8px;border-radius:50%;background:${a.isNew?"var(--blue)":"var(--border)"};flex-shrink:0"></div>
                  <div><div style="font-size:12px;font-weight:500;color:var(--text)">${a.msg}</div><div style="font-size:11px;color:var(--text-sec)">${a.time}</div></div>
                </div>`).join("")}
            </div>
            <div style="background:var(--blue-deep);border-radius:var(--r-xl);padding:16px">
              <div style="font-size:11px;font-weight:700;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px">Actions rapides</div>
              ${[["ti-user-plus","Inviter un membre","renderAdmin('users')"],["ti-folder-plus","Créer une catégorie","toast('Catégorie créée !','ok')"],["ti-chart-bar","Exporter les statistiques","toast('Export en cours…','info')"]].map(([ic,lbl,action])=>`
                <div class="flex-c gap-10" style="padding:9px 12px;background:rgba(255,255,255,.07);border-radius:var(--r-md);cursor:pointer;margin-bottom:7px;transition:var(--t)" onclick="${action}" onmouseover="this.style.background='rgba(255,255,255,.12)'" onmouseout="this.style.background='rgba(255,255,255,.07)'">
                  <i class="ti ${ic}" style="color:var(--blue);font-size:18px"></i>
                  <span style="font-size:13px;color:white;font-weight:500">${lbl}</span>
                </div>`).join("")}
            </div>
          </div>
        </div>
        <!-- MEMBRES -->
        <div class="card">
          <div class="card-header"><span class="card-title">Membres récents</span><button class="btn btn-outline btn-sm" onclick="renderAdmin('users')">Gérer les membres →</button></div>
          <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px;padding:16px">
            ${DB.users.map(u=>`
              <div class="card card-hover card-body" style="padding:14px;cursor:pointer" onclick="renderAdmin('users')">
                <div class="flex-c gap-8 mb-8"><div class="u-avatar" style="background:${u.role==="admin"?"var(--red)":"var(--blue)"}">${u.initials}</div><div style="min-width:0;overflow:hidden"><div style="font-size:12px;font-weight:700;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${u.name}</div><div style="font-size:10px;color:var(--text-sec)">${u.roleLabel}</div></div></div>
                <span class="status ${u.status==="new"?"s-pending":"s-published"}" style="font-size:10px">${u.status==="new"?"Nouveau":"Actif"}</span>
              </div>`).join("")}
          </div>
        </div>
      </div>`;
  }

  if (sec==="docs") {
    c.innerHTML = `
      <div class="topbar">
        <div><div class="topbar-title">Tous les documents</div><div class="topbar-sub">${DB.docs.length} documents</div></div>
        <div class="flex-c gap-8">
          <input type="text" class="form-control" style="width:240px;height:38px" placeholder="Filtrer…" oninput="adminFilter(this.value)">
          <button class="btn btn-primary btn-sm" onclick="toast('Importer un document','info')"><i class="ti ti-upload"></i>Importer</button>
        </div>
      </div>
      <div class="page-inner">
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Document</th><th>Type</th><th>Format</th><th>Auteur</th><th>Accès</th><th>Date</th><th>Statut</th><th>Actions</th></tr></thead>
            <tbody id="admin-docs-body">
              ${DB.docs.map(d=>`
                <tr id="admin-row-${d.id}">
                  <td style="max-width:250px"><div class="td-doc">${docIconHtml(d.fmt,"30px","36px")}<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600;font-size:13px">${d.title}</span></div></td>
                  <td>${tagHtml(d.type)}</td><td>${d.fmt}</td><td class="text-sec">${d.author}</td>
                  <td><span class="tag ${d.access==="Public"?"tag-pub":"tag-gray"}">${d.access}</span></td>
                  <td class="text-sec">${d.dateStr}</td>
                  <td id="status-${d.id}">${statusHtml(d.status)}</td>
                  <td><div class="flex-c gap-6">
                    ${d.status==="pending"?`<div class="btn-icon green" onclick="approveDoc(${d.id})" title="Approuver"><i class="ti ti-check"></i></div><div class="btn-icon red" onclick="rejectDoc(${d.id})" title="Rejeter"><i class="ti ti-x"></i></div>`:""}
                    <div class="btn-icon" onclick="navigate('doc',{id:${d.id}})"><i class="ti ti-eye"></i></div>
                    <div class="btn-icon red" onclick="adminDelDoc(${d.id})"><i class="ti ti-trash"></i></div>
                  </div></td>
                </tr>`).join("")}
            </tbody>
          </table>
        </div>
        <div class="pagination">${[1,2,3,"…",42].map((n,i)=>`<div class="pag-btn ${i===0?"active":""}" onclick="${typeof n==="number"?`toast('Page ${n}','info')`:""}">${n}</div>`).join("")}</div>
      </div>`;
  }

  if (sec==="users") {
    c.innerHTML = `
      <div class="topbar"><div><div class="topbar-title">Gestion des membres</div><div class="topbar-sub">${DB.users.length} membres inscrits</div></div><button class="btn btn-primary btn-sm" onclick="toast('Invitation envoyée !','ok')"><i class="ti ti-user-plus"></i>Inviter</button></div>
      <div class="page-inner">
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Membre</th><th>Email</th><th>Rôle</th><th>Documents</th><th>Inscrit</th><th>Statut</th><th>Actions</th></tr></thead>
            <tbody>${DB.users.map(u=>`
              <tr>
                <td><div class="flex-c gap-10"><div class="u-avatar" style="background:${u.role==="admin"?"var(--red)":"var(--blue)"}">${u.initials}</div><div><div style="font-size:13px;font-weight:700">${u.name}</div></div></div></td>
                <td class="text-sec text-sm">${u.email}</td>
                <td><span class="tag ${u.role==="admin"?"tag-red":"tag-blue"}">${u.roleLabel}</span></td>
                <td style="font-weight:700;color:var(--blue)">${u.docs}</td>
                <td class="text-sec text-sm">${u.joined}</td>
                <td><span class="status ${u.status==="new"?"s-pending":"s-published"}">${u.status==="new"?"Nouveau":"Actif"}</span></td>
                <td><div class="flex-c gap-6">
                  <div class="btn-icon" onclick="toast('Profil de ${u.name}','info')"><i class="ti ti-eye"></i></div>
                  <div class="btn-icon" onclick="toast('Rôle modifié','ok')"><i class="ti ti-pencil"></i></div>
                  <div class="btn-icon red" onclick="toast('Membre suspendu','err')"><i class="ti ti-user-off"></i></div>
                </div></td>
              </tr>`).join("")}
            </tbody>
          </table>
        </div>
      </div>`;
  }

  if (sec==="stats") {
    c.innerHTML = `
      <div class="topbar"><div><div class="topbar-title">Statistiques & Analyses</div><div class="topbar-sub">Vue d'ensemble de la plateforme</div></div><button class="btn btn-outline btn-sm" onclick="toast('Export CSV généré','ok')"><i class="ti ti-download"></i>Exporter</button></div>
      <div class="page-inner">
        <div class="stats-grid">
          ${[["ti-files","si-blue","1 284","Documents total"],["ti-download","si-blue","12 480","Téléchargements"],["ti-eye","si-blue","48 200","Vues totales"],["ti-users","si-blue","84","Membres"]].map(([ic,cls,v,l])=>`
            <div class="stat-card"><div class="stat-icon ${cls}"><i class="ti ${ic}"></i></div><div><div class="stat-val">${v}</div><div class="stat-label">${l}</div></div></div>`).join("")}
        </div>
        <div class="grid-2 gap-16">
          <div class="card card-body">
            <div class="card-title mb-16">Téléchargements mensuels</div>
            <div style="display:flex;align-items:flex-end;gap:6px;height:150px">
              ${[48,72,55,90,65,95,78,88,62,74,82,100].map((h,i)=>`
                <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">
                  <div style="width:100%;background:${h>85?"var(--blue)":"var(--blue-light)"};border-radius:4px 4px 0 0;height:${h*1.2}px;cursor:pointer;transition:var(--t)" onmouseover="this.style.background='var(--blue)';toast('${h} télécharg. en ${'JFMAMJJASOND'[i]}','info')" onmouseout="this.style.background='${h>85?"var(--blue)":"var(--blue-light)"}'"></div>
                  <span style="font-size:9px;color:var(--text-sec)">${'JFMAMJJASOND'[i]}</span>
                </div>`).join("")}
            </div>
          </div>
          <div class="card card-body">
            <div class="card-title mb-16">Top documents</div>
            ${DB.docs.sort((a,b)=>b.dl-a.dl).slice(0,5).map((d,i)=>`
              <div class="flex-c gap-10" style="padding:8px 0;border-bottom:1px solid var(--border-lt);cursor:pointer" onclick="navigate('doc',{id:${d.id}})">
                <div style="width:22px;height:22px;border-radius:50%;background:${i===0?"var(--blue)":i===1?"var(--blue-light)":"var(--gray-100)"};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:${i===0?"white":"var(--blue)"};flex-shrink:0">${i+1}</div>
                <div style="flex:1;min-width:0"><div style="font-size:12px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${d.title.substring(0,40)}…</div></div>
                <span style="font-size:12px;font-weight:700;color:var(--blue)">${d.dl}</span>
              </div>`).join("")}
          </div>
        </div>
      </div>`;
  }

  if (sec==="settings") {
    c.innerHTML = `
      <div class="topbar"><div class="topbar-title">Paramètres du système</div></div>
      <div class="page-inner" style="max-width:640px">
        <div class="card card-body mb-14">
          <div class="card-title mb-16">Informations de l'organisation</div>
          <div class="flex-col gap-12">
            <div class="form-group"><label class="form-label">Nom de l'association</label><input class="form-control" value="Association Espoir & Vie"></div>
            <div class="grid-2 gap-12">
              <div class="form-group"><label class="form-label">Email de contact</label><input class="form-control" value="contact@espoiretvie.td"></div>
              <div class="form-group"><label class="form-label">Domaine</label><input class="form-control" value="espoiretvie.td"></div>
            </div>
            <div class="form-group"><label class="form-label">Ville / Pays</label><input class="form-control" value="N'Djaména, Tchad"></div>
            <div class="form-group"><label class="form-label">Devise</label><input class="form-control" value="Solidarité - Humanité - Dignité"></div>
            <button class="btn btn-primary btn-sm" style="align-self:flex-start" onclick="toast('Paramètres enregistrés !','ok')"><i class="ti ti-device-floppy"></i>Enregistrer</button>
          </div>
        </div>
        <div class="card card-body">
          <div class="card-title mb-16">Options de la plateforme</div>
          <div class="flex-col gap-10">
            ${[["Validation manuelle des dépôts","Approbation admin requise avant publication"],["Accès public au téléchargement","Tous les visiteurs peuvent télécharger"],["Notifications email","Email admin à chaque nouveau dépôt"]].map(([lbl,desc])=>`
              <div class="flex-b" style="padding:14px 16px;border:1px solid var(--border);border-radius:var(--r-xl)">
                <div><div style="font-size:13px;font-weight:600;color:var(--text)">${lbl}</div><div class="doc-meta mt-4">${desc}</div></div>
                <div style="width:46px;height:26px;background:var(--blue);border-radius:13px;position:relative;cursor:pointer;flex-shrink:0" onclick="toast('Option mise à jour','ok')">
                  <div style="width:20px;height:20px;background:white;border-radius:50%;position:absolute;right:3px;top:3px;box-shadow:0 2px 4px rgba(0,0,0,.2)"></div>
                </div>
              </div>`).join("")}
            <button class="btn btn-danger btn-sm" style="align-self:flex-start;margin-top:8px" onclick="toast('Opération annulée','err')"><i class="ti ti-alert-triangle"></i>Zone dangereuse</button>
          </div>
        </div>
      </div>`;
  }
}

// ─── ACTIONS DOCS ────────────────────────────────────────
function approveDoc(id) {
  const d = DB.docs.find(x=>x.id===id);
  if (!d) return;
  d.status = "published";
  toast(`"${d.title.substring(0,30)}…" publié avec succès !`,"ok");
  const row = $(`#admin-row-${id}`);
  if (row) row.style.opacity="0.4";
  const st = $(`#status-${id}`);
  if (st) st.innerHTML = statusHtml("published");
  setTimeout(()=>renderAdmin(APP.adminSec), 1200);
}
function rejectDoc(id) {
  const d = DB.docs.find(x=>x.id===id);
  if (!d) return;
  d.status = "rejected";
  toast("Document rejeté.","err");
  setTimeout(()=>renderAdmin(APP.adminSec), 800);
}
function adminDelDoc(id) {
  openModal(`
    <p style="font-size:14px;color:var(--text-sec);line-height:1.7">Cette action est irréversible. Le document sera définitivement supprimé de la plateforme.</p>
    <div class="flex-c gap-10 mt-20">
      <button class="btn btn-danger" onclick="confirmAdminDel(${id})"><i class="ti ti-trash"></i>Supprimer</button>
      <button class="btn btn-outline" onclick="closeModal()">Annuler</button>
    </div>`, "Supprimer ce document ?");
}
function confirmAdminDel(id) {
  const i = DB.docs.findIndex(x=>x.id===id);
  if (i>-1) { DB.docs.splice(i,1); toast("Document supprimé.","err"); closeModal(); renderAdmin(APP.adminSec); }
}
function delDocMember(id) {
  const i = DB.docs.findIndex(x=>x.id===id);
  if (i>-1) { DB.docs.splice(i,1); toast("Document supprimé.","err"); renderMember(APP.memberSec); }
}
function adminFilter(q) {
  $$(`#admin-docs-body tr`).forEach(row=>{
    row.style.display = row.textContent.toLowerCase().includes(q.toLowerCase()) ? "" : "none";
  });
}

// ─── ACTIONS COMMUNES ────────────────────────────────────
function dlDoc(id) {
  const d = DB.docs.find(x=>x.id===id);
  if (!d) return;
  d.dl++;
  toast(`Téléchargement de "${d.title.substring(0,32)}…"`, "ok");
}
function shareDoc(id) {
  const url = `https://espoiretvie.td/doc/${id}`;
  navigator.clipboard?.writeText(url).catch(()=>{});
  toast("Lien copié dans le presse-papiers !", "info");
}
function toggleFav(id) {
  const btn = $(`#fav-btn-${id}`);
  if (btn) {
    const isFav = btn.querySelector("i").classList.contains("ti-star-filled");
    btn.querySelector("i").className = `ti ${isFav?"ti-star":"ti-star-filled"}`;
    btn.querySelector("i").style.color = isFav ? "" : "var(--blue)";
    toast(isFav ? "Retiré des favoris" : "Ajouté aux favoris !", isFav?"info":"ok");
  } else {
    toast("Ajouté aux favoris !","ok");
  }
}

// ══════════════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════════════
document.addEventListener("DOMContentLoaded", () => {
  renderHome();
  navigate("home");
});
