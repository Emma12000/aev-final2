import React from 'react';
import { AbsoluteFill } from 'remotion';
import { theme } from '../theme';
import { displayFont, bodyFont } from '../fonts';
import { Scene } from '../components/Layers';
import { Logo } from '../components/Logo';
import { Counter, Entrance, WordReveal, useFloat } from '../components/Motion';
import { formatPeriod, type PublicStats } from '../data';
import { useLayout } from '../layout';

/** Le payoff : croissance du trimestre, puis une seule action, calme, avec le halo sur l'adresse. */
export const Outro: React.FC<{ stats: PublicStats; portalUrl: string }> = ({
  stats,
  portalUrl,
}) => {
  const float = useFloat(34, 4);
  const L = useLayout();
  const growth = stats.totals.growthPercent;

  return (
    <Scene grid={false}>
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: L.portrait ? 32 : 40,
          padding: `0 ${L.padX}px`,
        }}
      >
        {growth !== null ? (
          <Entrance delay={12} preset="smooth" distance={38}>
            {/* En 9:16 le chiffre prend toute la largeur : la légende passe
                dessous plutôt que de comprimer le nombre. */}
            <div
              style={{
                display: 'flex',
                flexDirection: L.portrait ? 'column' : 'row',
                alignItems: L.portrait ? 'center' : 'baseline',
                justifyContent: 'center',
                gap: L.portrait ? 4 : 20,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <Counter
                  target={Math.abs(growth)}
                  delay={18}
                  decimals={1}
                  style={{
                    fontFamily: displayFont,
                    fontSize: L.growth,
                    fontWeight: 700,
                    color: theme.colors.primary,
                    letterSpacing: '-0.04em',
                    textShadow: `0 0 80px ${theme.colors.glow}`,
                  }}
                />
                <span
                  style={{
                    fontFamily: displayFont,
                    fontSize: L.growthUnit,
                    fontWeight: 600,
                    color: theme.colors.primary,
                    marginLeft: -8,
                  }}
                >
                  %
                </span>
              </div>
              <span
                style={{
                  fontFamily: bodyFont,
                  fontSize: L.growthCaption,
                  fontWeight: 500,
                  color: theme.colors.text,
                  marginLeft: L.portrait ? 0 : 18,
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
              fontSize: L.sub + 2,
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
            flexDirection: L.portrait ? 'column' : 'row',
            alignItems: 'center',
            gap: L.portrait ? 22 : 26,
            marginTop: 30,
            transform: `translateY(${float}px)`,
          }}
        >
          <Entrance delay={42} preset="bouncy" distance={20}>
            <Logo size={L.logoOutro} />
          </Entrance>

          <WordReveal
            text={`Consultez l’archive sur ${portalUrl}`}
            delay={48}
            highlight={portalUrl}
            style={{
              fontFamily: bodyFont,
              fontSize: L.cta,
              fontWeight: 600,
              color: theme.colors.text,
              maxWidth: L.portrait ? 880 : 1100,
              justifyContent: 'center',
            }}
          />
        </div>

        <Entrance delay={64} preset="snappy" distance={14}>
          <div
            style={{
              fontFamily: bodyFont,
              fontSize: L.legal,
              fontWeight: 400,
              color: theme.colors.textDim,
              letterSpacing: '0.08em',
              textAlign: 'center',
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
