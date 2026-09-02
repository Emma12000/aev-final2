import React from 'react';
import { Composition } from 'remotion';
import { BilanTrimestriel, bilanDefaultProps } from './BilanTrimestriel';
import { FPS, TOTAL_FRAMES } from './timeline';

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

    {/* Même montage, même bande son, même durée — seule la mise en page change.
        Reels, Shorts et TikTok. */}
    <Composition
      id="BilanVertical"
      component={BilanTrimestriel}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={1080}
      height={1920}
      defaultProps={bilanDefaultProps}
    />
  </>
);
