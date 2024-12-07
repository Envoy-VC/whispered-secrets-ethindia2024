'use client';

import { PhaserGame } from './_components';

const GamePage = () => {
  return (
    <div className='game-frame bg-brown-900 h-screen w-full'>
      <div className='bg-brown-900 relative h-full overflow-hidden'>
        <div className='absolute inset-0'>
          <PhaserGame />
        </div>
      </div>
    </div>
  );
};

export default GamePage;
