"use strict";

// BASE DE DONNÉES MOCK (remplacer par API réelle)
const DB = {
  cats: [
    { id:"admin",         name:"Administration",            icon:"ti-building-community", color:"#6D28D9", bg:"#F3E8FF", conf:"interne",      tags:["Statuts","PV","Légal"] },
    { id:"finance",       name:"Finance et comptabilité",   icon:"ti-cash",               color:"#C2410C", bg:"#FFF7ED", conf:"confidentiel",  tags:["Budget","Bilan","Comptabilité"] },
    { id:"contrat",       name:"Contrats et conventions",   icon:"ti-writing",            color:"#1E40AF", bg:"#EFF6FF", conf:"confidentiel",  tags:["Partenariat","Prestation","Subvention"] },
    { id:"courrier",      name:"Courriers",                 icon:"ti-mail",               color:"#0E7490", bg:"#ECFEFF", conf:"interne",       tags:["Officiel","Entrant","Sortant"] },
    { id:"rapport",       name:"Rapports et comptes rendus",icon:"ti-chart-line",         color:"#B91C1C", bg:"#FEF2F2", conf:"interne",       tags:["Annuel","Activité","Mission"] },
    { id:"projet",        name:"Projets et programmes",     icon:"ti-briefcase",          color:"#166534", bg:"#F0FDF4", conf:"interne",       tags:["Santé","Nutrition","Programme"] },
    { id:"partenariat",   name:"Partenariats",              icon:"ti-affiliate",          color:"#0F766E", bg:"#F0FDFA", conf:"interne",       tags:["ONG","Accord","Collaboration"] },
    { id:"communication", name:"Communication",             icon:"ti-speakerphone",       color:"#BE185D", bg:"#FDF2F8", conf:"public",        tags:["Plaquette","Presse","Visuel"] },
    { id:"rh",            name:"Ressources humaines",       icon:"ti-users",              color:"#B45309", bg:"#FFFBEB", conf:"confidentiel",  tags:["Personnel","Contrats","Évaluation"] },
    { id:"divers",        name:"Pièces diverses",           icon:"ti-folder",             color:"#475569", bg:"#F8FAFC", conf:"interne",       tags:["Temporaire","Divers"] },
  ],
  docs: [
    // Administration
    { id:1,  title:"Statuts de l'Association Espoir & Vie — Version 2023", type:"Administration", cat:"admin",    fmt:"PDF",   size:"1,2 Mo", pages:18, date:"2023-03-15", dateStr:"15 mars 2023",  author:"Admin AEV",     access:"Public",       dl:245, views:980,  tags:["Statuts","Légal","2023"],         status:"published", desc:"Texte officiel des statuts de l'Association Espoir & Vie adoptés lors de l'assemblée générale constitutive de mars 2023." },
    { id:11, title:"Procès-verbal — Assemblée Générale Ordinaire 2025",    type:"Administration", cat:"admin",    fmt:"PDF",   size:"680 Ko", pages:12, date:"2025-12-10", dateStr:"10 déc. 2025",  author:"Admin AEV",     access:"Membres",      dl:34,  views:89,   tags:["PV","AG","2025"],                status:"published", desc:"Procès-verbal de l'Assemblée Générale Ordinaire tenue le 10 décembre 2025, incluant les résolutions adoptées et le rapport moral." },
    // Finance et comptabilité
    { id:3,  title:"Budget annuel prévisionnel 2026",                      type:"Finance",        cat:"finance",  fmt:"Excel", size:"1,1 Mo", pages:22, date:"2026-01-10", dateStr:"10 jan. 2026",  author:"F. Adoum",      access:"Confidentiel", dl:12,  views:45,   tags:["Budget","2026","Finance"],        status:"published", desc:"Budget annuel prévisionnel 2026 de l'association incluant les recettes projetées, dépenses par poste et analyse de l'équilibre financier." },
    { id:7,  title:"Bilan financier — Exercice 2024",                      type:"Finance",        cat:"finance",  fmt:"Excel", size:"890 Ko", pages:18, date:"2025-03-05", dateStr:"5 mars 2025",   author:"F. Adoum",      access:"Confidentiel", dl:28,  views:76,   tags:["Bilan","2024","Comptabilité"],   status:"published", desc:"Bilan comptable et financier de l'exercice 2024 présenté lors de l'assemblée générale 2025." },
    { id:8,  title:"Facture prestation logistique #2026-091",              type:"Finance",        cat:"finance",  fmt:"PDF",   size:"280 Ko", pages:3,  date:"2026-06-06", dateStr:"6 juin 2026",   author:"S. Mahamat",    access:"Confidentiel", dl:0,   views:4,    tags:["Facture","2026","Logistique"],   status:"pending",   desc:"Facture de prestation logistique soumise pour validation avant paiement." },
    // Contrats et conventions
    { id:2,  title:"Contrat de partenariat — Forum Santé juin 2026",       type:"Contrat",        cat:"contrat",  fmt:"Word",  size:"845 Ko", pages:12, date:"2026-06-03", dateStr:"3 juin 2026",   author:"A. Ngaradoum",  access:"Membres",      dl:89,  views:342,  tags:["Partenariat","2026","Santé"],    status:"published", desc:"Accord de partenariat entre l'Association Espoir & Vie et les parties prenantes du Forum Santé 2026." },
    { id:6,  title:"Contrat prestation médicale — Mai 2026",               type:"Contrat",        cat:"contrat",  fmt:"Word",  size:"620 Ko", pages:8,  date:"2026-05-28", dateStr:"28 mai 2026",   author:"M. Dupont",     access:"Membres",      dl:5,   views:18,   tags:["Prestation","2026","Médical"],   status:"pending",   desc:"Contrat de prestation de services médicaux en attente de validation administrative." },
    { id:10, title:"Convention de subvention PNUD — Programme 2025",       type:"Contrat",        cat:"contrat",  fmt:"PDF",   size:"560 Ko", pages:10, date:"2025-06-15", dateStr:"15 juin 2025",  author:"Admin AEV",     access:"Membres",      dl:14,  views:58,   tags:["PNUD","2025","Subvention"],      status:"published", desc:"Convention de subvention conclue avec le PNUD pour le financement du programme de développement communautaire." },
    // Courriers
    { id:12, title:"Courrier officiel — Ministère de la Santé (mars 2026)",type:"Courrier",        cat:"courrier", fmt:"PDF",   size:"320 Ko", pages:3,  date:"2026-03-12", dateStr:"12 mars 2026",  author:"Admin AEV",     access:"Membres",      dl:6,   views:23,   tags:["Officiel","Ministère","2026"],   status:"published", desc:"Courrier adressé au Ministère de la Santé relatif à la demande d'agrément pour les activités de santé communautaire." },
    { id:13, title:"Réponse demande partenariat — ONG Solidarité Monde",   type:"Courrier",        cat:"courrier", fmt:"PDF",   size:"280 Ko", pages:2,  date:"2026-05-18", dateStr:"18 mai 2026",   author:"A. Ngaradoum",  access:"Membres",      dl:3,   views:12,   tags:["Partenariat","ONG","2026"],      status:"published", desc:"Réponse favorable adressée à l'ONG Solidarité Monde suite à leur proposition de collaboration sur les programmes nutrition." },
    // Rapports et comptes rendus
    { id:4,  title:"Rapport annuel Espoir & Vie — Exercice 2024",          type:"Rapport",         cat:"rapport",  fmt:"PDF",   size:"2,4 Mo", pages:48, date:"2026-06-05", dateStr:"5 juin 2026",   author:"Admin AEV",     access:"Public",       dl:347, views:1284, tags:["Annuel","2024","Bilan","Activités"], status:"published", desc:"Bilan complet des activités et résultats de l'association pour l'exercice 2024, couvrant les programmes santé, éducation et actions communautaires." },
    { id:5,  title:"Rapport annuel Espoir & Vie — Exercice 2023",          type:"Rapport",         cat:"rapport",  fmt:"PDF",   size:"2,1 Mo", pages:44, date:"2024-01-10", dateStr:"10 jan. 2024",  author:"Admin AEV",     access:"Public",       dl:520, views:2100, tags:["Annuel","2023","Bilan"],         status:"published", desc:"Rapport d'activité complet pour l'exercice 2023." },
    { id:14, title:"Rapport financier Q1 2026",                             type:"Rapport",         cat:"rapport",  fmt:"Excel", size:"1,1 Mo", pages:22, date:"2026-04-15", dateStr:"15 avr. 2026",  author:"F. Adoum",      access:"Membres",      dl:42,  views:118,  tags:["Financier","Q1","2026"],         status:"published", desc:"Rapport financier du premier trimestre 2026 incluant les recettes, dépenses et analyse des écarts budgétaires." },
    // Projets et programmes
    { id:9,  title:"Programme de santé communautaire 2025-2026",           type:"Projet",          cat:"projet",   fmt:"PDF",   size:"3,2 Mo", pages:60, date:"2025-07-20", dateStr:"20 juil. 2025", author:"Admin AEV",     access:"Public",       dl:430, views:1650, tags:["Santé","Programme","2025"],      status:"published", desc:"Programme détaillé des actions de santé communautaire pour la période 2025-2026." },
    { id:15, title:"Plan de travail — Projet Nutrition Rurale 2026",        type:"Projet",          cat:"projet",   fmt:"PDF",   size:"1,8 Mo", pages:32, date:"2026-02-20", dateStr:"20 fév. 2026",  author:"A. Ngaradoum",  access:"Membres",      dl:18,  views:67,   tags:["Nutrition","2026","Rurales"],    status:"published", desc:"Plan de travail annuel du projet de nutrition rurale, incluant les activités planifiées, les indicateurs de suivi et le budget prévisionnel." },
    // Partenariats
    { id:16, title:"Profil partenaire — Croix-Rouge Tchad 2026",           type:"Partenariat",     cat:"partenariat",fmt:"PDF", size:"740 Ko", pages:8,  date:"2026-01-15", dateStr:"15 jan. 2026",  author:"Admin AEV",     access:"Membres",      dl:11,  views:38,   tags:["Croix-Rouge","2026","Accord"],  status:"published", desc:"Fiche de présentation et cadre de collaboration avec la Croix-Rouge Tchad pour l'exercice 2026." },
    { id:17, title:"Accord de collaboration — ONG Santé Frontières",       type:"Partenariat",     cat:"partenariat",fmt:"PDF", size:"520 Ko", pages:6,  date:"2025-09-10", dateStr:"10 sept. 2025", author:"A. Ngaradoum",  access:"Membres",      dl:7,   views:29,   tags:["ONG","2025","Collaboration"],   status:"published", desc:"Accord de collaboration signé avec l'ONG Santé Frontières pour des activités conjointes de santé communautaire." },
    // Communication institutionnelle
    { id:18, title:"Plaquette institutionnelle AEV 2026",                  type:"Communication",   cat:"communication",fmt:"PDF",size:"4,2 Mo",pages:8, date:"2026-03-01", dateStr:"1 mars 2026",   author:"Admin AEV",     access:"Public",       dl:312, views:1040, tags:["Plaquette","2026","Identité"],  status:"published", desc:"Plaquette de présentation officielle de l'Association Espoir & Vie 2026 destinée aux partenaires et bailleurs de fonds." },
    { id:19, title:"Communiqué de presse — Forum Santé juin 2026",         type:"Communication",   cat:"communication",fmt:"PDF",size:"380 Ko",pages:2, date:"2026-06-01", dateStr:"1 juin 2026",   author:"A. Ngaradoum",  access:"Public",       dl:54,  views:178,  tags:["Presse","ForumSanté","2026"],   status:"published", desc:"Communiqué de presse annonçant la participation de l'AEV au Forum National Santé de juin 2026." },
    // Ressources humaines
    { id:20, title:"Registre du personnel — Exercice 2026",                type:"RH",              cat:"rh",       fmt:"Excel", size:"640 Ko", pages:5,  date:"2026-01-05", dateStr:"5 jan. 2026",   author:"Admin AEV",     access:"Confidentiel", dl:2,   views:8,    tags:["Personnel","2026","Registre"],  status:"published", desc:"Registre officiel du personnel salarié et bénévole de l'association pour l'exercice 2026." },
    // Pièces diverses
    { id:21, title:"Supports de formation — Atelier Gouvernance 2025",     type:"Divers",          cat:"divers",   fmt:"PDF",   size:"2,1 Mo", pages:40, date:"2025-11-18", dateStr:"18 nov. 2025",  author:"S. Mahamat",    access:"Membres",      dl:23,  views:74,   tags:["Formation","Gouvernance","2025"],status:"published", desc:"Supports pédagogiques utilisés lors de l'atelier de renforcement de la gouvernance organisationnelle de novembre 2025." },
  ],
  users: [
    { id:1, name:"Admin AEV", initials:"AA", role:"admin",   roleLabel:"Administrateur", email:"admin@espoiretvie.td",    docs:18, status:"active", joined:"Depuis 2022" },
    { id:2, name:"Aïcha Ngaradoum", initials:"AN", role:"member", roleLabel:"Membre", email:"a.ngaradoum@espoiretvie.td", docs:12, status:"active", joined:"Mars 2024"  },
    { id:3, name:"Souleymane Mahamat", initials:"SM", role:"member", roleLabel:"Membre", email:"s.mahamat@espoiretvie.td", docs:4,  status:"new",    joined:"Juin 2026"  },
    { id:4, name:"Fidèle Adoum",    initials:"FA", role:"member", roleLabel:"Membre", email:"f.adoum@espoiretvie.td",    docs:7,  status:"active", joined:"Jan. 2025"  },
    { id:5, name:"Marc Dupont",      initials:"MD", role:"member",     roleLabel:"Membre",     email:"m.dupont@espoiretvie.td",    docs:3,  status:"active", joined:"Avr. 2025"  },
    { id:6, name:"Christine Koumba", initials:"CK", role:"consultant", roleLabel:"Consultant", email:"c.koumba@partenaireoa.org",  docs:0,  status:"active", joined:"Juin 2026"  },
    { id:7, name:"Jean Mbodj",       initials:"JM", role:"lecteur",    roleLabel:"Lecteur",    email:"j.mbodj@partenaire.td",     docs:0,  status:"active", joined:"Mai 2026"   },
  ],
  activity: [
    { msg:"M. Dupont a soumis un rapport", time:"Il y a 43 min", isNew:true  },
    { msg:"Admin a approuvé un contrat",   time:"Il y a 2h",     isNew:false },
    { msg:"S. Mahamat a rejoint l'espace", time:"Hier à 16:00",  isNew:false },
    { msg:"Rapport annuel téléchargé 18×", time:"Hier",          isNew:false },
    { msg:"Nouvelle facture déposée",      time:"Avant-hier",    isNew:false },
  ],
  logs: [
    { id:1,  date:"2026-06-28T14:32", dateStr:"28 juin 2026, 14:32", user:"Admin AEV",    role:"ADMINISTRATEUR", action:"APPROBATION",    resource:"Rapport annuel 2024",              resourceType:"document",  ip:"41.202.223.10" },
    { id:2,  date:"2026-06-28T12:15", dateStr:"28 juin 2026, 12:15", user:"M. Dupont",    role:"AGENT",          action:"DÉPÔT",          resource:"Contrat prestation méd. 2026",     resourceType:"document",  ip:"41.202.221.45" },
    { id:3,  date:"2026-06-28T10:02", dateStr:"28 juin 2026, 10:02", user:"Admin AEV",    role:"ADMINISTRATEUR", action:"CONNEXION",      resource:"—",                                resourceType:"auth",      ip:"41.202.223.10" },
    { id:4,  date:"2026-06-27T17:45", dateStr:"27 juin 2026, 17:45", user:"S. Mahamat",   role:"AGENT",          action:"DÉPÔT",          resource:"Facture prestation #2026-091",     resourceType:"document",  ip:"41.202.220.88" },
    { id:5,  date:"2026-06-27T16:30", dateStr:"27 juin 2026, 16:30", user:"A. Ngaradoum", role:"SUPERVISEUR",    action:"TÉLÉCHARGEMENT", resource:"Convention subvention PNUD 2025",  resourceType:"document",  ip:"41.202.218.12" },
    { id:6,  date:"2026-06-27T14:10", dateStr:"27 juin 2026, 14:10", user:"F. Adoum",     role:"AGENT",          action:"CONNEXION",      resource:"—",                                resourceType:"auth",      ip:"41.202.217.99" },
    { id:7,  date:"2026-06-26T11:22", dateStr:"26 juin 2026, 11:22", user:"Admin AEV",    role:"ADMINISTRATEUR", action:"CRÉATION",       resource:"M. Dupont (AGENT)",                resourceType:"utilisateur",ip:"41.202.223.10" },
    { id:8,  date:"2026-06-25T15:50", dateStr:"25 juin 2026, 15:50", user:"A. Ngaradoum", role:"SUPERVISEUR",    action:"MODIFICATION",   resource:"Contrat partenariat Forum 2026",   resourceType:"document",  ip:"41.202.218.12" },
    { id:9,  date:"2026-06-25T09:30", dateStr:"25 juin 2026, 09:30", user:"M. Dupont",    role:"AGENT",          action:"TÉLÉCHARGEMENT", resource:"Rapport annuel 2024",              resourceType:"document",  ip:"41.202.221.45" },
    { id:10, date:"2026-06-24T16:00", dateStr:"24 juin 2026, 16:00", user:"Admin AEV",    role:"ADMINISTRATEUR", action:"SUPPRESSION",    resource:"Facture fournisseur #2026-088",    resourceType:"document",  ip:"41.202.223.10" },
    { id:11, date:"2026-06-24T14:20", dateStr:"24 juin 2026, 14:20", user:"F. Adoum",     role:"AGENT",          action:"DÉPÔT",          resource:"Budget annuel prévisionnel 2026",  resourceType:"document",  ip:"41.202.217.99" },
    { id:12, date:"2026-06-24T10:05", dateStr:"24 juin 2026, 10:05", user:"S. Mahamat",   role:"AGENT",          action:"CONNEXION",      resource:"—",                                resourceType:"auth",      ip:"41.202.220.88" },
    { id:13, date:"2026-06-23T17:15", dateStr:"23 juin 2026, 17:15", user:"Admin AEV",    role:"ADMINISTRATEUR", action:"REJET",          resource:"Rapport de mission non conforme",  resourceType:"document",  ip:"41.202.223.10" },
    { id:14, date:"2026-06-23T11:30", dateStr:"23 juin 2026, 11:30", user:"A. Ngaradoum", role:"SUPERVISEUR",    action:"ACCÈS",          resource:"Bilan financier 2024",             resourceType:"document",  ip:"41.202.218.12" },
    { id:15, date:"2026-06-22T14:45", dateStr:"22 juin 2026, 14:45", user:"M. Dupont",    role:"AGENT",          action:"DÉCONNEXION",    resource:"—",                                resourceType:"auth",      ip:"41.202.221.45" },
    { id:16, date:"2026-06-21T10:15", dateStr:"21 juin 2026, 10:15", user:"Admin AEV",    role:"ADMINISTRATEUR", action:"MODIFICATION",   resource:"Catégorie Ressources humaines",    resourceType:"catégorie", ip:"41.202.223.10" },
    { id:17, date:"2026-06-20T16:30", dateStr:"20 juin 2026, 16:30", user:"F. Adoum",     role:"AGENT",          action:"TÉLÉCHARGEMENT", resource:"Budget annuel prévisionnel 2026",  resourceType:"document",  ip:"41.202.217.99" },
    { id:18, date:"2026-06-19T09:00", dateStr:"19 juin 2026, 09:00", user:"Admin AEV",    role:"ADMINISTRATEUR", action:"CONNEXION",      resource:"—",                                resourceType:"auth",      ip:"41.202.223.10" },
    { id:19, date:"2026-06-18T15:20", dateStr:"18 juin 2026, 15:20", user:"A. Ngaradoum", role:"SUPERVISEUR",    action:"DÉPÔT",          resource:"Courrier Ministère Santé mars 2026",resourceType:"document", ip:"41.202.218.12" },
    { id:20, date:"2026-06-17T11:45", dateStr:"17 juin 2026, 11:45", user:"S. Mahamat",   role:"AGENT",          action:"APPROBATION",    resource:"Plaquette institutionnelle 2026",  resourceType:"document",  ip:"41.202.220.88" },
    { id:21, date:"2026-06-15T14:00", dateStr:"15 juin 2026, 14:00", user:"Admin AEV",    role:"ADMINISTRATEUR", action:"CRÉATION",       resource:"Catégorie Partenariats",           resourceType:"catégorie", ip:"41.202.223.10" },
    { id:22, date:"2026-06-12T10:30", dateStr:"12 juin 2026, 10:30", user:"M. Dupont",    role:"AGENT",          action:"DÉPÔT",          resource:"Rapport financier Q1 2026",        resourceType:"document",  ip:"41.202.221.45" },
    { id:23, date:"2026-06-10T16:45", dateStr:"10 juin 2026, 16:45", user:"F. Adoum",     role:"AGENT",          action:"TÉLÉCHARGEMENT", resource:"Rapport annuel 2023",              resourceType:"document",  ip:"41.202.217.99" },
    { id:24, date:"2026-06-05T09:15", dateStr:"5 juin 2026, 09:15",  user:"Admin AEV",    role:"ADMINISTRATEUR", action:"APPROBATION",    resource:"Rapport annuel 2024",              resourceType:"document",  ip:"41.202.223.10" },
    { id:25, date:"2026-06-01T14:30", dateStr:"1 juin 2026, 14:30",  user:"A. Ngaradoum", role:"SUPERVISEUR",    action:"DÉPÔT",          resource:"Communiqué Forum Santé 2026",      resourceType:"document",  ip:"41.202.218.12" },
    { id:26, date:"2026-05-28T10:00", dateStr:"28 mai 2026, 10:00",  user:"Admin AEV",    role:"ADMINISTRATEUR", action:"MODIFICATION",   resource:"Paramètres plateforme",            resourceType:"système",   ip:"41.202.223.10" },
    { id:27, date:"2026-05-20T15:15", dateStr:"20 mai 2026, 15:15",  user:"S. Mahamat",   role:"AGENT",          action:"TÉLÉCHARGEMENT", resource:"Programme santé communautaire 2025-2026",resourceType:"document",ip:"41.202.220.88" },
    { id:28, date:"2026-05-10T09:30", dateStr:"10 mai 2026, 09:30",  user:"Admin AEV",    role:"ADMINISTRATEUR", action:"CRÉATION",       resource:"A. Ngaradoum (SUPERVISEUR)",       resourceType:"utilisateur",ip:"41.202.223.10" },
  ],
  myActivity: [
    { id:1,  date:"2026-06-28T10:05", dateStr:"Aujourd'hui, 10:05",  action:"CONNEXION",      resource:"—",                                        resourceType:"auth",     fmt:null    },
    { id:2,  date:"2026-06-27T16:30", dateStr:"Hier, 16:30",         action:"TÉLÉCHARGEMENT", resource:"Convention subvention PNUD 2025",            resourceType:"document", fmt:"PDF"   },
    { id:3,  date:"2026-06-25T15:50", dateStr:"25 juin, 15:50",      action:"MODIFICATION",   resource:"Contrat partenariat Forum Santé 2026",       resourceType:"document", fmt:"Word"  },
    { id:4,  date:"2026-06-23T11:30", dateStr:"23 juin, 11:30",      action:"ACCÈS",          resource:"Bilan financier — Exercice 2024",            resourceType:"document", fmt:"Excel" },
    { id:5,  date:"2026-06-20T09:15", dateStr:"20 juin, 09:15",      action:"CONNEXION",      resource:"—",                                        resourceType:"auth",     fmt:null    },
    { id:6,  date:"2026-06-19T15:20", dateStr:"19 juin, 15:20",      action:"DÉPÔT",          resource:"Courrier Ministère Santé mars 2026",         resourceType:"document", fmt:"PDF"   },
    { id:7,  date:"2026-06-18T10:45", dateStr:"18 juin, 10:45",      action:"TÉLÉCHARGEMENT", resource:"Rapport annuel 2024",                        resourceType:"document", fmt:"PDF"   },
    { id:8,  date:"2026-06-15T14:30", dateStr:"15 juin, 14:30",      action:"TÉLÉCHARGEMENT", resource:"Programme santé communautaire 2025-2026",    resourceType:"document", fmt:"PDF"   },
    { id:9,  date:"2026-06-12T11:00", dateStr:"12 juin, 11:00",      action:"CONNEXION",      resource:"—",                                        resourceType:"auth",     fmt:null    },
    { id:10, date:"2026-06-10T09:30", dateStr:"10 juin, 09:30",      action:"ACCÈS",          resource:"Statuts de l'Association Espoir & Vie 2023",resourceType:"document", fmt:"PDF"   },
    { id:11, date:"2026-06-05T14:15", dateStr:"5 juin, 14:15",       action:"DÉPÔT",          resource:"Communiqué de presse — Forum Santé 2026",   resourceType:"document", fmt:"PDF"   },
    { id:12, date:"2026-06-01T08:50", dateStr:"1 juin, 08:50",       action:"CONNEXION",      resource:"—",                                        resourceType:"auth",     fmt:null    },
  ],
  access: [
    { id:1, userId:6, userName:"Christine Koumba", userRole:"CONSULTANT", type:"categorie", resourceId:"finance",  resourceLabel:"Finance et comptabilité",       grantedAt:"1 juin 2026",   grantedBy:"Admin AEV" },
    { id:2, userId:6, userName:"Christine Koumba", userRole:"CONSULTANT", type:"categorie", resourceId:"contrat",  resourceLabel:"Contrats et conventions",        grantedAt:"1 juin 2026",   grantedBy:"Admin AEV" },
    { id:3, userId:6, userName:"Christine Koumba", userRole:"CONSULTANT", type:"document",  resourceId:1,          resourceLabel:"Statuts de l'Association AEV 2023",grantedAt:"20 juin 2026", grantedBy:"Admin AEV" },
    { id:4, userId:7, userName:"Jean Mbodj",       userRole:"LECTEUR",    type:"document",  resourceId:4,          resourceLabel:"Rapport annuel 2024",            grantedAt:"15 juin 2026",  grantedBy:"Admin AEV" },
    { id:5, userId:7, userName:"Jean Mbodj",       userRole:"LECTEUR",    type:"document",  resourceId:9,          resourceLabel:"Programme santé communautaire 2025-2026", grantedAt:"15 juin 2026", grantedBy:"Admin AEV" },
    { id:6, userId:7, userName:"Jean Mbodj",       userRole:"LECTEUR",    type:"document",  resourceId:18,         resourceLabel:"Plaquette institutionnelle AEV 2026", grantedAt:"20 juin 2026", grantedBy:"Admin AEV" },
  ]
};

