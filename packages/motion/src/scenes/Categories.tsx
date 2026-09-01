import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../theme';
import { displayFont, bodyFont } from '../fonts';
import { Scene } from '../components/Layers';
import { Counter, Entrance, Underline } from '../components/Motion';
import type { PublicStats } from '../data';

const MAX_ROWS = 6;

/** Répartition par fonds. Barres décalées de 5 frames, le fonds dominant seul en couleur héros. */
export const Categories: React.FC<{ stats: PublicStats }> = ({ stats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rows = stats.byCategory.slice(0, MAX_ROWS);
  const max = Math.max(...rows.map((r) => r.count), 1);

  return (
    <Scene>
      <AbsoluteFill style={{ padding: '110px 140px', flexDirection: 'column' }}>
        <Entrance delay={2} preset="snappy" distance={24}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div
              style={{
                fontFamily: displayFont,
                fontSize: 72,
                fontWeight: 700,
                color: theme.colors.text,
                letterSpacing: '-0.03em',
              }}
            >
              Ce que contient l’archive
            </div>
            <Underline delay={14} width={200} />
          </div>
        </Entrance>

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 26,
            marginTop: 34,
          }}
        >
          {rows.map((row, i) => {
            const p = spring({ frame: frame - 24 - i * 5, fps, config: theme.spring.smooth });
            const isLead = i === 0;

            return (
              <div
                key={row.slug}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 32,
                  opacity: p,
                  transform: `translateX(${interpolate(p, [0, 1], [-38, 0])}px)`,
                }}
              >
                <div
                  style={{
                    width: 460,
                    fontFamily: bodyFont,
                    fontSize: 30,
                    fontWeight: isLead ? 600 : 500,
                    color: isLead ? theme.colors.text : theme.colors.textDim,
                    textAlign: 'right',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {row.name}
                </div>

                <div
                  style={{
                    flex: 1,
                    height: 44,
                    borderRadius: 22,
                    background: 'rgba(168,220,240,0.10)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${interpolate(p, [0, 1], [0, (row.count / max) * 100])}%`,
                      height: '100%',
                      borderRadius: 22,
                      background: isLead
                        ? `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.primary}aa)`
                        : `linear-gradient(90deg, ${theme.colors.bgAlt}, ${theme.colors.primary}55)`,
                      boxShadow: isLead ? `0 0 48px ${theme.colors.glow}` : undefined,
                    }}
                  />
                </div>

                <Counter
                  target={row.count}
                  delay={26 + i * 5}
                  style={{
                    width: 150,
                    fontFamily: displayFont,
                    fontSize: 40,
                    fontWeight: 700,
                    color: isLead ? theme.colors.primary : theme.colors.text,
                  }}
                />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </Scene>
  );
};
