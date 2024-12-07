import { useRef } from 'react';

import { useApp } from '@pixi/react';
import { type Viewport } from 'pixi-viewport';
import { GentleWorld } from '~/data/gentle';
import type { ServerGame } from '~/types';

import { PixiStaticMap } from './static-map';
import { PixiViewport } from './viewport';

export const PixiGame = (props: {
  game?: ServerGame;
  width: number;
  height: number;
}) => {
  const pixiApp = useApp();
  const viewportRef = useRef<Viewport | undefined>();

  const { width, height, tileDim } = GentleWorld;

  return (
    <PixiViewport
      app={pixiApp}
      screenHeight={props.height}
      screenWidth={props.width}
      viewportRef={viewportRef}
      worldHeight={height * tileDim}
      worldWidth={width * tileDim}
    >
      <PixiStaticMap map={GentleWorld} />
    </PixiViewport>
  );
};
