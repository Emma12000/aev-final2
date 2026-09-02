#!/usr/bin/env node
/**
 * Synthétise toute la bande son du bilan AEV : un lit musical original et un kit
 * d'effets, en WAV 16 bits mono. Aucun téléchargement, aucune licence à gérer,
 * résultat déterministe — deux exécutions produisent des fichiers identiques.
 *
 *   node scripts/gen-audio.mjs
 *
 * Registre volontairement institutionnel : nappe de cordes chaude en fa majeur,
 * arpège discret, aucune batterie. Les changements d'accord tombent sur les
 * quatre coupes du montage — c'est cette synchronisation-là que l'œil ressent,
 * bien plus qu'une grille de tempo rigide.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SR = 44100;
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SFX = join(root, 'public', 'sfx');
mkdirSync(SFX, { recursive: true });

// ── utilitaires ───────────────────────────────────────────────────────────
const secs = (s) => Math.round(s * SR);

/**
 * Rampe d'attaque de quelques millisecondes. Une enveloppe percussive qui part
 * de l'amplitude maximale au premier échantillon crée une discontinuité — un
 * clic audible, surtout après une recompression en AAC.
 */
const attack = (i, ms = 3) => Math.min(1, i / (SR * (ms / 1000)));

const wav = (samples, peakTarget = 0.9) => {
  let peak = 0;
  for (const s of samples) peak = Math.max(peak, Math.abs(s));
  const gain = peak > 0 ? peakTarget / peak : 1;

  const n = samples.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + n * 2, 4);
  buf.write('WAVE', 8);
  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) {
    const v = Math.max(-1, Math.min(1, samples[i] * gain));
    buf.writeInt16LE(Math.round(v * 32767), 44 + i * 2);
  }
  return buf;
};

/** Bruit pseudo-aléatoire déterministe : deux rendus donnent le même fichier. */
let seed = 20260401;
const rnd = () => {
  seed = (seed * 16807) % 2147483647;
  return seed / 2147483647 - 0.5;
};

// ── kit d'effets ──────────────────────────────────────────────────────────

/** Souffle de transition : bruit filtré qui enfle puis retombe. */
const whoosh = (dur, brightness) => {
  const N = secs(dur);
  const out = new Float32Array(N);
  let lp = 0;
  for (let i = 0; i < N; i++) {
    const t = i / N;
    const env = Math.sin(Math.PI * Math.pow(t, 0.65)) ** 2;
    const cutoff = 0.03 + brightness * Math.sin(Math.PI * t);
    lp += cutoff * (rnd() * 2 - lp);
    out[i] = lp * env;
  }
  return out;
};

/** Impact grave sur la coupe : sinus descendant, sans claquement. */
const impact = () => {
  const N = secs(0.7);
  const out = new Float32Array(N);
  let phase = 0;
  for (let i = 0; i < N; i++) {
    const t = i / N;
    const f = 76 - 34 * Math.min(1, (i / SR) * 4);
    phase += (2 * Math.PI * f) / SR;
    out[i] = Math.sin(phase) * Math.exp(-t * 4.2) * attack(i);
  }
  return out;
};

/** Pointe douce à l'apparition d'un élément — bois frappé, pas de « clic » numérique. */
const pop = () => {
  const N = secs(0.22);
  const out = new Float32Array(N);
  let p1 = 0;
  let p2 = 0;
  for (let i = 0; i < N; i++) {
    const t = i / N;
    const ts = i / SR;
    const f = 560 - 190 * Math.min(1, ts * 12);
    p1 += (2 * Math.PI * f) / SR;
    p2 += (2 * Math.PI * f * 2.01) / SR;
    out[i] = (Math.sin(p1) + Math.sin(p2) * 0.28) * Math.exp(-t * 11) * attack(i, 2);
  }
  return out;
};

/** Tic léger pour accompagner un compteur ou une barre qui pousse. */
const tick = () => {
  const N = secs(0.06);
  const out = new Float32Array(N);
  let phase = 0;
  for (let i = 0; i < N; i++) {
    const t = i / N;
    phase += (2 * Math.PI * 1650) / SR;
    out[i] = Math.sin(phase) * Math.exp(-t * 16) * attack(i, 1.5);
  }
  return out;
};

/** Scintillement : accord aigu arpégé très court, pour le logo et l'adresse finale. */
const shimmer = () => {
  const N = secs(1.1);
  const out = new Float32Array(N);
  const partials = [1046.5, 1396.9, 1760, 2093]; // do6 fa6 la6 do7 — fa majeur
  partials.forEach((f, k) => {
    const start = secs(k * 0.045);
    let phase = 0;
    for (let i = start; i < N; i++) {
      const t = (i - start) / (N - start);
      phase += (2 * Math.PI * f) / SR;
      out[i] += Math.sin(phase) * Math.exp(-t * 5.5) * 0.4 * attack(i - start, 4);
    }
  });
  return out;
};

