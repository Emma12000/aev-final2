"use strict";

const API_BASE = "https://aevbackend-production.up.railway.app/api/v1";

// Stockage des tokens JWT
const TokenStore = {
  get() {
    return {
      access:  localStorage.getItem("aev_access")  || "",
      refresh: localStorage.getItem("aev_refresh") || "",
    };
  },
  set(access, refresh) {
    if (access)  localStorage.setItem("aev_access",  access);
    if (refresh) localStorage.setItem("aev_refresh", refresh);
  },
  clear() {
    localStorage.removeItem("aev_access");
    localStorage.removeItem("aev_refresh");
  },
};

// Fetch authentifié avec auto-refresh
async function apiFetch(path, opts = {}) {
  const tokens = TokenStore.get();
  const headers = { "Content-Type": "application/json", ...(opts.headers || {}) };
  if (tokens.access) headers["Authorization"] = `Bearer ${tokens.access}`;

  let res = await fetch(API_BASE + path, { ...opts, headers });

  if (res.status === 401 && tokens.refresh) {
    const ref = await fetch(API_BASE + "/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: tokens.refresh }),
    });
    if (ref.ok) {
      const rd = await ref.json();
      TokenStore.set(rd.data.accessToken, rd.data.refreshToken);
      headers["Authorization"] = `Bearer ${rd.data.accessToken}`;
      res = await fetch(API_BASE + path, { ...opts, headers });
    } else {
      TokenStore.clear();
      return null;
    }
  }

  if (!res.ok) {
    let msg = "Erreur serveur.";
    try { msg = (await res.json()).message || msg; } catch(_) {}
    throw new Error(msg);
  }
  return res.json();
}

// Mappers API → format app
function mapUser(u) {
  if (!u) return null;
  const parts    = (u.fullName || "").trim().split(/\s+/);
  const initials = parts.map(p => p[0] || "").join("").toUpperCase().slice(0, 2) || "??";
  const roleMap  = { ADMINISTRATEUR: "admin", SUPERVISEUR: "superviseur", AGENT: "member", LECTEUR: "lecteur", CONSULTANT: "consultant" };
  const roleLbl  = { ADMINISTRATEUR: "Administrateur", SUPERVISEUR: "Superviseur", AGENT: "Agent", LECTEUR: "Lecteur", CONSULTANT: "Consultant" };
  return {
    id:        u.id,
    name:      u.fullName,
    initials,
    role:      roleMap[u.role] || "lecteur",
    roleLabel: roleLbl[u.role] || "Lecteur",
    email:     u.email,
    docs:      0,
    status:    u.isActive !== false ? "active" : "inactive",
    joined:    u.createdAt
      ? new Date(u.createdAt).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
      : "—",
  };
}

function mapDoc(d) {
  if (!d) return null;
  const fmtMap = {
    "application/pdf":                                                          "PDF",
    "application/msword":                                                       "Word",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":  "Word",
    "application/vnd.ms-excel":                                                 "Excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":        "Excel",
    "image/jpeg": "JPG",
    "image/png":  "PNG",
  };
  const accMap = { PUBLIC: "Public", INTERNE: "Membres", CONFIDENTIEL: "Confidentiel", RESTREINT: "Restreint" };
  const stMap  = { ACTIVE: "published", ARCHIVED: "pending", DELETED: "deleted" };
  const fmt    = fmtMap[d.fileMimeType] || "PDF";
  const size   = d.fileSize
    ? (d.fileSize > 1_048_576 ? `${(d.fileSize / 1_048_576).toFixed(1)} Mo` : `${Math.round(d.fileSize / 1024)} Ko`)
    : "—";
  const date   = d.createdAt ? d.createdAt.split("T")[0] : "";
  const dateStr = date ? new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "—";
  return {
    id:      d.id,
    title:   d.title,
    type:    d.category?.name   || "Document",
    cat:     d.category?.slug   || "",
    fmt,
    size,
    pages:   d.pageCount        || "—",
    date,
    dateStr,
    author:  d.uploadedBy?.fullName || "Admin AEV",
    access:  accMap[d.confidentiality] || "Public",
    dl:      d.downloadCount    || 0,
    views:   d.viewCount        || 0,
    tags:    d.tags             || [],
    status:  stMap[d.status]    || "published",
    desc:    d.description      || "",
    fileKey: d.fileKey          || "",
  };
}

