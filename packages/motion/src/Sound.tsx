import React from 'react';
import { Audio, Sequence, interpolate, staticFile } from 'remotion';
import { CUTS, SCENE_AT, TOTAL_FRAMES } from './timeline';

/**
 * Feuille de conduite audio.
 *
 * Règle appliquée partout : l'effet démarre 2 à 3 frames AVANT que l'élément
 * n'atterrisse. En avance, l'oreille entend « synchrone » ; en retard, elle
 * entend « cassé ».
 *
 * Les frames sont dérivées de `timeline.ts`, comme les scènes elles-mêmes :
 * changer une durée de scène déplace le montage ET les effets ensemble.
 */
type Cue = { at: number; sfx: string; volume: number };

const LEAD = 3;

/** Effet calé sur un élément qui atterrit à la frame `landing`. */
const before = (landing: number, sfx: string, volume: number): Cue => ({
  at: Math.max(0, landing - LEAD),
  sfx,
  volume,
});

const cues: Cue[] = [
  // ── Ouverture ───────────────────────────────────────────────────────────
  { at: SCENE_AT.intro, sfx: 'shimmer', volume: 0.5 },
  before(SCENE_AT.intro + 16, 'pop', 0.5),
  before(SCENE_AT.intro + 34, 'tick', 0.35),

  // ── Chiffre-clé ─────────────────────────────────────────────────────────
  before(SCENE_AT.keyFigure + 14, 'pop', 0.45),
  before(SCENE_AT.keyFigure + 46, 'pop', 0.3),
  before(SCENE_AT.keyFigure + 51, 'pop', 0.3),
  before(SCENE_AT.keyFigure + 56, 'pop', 0.3),

  // ── Rythme de versement : un tic une barre sur deux, sinon c'est une mitraillette
  ...[0, 2, 4, 6, 8, 10].map((i) => before(SCENE_AT.evolution + 4 + i * 4, 'tick', 0.3)),
  before(SCENE_AT.evolution + 4 + 11 * 4, 'pop', 0.35),

  // ── Répartition par fonds ───────────────────────────────────────────────
  ...[0, 1, 2, 3, 4, 5].map((i) => before(SCENE_AT.categories + 24 + i * 5, 'pop', 0.28)),

  // ── Final ───────────────────────────────────────────────────────────────
  { at: CUTS[3] - 46, sfx: 'riser', volume: 0.4 },
  before(SCENE_AT.outro + 18, 'shimmer', 0.35),
  before(SCENE_AT.outro + 42, 'pop', 0.4),
  before(SCENE_AT.outro + 48, 'whoosh-soft', 0.35),
  before(SCENE_AT.outro + 64, 'tick', 0.2),

  // ── Coupes : souffle qui amène, impact sur la coupe elle-même ───────────
  ...CUTS.flatMap((cut, i): Cue[] => [
    { at: cut - 6, sfx: 'whoosh', volume: 0.5 },
    { at: cut, sfx: 'impact', volume: i === CUTS.length - 1 ? 0.6 : 0.45 },
  ]),
];

const BED_VOLUME = 0.28;

export const Sound: React.FC = () => (
  <>
    <Audio
      src={staticFile('sfx/bed.wav')}
      volume={(f) =>
        interpolate(
          f,
          [0, 10, TOTAL_FRAMES - 26, TOTAL_FRAMES - 1],
          [0, BED_VOLUME, BED_VOLUME, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        )
      }
    />

    {cues.map((cue, i) => (
      <Sequence key={`${cue.sfx}-${cue.at}-${i}`} from={cue.at} name={`sfx ${cue.sfx}`}>
        <Audio src={staticFile(`sfx/${cue.sfx}.wav`)} volume={cue.volume} />
      </Sequence>
    ))}
  </>
);
