import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { theme } from '../theme';

/** Couche 1 — jamais de fond plat. Deux masses lumineuses qui dérivent lentement. */
export const BgMesh: React.FC = () => {
  const frame = useCurrentFrame();
  const d1 = Math.sin(frame / 55) * 50;
  const d2 = Math.cos(frame / 70) * 40;

  return (
    <AbsoluteFill style={{ background: theme.colors.bg, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          width: 1500,
          height: 1500,
          borderRadius: '50%',
          top: -560,
          left: -320 + d1,
          filter: 'blur(60px)',
          background: `radial-gradient(circle, ${theme.colors.primary}38, transparent 62%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 1100,
          height: 1100,
          borderRadius: '50%',
          bottom: -480,
          right: -280 - d2,
          filter: 'blur(80px)',
          background: `radial-gradient(circle, ${theme.colors.bgAlt}88, transparent 65%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/** Trame institutionnelle discrète — rappelle la grille documentaire de la plateforme. */
export const Grid: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 300], [0, -40], { easing: theme.ease.inOut });

  return (
    <AbsoluteFill
      style={{
        opacity: 0.5,
        backgroundImage: `linear-gradient(${theme.colors.grid} 1px, transparent 1px),
                          linear-gradient(90deg, ${theme.colors.grid} 1px, transparent 1px)`,
        backgroundSize: '96px 96px',
        backgroundPosition: `${drift}px ${drift}px`,
        maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 72%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 72%)',
      }}
    />
  );
};

/** Couche 4 — unifie le rendu de toutes les scènes en un seul étalonnage. */
export const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: 'none' }}>
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.primary,
        mixBlendMode: 'soft-light',
        opacity: 0.2,
      }}
    />
    <AbsoluteFill
      style={{
        background:
          'linear-gradient(180deg, rgba(0,0,0,0.14), transparent 28%, transparent 70%, rgba(0,0,0,0.26))',
      }}
    />
  </AbsoluteFill>
);

/** Couche 5a — grain procédural animé, aucun fichier asset. */
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        backgroundImage: noise,
        backgroundSize: '220px',
        backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`,
        opacity: 0.045,
        mixBlendMode: 'overlay',
      }}
    />
  );
};

/** Couche 5b — vignette, toujours au sommet de la pile. */
export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background: 'radial-gradient(ellipse at center, transparent 54%, rgba(0,0,0,0.34) 100%)',
    }}
  />
);

/**
 * Enveloppe de scène : impose la pile à 5 couches et la sortie animée
 * (plus rapide que l'entrée) sur tout le contenu.
 */
export const Scene: React.FC<{ children: React.ReactNode; grid?: boolean }> = ({
  children,
  grid = true,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const exitRange: [number, number] = [durationInFrames - 12, durationInFrames - 2];

  const exitY = interpolate(frame, exitRange, [0, -34], {
    easing: theme.ease.in,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitOpacity = interpolate(frame, exitRange, [1, 0], {
    easing: theme.ease.in,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <BgMesh />
      {grid ? <Grid /> : null}
      <AbsoluteFill style={{ opacity: exitOpacity, transform: `translateY(${exitY}px)` }}>
        {children}
      </AbsoluteFill>
      <Grade />
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};
