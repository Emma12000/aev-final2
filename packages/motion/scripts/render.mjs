#!/usr/bin/env node
/**
 * Rendu d'un bilan AEV.
 *
 *   pnpm --filter @aev/motion render -- --period=2026-Q1
 *   pnpm --filter @aev/motion render -- --period=2026-Q1 --format=vertical
 *   pnpm --filter @aev/motion render -- --period=2026-Q1 --strict
 *
 * Les chiffres sont récupérés côté Node PUIS injectés dans la composition via --props.
 * Aucune valeur n'est saisie à la main : ce que la vidéo affiche est ce que l'API a répondu.
 * `--strict` interdit le repli sur le jeu de démonstration — à utiliser pour toute
 * vidéo destinée à être diffusée.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const arg = (name, fallback) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split('=').slice(1).join('=') : fallback;
};
const flag = (name) => process.argv.includes(`--${name}`);

const apiUrl = arg('api', process.env.AEV_API_URL ?? 'http://localhost:3001/api/v1');
const period = arg('period');
const portalUrl = arg('portal', process.env.AEV_PORTAL_URL ?? 'archives.espoiretvie.org');
const strict = flag('strict');

const FORMATS = {
  paysage: { composition: 'BilanTrimestriel', suffix: '', label: '1920x1080' },
  vertical: { composition: 'BilanVertical', suffix: '-vertical', label: '1080x1920' },
};
const formatKey = arg('format', 'paysage');
const format = FORMATS[formatKey];
if (!format) {
  console.error(`✖ Format inconnu : ${formatKey}. Attendu : ${Object.keys(FORMATS).join(' | ')}.`);
  process.exit(1);
}

// La bande son est synthétisée, pas versionnée : le générateur est déterministe,
// donc la régénérer donne exactement les mêmes fichiers qu'ailleurs.
if (!existsSync(resolve(root, 'public/sfx/bed.wav'))) {
  console.log('→ génération de la bande son');
  const audio = spawnSync('node', ['scripts/gen-audio.mjs'], { cwd: root, stdio: 'inherit' });
  if (audio.status !== 0) {
    console.error('✖ Échec de la génération audio.');
    process.exit(1);
  }
}

const loadStats = async () => {
  const url = new URL(`${apiUrl.replace(/\/$/, '')}/public-stats`);
  if (period) url.searchParams.set('period', period);

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const body = await res.json();
    const stats = body?.data ?? body;
    if (!stats?.period?.label) throw new Error('réponse inattendue : champ period.label absent');
    console.log(`→ données réelles : ${url}`);
    return stats;
  } catch (err) {
    const message = `API injoignable (${url}) : ${err.message}`;
    if (strict) {
      console.error(`✖ ${message}\n  --strict interdit le repli sur le jeu de démonstration.`);
      process.exit(1);
    }
    console.warn(`⚠ ${message}\n  Repli sur le jeu de DÉMONSTRATION (defaultProps) — ne pas diffuser.`);
    return null;
  }
};

// `null` = repli : on ne passe pas --props et la composition utilise ses
// defaultProps (sampleStats), sans dépendre d'un import TypeScript depuis Node.
const stats = await loadStats();
const label = stats?.period.label ?? 'demo';
const out = arg('out', `out/aev-bilan-${label}${format.suffix}.mp4`);

mkdirSync(resolve(root, 'out'), { recursive: true });

const remotionArgs = [
  'remotion',
  'render',
  'src/index.ts',
  format.composition,
  out,
  '--codec',
  'h264',
  '--crf',
  '16',
  '--overwrite',
];

if (stats) {
  const propsFile = resolve(root, 'out/.props.json');
  writeFileSync(propsFile, JSON.stringify({ stats, portalUrl }));
  remotionArgs.push('--props', propsFile);
}

const browser = process.env.REMOTION_BROWSER_EXECUTABLE;
if (browser) remotionArgs.push(`--browser-executable=${browser}`);

console.log(`→ rendu ${label} en ${format.label} vers ${out}`);
const result = spawnSync('npx', remotionArgs, { cwd: root, stdio: 'inherit' });
process.exit(result.status ?? 1);