function mapCat(c) {
  const colors = {
    admin:         { color: "#6D28D9", bg: "#F3E8FF", conf: "interne" },
    finance:       { color: "#C2410C", bg: "#FFF7ED", conf: "confidentiel" },
    contrat:       { color: "#1E40AF", bg: "#EFF6FF", conf: "confidentiel" },
    courrier:      { color: "#0E7490", bg: "#ECFEFF", conf: "interne" },
    rapport:       { color: "#B91C1C", bg: "#FEF2F2", conf: "interne" },
    projet:        { color: "#166534", bg: "#F0FDF4", conf: "interne" },
    partenariat:   { color: "#0F766E", bg: "#F0FDFA", conf: "interne" },
    communication: { color: "#BE185D", bg: "#FDF2F8", conf: "public" },
    rh:            { color: "#B45309", bg: "#FFFBEB", conf: "confidentiel" },
    divers:        { color: "#475569", bg: "#F8FAFC", conf: "interne" },
  };
  const cl = colors[c.slug] || { color: "#6D28D9", bg: "#F3E8FF", conf: "interne" };
  return { id: c.slug, apiId: c.id, name: c.name, icon: c.icon, color: cl.color, bg: cl.bg, conf: cl.conf, tags: [] };
}

function mapActivity(a) {
  const actionMap = {
    LOGIN: "CONNEXION", LOGOUT: "DÉCONNEXION", LOGIN_FAILED: "ÉCHEC CONNEXION",
    UPLOAD: "DÉPÔT", DOWNLOAD: "TÉLÉCHARGEMENT", UPDATE: "MODIFICATION", VIEW: "ACCÈS",
    CREATE: "CRÉATION", USER_CREATE: "CRÉATION COMPTE", REGISTER: "INSCRIPTION",
    DELETE: "SUPPRESSION", USER_DELETE: "SUPPRESSION COMPTE",
    APPROVE: "APPROBATION", REJECT: "REJET",
    DOCUMENT_UPLOAD: "DÉPÔT", DOCUMENT_DOWNLOAD: "TÉLÉCHARGEMENT",
    DOCUMENT_VIEW: "ACCÈS", DOCUMENT_UPDATE: "MODIFICATION", DOCUMENT_DELETE: "SUPPRESSION",
    USER_UPDATE: "MODIFICATION",
  };
  const roleMap = { ADMINISTRATEUR: "ADMINISTRATEUR", AGENT: "AGENT", LECTEUR: "LECTEUR" };
  const resourceLabel = a.metadata?.title || a.metadata?.documentTitle
    || (a.resourceId && a.resourceType !== "auth" ? `${(a.resourceType||"").toLowerCase()}:${a.resourceId.slice(0,8)}` : "—");
  return {
    id:           a.id,
    date:         a.createdAt ? a.createdAt.replace("T", " ").slice(0, 16) : "",
    dateStr:      a.createdAt ? new Date(a.createdAt).toLocaleString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—",
    user:         a.user?.fullName || "Inconnu",
    role:         a.user?.role ? (roleMap[a.user.role] || a.user.role) : "—",
    action:       actionMap[a.action] || a.action,
    resource:     resourceLabel,
    resourceType: a.resourceType?.toLowerCase() || "document",
    ip:           a.ipAddress || "—",
  };
}

