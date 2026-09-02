// Découpage temporel du bilan. Extrait du montage pour que la bande son et les
// scènes lisent les mêmes valeurs : changer une durée ici déplace l'image ET le son.
import { theme } from './theme';

export const FPS = 30;

const s = theme.timing.sceneSeconds;
const f = (seconds: number) => Math.round(seconds * FPS);

export const SCENE_FRAMES = {
  intro: f(s.intro),
  keyFigure: f(s.keyFigure),
  evolution: f(s.evolution),
  categories: f(s.categories),
  outro: f(s.outro),
};

export const TRANSITION = theme.timing.transitionFrames;

const ORDER = ['intro', 'keyFigure', 'evolution', 'categories', 'outro'] as const;

/**
 * Frame de départ de chaque scène. `TransitionSeries` fait chevaucher les
 * transitions : chaque scène démarre `TRANSITION` frames avant la fin de la précédente.
 */
export const SCENE_AT = ORDER.reduce(
  (acc, name, i) => {
    if (i === 0) return { ...acc, [name]: 0 };
    const prev = ORDER[i - 1];
    return { ...acc, [name]: acc[prev] + SCENE_FRAMES[prev] - TRANSITION };
  },
  {} as Record<(typeof ORDER)[number], number>,
);

/** Milieu de chaque transition : le point que l'œil perçoit comme « la coupe ». */
export const CUTS = ORDER.slice(1).map((name) => SCENE_AT[name] + TRANSITION / 2);

export const TOTAL_FRAMES = SCENE_AT.outro + SCENE_FRAMES.outro;
