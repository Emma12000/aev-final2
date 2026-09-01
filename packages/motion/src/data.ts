// Contrat de données entre l'API AEV (GET /api/v1/public-stats) et le moteur vidéo.
// Aucun chiffre affiché à l'écran n'est saisi à la main : tout provient d'ici.

export interface PublicStats {
  period: { label: string; from: string; to: string };
  totals: {
    documents: number;
    documentsInPeriod: number;
    documentsPreviousPeriod: number;
    growthPercent: number | null;
    pages: number;
    categories: number;
    megabytes: number;
  };
  byCategory: { name: string; slug: string; icon: string | null; count: number }[];
  monthly: { month: string; count: number }[];
  topTags: { tag: string; count: number }[];
  generatedAt: string;
}

/**
 * Jeu de démonstration. Sert UNIQUEMENT au Studio et aux rendus hors ligne.
 * Un rendu de production sans API joignable doit échouer bruyamment plutôt que
 * publier ces chiffres : c'est le rôle de `--strict` dans scripts/render.mjs.
 */
export const sampleStats: PublicStats = {
  period: { label: '2026-Q1', from: '2026-01-01T00:00:00.000Z', to: '2026-04-01T00:00:00.000Z' },
  totals: {
    documents: 1284,
    documentsInPeriod: 217,
    documentsPreviousPeriod: 164,
    growthPercent: 32.3,
    pages: 9460,
    categories: 6,
    megabytes: 3820,
  },
  byCategory: [
    { name: 'Rapports d’activité', slug: 'rapports', icon: null, count: 412 },
    { name: 'Projets terrain', slug: 'projets', icon: null, count: 336 },
    { name: 'Santé communautaire', slug: 'sante', icon: null, count: 228 },
    { name: 'Formations', slug: 'formations', icon: null, count: 154 },
    { name: 'Partenariats', slug: 'partenariats', icon: null, count: 98 },
    { name: 'Gouvernance', slug: 'gouvernance', icon: null, count: 56 },
  ],
  monthly: [
    { month: '2025-04', count: 38 },
    { month: '2025-05', count: 44 },
    { month: '2025-06', count: 51 },
    { month: '2025-07', count: 29 },
    { month: '2025-08', count: 47 },
    { month: '2025-09', count: 62 },
    { month: '2025-10', count: 58 },
    { month: '2025-11', count: 71 },
    { month: '2025-12', count: 49 },
    { month: '2026-01', count: 66 },
    { month: '2026-02', count: 74 },
    { month: '2026-03', count: 77 },
  ],
  topTags: [
    { tag: 'N’Djamena', count: 184 },
    { tag: 'Nutrition', count: 152 },
    { tag: 'Jeunesse', count: 131 },
    { tag: 'Eau & assainissement', count: 119 },
    { tag: 'Plaidoyer', count: 87 },
  ],
  generatedAt: '2026-04-01T08:00:00.000Z',
};

/** Récupère les agrégats publics. Enveloppe `{ data, timestamp }` du TransformInterceptor. */
export const fetchStats = async (apiUrl: string, period?: string): Promise<PublicStats> => {
  const url = new URL(`${apiUrl.replace(/\/$/, '')}/public-stats`);
  if (period) url.searchParams.set('period', period);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`GET ${url.pathname} a répondu ${res.status} ${res.statusText}`);
  }

  const body = (await res.json()) as { data?: PublicStats } | PublicStats;
  return 'data' in body && body.data ? body.data : (body as PublicStats);
};

/** Libellé lisible : « 1er trimestre 2026 » / « Année 2025 ». */
export const formatPeriod = (label: string): string => {
  const [year, quarter] = label.split('-Q');
  if (!quarter) return `Année ${year}`;
  const ordinal = quarter === '1' ? '1er' : `${quarter}e`;
  return `${ordinal} trimestre ${year}`;
};

const MONTHS = ['jan', 'fév', 'mar', 'avr', 'mai', 'juin', 'juil', 'août', 'sep', 'oct', 'nov', 'déc'];

export const formatMonth = (iso: string): string => MONTHS[Number(iso.slice(5, 7)) - 1] ?? '';