// API publique
const API = {
  auth: {
    async login(email, password) {
      const res = await fetch(API_BASE + "/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Identifiants incorrects.");
      TokenStore.set(data.data.accessToken, data.data.refreshToken);
      return data.data;
    },

    async register(fullName, email, password) {
      const res = await fetch(API_BASE + "/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur lors de la création du compte.");
      TokenStore.set(data.data.accessToken, data.data.refreshToken);
      return data.data;
    },

    async logout() {
      const tokens = TokenStore.get();
      if (tokens.refresh) {
        try {
          await apiFetch("/auth/logout", {
            method: "POST",
            body: JSON.stringify({ refreshToken: tokens.refresh }),
          });
        } catch (_) {}
      }
      TokenStore.clear();
    },

    async me() {
      try {
        const res = await apiFetch("/auth/me");
        return res?.data || null;
      } catch (_) {
        return null;
      }
    },
  },

  categories: {
    async list() {
      try {
        const res = await fetch(API_BASE + "/categories");
        const data = await res.json();
        return (data?.data || []).map(mapCat);
      } catch (_) {
        return [];
      }
    },
  },

  documents: {
    async list(params = {}) {
      try {
        const q    = new URLSearchParams(params).toString();
        const path = "/documents" + (q ? "?" + q : "");
        const tokens = TokenStore.get();
        let items;
        if (tokens.access) {
          // Envoi du token si connecté → le backend adapte le filtre confidentialité au rôle
          const res = await apiFetch(path);
          const d   = res?.data;
          items = d?.items || (Array.isArray(d) ? d : []);
        } else {
          const res  = await fetch(API_BASE + path);
          const data = await res.json();
          items = data?.data?.items || data?.data || [];
        }
        return items.map(mapDoc);
      } catch (_) {
        return [];
      }
    },

    async get(id) {
      try {
        const res  = await apiFetch("/documents/" + id);
        return res?.data ? mapDoc(res.data) : null;
      } catch (_) {
        return null;
      }
    },

    // Upload multipart/form-data — NE PAS mettre Content-Type (le navigateur le fait)
    async upload(formData) {
      const tokens = TokenStore.get();
      const headers = {};
      if (tokens.access) headers["Authorization"] = `Bearer ${tokens.access}`;

      let res = await fetch(API_BASE + "/documents/upload", {
        method: "POST",
        headers,
        body: formData,
      });

      // Auto-refresh si 401
      if (res.status === 401 && tokens.refresh) {
        const ref = await fetch(API_BASE + "/auth/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: tokens.refresh }),
        });
        if (ref.ok) {
          const rd = await ref.json();
          TokenStore.set(rd.data.accessToken, rd.data.refreshToken);
          headers["Authorization"] = `Bearer ${rd.data.accessToken}`;
          res = await fetch(API_BASE + "/documents/upload", { method: "POST", headers, body: formData });
        }
      }

      if (!res.ok) {
        let msg = "Erreur lors du dépôt.";
        try { msg = (await res.json()).message || msg; } catch (_) {}
        throw new Error(msg);
      }
      const data = await res.json();
      return data?.data ? mapDoc(data.data) : data;
    },

    async download(id) {
      try {
        const res = await apiFetch("/documents/" + id + "/download");
        return res?.data || null;
      } catch (e) {
        throw e;
      }
    },

    async approve(id) {
      return apiFetch("/documents/" + id + "/approve", { method: "POST" });
    },

    async reject(id) {
      return apiFetch("/documents/" + id + "/reject", { method: "POST" });
    },

    async delete(id) {
      return apiFetch("/documents/" + id, { method: "DELETE" });
    },

    async adminList(params = {}) {
      try {
        const q   = new URLSearchParams(params).toString();
        const res = await apiFetch("/documents" + (q ? "?" + q : ""));
        const data = res?.data;
        const items = data?.items || (Array.isArray(data) ? data : []);
        return { items: items.map(mapDoc), total: data?.total || items.length, pages: data?.pages || 1 };
      } catch (_) {
        return { items: [], total: 0, pages: 1 };
      }
    },
  },

  admin: {
    async stats() {
      try {
        const res = await apiFetch("/admin/stats");
        return res?.data || null;
      } catch (_) {
        return null;
      }
    },

    async users(params = {}) {
      try {
        const q   = new URLSearchParams(params).toString();
        const res = await apiFetch("/users" + (q ? "?" + q : ""));
        const items = res?.data?.items || [];
        return items.map(mapUser);
      } catch (_) {
        return [];
      }
    },

    async createUser(dto) {
      const res = await apiFetch("/users", {
        method: "POST",
        body: JSON.stringify(dto),
      });
      return res?.data ? mapUser(res.data) : null;
    },

    async updateUser(id, dto) {
      const res = await apiFetch("/users/" + id, {
        method: "PATCH",
        body: JSON.stringify(dto),
      });
      return res?.data ? mapUser(res.data) : null;
    },

    async deleteUser(id) {
      return apiFetch("/users/" + id, { method: "DELETE" });
    },
  },

  activity: {
    async me() {
      try {
        const res = await apiFetch("/activity/me");
        const items = res?.data?.items || [];
        return items.map(mapActivity);
      } catch (_) {
        return [];
      }
    },

    async all(params = {}) {
      try {
        const q   = new URLSearchParams(params).toString();
        const res = await apiFetch("/activity" + (q ? "?" + q : ""));
        const items = res?.data?.items || [];
        return items.map(mapActivity);
      } catch (_) {
        return [];
      }
    },
  },

  favorites: {
    async list() {
      try {
        const res = await apiFetch("/favorites");
        return (res?.data || []).map(f => mapDoc(f.document));
      } catch (_) {
        return [];
      }
    },

    async add(documentId) {
      return apiFetch("/favorites/" + documentId, { method: "POST" });
    },

    async remove(documentId) {
      return apiFetch("/favorites/" + documentId, { method: "DELETE" });
    },
  },
};
