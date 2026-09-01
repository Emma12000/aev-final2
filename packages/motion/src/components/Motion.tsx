import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../theme';

type SpringPreset = keyof typeof theme.spring;

/** L'entrée de référence : opacité + translation + échelle. Un fondu seul est interdit. */
export const Entrance: React.FC<{
  delay?: number;
  preset?: SpringPreset;
  distance?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ delay = 0, preset = 'smooth', distance = 40, style, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: theme.spring[preset] });

  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [distance, 0])}px) scale(${interpolate(
          p,
          [0, 1],
          [0.94, 1],
        )})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Révélation mot à mot. Décalage de 3 frames — rien n'entre simultanément. */
export const WordReveal: React.FC<{
  text: string;
  delay?: number;
  per?: number;
  highlight?: string;
  style?: React.CSSProperties;
}> = ({ text, delay = 0, per = 3, highlight, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.26em', ...style }}>
      {text.split(' ').map((word, i) => {
        const p = spring({ frame: frame - delay - i * per, fps, config: theme.spring.snappy });
        const isHighlight = highlight !== undefined && word.includes(highlight);

        return (
          <span
            key={`${word}-${i}`}
            style={{
              display: 'inline-block',
              opacity: p,
              transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px)`,
              color: isHighlight ? theme.colors.primary : undefined,
              textShadow: isHighlight ? `0 0 46px ${theme.colors.glow}` : undefined,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

/** Compteur animé. `tabular-nums` évite le tremblement de la mise en page. */
/**
 * Le séparateur de milliers du français est U+202F (espace fine insécable),
 * absent du sous-ensemble latin des .woff2 : il s'affiche en glyphe manquant,
 * donc en « 1284 ». On le remplace par une espace ordinaire, toujours présente.
 */
const frenchSpaces = (value: string) => value.replace(/[\u202F\u00A0\u2009]/g, ' ');

export const Counter: React.FC<{
  target: number;
  delay?: number;
  decimals?: number;
  suffix?: string;
  style?: React.CSSProperties;
}> = ({ target, delay = 0, decimals = 0, suffix = '', style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 30, stiffness: 60, mass: 1 } });
  const value = interpolate(p, [0, 1], [0, target]);

  return (
    <span style={{ ...theme.numerals, ...style }}>
      {frenchSpaces(
        value.toLocaleString('fr-FR', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }),
      )}
      {suffix}
    </span>
  );
};

/** Respiration des éléments présents plus de 2 s à l'écran. */
export const useBreathe = (speed = 22, amount = 0.015) => {
  const frame = useCurrentFrame();
  return 1 + Math.sin(frame / speed) * amount;
};

export const useFloat = (speed = 30, amplitude = 3) => {
  const frame = useCurrentFrame();
  return Math.sin(frame / speed) * amplitude;
};

/** Filet d'accent sous un titre : balaye de gauche à droite après l'atterrissage du texte. */
export const Underline: React.FC<{ delay?: number; width: number; color?: string }> = ({
  delay = 0,
  width,
  color = theme.colors.accent,
}) => {
  const frame = useCurrentFrame();
  const scaleX = interpolate(frame, [delay, delay + 18], [0, 1], {
    easing: theme.ease.out,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width,
        height: 5,
        borderRadius: 5,
        background: color,
        transform: `scaleX(${scaleX})`,
        transformOrigin: '0% 50%',
      }}
    />
  );
};
