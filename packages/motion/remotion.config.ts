import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
// Les scènes empilent flous et dégradés : le CRF bas garde de la marge
// avant la recompression des plateformes (YouTube, LinkedIn, WhatsApp).
Config.setCrf(16);
