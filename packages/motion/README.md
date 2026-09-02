# @aev/motion — Moteur de redevabilité vidéo

Génère les vidéos institutionnelles de l'Association Espoir & Vie **à partir des
données réelles de la plateforme d'archives**. Aucun chiffre n'est saisi à la
main : chaque nombre affiché à l'écran provient de `GET /api/v1/public-stats`
et reste traçable jusqu'à une ligne de la base.

Rendu avec [Remotion](https://remotion.dev) (React → vidéo, image par image).

## Ce que ça produit

| Composition | Format | Durée | Usage |
|---|---|---|---|
| `BilanTrimestriel` | 1920×1080, 30 fps | ~24 s | Bailleurs, partenaires, site, LinkedIn |
| `BilanVertical` | 1080×1920, 30 fps | ~24 s | Reels, Shorts, TikTok, statuts WhatsApp |

Les deux partagent le montage, les données et la bande son **à la frame près** :
seule la mise en page change. Un ajustement de rythme profite aux deux formats.

Cinq scènes : ouverture de marque → chiffre-clé → rythme de versement sur 12 mois
→ répartition par fonds → croissance et appel à consulter l'archive.
Bande son incluse : lit musical original et effets synchronisés.

## Utilisation

```bash
# Bande son (déjà appelé automatiquement par studio et render)
pnpm --filter @aev/motion audio

# Aperçu interactif (données de démonstration)
pnpm motion:studio

# Rendu depuis l'API locale
pnpm motion:render -- --period=2026-Q1

# Version verticale pour les réseaux sociaux
pnpm motion:render -- --period=2026-Q1 --format=vertical

# Rendu de production : échoue si l'API est injoignable, au lieu de
# publier silencieusement des chiffres de démonstration
AEV_API_URL=https://api.aev.example/api/v1 \
  pnpm motion:render -- --period=2026-Q1 --strict
```

Options : `--period=YYYY-Qn|YYYY`, `--format=paysage|vertical`, `--api=`,
`--portal=`, `--out=`, `--strict`. La vidéo est écrite dans
`out/aev-bilan-<période>[-vertical].mp4`.

### Rendu dans un conteneur sans Chromium téléchargeable

```bash
export REMOTION_BROWSER_EXECUTABLE=/chemin/vers/headless_shell
```

## Garde-fous

1. **Confidentialité.** La source unique est `/public-stats`, qui n'expose que
   des agrégats calculés sur les documents `PUBLIC` : aucun titre, aucun nom de
   fichier, aucun utilisateur, aucun journal d'activité. Les tests
   `apps/backend/src/public-stats/public-stats.service.spec.ts` vérifient ce
   cloisonnement à chaque requête, y compris dans le SQL brut. **Ne pas les
   assouplir** : ces vidéos sont diffusées publiquement.
2. **Pas de repli silencieux.** Sans `--strict`, un échec de l'API produit une
   vidéo avec le jeu de démonstration, signalée par un avertissement en clair.
   Toute vidéo destinée à un bailleur se rend avec `--strict`.
3. **Aucun appel réseau au rendu.** Les polices sont auto-hébergées dans
   `public/fonts/` et la bande son est synthétisée localement. Un CI hors ligne
   produirait sinon une vidéo en police système ou muette, sans erreur.
4. **Aucune licence musicale à gérer.** Tout l'audio est synthétisé par
   `scripts/gen-audio.mjs` : création originale, aucun sample tiers, aucun
   risque de revendication sur YouTube ou Meta.

## Architecture

```
src/
├── theme.ts              # Couleurs, polices, easings, ressorts, rythme — source unique
├── timeline.ts           # Durées, départs de scène, coupes — lu par le montage ET le son
├── layout.ts             # Jetons de mise en page par format — évite de dupliquer les scènes
├── fonts.ts              # Inter + Playfair Display, auto-hébergées
├── data.ts               # Contrat API, jeu de démonstration, formatage FR
├── Sound.tsx             # Feuille de conduite audio
├── Root.tsx              # Déclaration des compositions
├── BilanTrimestriel.tsx  # Montage : scènes + transitions
├── components/
│   ├── Layers.tsx        # Pile à 5 couches : mesh → trame → contenu → étalonnage → grain + vignette
│   ├── Motion.tsx        # Entrance, WordReveal, Counter, respiration, filet
│   └── Logo.tsx          # Détourage circulaire du logo (fichier source à fond noir)
└── scenes/               # Intro, KeyFigure, Evolution, Categories, Outro
```

## Les deux formats

Les scènes ne connaissent pas leurs dimensions : elles lisent les jetons de
`layout.ts` via `useLayout()`. Dupliquer cinq scènes pour la version verticale
aurait garanti la divergence dès la première retouche.

Trois scènes changent de structure, pas seulement de taille :

- **Chiffre-clé** : les trois cartes deviennent une rangée compacte à hauteur
  égale, texte centré.
- **Rythme de versement** : les douze barres restent affichées — en réduire le
  nombre changerait ce que la vidéo raconte — mais un intitulé de mois sur deux
  seulement, et les valeurs uniquement sur le pic.
- **Répartition par fonds** : l'intitulé et le total passent au-dessus de la
  barre ; le tryptique du 16:9 ne tient pas sur 1080 px.

Zone de sécurité 9:16 : `padY` à 250 px maintient le contenu critique dans les
75 % centraux, là où l'interface des plateformes ne le recouvre pas.

## Règles de motion design appliquées

Aucune interpolation linéaire ; entrées sur 3 propriétés (opacité + translation
+ échelle) ; décalages de 3–6 frames ; sorties plus rapides que les entrées ;
pile à 5 couches sur chaque scène ; une seule couleur héros par image ; toutes
les durées dérivées du `fps`.

## Bande son

`scripts/gen-audio.mjs` synthétise tout l'audio en WAV 16 bits — création
originale, aucun sample tiers, résultat déterministe. Les fichiers ne sont donc
pas versionnés : `render` et `studio` les régénèrent s'ils manquent.

- **Lit musical** en fa majeur (F – B♭ – Dm – C – F), nappe de cordes chaude,
  basse tenue, arpège discret, aucune batterie. Registre institutionnel, pas
  électro. **Les changements d'accord tombent sur les quatre coupes du montage** :
  c'est cette synchronisation-là que l'œil ressent, bien plus qu'une grille de
  tempo rigide.
- **Effets** : souffle et impact sur chaque coupe, pointe à l'apparition d'un
  élément, tic sur les barres du graphe, montée avant le chiffre de croissance,
  scintillement sur le logo et l'adresse finale.
- **Calage** : chaque effet démarre 3 frames avant que l'élément n'atterrisse.
  En avance, l'oreille entend « synchrone » ; en retard, elle entend « cassé ».
- **Niveaux** : lit à 0,28 avec fondus d'entrée et de sortie, effets entre 0,2
  et 0,6. Pic mesuré à 0,689 — aucune saturation.

Vérification sans écoute possible : rendre la piste seule
(`--codec wav --config`) et analyser l'enveloppe RMS par frame. Les quatre
impacts doivent tripler le niveau aux frames 102, 240, 414 et 588.

## Limites connues

- **`public/logo-aev.png` est un JPEG à fond noir**, détouré géométriquement en
  cercle par `components/Logo.tsx`. Fournir un PNG à fond transparent et
  simplifier ce composant.
