// theme.ts — source de vérité unique du moteur vidéo AEV.
// Aligné sur la charte web (css/style.css). Ne JAMAIS inliner une couleur,
// une police ou une courbe d'easing dans un composant.
import { Easing } from 'remotion';

export const theme = {
  colors: {
    bg: '#083448', // --blue-deep : base institutionnelle
    bgAlt: '#0F5070', // --blue-darker : surfaces secondaires
    primary: '#29ABE2', // --blue : LA couleur héros (max 1 élément par frame)
    accent: '#E8192C', // --red : accent, un seul point d'emphase par scène
    text: '#FFFFFF',
    textDim: '#A8DCF0', // --blue-mid
    grid: 'rgba(168, 220, 240, 0.16)',
    glow: 'rgba(41, 171, 226, 0.42)',
  },
  fonts: {
    display: 'Playfair Display', // titres — chargé via @remotion/google-fonts
    body: 'Inter',
  },
  // Les courbes. Le linéaire est interdit.
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1), // easeOutExpo — entrées
    inOut: Easing.bezier(0.83, 0, 0.17, 1), // déplacements, Ken Burns
    in: Easing.bezier(0.7, 0, 0.84, 0), // sorties uniquement
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 },
    smooth: { damping: 20, stiffness: 90, mass: 1 },
    bouncy: { damping: 11, stiffness: 170, mass: 0.7 },
  },
  // Playfair Display sort des chiffres elzéviriens (hauteurs inégales, jambages
  // descendants) par défaut : illisible sur un chiffre-clé institutionnel.
  // On force les chiffres bas-de-casse en capitales tabulaires.
  numerals: {
    fontVariantNumeric: 'lining-nums tabular-nums',
    fontFeatureSettings: '"lnum" 1, "tnum" 1',
  },
  // Rythme : toute durée dérive du fps, jamais de numéro de frame magique.
  timing: {
    sceneSeconds: { intro: 3.6, keyFigure: 5, evolution: 6.2, categories: 6.2, outro: 4.4 },
    transitionFrames: 12,
  },
} as const;
