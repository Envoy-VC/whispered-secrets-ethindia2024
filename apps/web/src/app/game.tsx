import { Stage } from '@pixi/react';
import { createFileRoute } from '@tanstack/react-router';
import { useElementSize } from '~/hooks';

import { PixiGame } from './$components/game/game';

const GameComponent = () => {
  const [gameWrapperRef, { width, height }] = useElementSize();

  return (
    <div className='game-frame bg-brown-900 h-screen w-full'>
      <div
        ref={gameWrapperRef}
        className='bg-brown-900 relative h-full overflow-hidden'
      >
        <div className='absolute inset-0'>
          <div className='container'>
            <Stage
              height={height}
              options={{ backgroundColor: 0x7ab5ff }}
              width={width}
            >
              <PixiGame height={height} width={width} />
            </Stage>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute('/game')({
  component: GameComponent,
});
