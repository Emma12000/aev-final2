import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../theme';
import { displayFont, bodyFont } from '../fonts';
import { Scene } from '../components/Layers';
import { Counter, Entrance, Underline } from '../components/Motion';
import { useLayout } from '../layout';
import type { PublicStats } from '../data';

const MAX_ROWS = 6;

/**
 * Répartition par fonds. Barres décalées de 5 frames, le fonds dominant seul en
 * couleur héros.
 *
 * En 16:9 chaque ligne est un tryptique intitulé | barre | total. En 9:16 la
 * largeur ne le permet pas : l'intitulé et le total passent au-dessus de la
 * barre, sur une même ligne.
 */
export const Categories: React.FC<{ stats: PublicStats }> = ({ stats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = useLayout();

  const rows = stats.byCategory.slice(0, MAX_ROWS);
  const max = Math.max(...rows.map((r) => r.count), 1);

  return (
    <Scene>
      <AbsoluteFill
        style={{ padding: `${L.padY}px ${L.padX}px`, flexDirection: 'column' }}
      >
        <Entrance delay={2} preset="snappy" distance={24}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div
              style={{
                fontFamily: displayFont,
                fontSize: L.display,
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
            gap: L.portrait ? 34 : 26,
            marginTop: 34,
          }}
        >
          {rows.map((row, i) => {
            const p = spring({ frame: frame - 24 - i * 5, fps, config: theme.spring.smooth });
            const isLead = i === 0;

            const label = (
              <div
                style={{
                  width: L.portrait ? undefined : L.rowLabelWidth,
                  flex: L.portrait ? 1 : undefined,
                  fontFamily: bodyFont,
                  fontSize: L.rowLabel,
                  fontWeight: isLead ? 600 : 500,
                  color: isLead ? theme.colors.text : theme.colors.textDim,
                  textAlign: L.portrait ? 'left' : 'right',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {row.name}
              </div>
            );

            const count = (
              <Counter
                target={row.count}
                delay={26 + i * 5}
                style={{
                  width: L.portrait ? undefined : 150,
                  textAlign: L.portrait ? 'right' : 'left',
                  fontFamily: displayFont,
                  fontSize: L.rowCount,
                  fontWeight: 700,
                  color: isLead ? theme.colors.primary : theme.colors.text,
                }}
              />
            );

            const bar = (
              <div
                style={{
                  flex: L.portrait ? undefined : 1,
                  width: L.portrait ? '100%' : undefined,
                  height: L.barHeight,
                  borderRadius: L.barHeight / 2,
                  background: 'rgba(168,220,240,0.10)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${interpolate(p, [0, 1], [0, (row.count / max) * 100])}%`,
                    height: '100%',
                    borderRadius: L.barHeight / 2,
                    background: isLead
                      ? `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.primary}aa)`
                      : `linear-gradient(90deg, ${theme.colors.bgAlt}, ${theme.colors.primary}55)`,
                    boxShadow: isLead ? `0 0 48px ${theme.colors.glow}` : undefined,
                  }}
                />
              </div>
            );

            return (
              <div
                key={row.slug}
                style={{
                  display: 'flex',
                  flexDirection: L.portrait ? 'column' : 'row',
                  alignItems: L.portrait ? 'stretch' : 'center',
                  gap: L.portrait ? 12 : 32,
                  opacity: p,
                  transform: `translateX(${interpolate(p, [0, 1], [-38, 0])}px)`,
                }}
              >
                {L.portrait ? (
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
                    {label}
                    {count}
                  </div>
                ) : (
                  label
                )}
                {bar}
                {L.portrait ? null : count}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </Scene>
  );
};
