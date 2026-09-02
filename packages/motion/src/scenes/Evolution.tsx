import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../theme';
import { displayFont, bodyFont } from '../fonts';
import { Scene } from '../components/Layers';
import { Entrance, Underline } from '../components/Motion';
import { useLayout } from '../layout';
import { formatMonth, type PublicStats } from '../data';

/**
 * Douze mois de versements. La barre la plus haute porte l'accent — un seul
 * point d'emphase par image.
 *
 * En 9:16 les douze intitulés de mois ne tiennent pas sur 1080 px : on n'affiche
 * qu'un mois sur deux et on retire les valeurs sauf sur le pic. Les douze barres
 * restent affichées — réduire la série changerait ce que la vidéo raconte.
 */
export const Evolution: React.FC<{ stats: PublicStats }> = ({ stats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = useLayout();

  const max = Math.max(...stats.monthly.map((m) => m.count), 1);
  const peakIndex = stats.monthly.reduce(
    (best, m, i) => (m.count > stats.monthly[best].count ? i : best),
    0,
  );

  const baseline = interpolate(frame, [4, 24], [0, 1], {
    easing: theme.ease.out,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <Scene>
      <AbsoluteFill
        style={{ padding: `${L.padY}px ${L.padX}px`, flexDirection: 'column', gap: 20 }}
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
              Rythme de versement
            </div>
            <Underline delay={14} width={200} />
            <div
              style={{
                fontFamily: bodyFont,
                fontSize: L.sub,
                fontWeight: 400,
                color: theme.colors.textDim,
              }}
            >
              Documents publics déposés sur les 12 derniers mois
            </div>
          </div>
        </Entrance>

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-end',
            gap: L.chartGap,
            marginTop: 40,
            borderBottom: `2px solid ${theme.colors.grid}`,
            paddingBottom: 18,
            transform: `scaleX(${interpolate(baseline, [0, 1], [0.98, 1])})`,
          }}
        >
          {stats.monthly.map((month, i) => {
            const p = spring({ frame: frame - 4 - i * 4, fps, config: theme.spring.smooth });
            const isPeak = i === peakIndex;
            const height = interpolate(p, [0, 1], [0, (month.count / max) * L.chartHeight]);
            const showValue = !L.portrait || isPeak;
            const showMonth = !L.portrait || i % L.monthLabelEvery === 0 || isPeak;

            return (
              <div
                key={month.month}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                <span
                  style={{
                    fontFamily: bodyFont,
                    fontSize: L.monthLabel + 2,
                    fontWeight: 600,
                    color: isPeak ? theme.colors.text : theme.colors.textDim,
                    opacity: showValue ? p : 0,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {month.count}
                </span>
                <div
                  style={{
                    width: '100%',
                    height,
                    borderRadius: L.portrait ? '8px 8px 3px 3px' : '12px 12px 4px 4px',
                    background: isPeak
                      ? `linear-gradient(180deg, ${theme.colors.accent}, ${theme.colors.accent}99)`
                      : `linear-gradient(180deg, ${theme.colors.primary}, ${theme.colors.primary}55)`,
                    boxShadow: isPeak ? `0 0 54px ${theme.colors.accent}55` : undefined,
                  }}
                />
                <span
                  style={{
                    fontFamily: bodyFont,
                    fontSize: L.monthLabel,
                    fontWeight: 500,
                    color: theme.colors.textDim,
                    opacity: showMonth ? p : 0,
                  }}
                >
                  {formatMonth(month.month)}
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </Scene>
  );
};
