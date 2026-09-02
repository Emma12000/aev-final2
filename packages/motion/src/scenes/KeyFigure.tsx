import React from 'react';
import { AbsoluteFill } from 'remotion';
import { theme } from '../theme';
import { displayFont, bodyFont } from '../fonts';
import { Scene } from '../components/Layers';
import { Counter, Entrance, WordReveal } from '../components/Motion';
import type { PublicStats } from '../data';
import { useLayout, type Layout } from '../layout';

const Stat: React.FC<{
  value: number;
  label: string;
  delay: number;
  suffix?: string;
  layout: Layout;
}> = ({ value, label, delay, suffix, layout: L }) => (
  // En 9:16 les trois cartes partagent la largeur à parts égales : `Entrance`
  // porte le `flex`, la carte n'est pas elle-même l'enfant du conteneur flex.
  <Entrance
    delay={delay}
    preset="snappy"
    distance={26}
    style={L.portrait ? { flex: 1, minWidth: 0 } : undefined}
  >
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: L.portrait ? 'center' : 'flex-start',
        textAlign: L.portrait ? 'center' : 'left',
        gap: 10,
        padding: L.statPad,
        borderRadius: 20,
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(168,220,240,0.18)',
        minWidth: L.portrait ? 0 : 300,
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Counter
        target={value}
        delay={delay + 4}
        suffix={suffix}
        style={{
          fontFamily: displayFont,
          fontSize: L.statValue,
          fontWeight: 700,
          color: theme.colors.text,
          letterSpacing: '-0.03em',
        }}
      />
      <span
        style={{
          fontFamily: bodyFont,
          fontSize: L.statLabel,
          fontWeight: 500,
          color: theme.colors.textDim,
          letterSpacing: '0.06em',
        }}
      >
        {label}
      </span>
    </div>
  </Entrance>
);

/** Le chiffre-clé : volume total de l'archive publique, puis les compléments en cascade. */
export const KeyFigure: React.FC<{ stats: PublicStats }> = ({ stats }) => {
  const L = useLayout();

  return (
    <Scene>
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: L.portrait ? 40 : 56,
          padding: `0 ${L.padX}px`,
        }}
      >
      <WordReveal
        text="Une mémoire institutionnelle accessible"
        delay={4}
        style={{
          fontFamily: bodyFont,
          fontSize: L.eyebrow,
          fontWeight: 500,
          color: theme.colors.textDim,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          justifyContent: 'center',
        }}
      />

      <Entrance delay={14} preset="smooth" distance={46}>
        <Counter
          target={stats.totals.documents}
          delay={18}
          style={{
            fontFamily: displayFont,
            fontSize: L.hero,
            fontWeight: 700,
            color: theme.colors.primary,
            letterSpacing: '-0.05em',
            lineHeight: 0.92,
            textShadow: `0 0 90px ${theme.colors.glow}`,
            display: 'block',
          }}
        />
      </Entrance>

      <Entrance delay={30} preset="snappy" distance={22}>
        <div
          style={{
            fontFamily: bodyFont,
            fontSize: L.body,
            fontWeight: 500,
            color: theme.colors.text,
            textAlign: 'center',
          }}
        >
          documents publics archivés et consultables
        </div>
      </Entrance>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            alignItems: 'stretch',
            justifyContent: 'center',
            gap: L.portrait ? 14 : 32,
            marginTop: 14,
          }}
        >
          <Stat value={stats.totals.pages} label="pages numérisées" delay={46} layout={L} />
          <Stat value={stats.totals.categories} label="fonds documentaires" delay={51} layout={L} />
          <Stat value={stats.totals.megabytes} label="Mo préservés" delay={56} layout={L} />
        </div>
      </AbsoluteFill>
    </Scene>
  );
};