// ÉTAT GLOBAL
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

// UTILITAIRES
const $  = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => [...ctx.querySelectorAll(sel)];

function docIconHtml(fmt, sz="40px", h="46px") {
  const map = { PDF:["ti-file-type-pdf","di-pdf"], Word:["ti-file-type-doc","di-doc"], Excel:["ti-file-spreadsheet","di-xls"] };
  const [ic, cls] = map[fmt] || ["ti-file","di-pdf"];
  return `<div class="doc-icon ${cls}" style="width:${sz};height:${h};font-size:calc(${sz} * 0.52)"><i class="ti ${ic}"></i></div>`;
}
function tagHtml(type) {
  const map = {
    Administration:"tag-purple", Finance:"tag-orange",  Contrat:"tag-blue",
    Courrier:"tag-cyan",         Rapport:"tag-red",     Projet:"tag-green",
    Partenariat:"tag-teal",      Communication:"tag-pink", RH:"tag-yellow",
    Divers:"tag-gray",
  };
  return `<span class="tag ${map[type]||"tag-gray"}">${type}</span>`;
}
function statusHtml(s) {
  const map = { published:["s-published","✓ Publié"], pending:["s-pending","⏳ En attente"], rejected:["s-rejected","✗ Rejeté"] };
  const [cls, label] = map[s] || ["s-pending","Inconnu"];
  return `<span class="status ${cls}">${label}</span>`;
}
function fmtDate(d) { return d ? new Date(d).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"}) : ""; }

// TOAST
function toast(msg, type="ok") {
  const c = $("#toast-wrap");
  const el = document.createElement("div");
  const ic = { ok:"ti-circle-check", err:"ti-alert-circle", info:"ti-info-circle" }[type] || "ti-info-circle";
  el.className = `toast toast-${type}`;
  el.innerHTML = `<i class="ti ${ic}" style="font-size:17px;flex-shrink:0"></i><span>${msg}</span>`;
  c.appendChild(el);
  setTimeout(()=>{ el.style.opacity="0"; el.style.transform="translateX(20px)"; setTimeout(()=>el.remove(),320); }, 3200);
}

// MODAL
function openModal(html, title="") {
  $("#modal-title").textContent = title;
  $("#modal-body").innerHTML = html;
  $("#modal-overlay").classList.add("open");
}
function closeModal() { $("#modal-overlay").classList.remove("open"); }

// NAVIGATION
function navigate(page, data={}) {
  // Guard : pages protégées inaccessibles sans connexion
  if ((page==="member" || page==="admin") && !APP.user) {
    page = "auth";
    data = {};
  }
  // Guard : seuls admin et superviseur peuvent accéder au panel admin
  if (page==="admin" && APP.user && !["admin","superviseur"].includes(APP.user.role)) {
    page = "member";
  }
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

//  PAGE : ACCUEIL
async function renderHome() {
  const container = $("#home-recent");
  if (container) container.innerHTML = `<div style="padding:20px;text-align:center"><i class="ti ti-loader-2" style="font-size:22px;color:var(--blue);animation:spin 1s linear infinite"></i></div>`;
  const recent = await API.documents.list({ status: "ACTIVE", limit: 5 }).catch(() => []);
  if (!container) return;
  container.innerHTML = recent.length
    ? recent.map(d=>`
    <div class="doc-row" onclick="navigate('doc',{id:'${d.id}'})">
      ${docIconHtml(d.fmt)}
      <div style="flex:1;min-width:0">
        <div class="doc-name">${d.title}</div>
        <div class="doc-meta">${d.dateStr} · ${d.fmt} · ${d.size} · <i class="ti ti-download" style="font-size:11px"></i> ${d.dl}</div>
      </div>
      ${tagHtml(d.type)}
      <div class="doc-actions gap-6">
        <div class="btn-icon" onclick="event.stopPropagation();memberDownloadDoc('${d.id}')" title="Télécharger"><i class="ti ti-download"></i></div>
        <div class="btn-icon" onclick="event.stopPropagation();shareDoc('${d.id}')" title="Partager"><i class="ti ti-share"></i></div>
      </div>
    </div>`).join("")
    : `<div style="padding:24px;text-align:center;color:var(--text-sec)">Aucun document récent.</div>`;
}

function homeSearch() {
  const q = $("#home-q").value.trim();
  navigate("search", { q });
}

//  PAGE : CATALOGUE
async function renderCatalogue(cat="") {
  APP.catFilter = cat;
  $$(".cat-chip").forEach(c => c.classList.toggle("on", c.dataset.cat === cat));
  const list = $("#cat-list");
  const cnt  = $("#cat-count");
  if (list) list.innerHTML = `<div style="padding:32px;text-align:center"><i class="ti ti-loader-2" style="font-size:28px;color:var(--blue);animation:spin 1s linear infinite"></i></div>`;

  const catObj = cat ? DB.cats.find(c => c.id === cat) : null;
  const params = { status: "ACTIVE", limit: 50 };
  if (catObj?.apiId) params.categoryId = catObj.apiId;
  const docs = await API.documents.list(params).catch(() => []);

  if (cnt) cnt.textContent = `${docs.length} document${docs.length!==1?"s":""}`;
  if (list) list.innerHTML = docs.length
    ? docs.map(d=>`
      <div class="result-card" onclick="navigate('doc',{id:'${d.id}'})">
        ${docIconHtml(d.fmt,"44px","52px")}
        <div style="flex:1;min-width:0">
          <div class="flex-b gap-8">
            <div class="doc-name" style="font-size:15px;font-weight:700">${d.title}</div>
            <div class="flex-c gap-6" style="flex-shrink:0">
              <div class="btn-icon" onclick="event.stopPropagation();memberDownloadDoc('${d.id}')"><i class="ti ti-download"></i></div>
              <div class="btn-icon" onclick="event.stopPropagation();shareDoc('${d.id}')"><i class="ti ti-share"></i></div>
            </div>
          </div>
          <div class="doc-meta mt-4">${d.dateStr} · ${d.fmt} · ${d.size}</div>
          <div class="flex-c gap-6 mt-8 flex-wrap">${tagHtml(d.type)}${d.tags.slice(0,3).map(t=>`<span class="tag tag-gray">${t}</span>`).join("")}<span class="tag tag-pub">${d.access}</span></div>
        </div>
      </div>`).join("")
    : `<div class="empty"><i class="ti ti-folder-open"></i><h3>Aucun document</h3><p>Aucun document dans cette catégorie pour le moment.</p></div>`;
}

//  PAGE : RECHERCHE
function renderSearch(q="") {
  APP.searchQ = q;
  $("#search-q").value = q;
  applySearch();
}

let _searchTimer;
async function applySearch() {
  const q      = $("#search-q")?.value.trim() || "";
  const results = $("#search-results");
  const countEl = $("#search-count");

  if (results) results.innerHTML = `<div style="padding:32px;text-align:center"><i class="ti ti-loader-2" style="font-size:28px;color:var(--blue);animation:spin 1s linear infinite"></i></div>`;

  const params = { status: "ACTIVE", limit: 50 };
  if (q) params.q = q;

  const docs = await API.documents.list(params).catch(() => []);

  // Filtres client-side (format, accès) — pas de param backend
  const fmts   = $$(".f-fmt:checked").map(el => el.value);
  const access = $(".f-access:checked")?.value || "";
  let res = docs;
  if (fmts.length)  res = res.filter(d => fmts.includes(d.fmt));
  if (access)       res = res.filter(d => d.access === access);

  if (countEl) countEl.textContent = `${res.length} résultat${res.length!==1?"s":""}`;
  if (results) results.innerHTML = res.length
    ? res.map(d=>`
      <div class="result-card" onclick="navigate('doc',{id:'${d.id}'})">
        ${docIconHtml(d.fmt,"44px","52px")}
        <div style="flex:1;min-width:0">
          <div class="flex-b gap-8">
            <div class="doc-name" style="font-size:14px;font-weight:700">${d.title}</div>
            <div class="flex-c gap-6" style="flex-shrink:0">
              <div class="btn-icon" onclick="event.stopPropagation();memberDownloadDoc('${d.id}')"><i class="ti ti-download"></i></div>
              <div class="btn-icon" onclick="event.stopPropagation();shareDoc('${d.id}')"><i class="ti ti-share"></i></div>
            </div>
          </div>
          <div class="doc-meta mt-4">${d.dateStr} · ${d.fmt} · ${d.size}</div>
          <div class="flex-c gap-6 mt-8 flex-wrap">${tagHtml(d.type)}${d.tags.slice(0,4).map(t=>`<span class="tag tag-gray">${t}</span>`).join("")}</div>
        </div>
      </div>`).join("")
    : `<div class="empty"><i class="ti ti-search"></i><h3>Aucun résultat</h3><p>Essayez avec d'autres mots-clés ou réinitialisez les filtres.</p></div>`;
}

function debouncedSearch() {
  clearTimeout(_searchTimer);
  _searchTimer = setTimeout(() => applySearch(), 400);
}

function resetFilters() {
  $$(".f-type,.f-fmt,.f-period,.f-access").forEach(el=>el.checked=false);
  applySearch();
}

//  PAGE : FICHE DOCUMENT
async function renderDoc(id) {
  APP.docId = id;
  const docContent = $("#doc-content");
  if (docContent) docContent.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:300px"><i class="ti ti-loader-2" style="font-size:36px;color:var(--blue);animation:spin 1s linear infinite"></i></div>`;
  const d = await API.documents.get(id);
  if (!d) {
    if (docContent) docContent.innerHTML = `<div style="padding:60px;text-align:center;color:var(--text-sec)"><i class="ti ti-file-off" style="font-size:40px;display:block;margin-bottom:12px"></i>Document introuvable.</div>`;
    return;
  }
  const catObj = d.cat ? DB.cats.find(c => c.id === d.cat) : null;
  const relatedRaw = catObj?.apiId
    ? await API.documents.list({ status: "ACTIVE", categoryId: catObj.apiId, limit: 4 }).catch(() => [])
    : [];
  const related = relatedRaw.filter(x => x.id !== id).slice(0, 3);
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
        <span style="color:rgba(255,255,255,.8)">${d.title.length>38?d.title.substring(0,38)+"…":d.title}</span>
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
          <button class="btn btn-ghost btn-sm" onclick="shareDoc('${d.id}')"><i class="ti ti-share"></i>Partager</button>
          <button class="btn btn-ghost btn-sm" id="fav-btn-${d.id}" onclick="toggleFav('${d.id}')"><i class="ti ti-star"></i>Favori</button>
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
              <button class="btn btn-outline btn-sm" onclick="openDocFullscreen('${d.id}')"><i class="ti ti-maximize"></i>Plein écran</button>
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
          <button class="btn btn-red btn-lg" onclick="memberDownloadDoc('${d.id}')"><i class="ti ti-download"></i>Télécharger gratuitement</button>
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
          <button class="btn btn-primary w-full mb-8" onclick="memberDownloadDoc('${d.id}')"><i class="ti ti-download"></i>Télécharger</button>
          <button class="btn btn-outline w-full" style="font-size:12px" onclick="openDocFullscreen('${d.id}')"><i class="ti ti-eye"></i>Aperçu plein écran</button>
          <div style="font-size:11px;color:var(--text-sec);margin-top:10px">${d.dl} téléchargements · Gratuit</div>
        </div>

        <!-- SHARE -->
        <div class="card card-body">
          <div class="card-title mb-10">Partager ce document</div>
          <div class="grid-4 gap-6">
            <div class="btn-icon w-full" style="height:36px;border-radius:var(--r-md);font-size:17px" title="Partager sur Facebook"
              onclick="shareDoc('${d.id}','facebook','${d.title.replace(/'/g,"\\'").replace(/"/g,"&quot;")}')">
              <i class="ti ti-brand-facebook" style="color:#1877F2"></i></div>
            <div class="btn-icon w-full" style="height:36px;border-radius:var(--r-md);font-size:17px" title="Partager sur WhatsApp"
              onclick="shareDoc('${d.id}','whatsapp','${d.title.replace(/'/g,"\\'").replace(/"/g,"&quot;")}')">
              <i class="ti ti-brand-whatsapp" style="color:#25D366"></i></div>
            <div class="btn-icon w-full" style="height:36px;border-radius:var(--r-md);font-size:17px" title="Partager par email"
              onclick="shareDoc('${d.id}','email','${d.title.replace(/'/g,"\\'").replace(/"/g,"&quot;")}')">
              <i class="ti ti-mail" style="color:var(--blue)"></i></div>
            <div class="btn-icon w-full" style="height:36px;border-radius:var(--r-md);font-size:17px" title="Copier le lien"
              onclick="shareDoc('${d.id}','link','')">
              <i class="ti ti-link" style="color:var(--gray-600)"></i></div>
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
            <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border-lt);cursor:pointer" onclick="navigate('doc',{id:'${r.id}'})">
              ${docIconHtml(r.fmt,"30px","36px")}
              <div style="min-width:0;overflow:hidden">
                <div style="font-size:12px;font-weight:600;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${r.title.length>38?r.title.substring(0,38)+"…":r.title}</div>
                <div style="font-size:11px;color:var(--text-sec)">${r.fmt} · ${r.size}</div>
              </div>
            </div>`).join("")}
        </div>` : ""}
      </div>
    </div>
  `;
}

//  AUTH
function renderAuth(tab="login") {
  switchAuthTab(tab);
}
function switchAuthTab(tab) {
  APP.authTab = tab;
  $$(".auth-tab").forEach(t=>t.classList.toggle("active",t.dataset.tab===tab));
  $("#auth-login").style.display  = tab==="login" ? "flex" : "none";
  $("#auth-register").style.display = tab==="register" ? "flex" : "none";
}
async function doLogin() {
  const email = $("#login-email").value.trim();
  const pass  = $("#login-pass").value;
  if (!email||!pass) { toast("Veuillez remplir tous les champs.","err"); return; }
  const btn = $("#btn-login");
  if (btn) { btn.disabled = true; btn.textContent = "Connexion…"; }
  try {
    const data = await API.auth.login(email, pass);
    APP.user = mapUser(data.user);
    updateNavbarUser();
    toast(`Bienvenue, ${APP.user.name.split(" ")[0]} !`, "ok");
    navigate(["admin","superviseur"].includes(APP.user.role) ? "admin" : "member");
  } catch(e) {
    toast(e.message || "Email ou mot de passe incorrect.", "err");
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = "Se connecter"; }
  }
}
async function doRegister() {
  const prenom = $("#reg-prenom").value.trim();
  const nom    = $("#reg-nom").value.trim();
  const email  = $("#reg-email").value.trim();
  const pass   = $("#reg-pass").value;
  if (!prenom||!nom||!email||!pass) { toast("Veuillez remplir tous les champs obligatoires.","err"); return; }
  if (pass.length < 8) { toast("Le mot de passe doit contenir au moins 8 caractères.","err"); return; }
  const btn = $("#btn-register");
  if (btn) { btn.disabled = true; btn.textContent = "Création…"; }
  try {
    const data = await API.auth.register(`${prenom} ${nom}`.trim(), email, pass);
    APP.user = mapUser(data.user);
    updateNavbarUser();
    toast(`Bienvenue, ${prenom} ! Votre compte a été créé.`, "ok");
    navigate("member");
  } catch(e) {
    toast(e.message || "Impossible de créer le compte.", "err");
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = "Créer mon compte"; }
  }
}
function initGoogleSignIn() {
  if (!window.google || !window.GOOGLE_CLIENT_ID) return;
  google.accounts.id.initialize({
    client_id: window.GOOGLE_CLIENT_ID,
    callback: handleGoogleCredential,
    auto_select: false,
    cancel_on_tap_outside: true,
  });
}

async function handleGoogleCredential(response) {
  try {
    const data = await API.auth.googleLogin(response.credential);
    APP.user = mapUser(data.user);
    updateNavbarUser();
    toast(`Bienvenue, ${APP.user.name.split(" ")[0]} !`, "ok");
    navigate(["admin","superviseur"].includes(APP.user.role) ? "admin" : "member");
  } catch(e) {
    toast(e.message || "Connexion Google impossible.", "err");
  }
}

function doGoogleLogin() {
  if (!window.google) { toast("Chargement de Google en cours…", "info"); return; }
  if (!window.GOOGLE_CLIENT_ID) { toast("Google OAuth non configuré.", "err"); return; }
  initGoogleSignIn();
  google.accounts.id.prompt((notification) => {
    if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
      google.accounts.id.renderButton(
        document.createElement("div"),
        { theme: "outline", size: "large" }
      );
      google.accounts.id.prompt();
    }
  });
}

async function doSaveProfile() {
  const prenom = document.getElementById("profile-prenom")?.value.trim();
  const nom    = document.getElementById("profile-nom")?.value.trim();
  if (!prenom) { toast("Le prénom est requis.", "err"); return; }
  const fullName = [prenom, nom].filter(Boolean).join(" ");
  const btn = document.querySelector("#member-main .btn-primary");
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="ti ti-loader"></i>Enregistrement…'; }
  try {
    const updated = await API.auth.updateProfile(fullName);
    if (updated) {
      APP.user = mapUser(updated);
      updateNavbarUser();
    }
    toast("Profil mis à jour avec succès.", "ok");
  } catch(e) {
    toast(e.message || "Erreur lors de la mise à jour.", "err");
  } finally {
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="ti ti-device-floppy"></i>Enregistrer les modifications'; }
  }
}

async function doChangePassword() {
  const oldPwd  = document.getElementById("pwd-old")?.value;
  const newPwd  = document.getElementById("pwd-new")?.value;
  const confirm = document.getElementById("pwd-confirm")?.value;
  if (!oldPwd)               { toast("Entrez votre mot de passe actuel.", "err"); return; }
  if (!newPwd || newPwd.length < 8) { toast("Le nouveau mot de passe doit contenir au moins 8 caractères.", "err"); return; }
  if (newPwd !== confirm)    { toast("Les mots de passe ne correspondent pas.", "err"); return; }
  const btn = document.querySelector("#member-main .btn-outline");
  if (btn) { btn.disabled = true; btn.textContent = "Mise à jour…"; }
  try {
    await API.auth.changePassword(oldPwd, newPwd);
    document.getElementById("pwd-old").value = "";
    document.getElementById("pwd-new").value = "";
    document.getElementById("pwd-confirm").value = "";
    toast("Mot de passe mis à jour avec succès.", "ok");
  } catch(e) {
    toast(e.message || "Mot de passe actuel incorrect.", "err");
  } finally {
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="ti ti-lock"></i>Mettre à jour'; }
  }
}

async function doResendVerification() {
  try {
    await API.auth.resendVerification();
    toast("Email de vérification renvoyé. Vérifiez votre boîte mail.", "ok");
  } catch(e) {
    toast(e.message || "Erreur lors du renvoi.", "err");
  }
}

function openForgotPassword() {
  const el = document.getElementById("modal-forgot-password");
  document.getElementById("forgot-email").value = "";
  el.style.display = "flex";
  setTimeout(() => document.getElementById("forgot-email").focus(), 50);
}
function closeForgotPassword() {
  document.getElementById("modal-forgot-password").style.display = "none";
}
async function doForgotPassword() {
  const email = document.getElementById("forgot-email").value.trim();
  if (!email) { toast("Entrez votre adresse email.", "err"); return; }
  const btn = document.querySelector("#modal-forgot-password .btn-primary");
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="ti ti-loader"></i>Envoi…'; }
  try {
    await API.auth.forgotPassword(email);
    closeForgotPassword();
    toast("Si cet email est enregistré, vous recevrez un lien de réinitialisation.", "ok");
  } catch(e) {
    toast(e.message || "Erreur lors de l'envoi.", "err");
  } finally {
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="ti ti-send"></i>Envoyer le lien'; }
  }
}
async function doResetPassword() {
  const token = document.getElementById("reset-token").value;
  const pass  = document.getElementById("reset-pass").value;
  const pass2 = document.getElementById("reset-pass2").value;
  if (!pass || pass.length < 8) { toast("Minimum 8 caractères requis.", "err"); return; }
  if (pass !== pass2) { toast("Les mots de passe ne correspondent pas.", "err"); return; }
  const btn = document.querySelector("#modal-reset-password .btn-primary");
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="ti ti-loader"></i>Enregistrement…'; }
  try {
    await API.auth.resetPassword(token, pass);
    document.getElementById("modal-reset-password").style.display = "none";
    toast("Mot de passe réinitialisé ! Vous pouvez maintenant vous connecter.", "ok");
    navigate("auth");
  } catch(e) {
    toast(e.message || "Lien invalide ou expiré.", "err");
  } finally {
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="ti ti-check"></i>Confirmer le nouveau mot de passe'; }
  }
}
async function doAdminDemo() {
  try {
    toast("Utilisez vos identifiants administrateur pour vous connecter.", "info");
    navigate("auth");
  } catch(_) {
    toast("Démo indisponible.", "err");
  }
}
async function doLogout() {
  await API.auth.logout();
  APP.user = null;
  updateNavbarUser();
  toast("Déconnexion réussie.", "info");
  navigate("home");
}
function updateNavbarUser() {
  const btnZone = $("#navbar-user-zone");
  if (APP.user) {
    const isAdmin = ["admin","superviseur"].includes(APP.user.role);
    const roleLbl = { admin:"Administrateur", superviseur:"Superviseur", member:"Agent", consultant:"Consultant", lecteur:"Lecteur" }[APP.user.role] || "Membre";
    btnZone.innerHTML = `
      <div class="user-menu-wrap" id="user-menu-wrap">
        <div class="navbar-user" onclick="toggleUserMenu(event)">
          <div class="navbar-user-avatar">${APP.user.initials}</div>
          <span class="navbar-user-name">${APP.user.name.split(" ")[0]}</span>
          <i class="ti ti-chevron-down" style="font-size:12px;color:rgba(255,255,255,.5)"></i>
        </div>
      </div>`;
  } else {
    btnZone.innerHTML = `<button class="btn-nav-login" onclick="navigate('auth')"><i class="ti ti-login" style="margin-right:6px"></i>Connexion</button>`;
  }
}

function toggleUserMenu(e) {
  e.stopPropagation();
  const wrap = document.getElementById("user-menu-wrap");
  const existing = wrap.querySelector(".user-dropdown");
  if (existing) { existing.remove(); return; }

  const isAdmin = ["admin","superviseur"].includes(APP.user.role);
  const roleLbl = { admin:"Administrateur", superviseur:"Superviseur", member:"Agent", consultant:"Consultant", lecteur:"Lecteur" }[APP.user.role] || "Membre";

  const menu = document.createElement("div");
  menu.className = "user-dropdown";
  menu.innerHTML = `
    <div class="user-dropdown-header">
      <div class="user-dropdown-name">${APP.user.name}</div>
      <div class="user-dropdown-role">${roleLbl} · ${APP.user.email}</div>
    </div>
    ${isAdmin ? `
    <div class="user-dropdown-item" onclick="closeUserMenu();navigate('admin')">
      <i class="ti ti-layout-dashboard"></i>Espace Admin
    </div>` : `
    <div class="user-dropdown-item" onclick="closeUserMenu();navigate('member')">
      <i class="ti ti-layout-dashboard"></i>Espace Membre
    </div>`}
    <div class="user-dropdown-item" onclick="closeUserMenu();navigate('member',{sec:'profile'})">
      <i class="ti ti-user-circle"></i>Mon profil
    </div>
    <div class="user-dropdown-divider"></div>
    <div class="user-dropdown-item danger" onclick="closeUserMenu();doLogout()">
      <i class="ti ti-logout"></i>Déconnexion
    </div>`;
  wrap.appendChild(menu);

  // Fermer en cliquant ailleurs
  setTimeout(() => {
    document.addEventListener("click", closeUserMenu, { once: true });
  }, 10);
}

function closeUserMenu() {
  const menu = document.querySelector(".user-dropdown");
  if (menu) menu.remove();
}

//  PAGE : À PROPOS
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
    ["ti-affiliate","Partenariats avec associations, ONG, institutions nationales et internationales"],
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

//  MEMBRE
async function renderMember(sec="dashboard") {
  APP.memberSec = sec;
  $$("#member-sidebar .sidebar-item").forEach(el=>el.classList.toggle("active",el.dataset.sec===sec));
  const c = $("#member-main");

  if (sec==="dashboard") {
    // Charger données réelles depuis l'API
    const userId = APP.user?.id;
    const [{ items: myDocs }, myFavs] = await Promise.all([
      userId ? API.documents.adminList({ uploadedById: userId, limit: 5 }).catch(() => ({ items: [] })) : Promise.resolve({ items: [] }),
      userId ? API.favorites.list().catch(() => []) : Promise.resolve([]),
    ]);
    const pending = myDocs.filter(d=>d.status==="pending").length;
    const verifyBanner = APP.user && !APP.user.emailVerified ? `
      <div style="background:#FEF3C7;border:1px solid #F59E0B;border-radius:8px;padding:12px 16px;display:flex;align-items:center;gap:12px;margin-bottom:16px">
        <i class="ti ti-mail-exclamation" style="font-size:20px;color:#D97706;flex-shrink:0"></i>
        <div style="flex:1">
          <div style="font-size:13px;font-weight:600;color:#92400E">Vérifiez votre adresse email</div>
          <div style="font-size:12px;color:#B45309;margin-top:2px">Un email de confirmation a été envoyé à <strong>${APP.user.email}</strong>. Cliquez sur le lien pour activer votre compte.</div>
        </div>
        <button class="btn btn-sm" style="background:#F59E0B;color:white;border:none;white-space:nowrap" onclick="doResendVerification()"><i class="ti ti-send"></i>Renvoyer</button>
      </div>` : "";
    c.innerHTML = `
      <div class="topbar">
        <div><div class="topbar-title">Bonjour, ${APP.user?.name?.split(" ")[0]||"vous"} 👋</div><div class="topbar-sub">Bienvenue sur votre espace personnel</div></div>
        <button class="btn btn-primary" onclick="renderMember('upload')"><i class="ti ti-upload"></i>Déposer un document</button>
      </div>
      <div class="page-inner">
        ${verifyBanner}
        <div class="stats-grid">
          ${[
            ["ti-files","si-blue", myDocs.length, "Mes documents", myDocs.length ? `${pending} en attente` : "Aucun document"],
            ["ti-clock","si-red",  pending,         "En attente",    "À valider par l'admin"],
            ["ti-star","si-blue",  myFavs.length,   "Favoris",       "Sauvegardés"],
            ["ti-download","si-blue","—",            "Téléchargements","Total cumulé"],
          ].map(([ic,cls,val,lbl,trend])=>`
            <div class="stat-card">
              <div class="stat-icon ${cls}"><i class="ti ${ic}"></i></div>
              <div><div class="stat-val">${val}</div><div class="stat-label">${lbl}</div><div class="stat-trend">${trend}</div></div>
            </div>`).join("")}
        </div>
        <div class="card">
          <div class="card-header"><span class="card-title"><i class="ti ti-files" style="color:var(--blue);margin-right:6px"></i>Mes derniers documents</span><button class="btn btn-outline btn-sm" onclick="renderMember('docs')">Tout voir →</button></div>
          ${myDocs.length ? myDocs.map(d=>`
            <div class="doc-row" onclick="navigate('doc',{id:'${d.id}'})">
              ${docIconHtml(d.fmt)}
              <div style="flex:1;min-width:0"><div class="doc-name">${d.title}</div><div class="doc-meta">${d.dateStr} · ${d.fmt} · ${d.size}</div></div>
              ${statusHtml(d.status)}
              <div class="doc-actions gap-6">
                <div class="btn-icon" onclick="event.stopPropagation();memberDownloadDoc('${d.id}')"><i class="ti ti-download"></i></div>
                <div class="btn-icon red" onclick="event.stopPropagation();adminDelDoc('${d.id}','${d.title.replace(/'/g,"\\'").slice(0,30)}')"><i class="ti ti-trash"></i></div>
              </div>
            </div>`).join("")
          : `<div style="padding:20px;text-align:center;color:var(--text-sec);font-size:13px">Aucun document déposé pour l'instant.</div>`}
        </div>
        <div>
          <div class="flex-b mb-12"><div class="section-title" style="margin-bottom:0">Mes favoris</div><button class="btn btn-outline btn-sm" onclick="renderMember('favorites')">Voir tout →</button></div>
          <div class="grid-3 gap-14">
            ${myFavs.slice(0,3).map(d=>`
              <div class="card card-hover" style="cursor:pointer" onclick="navigate('doc',{id:'${d.id}'})">
                <div class="card-body flex-c gap-10">
                  ${docIconHtml(d.fmt,"36px","42px")}
                  <div style="min-width:0;flex:1"><div class="doc-name" style="font-size:13px">${d.title.length>35?d.title.substring(0,35)+"…":d.title}</div><div class="doc-meta">${d.fmt} · ${d.size}</div></div>
                  <i class="ti ti-star-filled" style="color:var(--blue);font-size:17px;cursor:pointer;flex-shrink:0" onclick="event.stopPropagation();toggleFav('${d.id}')"></i>
                </div>
              </div>`).join("")
            || `<div style="color:var(--text-sec);font-size:13px;padding:8px 0">Aucun favori pour l'instant.</div>`}
          </div>
        </div>
      </div>`;
  }

  if (sec==="docs") {
    c.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:300px"><i class="ti ti-loader-2" style="font-size:36px;color:var(--blue);animation:spin 1s linear infinite"></i></div>`;
    const userId = APP.user?.id;
    const { items: myDocs } = userId
      ? await API.documents.adminList({ uploadedById: userId, limit: 50 }).catch(() => ({ items: [] }))
      : { items: [] };

    c.innerHTML = `
      <div class="topbar">
        <div><div class="topbar-title">Mes documents</div><div class="topbar-sub">${myDocs.length} document${myDocs.length!==1?"s":""}</div></div>
        <button class="btn btn-primary" onclick="renderMember('upload')"><i class="ti ti-upload"></i>Nouveau dépôt</button>
      </div>
      <div class="page-inner">
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Document</th><th>Catégorie</th><th>Format</th><th>Date</th><th>Statut</th><th>Actions</th></tr></thead>
            <tbody>
              ${myDocs.length ? myDocs.map(d => `
                <tr id="member-row-${d.id}">
                  <td><div class="td-doc">${docIconHtml(d.fmt,"30px","36px")}<span style="font-weight:600;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:block" title="${d.title}">${d.title}</span></div></td>
                  <td>${tagHtml(d.type)}</td>
                  <td class="text-sec text-sm">${d.fmt}</td>
                  <td class="text-sec text-sm">${d.dateStr}</td>
                  <td>${statusHtml(d.status)}</td>
                  <td><div class="flex-c gap-6">
                    <div class="btn-icon" onclick="navigate('doc',{id:'${d.id}'})" title="Voir"><i class="ti ti-eye"></i></div>
                    <div class="btn-icon" onclick="memberDownloadDoc('${d.id}')" title="Télécharger"><i class="ti ti-download"></i></div>
                    <div class="btn-icon red" onclick="adminDelDoc('${d.id}','${d.title.replace(/'/g,"\\'").slice(0,30)}')" title="Supprimer"><i class="ti ti-trash"></i></div>
                  </div></td>
                </tr>`).join("")
              : `<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--text-sec)">
                  <i class="ti ti-files" style="font-size:32px;display:block;margin-bottom:10px;opacity:.4"></i>
                  Vous n'avez encore déposé aucun document.
                  <br><button class="btn btn-primary btn-sm mt-16" onclick="renderMember('upload')"><i class="ti ti-upload"></i>Déposer mon premier document</button>
                </td></tr>`}
            </tbody>
          </table>
        </div>
      </div>`;
  }

  if (sec==="upload") {
    APP.uploadStep = 1;
    renderUploadStep(c);
  }

  if (sec==="favorites") {
    c.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:200px"><i class="ti ti-loader-2" style="font-size:32px;color:var(--blue);animation:spin 1s linear infinite"></i></div>`;
    const favs = await API.favorites.list().catch(() => []);
    c.innerHTML = `
      <div class="topbar"><div><div class="topbar-title">Mes favoris</div><div class="topbar-sub">${favs.length} document${favs.length!==1?"s":""}</div></div></div>
      <div class="page-inner">
        ${favs.length ? `<div class="grid-3 gap-14">
          ${favs.map(d=>`
            <div class="card card-hover" style="cursor:pointer" onclick="navigate('doc',{id:'${d.id}'})">
              <div class="card-body">
                <div class="flex-c gap-10 mb-12">${docIconHtml(d.fmt,"36px","42px")}<div><div style="font-size:13px;font-weight:700;color:var(--text)">${d.title.length>35?d.title.substring(0,35)+"…":d.title}</div><div class="doc-meta">${d.fmt} · ${d.size}</div></div></div>
                <div class="flex-b">${tagHtml(d.type)}<i class="ti ti-star-filled" style="color:var(--blue);font-size:17px;cursor:pointer" onclick="event.stopPropagation();toggleFav('${d.id}')"></i></div>
              </div>
            </div>`).join("")}
        </div>` : `<div style="text-align:center;padding:60px 20px;color:var(--text-sec)">
          <i class="ti ti-star" style="font-size:40px;display:block;margin-bottom:12px;opacity:.3"></i>
          <div style="font-size:14px">Aucun favori pour l'instant.</div>
          <div style="font-size:12px;margin-top:4px">Cliquez sur l'étoile d'un document pour l'ajouter.</div>
        </div>`}
      </div>`;
  }

  if (sec==="profile") {
    const u = APP.user || {};
    const nameParts = (u.name||"Utilisateur").split(" ");
    const prenom = nameParts[0] || "";
    const nom    = nameParts.slice(1).join(" ") || "";
    const roleLbl = { admin:"Administrateur", superviseur:"Superviseur", member:"Agent", consultant:"Consultant", lecteur:"Lecteur" }[u.role] || "Utilisateur";
    const roleCls = { admin:"tag-red", superviseur:"tag-orange", consultant:"tag-cyan", lecteur:"tag-gray" }[u.role] || "tag-blue";
    c.innerHTML = `
      <div class="topbar"><div class="topbar-title">Mon profil</div></div>
      <div class="page-inner" style="max-width:580px">
        <div class="card card-body mb-14">
          <div class="flex-c gap-16 mb-20">
            <div style="width:68px;height:68px;border-radius:50%;background:${u.role==="admin"?"var(--red)":"var(--blue)"};display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:800;color:white;flex-shrink:0">${u.initials||"?"}</div>
            <div><div style="font-size:18px;font-weight:700;color:var(--text)">${u.name||"Utilisateur"}</div><div class="doc-meta">${roleLbl} · ${u.email||""}</div><span class="tag ${roleCls} mt-4" style="display:inline-block">${roleLbl}</span></div>
          </div>
          <div class="grid-2 gap-12">
            <div class="form-group"><label class="form-label">Prénom</label><input id="profile-prenom" class="form-control" value="${prenom}"></div>
            <div class="form-group"><label class="form-label">Nom</label><input id="profile-nom" class="form-control" value="${nom}"></div>
            <div class="form-group"><label class="form-label">Email</label><input class="form-control" type="email" value="${u.email||""}" disabled style="opacity:.6"></div>
            <div class="form-group"><label class="form-label">Rôle</label><input class="form-control" value="${roleLbl}" disabled style="opacity:.6"></div>
          </div>
          <button class="btn btn-primary btn-sm mt-16" onclick="doSaveProfile()"><i class="ti ti-device-floppy"></i>Enregistrer les modifications</button>
        </div>
        <div class="card card-body">
          <div class="card-title mb-12">Changer le mot de passe</div>
          <div class="flex-col gap-10">
            <div class="form-group"><label class="form-label">Mot de passe actuel</label><input type="password" id="pwd-old" class="form-control" placeholder="••••••••"></div>
            <div class="form-group"><label class="form-label">Nouveau mot de passe</label><input type="password" id="pwd-new" class="form-control" placeholder="Minimum 8 caractères"></div>
            <div class="form-group"><label class="form-label">Confirmer</label><input type="password" id="pwd-confirm" class="form-control" placeholder="Répétez le nouveau mot de passe"></div>
            <button class="btn btn-outline btn-sm" style="align-self:flex-start" onclick="doChangePassword()"><i class="ti ti-lock"></i>Mettre à jour</button>
          </div>
        </div>
      </div>`;
  }

  if (sec==="activity") {
    c.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:300px"><i class="ti ti-loader-2" style="font-size:36px;color:var(--blue);animation:spin 1s linear infinite"></i></div>`;
    const myLogs = await API.activity.me().catch(() => []);

    const actionCls = {
      "CONNEXION":"tag-blue","DÉCONNEXION":"tag-gray","DÉPÔT":"tag-green","DÉPÔT":"tag-green",
      "TÉLÉCHARGEMENT":"tag-pub","MODIFICATION":"tag-orange","ACCÈS":"tag-gray",
      "CRÉATION COMPTE":"tag-purple","SUPPRESSION":"tag-red","INSCRIPTION":"tag-blue",
    };
    const actionIcon = {
      "CONNEXION":"ti-login","DÉCONNEXION":"ti-logout","DÉPÔT":"ti-upload",
      "TÉLÉCHARGEMENT":"ti-download","MODIFICATION":"ti-pencil","ACCÈS":"ti-eye",
      "CRÉATION COMPTE":"ti-user-plus","SUPPRESSION":"ti-trash",
    };
    const actionColor = {
      "CONNEXION":"var(--blue)","DÉCONNEXION":"var(--gray-400)","DÉPÔT":"#16a34a",
      "TÉLÉCHARGEMENT":"#0369a1","MODIFICATION":"#c2410c","ACCÈS":"var(--gray-400)",
      "CRÉATION COMPTE":"#7c3aed","SUPPRESSION":"#dc2626",
    };

    const cnt = (action) => myLogs.filter(a => a.action === action).length;
    const conn  = cnt("CONNEXION");
    const depot = cnt("DÉPÔT");
    const dl    = cnt("TÉLÉCHARGEMENT");
    const acces = myLogs.filter(a => a.action === "ACCÈS" || a.action === "MODIFICATION").length;
    const actions = [...new Set(myLogs.map(a => a.action))].sort();

    c.innerHTML = `
      <div class="topbar">
        <div><div class="topbar-title">Mon activité</div><div class="topbar-sub">${myLogs.length} action${myLogs.length!==1?"s":""} enregistrée${myLogs.length!==1?"s":""}</div></div>
      </div>
      <div class="page-inner">
        <div class="stats-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:16px">
          ${[
            ["ti-login",    "si-blue", conn,  "Connexions",      "Sessions ouvertes"],
            ["ti-upload",   "si-blue", depot, "Dépôts",          "Documents soumis"],
            ["ti-download", "si-blue", dl,    "Téléchargements", "Fichiers obtenus"],
            ["ti-eye",      "si-blue", acces, "Consultations",   "Accès & modifications"],
          ].map(([ic,cls,val,lbl,trend])=>`
            <div class="stat-card">
              <div class="stat-icon ${cls}"><i class="ti ${ic}"></i></div>
              <div><div class="stat-val">${val}</div><div class="stat-label">${lbl}</div><div class="stat-trend">${trend}</div></div>
            </div>`).join("")}
        </div>
        <div class="flex-c gap-10 mb-14" style="flex-wrap:wrap">
          <select id="act-action" class="form-control" style="width:200px;height:36px" onchange="myActivityFilter()">
            <option value="">Toutes les actions</option>
            ${actions.map(a=>`<option value="${a}">${a}</option>`).join("")}
          </select>
          <select id="act-period" class="form-control" style="width:160px;height:36px" onchange="myActivityFilter()">
            <option value="all">Toute la période</option>
            <option value="today">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
          </select>
          <button class="btn btn-outline btn-sm" onclick="document.getElementById('act-action').value='';document.getElementById('act-period').value='all';myActivityFilter()">
            <i class="ti ti-x"></i>Réinitialiser
          </button>
          <span id="act-count" style="font-size:12px;color:var(--text-sec);margin-left:4px">${myLogs.length} résultat${myLogs.length!==1?"s":""}</span>
        </div>
        <div class="card" style="overflow:hidden" id="act-timeline">
          ${myLogs.length ? myLogs.map(a => `
            <div class="act-row" data-action="${a.action}" data-date="${a.date}" style="display:flex;align-items:flex-start;gap:14px;padding:14px 20px;border-bottom:1px solid var(--border-lt);position:relative">
              <div style="width:3px;position:absolute;left:0;top:0;bottom:0;background:${actionColor[a.action]||"var(--border)"}"></div>
              <div style="width:36px;height:36px;border-radius:10px;background:${(actionColor[a.action]||"var(--blue)")}18;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px">
                <i class="ti ${actionIcon[a.action]||"ti-activity"}" style="color:${actionColor[a.action]||"var(--blue)"};font-size:17px"></i>
              </div>
              <div style="flex:1;min-width:0">
                <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap">
                  <span class="tag ${actionCls[a.action]||"tag-gray"}">${a.action}</span>
                  <span style="font-size:11px;color:var(--text-sec);white-space:nowrap">${a.dateStr}</span>
                </div>
                <div style="font-size:13px;font-weight:600;color:var(--text);margin-top:6px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${a.resource}">${a.resource}</div>
              </div>
            </div>`).join("")
          : `<div style="text-align:center;padding:40px;color:var(--text-sec)"><i class="ti ti-timeline" style="font-size:32px;display:block;margin-bottom:10px;opacity:.4"></i>Aucune activité enregistrée.</div>`}
        </div>
      </div>`;
  }
}

