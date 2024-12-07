'use client';

import { getTools } from '~/lib/langchain';

import { useElementSize } from '~/hooks';

const GamePage = () => {
  const [gameWrapperRef, { width, height }] = useElementSize();

  return (
    <div className='game-frame bg-brown-900 h-screen w-full'>
      <div
        ref={gameWrapperRef}
        className='bg-brown-900 relative h-full overflow-hidden'
      >
        <div className='absolute inset-0'>
          <button type='button' onClick={getTools}>
            Get Tools
          </button>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