/** Montée avant le chiffre de croissance. */
const riser = () => {
  const N = secs(1.6);
  const out = new Float32Array(N);
  let lp = 0;
  let phase = 0;
  for (let i = 0; i < N; i++) {
    const t = i / N;
    lp += (0.02 + 0.2 * t) * (rnd() * 2 - lp);
    phase += (2 * Math.PI * (180 + 500 * t * t)) / SR;
    out[i] = (lp * 0.8 + Math.sin(phase) * 0.25) * Math.pow(t, 1.6);
  }
  return out;
};

const kit = {
  'whoosh.wav': [whoosh(0.55, 0.22), 0.85],
  'whoosh-soft.wav': [whoosh(0.4, 0.12), 0.6],
  'impact.wav': [impact(), 0.95],
  'pop.wav': [pop(), 0.8],
  'tick.wav': [tick(), 0.55],
  'shimmer.wav': [shimmer(), 0.7],
  'riser.wav': [riser(), 0.8],
};

for (const [name, [samples, peak]] of Object.entries(kit)) {
  writeFileSync(join(SFX, name), wav(samples, peak));
}

// ── lit musical ───────────────────────────────────────────────────────────
// 714 frames à 30 fps = 23,8 s. Les bornes d'accord correspondent aux coupes
// du montage (frames 102, 240, 414, 588).
const DUR = 714 / 30;
const N = secs(DUR);
const bed = new Float32Array(N);

const add = (start, dur, fn) => {
  const s0 = secs(start);
  const n = secs(dur);
  for (let i = 0; i < n && s0 + i < N; i++) bed[s0 + i] += fn(i / SR, i / n);
};

// Fa majeur : F – Bb – Dm – C – F. On ouvre et on résout sur la tonique,
// la tension du Ve degré tombe pile sur la scène de croissance.
const CHORDS = [
  { at: 0.0, until: 102 / 30, notes: [174.61, 261.63, 349.23] }, // F3 C4 F4
  { at: 102 / 30, until: 240 / 30, notes: [233.08, 293.66, 349.23] }, // Bb3 D4 F4
  { at: 240 / 30, until: 414 / 30, notes: [146.83, 220.0, 293.66] }, // D3 A3 D4
  { at: 414 / 30, until: 588 / 30, notes: [130.81, 196.0, 261.63] }, // C3 G3 C4
  { at: 588 / 30, until: DUR, notes: [174.61, 261.63, 349.23] }, // F3 C4 F4
];

// Nappe : chaque accord déborde sur le suivant pour que la liaison soit fondue.
for (const { at, until, notes } of CHORDS) {
  const span = until - at + 0.9;
  for (const f of notes) {
    for (const d of [f / 1.0018, f * 1.0018]) {
      const phase0 = rnd() * Math.PI * 2;
      add(at, span, (ts) => {
        const attack = Math.min(1, ts / 0.7);
        const release = Math.min(1, (span - ts) / 1.1);
        const trem = 1 - 0.12 * (0.5 + 0.5 * Math.sin(2 * Math.PI * 0.11 * ts));
        return Math.sin(phase0 + 2 * Math.PI * d * ts) * 0.05 * attack * release * trem;
      });
    }
  }
}

// Basse tenue, une note par accord — assise sans batterie.
for (const { at, until, notes } of CHORDS) {
  const f = notes[0] / 2;
  const span = until - at;
  add(at, span, (ts) => {
    const attack = Math.min(1, ts / 0.5);
    const release = Math.min(1, (span - ts) / 0.8);
    return Math.sin(2 * Math.PI * f * ts) * 0.11 * attack * release;
  });
}

/** Arpège cristallin, croches à 100 BPM (0,3 s). Entre avec les données, sort à l'outro. */
const ARP_FROM = 102 / 30;
const ARP_TO = 588 / 30;
const chordAt = (t) => CHORDS.find((c) => t >= c.at && t < c.until) ?? CHORDS[0];
for (let k = 0; ; k++) {
  const t = ARP_FROM + k * 0.3;
  if (t >= ARP_TO) break;
  const chord = chordAt(t);
  const f = chord.notes[k % chord.notes.length] * 2;
  add(t, 0.55, (ts, p) => {
    const env = Math.min(1, ts * 300) * Math.exp(-p * 4.5);
    return (Math.sin(2 * Math.PI * f * ts) + Math.sin(2 * Math.PI * f * 2 * ts) * 0.2) * 0.06 * env;
  });
}

// Souffle très léger sur les contretemps, à partir de la scène de rythme.
for (let t = 240 / 30; t < 588 / 30; t += 0.3) {
  add(t + 0.15, 0.09, (ts, p) => rnd() * 2 * Math.exp(-p * 11) * 0.035);
}

// Respiration montante juste avant la scène finale.
add(560 / 30, 0.95, (ts, p) => rnd() * 2 * p * p * 0.09);

writeFileSync(join(root, 'public', 'sfx', 'bed.wav'), wav(bed, 0.82));

console.log(`Kit d'effets + lit musical (${DUR.toFixed(2)} s) écrits dans public/sfx/`);