// UPLOAD WIZARD
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
      <div class="form-group"><label class="form-label">Titre du document <span class="req">*</span></label><input type="text" id="doc-title" class="form-control" placeholder="Ex : Rapport d'activité 2026" value="${APP.uploadDraft?.title||""}"></div>
      <div class="grid-2 gap-12">
        <div class="form-group"><label class="form-label">Catégorie <span class="req">*</span></label>
          <select id="doc-cat" class="form-control">
            <option value="">Choisir…</option>
            ${DB.cats.map(c=>`<option value="${c.apiId||c.id}" ${APP.uploadDraft?.categoryId===(c.apiId||c.id)?"selected":""}>${c.name}</option>`).join("")}
          </select>
        </div>
        <div class="form-group"><label class="form-label">Date du document</label><input type="date" id="doc-date" class="form-control" value="${new Date().toISOString().split("T")[0]}"></div>
      </div>
      <div class="form-group"><label class="form-label">Description courte</label><textarea id="doc-desc" class="form-control" rows="3" placeholder="Résumé du contenu…">${APP.uploadDraft?.description||""}</textarea></div>
      <div class="form-group"><label class="form-label">Mots-clés</label>
        <div class="flex-c gap-8 flex-wrap" id="tags-box">
          ${["Association","2026","Rapport","Contrat","Santé","Éducation"].map(t=>`<span class="chip ${(APP.uploadDraft?.tags||[]).includes(t)?"on":""}" onclick="this.classList.toggle('on')">${t}</span>`).join("")}
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
  if (s===4) {
    const isPublished = APP.uploadedDoc?.status === "published";
    const docId = APP.uploadedDoc?.id;
    body = `
    <div style="text-align:center;padding:36px 20px">
      <div style="width:80px;height:80px;background:${isPublished?"#DCFCE7":"var(--blue-light)"};border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:36px;color:${isPublished?"#16A34A":"var(--blue)"}">
        <i class="ti ${isPublished?"ti-circle-check":"ti-clock"}"></i>
      </div>
      <h2 style="font-family:var(--font-display);font-size:24px;font-weight:700;color:var(--text);margin-bottom:10px">
        ${isPublished ? "Document publié !" : "Document soumis avec succès !"}
      </h2>
      <p style="font-size:14px;color:var(--text-sec);margin-bottom:28px;max-width:400px;margin-left:auto;margin-right:auto;line-height:1.7">
        ${isPublished
          ? "Votre document est immédiatement visible dans le catalogue. Les membres peuvent le consulter et le télécharger."
          : "Votre document a été envoyé pour validation. Un administrateur le traitera sous 24 à 48h. Vous serez notifié par email dès sa publication."}
      </p>
      <div class="flex-c gap-10" style="justify-content:center;flex-wrap:wrap">
        ${isPublished && docId
          ? `<button class="btn btn-primary" onclick="navigate('doc',{id:'${docId}'})"><i class="ti ti-eye"></i>Voir le document</button>
             <button class="btn btn-outline" onclick="navigate('catalogue')"><i class="ti ti-books"></i>Voir le catalogue</button>`
          : `<button class="btn btn-primary" onclick="renderMember('docs')"><i class="ti ti-files"></i>Mes documents</button>`}
        <button class="btn btn-outline" onclick="APP.uploadedDoc=null;renderMember('upload')"><i class="ti ti-upload"></i>Nouveau dépôt</button>
      </div>
    </div>`;
  }

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

