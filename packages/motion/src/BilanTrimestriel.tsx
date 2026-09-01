import React from 'react';
import { AbsoluteFill } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { slide } from '@remotion/transitions/slide';
import { fade } from '@remotion/transitions/fade';
import { theme } from './theme';
import { Intro } from './scenes/Intro';
import { KeyFigure } from './scenes/KeyFigure';
import { Evolution } from './scenes/Evolution';
import { Categories } from './scenes/Categories';
import { Outro } from './scenes/Outro';
import { sampleStats, type PublicStats } from './data';

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

const TRANSITION = theme.timing.transitionFrames;
const TRANSITION_COUNT = 4;

/** Les transitions se chevauchent : la durée totale retranche chaque recouvrement. */
export const TOTAL_FRAMES =
  Object.values(SCENE_FRAMES).reduce((a, b) => a + b, 0) - TRANSITION * TRANSITION_COUNT;

// Type (et non interface) : Remotion contraint les props à `Record<string, unknown>`,
// ce qu'une interface ne satisfait pas faute de signature d'index implicite.
export type BilanProps = {
  stats: PublicStats;
  portalUrl: string;
};

export const bilanDefaultProps: BilanProps = {
  stats: sampleStats,
  portalUrl: 'archives.espoiretvie.org',
};

export const BilanTrimestriel: React.FC<BilanProps> = ({ stats, portalUrl }) => (
  <AbsoluteFill style={{ backgroundColor: theme.colors.bg }}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES.intro}>
        <Intro periodLabel={stats.period.label} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION })}
      />

      <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES.keyFigure}>
        <KeyFigure stats={stats} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: 'from-right' })}
        timing={linearTiming({ durationInFrames: TRANSITION })}
      />

      <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES.evolution}>
        <Evolution stats={stats} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: 'from-right' })}
        timing={linearTiming({ durationInFrames: TRANSITION })}
      />

      <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES.categories}>
        <Categories stats={stats} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION })}
      />

      <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES.outro}>
        <Outro stats={stats} portalUrl={portalUrl} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
