import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../theme';
import { displayFont, bodyFont } from '../fonts';
import { Scene } from '../components/Layers';
import { Logo } from '../components/Logo';
import { Entrance, Underline, useBreathe } from '../components/Motion';
import { formatPeriod } from '../data';

/** Sting d'ouverture : marque (0–0.8 s) → nom (0.6–1.8 s) → période (1.3 s) → respiration → sortie. */
export const Intro: React.FC<{ periodLabel: string }> = ({ periodLabel }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const breathe = useBreathe(26, 0.012);

  const logoIn = spring({ frame, fps, config: theme.spring.bouncy });
  const halo = interpolate(frame, [0, 30], [0, 1], {
    easing: theme.ease.out,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <Scene>
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 34,
        }}
      >
        <div
          style={{
            position: 'relative',
            transform: `scale(${interpolate(logoIn, [0, 1], [0.7, 1]) * breathe}) rotate(${interpolate(
              logoIn,
              [0, 1],
              [-8, 0],
            )}deg)`,
            opacity: logoIn,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: -70,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${theme.colors.glow}, transparent 68%)`,
              opacity: halo * 0.9,
              filter: 'blur(18px)',
            }}
          />
          <Logo size={300} style={{ position: 'relative' }} />
        </div>

        <Entrance delay={16} preset="smooth" distance={28}>
          <div
            style={{
              fontFamily: displayFont,
              fontSize: 92,
              fontWeight: 700,
              color: theme.colors.text,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              textAlign: 'center',
            }}
          >
            Association Espoir &amp; Vie
          </div>
        </Entrance>

        <Entrance delay={24} preset="snappy" distance={20}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
            <div
              style={{
                fontFamily: bodyFont,
                fontSize: 34,
                fontWeight: 500,
                color: theme.colors.textDim,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
              }}
            >
              Bilan documentaire — {formatPeriod(periodLabel)}
            </div>
            <Underline delay={34} width={260} />
          </div>
        </Entrance>
      </AbsoluteFill>
    </Scene>
  );
};