async function nextUploadStep() {
  const c = $("#member-main");

  if (APP.uploadStep===1) {
    const fi = $("#fi");
    if (!fi?.files[0]) { toast("Veuillez sélectionner un fichier avant de continuer.","err"); return; }
    APP.uploadFile = fi.files[0];
  }

  if (APP.uploadStep===2) {
    const title = $("#doc-title")?.value.trim();
    const categoryId = $("#doc-cat")?.value;
    const description = $("#doc-desc")?.value.trim() || "";
    const tags = $$(".chip.on").map(el=>el.textContent.trim()).filter(t=>t && !t.includes("+"));
    if (!title||!categoryId) { toast("Veuillez remplir le titre et la catégorie.","err"); return; }
    // Sauvegarder le brouillon dans APP pour passage à l'étape suivante
    APP.uploadDraft = { title, categoryId, description, tags };
  }

  if (APP.uploadStep===3) {
    // Soumettre le document à l'API
    const confMap = { public:"PUBLIC", members:"INTERNE", private:"CONFIDENTIEL" };
    const access = $("[name='acc']:checked")?.value || "members";
    const { title, categoryId, description, tags } = APP.uploadDraft || {};

    if (!APP.uploadFile || !title || !categoryId) {
      toast("Informations manquantes. Recommencez depuis l'étape 1.","err"); return;
    }

    const fd = new FormData();
    fd.append("file", APP.uploadFile);
    fd.append("title", title);
    fd.append("categoryId", categoryId);
    fd.append("confidentiality", confMap[access] || "INTERNE");
    if (description) fd.append("description", description);
    // Envoyer les tags comme champs répétés
    (tags || []).forEach(t => fd.append("tags", t));

    // Afficher un spinner pendant l'upload
    const footer = c.querySelector(".card-footer");
    const btn = footer?.querySelector(".btn-primary");
    if (btn) { btn.disabled = true; btn.innerHTML = `<i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Envoi…`; }

    try {
      const uploaded = await API.documents.upload(fd);
      APP.uploadStep++;
      APP.uploadedDoc = uploaded; // garder pour adapter l'écran de succès
      APP.uploadFile = null;
      APP.uploadDraft = null;
      renderUploadStep(c);
      const isPublished = uploaded?.status === "published";
      toast(isPublished ? "Document publié dans le catalogue !" : "Document soumis — en attente de validation.", isPublished ? "ok" : "info");
    } catch(e) {
      toast(e.message || "Erreur lors du dépôt. Vérifiez le fichier.", "err");
      if (btn) { btn.disabled = false; btn.innerHTML = `<i class="ti ti-send"></i>Soumettre`; }
    }
    return;
  }

  if (APP.uploadStep < 4) {
    APP.uploadStep++;
    renderUploadStep(c);
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

//  ADMIN
async function renderAdmin(sec="dashboard") {
  APP.adminSec = sec;
  $$("#admin-sidebar .sidebar-item").forEach(el=>el.classList.toggle("active",el.dataset.sec===sec));
  const c = $("#admin-main");

  // SUPERVISEUR : masquer les sections réservées à l'ADMINISTRATEUR
  const isSuperviseur = APP.user?.role === "superviseur";
  ["users","access","settings"].forEach(s => {
    const el = document.querySelector(`#admin-sidebar [data-sec="${s}"]`);
    if (el) el.style.display = isSuperviseur ? "none" : "";
  });
  // Rediriger si le superviseur tente d'accéder à une section interdite
  if (isSuperviseur && ["users","access","settings"].includes(sec)) {
    sec = "dashboard";
    APP.adminSec = "dashboard";
    $$("#admin-sidebar .sidebar-item").forEach(el=>el.classList.toggle("active",el.dataset.sec==="dashboard"));
  }
  // Badge dynamique — vrais documents en attente depuis l'API
  API.documents.adminList({ status: "ARCHIVED", limit: 1 }).then(({ total }) => {
    const navDocs = $("#admin-docs-nav");
    if (!navDocs) return;
    const badge = navDocs.querySelector(".s-badge");
    if (badge) badge.remove();
    if (total > 0) {
      const b = document.createElement("span");
      b.className = "s-badge";
      b.textContent = total;
      navDocs.appendChild(b);
    }
  }).catch(() => null);

  if (sec==="dashboard") {
    // Spinner pendant le chargement des vraies stats
    c.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:300px"><i class="ti ti-loader-2" style="font-size:36px;color:var(--blue);animation:spin 1s linear infinite"></i></div>`;
    const [stats, apiUsers] = await Promise.all([
      API.admin.stats().catch(()=>null),
      API.admin.users({ limit: 20 }).catch(()=>[]),
    ]);
    const realUsers   = apiUsers.length ? apiUsers : DB.users;
    // Si l'API répond, utiliser ses données ; sinon seulement fallback sur mock
    const apiOk       = stats !== null;
    const totalDocs   = apiOk ? (stats.documents?.total ?? 0) : DB.docs.filter(d=>d.status==="published").length;
    const totalUsers  = apiOk ? (stats.users?.total ?? 0) : DB.users.length;
    const recentUps   = apiOk ? (stats.documents?.recentUploads ?? 0) : 0;
    const pendingDocs = apiOk ? (stats.documents?.byStatus?.find(s=>s.status==="PENDING")?.count ?? 0) : pending.length;
    // Mettre à jour le badge sidebar avec la vraie valeur
    const navDocsAfter = $("#admin-docs-nav");
    if (navDocsAfter) {
      const oldBadge = navDocsAfter.querySelector(".s-badge");
      if (oldBadge) oldBadge.remove();
      if (pendingDocs > 0) {
        const b = document.createElement("span");
        b.className = "s-badge"; b.textContent = pendingDocs;
        navDocsAfter.appendChild(b);
      }
    }
    const recentActivity = (stats?.recentActivity || []).map(a => {
      const actionMap = { LOGIN:"CONNEXION", LOGOUT:"DÉCONNEXION", LOGIN_FAILED:"ÉCHEC CONNEXION", UPLOAD:"DÉPÔT", DOWNLOAD:"TÉLÉCHARGEMENT", UPDATE:"MODIFICATION", VIEW:"ACCÈS", CREATE:"CRÉATION", USER_CREATE:"CRÉATION COMPTE", REGISTER:"INSCRIPTION", DELETE:"SUPPRESSION", USER_DELETE:"SUPPRESSION COMPTE", APPROVE:"APPROBATION", REJECT:"REJET" };
      const diff = a.createdAt ? Date.now() - new Date(a.createdAt).getTime() : Infinity;
      const ago  = diff < 3_600_000 ? `Il y a ${Math.round(diff/60000)} min` : diff < 86_400_000 ? `Il y a ${Math.round(diff/3_600_000)}h` : "Hier";
      return { msg: `${a.user?.fullName||"Inconnu"} — ${actionMap[a.action]||a.action}`, time: ago, isNew: diff < 3_600_000 };
    });
    const activity = recentActivity.length ? recentActivity : DB.activity;
    // Répartition par catégorie
    const catStats = stats?.documents?.byCategory || [];
    const catPct = (slug) => { const found = catStats.find(c=>c.category?.slug===slug); return found ? found.count : 0; };
    const totForPct = catStats.reduce((s,c)=>s+c.count, 0) || 1;
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
            ["ti-files","si-blue", totalDocs, "Documents publiés", recentUps ? `↑ +${recentUps} ce mois` : "Aucun ce mois"],
            ["ti-clock","si-red",  pendingDocs, "En attente", pendingDocs ? "À valider" : "Tout est à jour"],
            ["ti-users","si-blue", totalUsers, "Utilisateurs", "Comptes actifs"],
            ["ti-folders","si-blue", stats?.categories?.total ?? DB.cats.length, "Catégories", "Organisées"],
          ].map(([ic,cls,val,lbl,trend])=>`
            <div class="stat-card"><div class="stat-icon ${cls}"><i class="ti ${ic}"></i></div><div><div class="stat-val">${val}</div><div class="stat-label">${lbl}</div><div class="stat-trend">${trend}</div></div></div>
          `).join("")}
        </div>
        <div style="display:grid;grid-template-columns:1fr 290px;gap:16px">
          <!-- VALIDATION -->
          <div class="card">
            <div class="card-header">
              <span class="card-title">Documents en attente ${pendingDocs?`<span class="tag tag-red" style="margin-left:8px">${pendingDocs} à valider</span>`:""}</span>
              <button class="btn btn-outline btn-sm" onclick="renderAdmin('docs')">Tout voir →</button>
            </div>
            <div class="empty"><i class="ti ti-circle-check"></i><h3>Tout est à jour !</h3><p>Aucun document en attente de validation.</p></div>
          </div>
          <!-- DROITE -->
          <div class="flex-col gap-14">
            <div class="card card-body">
              <div class="card-title mb-12">Répartition des documents</div>
              ${DB.cats.map((cat,i)=>{
                const cnt = catPct(cat.id);
                const pct = Math.round(cnt/totForPct*100);
                const isRed = i===0;
                return `<div style="margin-bottom:10px">
                  <div class="flex-b text-sm mb-4"><span style="font-weight:600;font-size:12px">${cat.name.length>20?cat.name.substring(0,20)+"…":cat.name}</span><span style="color:${isRed?"var(--red)":"var(--blue)"};font-weight:700;font-size:12px">${cnt} doc${cnt>1?"s":""}</span></div>
                  <div class="progress"><div class="progress-fill ${isRed?"red":""}" style="width:${Math.max(pct,2)}%"></div></div>
                </div>`;
              }).join("")}
            </div>
            <div class="card card-body">
              <div class="card-title mb-10">Activité récente</div>
              ${activity.map(a=>`
                <div class="flex-c gap-10" style="padding:7px 0;border-bottom:1px solid var(--border-lt)">
                  <div style="width:8px;height:8px;border-radius:50%;background:${a.isNew?"var(--blue)":"var(--border)"};flex-shrink:0"></div>
                  <div><div style="font-size:12px;font-weight:500;color:var(--text)">${a.msg}</div><div style="font-size:11px;color:var(--text-sec)">${a.time}</div></div>
                </div>`).join("")}
            </div>
            <div style="background:var(--blue-deep);border-radius:var(--r-xl);padding:16px">
              <div style="font-size:11px;font-weight:700;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px">Actions rapides</div>
              ${[["ti-user-plus","Inviter un membre","renderAdmin('users')"],["ti-folder-plus","Créer une catégorie","renderAdmin('cats')"],["ti-chart-bar","Statistiques","toast('Export en cours…','info')"]].map(([ic,lbl,action])=>`
                <div class="flex-c gap-10" style="padding:9px 12px;background:rgba(255,255,255,.07);border-radius:var(--r-md);cursor:pointer;margin-bottom:7px;transition:var(--t)" onclick="${action}" onmouseover="this.style.background='rgba(255,255,255,.12)'" onmouseout="this.style.background='rgba(255,255,255,.07)'">
                  <i class="ti ${ic}" style="color:var(--blue);font-size:18px"></i>
                  <span style="font-size:13px;color:white;font-weight:500">${lbl}</span>
                </div>`).join("")}
            </div>
          </div>
        </div>
        <!-- MEMBRES -->
        <div class="card">
          <div class="card-header"><span class="card-title">Utilisateurs (${totalUsers})</span><button class="btn btn-outline btn-sm" onclick="renderAdmin('users')">Gérer →</button></div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px;padding:16px">
            ${realUsers.map(u=>`
              <div class="card card-hover card-body" style="padding:14px;cursor:pointer" onclick="renderAdmin('users')">
                <div class="flex-c gap-8 mb-8"><div class="u-avatar" style="background:${u.role==="admin"?"var(--red)":"var(--blue)"}">${u.initials}</div><div style="min-width:0;overflow:hidden"><div style="font-size:12px;font-weight:700;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${u.name}</div><div style="font-size:10px;color:var(--text-sec)">${u.roleLabel}</div></div></div>
                <span class="status ${u.status==="new"?"s-pending":"s-published"}" style="font-size:10px">${u.status==="new"?"Nouveau":"Actif"}</span>
              </div>`).join("")}
          </div>
        </div>
      </div>`;
  }

  if (sec==="docs") {
    c.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:300px"><i class="ti ti-loader-2" style="font-size:36px;color:var(--blue);animation:spin 1s linear infinite"></i></div>`;
    APP._docsFilter = APP._docsFilter || { status: "", q: "", page: 1 };
    const f = APP._docsFilter;
    const params = { limit: 50, page: f.page };
    if (f.status) params.status = f.status;
    if (f.q) params.q = f.q;
    const { items: docs, total, pages } = await API.documents.adminList(params);

    const renderDocsTable = (docs) => docs.map(d => `
      <tr id="admin-row-${d.id}">
        <td style="max-width:240px"><div class="td-doc">${docIconHtml(d.fmt,"30px","36px")}<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600;font-size:13px" title="${d.title}">${d.title}</span></div></td>
        <td>${tagHtml(d.type)}</td>
        <td class="text-sec text-sm">${d.fmt}</td>
        <td class="text-sec text-sm">${d.author}</td>
        <td><span class="tag ${d.access==="Public"?"tag-pub":"tag-gray"}">${d.access}</span></td>
        <td class="text-sec text-sm">${d.dateStr}</td>
        <td id="status-${d.id}">${statusHtml(d.status)}</td>
        <td><div class="flex-c gap-6">
          ${d.status==="pending"
            ? `<div class="btn-icon green" onclick="approveDoc('${d.id}','${d.title.replace(/'/g,"\\'").slice(0,30)}')" title="Approuver"><i class="ti ti-check"></i></div>
               <div class="btn-icon red"   onclick="rejectDoc('${d.id}')" title="Rejeter"><i class="ti ti-x"></i></div>`
            : ""}
          <div class="btn-icon" onclick="navigate('doc',{id:'${d.id}'})" title="Voir"><i class="ti ti-eye"></i></div>
          <div class="btn-icon red" onclick="adminDelDoc('${d.id}','${d.title.replace(/'/g,"\\'").slice(0,30)}')" title="Supprimer"><i class="ti ti-trash"></i></div>
        </div></td>
      </tr>`).join("");

    const pagBtns = pages <= 1 ? "" : Array.from({length: Math.min(pages,10)}, (_,i)=>i+1).map(n=>
      `<div class="pag-btn ${n===f.page?"active":""}" onclick="adminDocsPage(${n})">${n}</div>`).join("");

    c.innerHTML = `
      <div class="topbar">
        <div><div class="topbar-title">Tous les documents</div><div class="topbar-sub" id="docs-sub">${total} document${total!==1?"s":""}</div></div>
        <div class="flex-c gap-8">
          <input type="text" id="admin-doc-q" class="form-control" style="width:220px;height:38px" placeholder="Rechercher…" value="${f.q}" oninput="adminDocsSearch(this.value)">
          <select id="admin-doc-status" class="form-control" style="width:160px;height:38px" onchange="adminDocsStatusFilter(this.value)">
            <option value="" ${!f.status?"selected":""}>Tous les statuts</option>
            <option value="ARCHIVED" ${f.status==="ARCHIVED"?"selected":""}>En attente</option>
            <option value="ACTIVE"   ${f.status==="ACTIVE"  ?"selected":""}>Publiés</option>
            <option value="DELETED"  ${f.status==="DELETED" ?"selected":""}>Supprimés</option>
          </select>
        </div>
      </div>
      <div class="page-inner">
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Document</th><th>Catégorie</th><th>Format</th><th>Auteur</th><th>Accès</th><th>Date</th><th>Statut</th><th>Actions</th></tr></thead>
            <tbody id="admin-docs-body">
              ${docs.length ? renderDocsTable(docs) : `<tr><td colspan="8" style="text-align:center;padding:32px;color:var(--text-sec)">Aucun document trouvé.</td></tr>`}
            </tbody>
          </table>
        </div>
        ${pagBtns ? `<div class="pagination">${pagBtns}</div>` : ""}
      </div>`;
  }

  if (sec==="users") {
    c.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:300px"><i class="ti ti-loader-2" style="font-size:36px;color:var(--blue);animation:spin 1s linear infinite"></i></div>`;
    const users = await API.admin.users({ limit: 100 }).catch(() => []);
    const roleClsMap = { admin:"tag-red", superviseur:"tag-orange", member:"tag-blue", consultant:"tag-cyan", lecteur:"tag-gray" };
    c.innerHTML = `
      <div class="topbar">
        <div><div class="topbar-title">Gestion des membres</div><div class="topbar-sub">${users.length} membre${users.length!==1?"s":""} inscrit${users.length!==1?"s":""}</div></div>
        <button class="btn btn-primary btn-sm" onclick="openCreateUserModal()"><i class="ti ti-user-plus"></i>Créer un compte</button>
      </div>
      <div class="page-inner">
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Membre</th><th>Email</th><th>Rôle</th><th>Inscrit</th><th>Statut</th><th>Actions</th></tr></thead>
            <tbody>
              ${users.map(u=>`
              <tr id="user-row-${u.id}">
                <td><div class="flex-c gap-10">
                  <div class="u-avatar" style="background:${u.role==="admin"?"var(--red)":u.role==="superviseur"?"#F97316":"var(--blue)"}">${u.initials}</div>
                  <div style="font-size:13px;font-weight:700">${u.name}</div>
                </div></td>
                <td class="text-sec text-sm">${u.email}</td>
                <td><span class="tag ${roleClsMap[u.role]||"tag-gray"}">${u.roleLabel}</span></td>
                <td class="text-sec text-sm">${u.joined}</td>
                <td><span class="status ${u.status==="active"?"s-published":"s-draft"}">${u.status==="active"?"Actif":"Inactif"}</span></td>
                <td><div class="flex-c gap-6">
                  <div class="btn-icon" title="Modifier" onclick="openEditUserModal('${u.id}','${u.name.replace(/'/g,"\\'")}','${u.role}','${u.status}')"><i class="ti ti-pencil"></i></div>
                  <div class="btn-icon ${u.status==="active"?"red":""}" title="${u.status==="active"?"Désactiver":"Réactiver"}" onclick="adminToggleUser('${u.id}',${u.status==="active"})"><i class="ti ti-user-${u.status==="active"?"off":"check"}"></i></div>
                </div></td>
              </tr>`).join("")}
            </tbody>
          </table>
        </div>
      </div>`;
  }

  if (sec==="logs") {
    c.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:300px"><i class="ti ti-loader-2" style="font-size:36px;color:var(--blue);animation:spin 1s linear infinite"></i></div>`;
    const logs = await API.activity.all({ limit: 100 }).catch(() => []);
    APP._adminLogs = logs;

    const actionCls = {
      "CONNEXION":"tag-blue","DÉCONNEXION":"tag-gray","DÉPÔT":"tag-green","DÉPÔT":"tag-green",
      "TÉLÉCHARGEMENT":"tag-pub","APPROBATION":"tag-green","REJET":"tag-red",
      "SUPPRESSION":"tag-red","MODIFICATION":"tag-orange","CRÉATION":"tag-purple",
      "CRÉATION COMPTE":"tag-purple","SUPPRESSION COMPTE":"tag-red",
      "ACCÈS":"tag-gray","CONNEXION ÉCHOUÉE":"tag-red","INSCRIPTION":"tag-blue",
      "ÉCHEC CONNEXION":"tag-red",
    };
    const roleCls = {
      "ADMINISTRATEUR":"tag-red","SUPERVISEUR":"tag-orange","AGENT":"tag-blue",
      "CONSULTANT":"tag-cyan","LECTEUR":"tag-gray",
    };
    const actions = [...new Set(logs.map(l=>l.action))].sort();

    const rowHtml = (l) => `
      <tr data-user="${l.user.toLowerCase()}" data-action="${l.action}" data-resource="${l.resource.toLowerCase()}" data-date="${l.date}">
        <td class="text-sec text-sm" style="white-space:nowrap;font-variant-numeric:tabular-nums">${l.dateStr}</td>
        <td>
          <div class="flex-c gap-8">
            <div class="u-avatar" style="width:28px;height:28px;font-size:10px;background:${l.role==="ADMINISTRATEUR"?"var(--red)":l.role==="SUPERVISEUR"?"#F97316":"var(--blue)"}">${l.user.split(" ").map(w=>w[0]||"").join("").substring(0,2).toUpperCase()||"?"}</div>
            <span style="font-size:13px;font-weight:600">${l.user}</span>
          </div>
        </td>
        <td><span class="tag ${roleCls[l.role]||"tag-gray"}" style="font-size:10px">${l.role}</span></td>
        <td><span class="tag ${actionCls[l.action]||"tag-gray"}">${l.action}</span></td>
        <td class="text-sec text-sm" style="max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${l.resource}">${l.resource}</td>
        <td class="text-sec text-sm" style="font-family:monospace;font-size:11px">${l.ip}</td>
      </tr>`;

    c.innerHTML = `
      <div class="topbar">
        <div><div class="topbar-title">Journaux d'activité</div><div class="topbar-sub" id="logs-sub">${logs.length} entrée${logs.length!==1?"s":""} enregistrée${logs.length!==1?"s":""}</div></div>
        <button class="btn btn-outline btn-sm" onclick="exportLogsCSV()"><i class="ti ti-download"></i>Exporter CSV</button>
      </div>
      <div class="page-inner">
        <div class="flex-c gap-10 mb-14" style="flex-wrap:wrap">
          <input id="log-search" type="text" class="form-control" style="width:240px;height:36px" placeholder="Rechercher utilisateur, ressource…" oninput="logsFilter()">
          <select id="log-action" class="form-control" style="width:180px;height:36px" onchange="logsFilter()">
            <option value="">Toutes les actions</option>
            ${actions.map(a=>`<option value="${a}">${a}</option>`).join("")}
          </select>
          <select id="log-period" class="form-control" style="width:160px;height:36px" onchange="logsFilter()">
            <option value="all">Toute la période</option>
            <option value="today">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
          </select>
          <button class="btn btn-outline btn-sm" onclick="document.getElementById('log-search').value='';document.getElementById('log-action').value='';document.getElementById('log-period').value='all';logsFilter()">
            <i class="ti ti-x"></i>Réinitialiser
          </button>
          <span id="log-count" style="font-size:12px;color:var(--text-sec);margin-left:4px">${logs.length} résultat${logs.length!==1?"s":""}</span>
        </div>
        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th style="width:160px">Date / Heure</th>
                <th>Utilisateur</th>
                <th style="width:130px">Rôle</th>
                <th style="width:145px">Action</th>
                <th>Ressource</th>
                <th style="width:130px">IP</th>
              </tr>
            </thead>
            <tbody id="logs-body">
              ${logs.length ? logs.map(rowHtml).join("") : `<tr><td colspan="6" style="text-align:center;padding:32px;color:var(--text-sec)">Aucune activité enregistrée.</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>`;
  }

  if (sec==="cats") {
    const confCls  = { public:"tag-green", interne:"tag-blue", confidentiel:"tag-red" };
    const confLbl  = { public:"PUBLIC",    interne:"INTERNE",  confidentiel:"CONFIDENTIEL" };
    c.innerHTML = `
      <div class="topbar">
        <div><div class="topbar-title">Catégories documentaires</div><div class="topbar-sub">${DB.cats.length} familles · ${DB.docs.length} documents archivés</div></div>
        <button class="btn btn-primary btn-sm" onclick="openCatForm()"><i class="ti ti-folder-plus"></i>Nouvelle catégorie</button>
      </div>
      <div class="page-inner">
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px">
          ${DB.cats.map(cat=>{
            const docCount = DB.docs.filter(d=>d.cat===cat.id).length;
            return `
            <div class="card card-body" id="cat-card-${cat.id}">
              <div class="flex-b mb-10">
                <div class="flex-c gap-12">
                  <div style="width:46px;height:46px;border-radius:12px;background:${cat.bg};color:${cat.color};display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">
                    <i class="ti ${cat.icon}"></i>
                  </div>
                  <div>
                    <div style="font-weight:700;font-size:14px;color:var(--text)">${cat.name}</div>
                    <div style="font-size:11px;color:var(--text-sec);margin-top:2px;font-family:monospace">/${cat.id}</div>
                  </div>
                </div>
                <div class="flex-c gap-6">
                  <div class="btn-icon" onclick="openCatForm('${cat.id}')" title="Modifier"><i class="ti ti-pencil"></i></div>
                  <div class="btn-icon red" onclick="deleteCat('${cat.id}')" title="Supprimer"><i class="ti ti-trash"></i></div>
                </div>
              </div>
              <div style="font-size:12px;color:var(--text-sec);margin-bottom:12px;line-height:1.5">${cat.tags.join(' · ')}</div>
              <div class="flex-b">
                <span class="tag ${confCls[cat.conf]||'tag-gray'}">${confLbl[cat.conf]||cat.conf}</span>
                <span style="font-size:12px;font-weight:700;color:var(--blue)">${docCount} document${docCount!==1?'s':''}</span>
              </div>
            </div>`;
          }).join("")}
        </div>
      </div>`;
  }

  if (sec==="access") {
    c.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:300px"><i class="ti ti-loader-2" style="font-size:36px;color:var(--blue);animation:spin 1s linear infinite"></i></div>`;
    const [allUsers, docRules, catRules] = await Promise.all([
      API.admin.users({ limit: 200 }).catch(()=>[]),
      API.access.listDocuments().catch(()=>[]),
      API.access.listCategories().catch(()=>[]),
    ]);
    const restricted = allUsers.filter(u=>u.role==="consultant"||u.role==="lecteur");
    const usersById = Object.fromEntries(allUsers.map(u=>[u.id,u]));

    const rules = [
      ...docRules.map(r => ({
        id: r.id, type:"document", userId: r.user.id, userName: r.user.fullName,
        userRole: usersById[r.user.id]?.role, userRoleLabel: usersById[r.user.id]?.roleLabel || "—",
        resourceLabel: r.document.title, grantedAt: fmtDate(r.createdAt), grantedBy: r.grantedBy.fullName,
      })),
      ...catRules.map(r => ({
        id: r.id, type:"categorie", userId: r.user.id, userName: r.user.fullName,
        userRole: usersById[r.user.id]?.role, userRoleLabel: usersById[r.user.id]?.roleLabel || "—",
        resourceLabel: r.category.name, grantedAt: fmtDate(r.createdAt), grantedBy: r.grantedBy.fullName,
      })),
    ];
    DB.access = rules; // cache pour openAccessForm / revokeAccess
    DB._restrictedUsers = restricted;

    const roleCls  = { consultant:"tag-cyan", lecteur:"tag-gray" };
    const typeCls  = { categorie:"tag-blue",  document:"tag-green" };
    const typeLbl  = { categorie:"Catégorie", document:"Document"  };
    c.innerHTML = `
      <div class="topbar">
        <div><div class="topbar-title">Gestion des accès</div><div class="topbar-sub">${DB.access.length} règles actives · ${restricted.length} utilisateurs restreints</div></div>
        <button class="btn btn-primary btn-sm" onclick="openAccessForm()"><i class="ti ti-key"></i>Accorder un accès</button>
      </div>
      <div class="page-inner">
        <div class="flex-c gap-0 mb-16" style="border-bottom:1px solid var(--border)">
          <button class="access-tab active" id="tab-user" onclick="accessTab('user')"><i class="ti ti-users" style="margin-right:6px;font-size:13px"></i>Par utilisateur</button>
          <button class="access-tab" id="tab-res" onclick="accessTab('res')"><i class="ti ti-folder" style="margin-right:6px;font-size:13px"></i>Par ressource</button>
        </div>

        <div id="access-users">
          ${restricted.map(u=>{
            const rules = DB.access.filter(r=>r.userId===u.id);
            return `
            <div class="card card-body mb-14">
              <div class="flex-b mb-14">
                <div class="flex-c gap-12">
                  <div class="u-avatar" style="width:40px;height:40px;font-size:14px;background:${u.role==="consultant"?"#0E7490":"var(--gray-400)"}">${u.initials}</div>
                  <div>
                    <div style="font-size:14px;font-weight:700;color:var(--text)">${u.name}</div>
                    <div style="font-size:12px;color:var(--text-sec);margin-top:2px">${u.email}</div>
                  </div>
                  <span class="tag ${roleCls[u.role]||"tag-gray"}" style="margin-left:4px">${u.roleLabel}</span>
                </div>
                <button class="btn btn-outline btn-sm" onclick="openAccessForm('${u.id}')"><i class="ti ti-plus"></i>Accorder un accès</button>
              </div>
              ${rules.length===0 ? `
                <div style="padding:14px;text-align:center;color:var(--text-sec);font-size:13px;background:var(--gray-100);border-radius:var(--r-lg)">
                  <i class="ti ti-lock-off" style="font-size:18px;display:block;margin-bottom:6px"></i>
                  Aucun accès spécifique — limité aux documents publics uniquement
                </div>` : `
                <div class="flex-col gap-8">
                  ${rules.map(r=>`
                    <div class="flex-b" style="padding:10px 14px;background:var(--gray-100);border-radius:var(--r-lg);border:1px solid var(--border-lt)">
                      <div class="flex-c gap-10">
                        <span class="tag ${typeCls[r.type]||"tag-gray"}" style="font-size:10px">${typeLbl[r.type]||r.type}</span>
                        <span style="font-size:13px;font-weight:600;color:var(--text)">${r.resourceLabel}</span>
                      </div>
                      <div class="flex-c gap-10">
                        <span style="font-size:11px;color:var(--text-sec)">le ${r.grantedAt}</span>
                        <div class="btn-icon red" onclick="revokeAccess('${r.id}','${r.type}')" title="Révoquer"><i class="ti ti-x"></i></div>
                      </div>
                    </div>`).join("")}
                </div>`}
            </div>`;
          }).join("")}
        </div>

        <div id="access-res" style="display:none">
          <div class="table-wrap">
            <table class="table">
              <thead><tr><th>Type</th><th>Ressource</th><th>Utilisateur</th><th>Rôle</th><th>Accordé le</th><th>Accordé par</th><th>Action</th></tr></thead>
              <tbody>
                ${DB.access.map(r=>`
                  <tr>
                    <td><span class="tag ${typeCls[r.type]||"tag-gray"}" style="font-size:10px">${typeLbl[r.type]||r.type}</span></td>
                    <td style="font-weight:600;font-size:13px;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${r.resourceLabel}</td>
                    <td>
                      <div class="flex-c gap-8">
                        <div class="u-avatar" style="width:26px;height:26px;font-size:10px;background:${r.userRole==="consultant"?"#0E7490":"var(--gray-400)"}">${r.userName.split(" ").map(w=>w[0]).join("").substring(0,2).toUpperCase()}</div>
                        <span style="font-size:13px;font-weight:500">${r.userName}</span>
                      </div>
                    </td>
                    <td><span class="tag ${r.userRole==="consultant"?"tag-cyan":"tag-gray"}" style="font-size:10px">${r.userRoleLabel}</span></td>
                    <td class="text-sec text-sm">${r.grantedAt}</td>
                    <td class="text-sec text-sm">${r.grantedBy}</td>
                    <td><div class="btn-icon red" onclick="revokeAccess('${r.id}','${r.type}')" title="Révoquer"><i class="ti ti-x"></i></div></td>
                  </tr>`).join("")}
              </tbody>
            </table>
          </div>
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
            ${[...DB.docs].sort((a,b)=>b.dl-a.dl).slice(0,5).map((d,i)=>`
              <div class="flex-c gap-10" style="padding:8px 0;border-bottom:1px solid var(--border-lt);cursor:pointer" onclick="navigate('doc',{id:'${d.id}'})">
                <div style="width:22px;height:22px;border-radius:50%;background:${i===0?"var(--blue)":i===1?"var(--blue-light)":"var(--gray-100)"};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:${i===0?"white":"var(--blue)"};flex-shrink:0">${i+1}</div>
                <div style="flex:1;min-width:0"><div style="font-size:12px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${d.title.length>40?d.title.substring(0,40)+"…":d.title}</div></div>
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

// FILTRE MON ACTIVITÉ
function myActivityFilter() {
  const action = document.getElementById("act-action")?.value || "";
  const period = document.getElementById("act-period")?.value || "all";
  const today  = new Date(); today.setHours(0,0,0,0);
  const weekStart = new Date(today); weekStart.setDate(today.getDate() - today.getDay());
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  let visible = 0;
  document.querySelectorAll(".act-row").forEach(row => {
    const matchAction = !action || row.dataset.action === action;
    const rowDate = new Date(row.dataset.date); rowDate.setHours(0,0,0,0);
    const matchPeriod = period === "all" ||
      (period === "today" && rowDate >= today) ||
      (period === "week"  && rowDate >= weekStart) ||
      (period === "month" && rowDate >= monthStart);
    const show = matchAction && matchPeriod;
    row.style.display = show ? "" : "none";
    if (show) visible++;
  });
  const cnt = document.getElementById("act-count");
  if (cnt) cnt.textContent = `${visible} résultat${visible !== 1 ? "s" : ""}`;
}

// FILTRE JOURNAUX
function logsFilter() {
  const q      = (document.getElementById("log-search")?.value  || "").toLowerCase();
  const action = (document.getElementById("log-action")?.value  || "");
  const period = (document.getElementById("log-period")?.value  || "all");
  const today  = new Date(); today.setHours(0,0,0,0);
  const weekStart = new Date(today); weekStart.setDate(today.getDate() - today.getDay());
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  let visible = 0;
  document.querySelectorAll("#logs-body tr").forEach(row => {
    if (!row.dataset.date) { row.style.display=""; return; }
    const matchQ      = !q || row.dataset.user.includes(q) || row.dataset.resource.includes(q) || row.dataset.action.toLowerCase().includes(q);
    const matchAction = !action || row.dataset.action === action;
    const rowDate     = new Date(row.dataset.date); rowDate.setHours(0,0,0,0);
    const matchPeriod = period === "all" ||
      (period === "today" && rowDate >= today) ||
      (period === "week"  && rowDate >= weekStart) ||
      (period === "month" && rowDate >= monthStart);
    const show = matchQ && matchAction && matchPeriod;
    row.style.display = show ? "" : "none";
    if (show) visible++;
  });
  const cnt = document.getElementById("log-count");
  if (cnt) cnt.textContent = `${visible} résultat${visible!==1?"s":""}`;
}

function exportLogsCSV() {
  const logs = APP._adminLogs || [];
  if (!logs.length) { toast("Aucune donnée à exporter.","err"); return; }
  const header = ["Date","Utilisateur","Rôle","Action","Ressource","IP"];
  const rows = logs.map(l => [
    `"${l.dateStr}"`, `"${l.user}"`, `"${l.role}"`,
    `"${l.action}"`, `"${l.resource.replace(/"/g,'""')}"`, `"${l.ip}"`
  ].join(","));
  const csv = [header.join(","), ...rows].join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `journaux-aev-${new Date().toISOString().slice(0,10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
  toast("Export CSV généré.", "ok");
}

// GESTION DES ACCÈS
function accessTab(which) {
  document.getElementById("access-users").style.display = which==="user" ? "" : "none";
  document.getElementById("access-res").style.display   = which==="res"  ? "" : "none";
  document.getElementById("tab-user").classList.toggle("active", which==="user");
  document.getElementById("tab-res").classList.toggle("active",  which==="res");
}

function openAccessForm(userId) {
  const restricted = DB._restrictedUsers || [];
  openModal(`
    <div class="flex-col gap-12">
      <div class="form-group">
        <label class="form-label">Utilisateur <span class="req">*</span></label>
        <select id="acc-user" class="form-control">
          <option value="">Choisir un utilisateur…</option>
          ${restricted.map(u=>`<option value="${u.id}" ${u.id===userId?"selected":""}>${u.name} — ${u.roleLabel}</option>`).join("")}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Type de ressource <span class="req">*</span></label>
        <select id="acc-type" class="form-control" onchange="accessTypeChange()">
          <option value="categorie">Catégorie documentaire</option>
          <option value="document">Document spécifique</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Ressource <span class="req">*</span></label>
        <select id="acc-resource" class="form-control">
          ${DB.cats.map(cat=>`<option value="${cat.apiId}">${cat.name}</option>`).join("")}
        </select>
      </div>
      <div class="flex-c gap-10 mt-8">
        <button class="btn btn-primary" onclick="grantAccess()"><i class="ti ti-key"></i>Accorder l'accès</button>
        <button class="btn btn-outline" onclick="closeModal()">Annuler</button>
      </div>
    </div>`, "Accorder un accès");
}

async function accessTypeChange() {
  const type = document.getElementById("acc-type").value;
  const sel  = document.getElementById("acc-resource");
  if (type==="categorie") {
    sel.innerHTML = DB.cats.map(cat=>`<option value="${cat.apiId}">${cat.name}</option>`).join("");
    return;
  }
  sel.innerHTML = `<option>Chargement…</option>`;
  if (!DB._accessDocsCache) {
    DB._accessDocsCache = await API.documents.list({ status:"ACTIVE", limit:200 }).catch(()=>[]);
  }
  sel.innerHTML = DB._accessDocsCache
    .map(d=>`<option value="${d.id}">${d.title.length>55?d.title.substring(0,55)+"…":d.title}</option>`).join("");
}

async function grantAccess() {
  const userId     = document.getElementById("acc-user").value;
  const type       = document.getElementById("acc-type").value;
  const resourceId = document.getElementById("acc-resource").value;
  if (!userId)     { toast("Sélectionnez un utilisateur.", "err"); return; }
  if (!resourceId) { toast("Sélectionnez une ressource.",  "err"); return; }
  const btn = document.querySelector("#modal-body .btn-primary");
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="ti ti-loader"></i>Envoi…'; }
  try {
    if (type==="categorie") await API.access.grantCategory(resourceId, userId);
    else                    await API.access.grantDocument(resourceId, userId);
    toast("Accès accordé.", "ok");
    closeModal();
    renderAdmin("access");
  } catch(e) {
    toast(e.message || "Impossible d'accorder cet accès.", "err");
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="ti ti-key"></i>Accorder l\'accès'; }
  }
}

function revokeAccess(id, type) {
  const rule = (DB.access||[]).find(r=>r.id===id);
  if (!rule) return;
  openModal(`
    <p style="font-size:14px;color:var(--text-sec);line-height:1.7">
      Révoquer l'accès de <strong>${rule.userName}</strong> à <strong>${rule.resourceLabel}</strong> ?
    </p>
    <div class="flex-c gap-10 mt-20">
      <button class="btn btn-danger" onclick="confirmRevokeAccess('${id}','${type}')"><i class="ti ti-x"></i>Révoquer</button>
      <button class="btn btn-outline" onclick="closeModal()">Annuler</button>
    </div>`, "Révoquer cet accès ?");
}

async function confirmRevokeAccess(id, type) {
  try {
    if (type==="categorie") await API.access.revokeCategory(id);
    else                    await API.access.revokeDocument(id);
    toast("Accès révoqué.", "err");
    closeModal();
    renderAdmin("access");
  } catch(e) {
    toast(e.message || "Impossible de révoquer cet accès.", "err");
  }
}

// CRUD CATÉGORIES
function openCatForm(id) {
  const cat = id ? DB.cats.find(c=>c.id===id) : null;
  openModal(`
    <div class="flex-col gap-12">
      <div class="form-group">
        <label class="form-label">Nom <span class="req">*</span></label>
        <input id="cf-name" class="form-control" value="${cat?cat.name:''}" placeholder="Ex. Contrats et conventions">
      </div>
      <div class="grid-2 gap-12">
        <div class="form-group">
          <label class="form-label">Identifiant (slug) <span class="req">*</span></label>
          <input id="cf-id" class="form-control" value="${cat?cat.id:''}" placeholder="contrat" ${cat?"disabled":""}>
        </div>
        <div class="form-group">
          <label class="form-label">Icône Tabler</label>
          <input id="cf-icon" class="form-control" value="${cat?cat.icon:"ti-folder"}" placeholder="ti-folder">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Confidentialité par défaut</label>
        <select id="cf-conf" class="form-control">
          <option value="public"        ${cat?.conf==="public"       ?"selected":""}>PUBLIC — visible par tous</option>
          <option value="interne"       ${!cat||cat.conf==="interne" ?"selected":""}>INTERNE — membres uniquement</option>
          <option value="confidentiel"  ${cat?.conf==="confidentiel" ?"selected":""}>CONFIDENTIEL — accès restreint</option>
        </select>
      </div>
      <div class="flex-c gap-10 mt-8">
        <button class="btn btn-primary" onclick="saveCat('${id||""}')"><i class="ti ti-device-floppy"></i>${cat?"Enregistrer":"Créer"}</button>
        <button class="btn btn-outline" onclick="closeModal()">Annuler</button>
      </div>
    </div>`, cat ? `Modifier — ${cat.name}` : "Nouvelle catégorie");
}
function saveCat(id) {
  const name = document.getElementById("cf-name").value.trim();
  const slug = (document.getElementById("cf-id").value||"").trim();
  const icon = document.getElementById("cf-icon").value.trim() || "ti-folder";
  const conf = document.getElementById("cf-conf").value;
  if (!name) { toast("Le nom est requis.", "err"); return; }
  if (id) {
    const cat = DB.cats.find(c=>c.id===id);
    if (cat) { cat.name=name; cat.icon=icon; cat.conf=conf; }
    toast(`Catégorie "${name}" modifiée.`, "ok");
  } else {
    if (!slug) { toast("L'identifiant est requis.", "err"); return; }
    if (DB.cats.find(c=>c.id===slug)) { toast("Cet identifiant existe déjà.", "err"); return; }
    DB.cats.push({ id:slug, name, icon, color:"#475569", bg:"#F8FAFC", conf, tags:[] });
    toast(`Catégorie "${name}" créée !`, "ok");
  }
  closeModal();
  renderAdmin("cats");
}
function deleteCat(id) {
  const cat = DB.cats.find(c=>c.id===id);
  if (!cat) return;
  const count = DB.docs.filter(d=>d.cat===id).length;
  if (count>0) {
    openModal(`
      <p style="font-size:14px;color:var(--text-sec);line-height:1.7">
        La catégorie <strong>${cat.name}</strong> contient <strong>${count} document${count>1?"s":""}</strong>.<br>
        Déplacez ou supprimez ces documents avant de supprimer la catégorie.
      </p>
      <button class="btn btn-outline mt-16" onclick="closeModal()">Compris</button>`,
      "Suppression impossible");
  } else {
    openModal(`
      <p style="font-size:14px;color:var(--text-sec);line-height:1.7">
        Supprimer <strong>${cat.name}</strong> ? Cette action est irréversible.
      </p>
      <div class="flex-c gap-10 mt-20">
        <button class="btn btn-danger" onclick="confirmDelCat('${id}')"><i class="ti ti-trash"></i>Supprimer</button>
        <button class="btn btn-outline" onclick="closeModal()">Annuler</button>
      </div>`,
      "Supprimer cette catégorie ?");
  }
}
function confirmDelCat(id) {
  const i = DB.cats.findIndex(c=>c.id===id);
  if (i>-1) { DB.cats.splice(i,1); toast("Catégorie supprimée.","err"); closeModal(); renderAdmin("cats"); }
}

// CRUD UTILISATEURS
function openCreateUserModal() {
  openModal(`
    <div class="flex-col gap-14">
      <div class="form-group">
        <label class="form-label">Nom complet <span class="req">*</span></label>
        <input id="cu-name" type="text" class="form-control" placeholder="Ex : Marie Dupont">
      </div>
      <div class="form-group">
        <label class="form-label">Adresse e-mail <span class="req">*</span></label>
        <input id="cu-email" type="email" class="form-control" placeholder="marie@exemple.com">
      </div>
      <div class="form-group">
        <label class="form-label">Rôle</label>
        <select id="cu-role" class="form-control">
          <option value="AGENT">Agent</option>
          <option value="SUPERVISEUR">Superviseur</option>
          <option value="CONSULTANT">Consultant</option>
          <option value="LECTEUR">Lecteur</option>
          <option value="ADMINISTRATEUR">Administrateur</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Mot de passe <span class="req">*</span></label>
        <input id="cu-pwd" type="password" class="form-control" placeholder="Min. 8 car., 1 maj., 1 chiffre">
      </div>
      <div class="flex-c gap-10 mt-4">
        <button class="btn btn-primary" onclick="submitCreateUser()"><i class="ti ti-user-plus"></i>Créer le compte</button>
        <button class="btn btn-outline" onclick="closeModal()">Annuler</button>
      </div>
    </div>`, "Créer un compte utilisateur");
}

async function submitCreateUser() {
  const fullName = $("#cu-name")?.value.trim();
  const email    = $("#cu-email")?.value.trim();
  const role     = $("#cu-role")?.value;
  const password = $("#cu-pwd")?.value;
  if (!fullName || !email || !password) { toast("Remplissez tous les champs obligatoires.","err"); return; }
  const btn = document.querySelector("#modal-overlay .btn-primary");
  if (btn) { btn.disabled=true; btn.innerHTML=`<i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Création…`; }
  try {
    await API.admin.createUser({ fullName, email, password, role });
    closeModal();
    toast(`Compte de ${fullName} créé avec succès.`, "ok");
    renderAdmin("users");
  } catch(e) {
    toast(e.message || "Erreur lors de la création.", "err");
    if (btn) { btn.disabled=false; btn.innerHTML=`<i class="ti ti-user-plus"></i>Créer le compte`; }
  }
}

function openEditUserModal(id, name, role, status) {
  const roleMap = { admin:"ADMINISTRATEUR", superviseur:"SUPERVISEUR", member:"AGENT", consultant:"CONSULTANT", lecteur:"LECTEUR" };
  const apiRole = roleMap[role] || "AGENT";
  openModal(`
    <div class="flex-col gap-14">
      <div class="form-group">
        <label class="form-label">Nom complet</label>
        <input id="eu-name" type="text" class="form-control" value="${name}">
      </div>
      <div class="form-group">
        <label class="form-label">Rôle</label>
        <select id="eu-role" class="form-control">
          <option value="AGENT" ${apiRole==="AGENT"?"selected":""}>Agent</option>
          <option value="SUPERVISEUR" ${apiRole==="SUPERVISEUR"?"selected":""}>Superviseur</option>
          <option value="CONSULTANT" ${apiRole==="CONSULTANT"?"selected":""}>Consultant</option>
          <option value="LECTEUR" ${apiRole==="LECTEUR"?"selected":""}>Lecteur</option>
          <option value="ADMINISTRATEUR" ${apiRole==="ADMINISTRATEUR"?"selected":""}>Administrateur</option>
        </select>
      </div>
      <div class="flex-c gap-10 mt-4">
        <button class="btn btn-primary" onclick="submitEditUser('${id}')"><i class="ti ti-check"></i>Enregistrer</button>
        <button class="btn btn-outline" onclick="closeModal()">Annuler</button>
      </div>
    </div>`, `Modifier — ${name}`);
}

async function submitEditUser(id) {
  const fullName = $("#eu-name")?.value.trim();
  const role     = $("#eu-role")?.value;
  if (!fullName) { toast("Le nom est requis.","err"); return; }
  const btn = document.querySelector("#modal-overlay .btn-primary");
  if (btn) { btn.disabled=true; btn.innerHTML=`<i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Enregistrement…`; }
  try {
    await API.admin.updateUser(id, { fullName, role });
    closeModal();
    toast("Modifications enregistrées.", "ok");
    renderAdmin("users");
  } catch(e) {
    toast(e.message || "Erreur lors de la modification.", "err");
    if (btn) { btn.disabled=false; btn.innerHTML=`<i class="ti ti-check"></i>Enregistrer`; }
  }
}

async function adminToggleUser(id, isCurrentlyActive) {
  const action = isCurrentlyActive ? "désactiver" : "réactiver";
  openModal(`
    <p style="font-size:14px;color:var(--text-sec);line-height:1.7">
      Voulez-vous vraiment <strong>${action}</strong> ce compte utilisateur ?
    </p>
    <div class="flex-c gap-10 mt-20">
      <button class="btn ${isCurrentlyActive?"btn-danger":"btn-primary"}" onclick="confirmToggleUser('${id}',${isCurrentlyActive})">
        <i class="ti ti-user-${isCurrentlyActive?"off":"check"}"></i>${isCurrentlyActive?"Désactiver":"Réactiver"}
      </button>
      <button class="btn btn-outline" onclick="closeModal()">Annuler</button>
    </div>`, isCurrentlyActive ? "Désactiver le compte" : "Réactiver le compte");
}

async function confirmToggleUser(id, isCurrentlyActive) {
  try {
    await API.admin.updateUser(id, { isActive: !isCurrentlyActive });
    closeModal();
    toast(isCurrentlyActive ? "Compte désactivé." : "Compte réactivé.", isCurrentlyActive ? "err" : "ok");
    renderAdmin("users");
  } catch(e) {
    toast(e.message || "Erreur.", "err");
  }
}

// ACTIONS DOCS
async function approveDoc(id, title) {
  const row = $(`#admin-row-${id}`);
  if (row) row.style.opacity = "0.5";
  try {
    await API.documents.approve(id);
    const st = $(`#status-${id}`);
    if (st) st.innerHTML = statusHtml("published");
    toast(`"${title}…" publié avec succès !`, "ok");
    setTimeout(() => renderAdmin("docs"), 1000);
  } catch(e) {
    if (row) row.style.opacity = "1";
    toast(e.message || "Erreur lors de l'approbation.", "err");
  }
}

async function rejectDoc(id) {
  try {
    await API.documents.reject(id);
    const st = $(`#status-${id}`);
    if (st) st.innerHTML = statusHtml("deleted");
    toast("Document rejeté.", "err");
    setTimeout(() => renderAdmin("docs"), 800);
  } catch(e) {
    toast(e.message || "Erreur lors du rejet.", "err");
  }
}

function adminDelDoc(id, title) {
  openModal(`
    <p style="font-size:14px;color:var(--text-sec);line-height:1.7">
      Supprimer <strong>"${title}…"</strong> ? Cette action est irréversible.
    </p>
    <div class="flex-c gap-10 mt-20">
      <button class="btn btn-danger" onclick="confirmAdminDel('${id}')"><i class="ti ti-trash"></i>Supprimer</button>
      <button class="btn btn-outline" onclick="closeModal()">Annuler</button>
    </div>`, "Supprimer ce document ?");
}

async function confirmAdminDel(id) {
  try {
    await API.documents.delete(id);
    toast("Document supprimé.", "err");
    closeModal();
    renderAdmin("docs");
  } catch(e) {
    toast(e.message || "Erreur lors de la suppression.", "err");
  }
}

function delDocMember(id) {
  adminDelDoc(id, "ce document");
}

let _adminDocSearchTimer;
function adminDocsSearch(q) {
  clearTimeout(_adminDocSearchTimer);
  _adminDocSearchTimer = setTimeout(() => {
    APP._docsFilter = { ...(APP._docsFilter||{}), q, page: 1 };
    renderAdmin("docs");
  }, 400);
}

function adminDocsStatusFilter(status) {
  APP._docsFilter = { ...(APP._docsFilter||{}), status, page: 1 };
  renderAdmin("docs");
}

function adminDocsPage(page) {
  APP._docsFilter = { ...(APP._docsFilter||{}), page };
  renderAdmin("docs");
}

function adminFilter(q) {
  $$(`#admin-docs-body tr`).forEach(row=>{
    row.style.display = row.textContent.toLowerCase().includes(q.toLowerCase()) ? "" : "none";
  });
}

// ACTIONS COMMUNES
async function memberDownloadDoc(id) {
  try {
    toast("Préparation du téléchargement…", "info");
    const result = await API.documents.download(id);
    if (result?.url) {
      const a = document.createElement("a");
      a.href = result.url;
      a.download = result.fileName || "document";
      a.target = "_blank";
      a.click();
      toast("Téléchargement lancé.", "ok");
    }
  } catch(e) {
    toast(e.message || "Erreur lors du téléchargement.", "err");
  }
}

function dlDoc(id) {
  memberDownloadDoc(id);
}
function shareDoc(id, network, title) {
  const docUrl = `https://archive.espoiretvie.td?doc=${id}`;
  const msg = `Consultez ce document sur AEV Archives${title ? " : " + title : ""}\n${docUrl}`;
  switch(network) {
    case "facebook":
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(docUrl)}`, "_blank", "width=600,height=400,noopener");
      break;
    case "whatsapp":
      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
      break;
    case "email":
      window.location.href = `mailto:?subject=${encodeURIComponent("Document AEV" + (title ? " : " + title : ""))}&body=${encodeURIComponent(msg)}`;
      break;
    default: // "link" ou fallback
      if (navigator.clipboard) {
        navigator.clipboard.writeText(docUrl)
          .then(()  => toast("Lien copié !", "ok"))
          .catch(() => _fallbackCopy(docUrl));
      } else {
        _fallbackCopy(docUrl);
      }
  }
}

async function openDocFullscreen(id) {
  const modal    = document.getElementById("modal-preview");
  const iframe   = document.getElementById("preview-iframe");
  const loading  = document.getElementById("preview-loading");
  const noPreview= document.getElementById("preview-no-preview");
  const titleEl  = document.getElementById("preview-title");
  const metaEl   = document.getElementById("preview-meta");
  const iconEl   = document.getElementById("preview-icon");
  const dlBtn    = document.getElementById("preview-dl-btn");
  const dlBtn2   = document.getElementById("preview-dl-btn2");

  // Réinitialiser l'état
  modal.style.display = "flex";
  iframe.style.display = "none";
  iframe.src = "";
  noPreview.style.display = "none";
  loading.style.display = "flex";
  titleEl.textContent = "Chargement…";
  metaEl.textContent = "";

  // Fermer avec Escape
  document.onkeydown = (e) => { if (e.key === "Escape") closeDocFullscreen(); };

  try {
    const result = await API.documents.download(id);
    if (!result?.url) throw new Error("URL indisponible");

    const mime = result.mimeType || "";
    const name = result.fileName || "document";
    const fmt  = mime.includes("pdf") ? "PDF" : mime.includes("word") ? "Word" : mime.includes("excel") || mime.includes("spreadsheet") ? "Excel" : "Fichier";
    const fmtIcon = { PDF:"ti-file-type-pdf", Word:"ti-file-type-doc", Excel:"ti-file-spreadsheet" }[fmt] || "ti-file";
    const fmtColor = { PDF:"#e53e3e", Word:"#2563eb", Excel:"#16a34a" }[fmt] || "#7c91f9";

    titleEl.textContent = name.replace(/\.[^.]+$/, "");
    metaEl.textContent  = `${fmt} · Aperçu en lecture seule`;
    iconEl.innerHTML    = `<i class="ti ${fmtIcon}" style="color:${fmtColor}"></i>`;

    // Action télécharger
    const doDownload = () => {
      const a = document.createElement("a");
      a.href = result.url; a.download = name; a.target = "_blank"; a.click();
    };
    dlBtn.onclick  = doDownload;
    if (dlBtn2) dlBtn2.onclick = doDownload;

    loading.style.display = "none";

    if (mime.includes("pdf")) {
      // PDF : affiché inline dans l'iframe
      iframe.src = result.url;
      iframe.style.display = "block";
      iframe.onload = () => { loading.style.display = "none"; };
      iframe.onerror = () => { iframe.style.display = "none"; noPreview.style.display = "flex"; };
    } else {
      // Word, Excel, etc. : pas d'aperçu inline possible
      noPreview.style.display = "flex";
    }
  } catch(e) {
    loading.style.display = "none";
    noPreview.style.display = "flex";
  }
}

function closeDocFullscreen() {
  const modal  = document.getElementById("modal-preview");
  const iframe = document.getElementById("preview-iframe");
  modal.style.display = "none";
  iframe.src = "";
  document.onkeydown = null;
}
function _fallbackCopy(text) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.cssText = "position:fixed;left:-9999px;top:-9999px;opacity:0";
  document.body.appendChild(ta);
  ta.focus(); ta.select();
  try {
    document.execCommand("copy");
    toast("Lien copié dans le presse-papiers !", "info");
  } catch(e) {
    toast("Lien : " + text, "info");
  }
  document.body.removeChild(ta);
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

//  INIT
document.addEventListener("DOMContentLoaded", async () => {
  // Charger les catégories réelles depuis l'API
  const apiCats = await API.categories.list();
  if (apiCats.length) DB.cats = apiCats;

  // Restaurer la session via le cookie httpOnly (refresh silencieux au démarrage)
  await silentRefresh();
  const me = await API.auth.me();
  if (me) {
    APP.user = mapUser(me);
    updateNavbarUser();
  }

  // Initialiser Google Sign-In
  if (window.google) initGoogleSignIn();
  else window.addEventListener("load", initGoogleSignIn, { once: true });

  // Ouvrir directement un document via ?doc=UUID (lien partagé)
  const docParam = urlParams.get("doc");
  if (docParam) {
    window.history.replaceState({}, "", window.location.pathname);
    navigate("doc", { id: docParam });
  }

  // Détecter un token de vérification email (?verify=TOKEN)
  const urlParams = new URLSearchParams(window.location.search);
  const verifyToken = urlParams.get("verify");
  if (verifyToken) {
    window.history.replaceState({}, "", window.location.pathname);
    try {
      await API.auth.verifyEmail(verifyToken);
      if (APP.user) APP.user.emailVerified = true;
      toast("Email vérifié avec succès ! Bienvenue.", "ok");
    } catch(e) {
      toast(e.message || "Lien de vérification invalide ou expiré.", "err");
    }
  }

  // Détecter un token de réinitialisation dans l'URL (?reset=TOKEN)
  const resetToken = urlParams.get("reset");
  if (resetToken) {
    document.getElementById("reset-token").value = resetToken;
    document.getElementById("modal-reset-password").style.display = "flex";
    window.history.replaceState({}, "", window.location.pathname);
  }

  renderHome();
  navigate("home");
});
