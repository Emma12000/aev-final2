import React from 'react';
import { Composition } from 'remotion';
import {
  BilanTrimestriel,
  bilanDefaultProps,
  FPS,
  TOTAL_FRAMES,
} from './BilanTrimestriel';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="BilanTrimestriel"
      component={BilanTrimestriel}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={bilanDefaultProps}
    />
  </>
);
