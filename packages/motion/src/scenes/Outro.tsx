import React from 'react';
import { AbsoluteFill } from 'remotion';
import { theme } from '../theme';
import { displayFont, bodyFont } from '../fonts';
import { Scene } from '../components/Layers';
import { Logo } from '../components/Logo';
import { Counter, Entrance, WordReveal, useFloat } from '../components/Motion';
import { formatPeriod, type PublicStats } from '../data';

/** Le payoff : croissance du trimestre, puis une seule action, calme, avec le halo sur l'adresse. */
export const Outro: React.FC<{ stats: PublicStats; portalUrl: string }> = ({
  stats,
  portalUrl,
}) => {
  const float = useFloat(34, 4);
  const growth = stats.totals.growthPercent;

  return (
    <Scene grid={false}>
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 40,
          padding: '0 160px',
        }}
      >
        {growth !== null ? (
          <Entrance delay={12} preset="smooth" distance={38}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 20 }}>
              <Counter
                target={Math.abs(growth)}
                delay={18}
                decimals={1}
                style={{
                  fontFamily: displayFont,
                  fontSize: 168,
                  fontWeight: 700,
                  color: theme.colors.primary,
                  letterSpacing: '-0.04em',
                  textShadow: `0 0 80px ${theme.colors.glow}`,
                }}
              />
              <span
                style={{
                  fontFamily: displayFont,
                  fontSize: 84,
                  fontWeight: 600,
                  color: theme.colors.primary,
                  marginLeft: -8,
                }}
              >
                %
              </span>
              <span
                style={{
                  fontFamily: bodyFont,
                  fontSize: 40,
                  fontWeight: 500,
                  color: theme.colors.text,
                  marginLeft: 18,
                }}
              >
                {growth >= 0 ? 'de versements en plus' : 'de versements en moins'}
              </span>
            </div>
          </Entrance>
        ) : null}

        <Entrance delay={28} preset="snappy" distance={22}>
          <div
            style={{
              fontFamily: bodyFont,
              fontSize: 30,
              fontWeight: 400,
              color: theme.colors.textDim,
              textAlign: 'center',
            }}
          >
            {formatPeriod(stats.period.label)} — {stats.totals.documentsInPeriod} nouveaux documents
            publics, comparé à {stats.totals.documentsPreviousPeriod} sur la période précédente.
          </div>
        </Entrance>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 26,
            marginTop: 30,
            transform: `translateY(${float}px)`,
          }}
        >
          <Entrance delay={42} preset="bouncy" distance={20}>
            <Logo size={132} />
          </Entrance>

          <WordReveal
            text={`Consultez l’archive sur ${portalUrl}`}
            delay={48}
            highlight={portalUrl}
            style={{
              fontFamily: bodyFont,
              fontSize: 44,
              fontWeight: 600,
              color: theme.colors.text,
              maxWidth: 1100,
            }}
          />
        </div>

        <Entrance delay={64} preset="snappy" distance={14}>
          <div
            style={{
              fontFamily: bodyFont,
              fontSize: 20,
              fontWeight: 400,
              color: theme.colors.textDim,
              letterSpacing: '0.08em',
            }}
          >
            Chiffres extraits automatiquement de la plateforme d’archives AEV le{' '}
            {new Date(stats.generatedAt).toLocaleDateString('fr-FR')} — documents publics uniquement.
          </div>
        </Entrance>
      </AbsoluteFill>
    </Scene>
  );
};
