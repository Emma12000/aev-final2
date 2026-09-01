import React from 'react';
import { Img, staticFile } from 'remotion';
import { theme } from '../theme';

/**
 * Le fichier fourni (assets/logo-aev.png) est en réalité un JPEG sur fond NOIR
 * opaque : posé tel quel, il affiche un rectangle noir au milieu de la scène.
 *
 * `mixBlendMode: 'screen'` ne suffit pas ici — les scènes animent l'opacité de
 * leurs conteneurs, ce qui crée un groupe isolé et neutralise la fusion.
 * On détoure donc géométriquement : le blason est circulaire et occupe ~93 % de
 * la largeur du fichier, on le recadre dans un disque.
 *
 * Dès que la charte fournit un PNG à fond transparent, remplacer public/logo-aev.png
 * et ramener CIRCLE_RATIO à 1.
 */
const CIRCLE_RATIO = 0.93;

export const Logo: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: `0 0 0 3px rgba(255,255,255,0.14), 0 26px 60px -18px ${theme.colors.bg}`,
      flexShrink: 0,
      ...style,
    }}
  >
    <Img
      src={staticFile('logo-aev.png')}
      style={{ width: size / CIRCLE_RATIO, height: 'auto', maxWidth: 'none', flexShrink: 0 }}
    />
  </div>
);
