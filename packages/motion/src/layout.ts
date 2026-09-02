// Jetons de mise en page par format. Les scènes ne connaissent pas leurs
// dimensions : elles lisent ces jetons, ce qui évite de dupliquer cinq scènes
// pour obtenir la version verticale.
//
// Zone de sécurité 9:16 : le contenu critique reste dans les 75 % centraux —
// l'interface des plateformes (Reels, Shorts, TikTok) recouvre haut et bas.
import { useVideoConfig } from 'remotion';

type Tokens = {
  padX: number;
  padY: number;
  brand: number;
  eyebrow: number;
  display: number;
  sub: number;
  body: number;
  hero: number;
  statValue: number;
  statLabel: number;
  statPad: string;
  rowLabel: number;
  rowCount: number;
  rowLabelWidth: number;
  barHeight: number;
  chartHeight: number;
  chartGap: number;
  monthLabel: number;
  logoIntro: number;
  logoOutro: number;
  growth: number;
  growthUnit: number;
  growthCaption: number;
  cta: number;
  legal: number;
  monthLabelEvery: number;
};

const LANDSCAPE: Tokens = {
  padX: 140,
  padY: 110,
  brand: 92,
  eyebrow: 32,
  display: 72,
  sub: 28,
  body: 40,
  hero: 300,
  statValue: 76,
  statLabel: 24,
  statPad: '30px 44px',
  rowLabel: 30,
  rowCount: 40,
  rowLabelWidth: 460,
  barHeight: 44,
  chartHeight: 420,
  chartGap: 26,
  monthLabel: 24,
  logoIntro: 300,
  logoOutro: 132,
  growth: 168,
  growthUnit: 84,
  growthCaption: 40,
  cta: 44,
  legal: 20,
  monthLabelEvery: 1,
};

const PORTRAIT: Tokens = {
  padX: 76,
  padY: 250,
  brand: 76,
  eyebrow: 27,
  display: 64,
  sub: 26,
  body: 36,
  hero: 250,
  statValue: 52,
  statLabel: 19,
  statPad: '22px 14px',
  rowLabel: 32,
  rowCount: 36,
  rowLabelWidth: 0, // en portrait l'intitulé passe AU-DESSUS de la barre
  barHeight: 40,
  chartHeight: 620,
  chartGap: 10,
  monthLabel: 21,
  logoIntro: 300,
  logoOutro: 148,
  growth: 190,
  growthUnit: 92,
  growthCaption: 38,
  cta: 40,
  legal: 19,
  monthLabelEvery: 2, // douze intitulés ne tiennent pas sur 1080 px
};

export const useLayout = () => {
  const { width, height } = useVideoConfig();
  const portrait = height > width;
  return { portrait, ...(portrait ? PORTRAIT : LANDSCAPE) };
};

export type Layout = ReturnType<typeof useLayout>;
