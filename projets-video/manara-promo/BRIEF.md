---
workflow: product-launch-video
flow: automation
storyboard: no
message: "Manara Productions définit la stratégie et produit l'exécution — de bout en bout."
destination: linkedin
aspect: "1:1"
length: 75s
language: fr
audience: "marques et institutions au Tchad cherchant une agence de communication"
angle: "l'agence qui ne s'arrête pas à la stratégie : elle produit aussi"
---

# Manara Productions — vidéo de présentation

## Intent

Vidéo de présentation institutionnelle, format carré (LinkedIn / Facebook feed),
75 s, français. L'angle vient du positionnement de l'agence elle-même :
« la communication de qualité, mais aussi la création et la production
d'excellence ». La vidéo articule donc stratégie → déclinaison print/digital →
production, et se ferme sur les coordonnées.

## Structure

| Scène | Temps | Contenu |
| --- | --- | --- |
| 1 | 0–7,5 s | Révélation du logo (carré, barre, triangle, wordmark) |
| 2 | 7–17 s | Accroche : « Votre marque a quelque chose à dire. Encore faut-il qu'on l'écoute. » |
| 3 | 16,5–27 s | Positionnement de l'agence |
| 4 | 26,5–35 s | Pilier 01 — Stratégie |
| 5 | 34,5–43 s | Pilier 02 — Print & digital |
| 6 | 42,5–51 s | Pilier 03 — Création & production |
| 7 | 50,5–62 s | Signature |
| 8 | 61,5–75 s | Carte de contact |

## Assets

- **Logo** — reconstruit en CSS/SVG d'après l'image fournie par le client
  (carré arrondi #FA3B0F, barre + triangle blancs). **À remplacer par le
  fichier vectoriel original** avant diffusion : le triangle reconstruit a des
  angles vifs là où l'original a des angles arrondis.
- **Typographies** — Montserrat ExtraBold (titres, wordmark) + Inter (textes).
  Approximations : la police exacte du wordmark n'a pas été fournie.
- **Aucun visuel ni rush fourni** — la vidéo est entièrement typographique.

## Sources des informations

Le site `productions.manara.td` n'a pas pu être capturé : bloqué par la
politique réseau de l'environnement, et signalé par ailleurs comme un WordPress
encore au contenu par défaut. Les informations proviennent de recherche web
publique :

- Positionnement : « accompagne dans la définition et la mise en œuvre de
  stratégies de communication efficaces, sur tous les canaux, print et digital »
- Signature : « pas seulement la communication de qualité, mais aussi la
  création et la production d'excellence »
- Adresse : Rue 3037, Avenue Charles de Gaulle, N'Djamena
- Téléphone : +235 69 29 69 43 · Email : productions@manara.td

## Notes

- **Aucun chiffre n'a été inventé.** Le storyboard initial prévoyait une scène
  de statistiques en count-up (années, clients, projets) ; elle a été supprimée
  faute de données réelles. À réintégrer si le client fournit ses chiffres.
- Les libellés des trois piliers sont une interprétation du positionnement
  public, pas une liste de services validée par le client.
- Pas de musique : aucune piste fournie, et la génération locale (MusicGen)
  n'est pas installée.

## Musique

Piste `<audio id="bgm">` câblée, fondus pilotés par la timeline (entrée 3 s,
baisse à −4 dB sous la signature à 50,5 s, remontée sur la carte de contact,
sortie 4 s). Vérifié au ffprobe sur le MP4 : flux AAC stéréo 48 kHz présent, et
les quatre paliers de volume mesurés conformes.

`assets/bgm-placeholder.mp3` est un **nappage synthétisé à l'ffmpeg** (bourdon
La mineur, trémolo lent, écho) — un gabarit de niveaux, pas une musique.
Il est aussi mixé bas (−36 dB moyen au plein régime). À remplacer par une piste
instrumentale réelle de 75 s minimum :

    cp ta-musique.mp3 assets/bgm.mp3
    # dans index.html : src="assets/bgm.mp3"
    npx hyperframes check && npx hyperframes render

Le catalogue BGM de `media-use` (10 000+ titres) n'a pas pu être utilisé :
il exige le CLI `heygen` et une authentification au compte du client.
