// Polices de la charte AEV (identiques au site : css/style.css), AUTO-HÉBERGÉES.
//
// Volontairement pas @remotion/google-fonts : le rendu ne doit dépendre d'aucun
// appel réseau. Un CI hors ligne, un proxy d'entreprise ou une coupure chez
// Google produiraient sinon une vidéo en police système — livrée sans erreur.
// Les .woff2 sont versionnés dans public/fonts/ (sous-ensemble latin, variables).
import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

export const displayFont = 'Playfair Display';
export const bodyFont = 'Inter';

loadFont({
  family: displayFont,
  url: staticFile('fonts/PlayfairDisplay-Variable-latin.woff2'),
  weight: '600 700',
  format: 'woff2',
});

loadFont({
  family: bodyFont,
  url: staticFile('fonts/Inter-Variable-latin.woff2'),
  weight: '400 700',
  format: 'woff2',
});
