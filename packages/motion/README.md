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

Cinq scènes : ouverture de marque → chiffre-clé → rythme de versement sur 12 mois
→ répartition par fonds → croissance et appel à consulter l'archive.

## Utilisation

```bash
# Aperçu interactif (données de démonstration)
pnpm motion:studio

# Rendu depuis l'API locale
pnpm motion:render -- --period=2026-Q1

# Rendu de production : échoue si l'API est injoignable, au lieu de
# publier silencieusement des chiffres de démonstration
AEV_API_URL=https://api.aev.example/api/v1 \
  pnpm motion:render -- --period=2026-Q1 --strict
```

Options : `--period=YYYY-Qn|YYYY`, `--api=`, `--portal=`, `--out=`, `--strict`.
La vidéo est écrite dans `out/aev-bilan-<période>.mp4`.

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
   `public/fonts/`. Un CI hors ligne produirait sinon une vidéo en police
   système, sans erreur.

## Architecture

```
src/
├── theme.ts              # Couleurs, polices, easings, ressorts, rythme — source unique
├── fonts.ts              # Inter + Playfair Display, auto-hébergées
├── data.ts               # Contrat API, jeu de démonstration, formatage FR
├── Root.tsx              # Déclaration des compositions
├── BilanTrimestriel.tsx  # Montage : scènes + transitions
├── components/
│   ├── Layers.tsx        # Pile à 5 couches : mesh → trame → contenu → étalonnage → grain + vignette
│   ├── Motion.tsx        # Entrance, WordReveal, Counter, respiration, filet
│   └── Logo.tsx          # Détourage circulaire du logo (fichier source à fond noir)
└── scenes/               # Intro, KeyFigure, Evolution, Categories, Outro
```

## Règles de motion design appliquées

Aucune interpolation linéaire ; entrées sur 3 propriétés (opacité + translation
+ échelle) ; décalages de 3–6 frames ; sorties plus rapides que les entrées ;
pile à 5 couches sur chaque scène ; une seule couleur héros par image ; toutes
les durées dérivées du `fps`.

## Limites connues

- **Pas de bande son.** Une vidéo institutionnelle muette perd environ la moitié
  de sa qualité perçue : prochaine étape, un lit musical discret et des SFX sur
  les temps forts.
- **`public/logo-aev.png` est un JPEG à fond noir**, détouré géométriquement en
  cercle par `components/Logo.tsx`. Fournir un PNG à fond transparent et
  simplifier ce composant.
- **Format paysage uniquement.** La déclinaison verticale 1080×1920 pour Reels,
  Shorts et TikTok reste à faire.
