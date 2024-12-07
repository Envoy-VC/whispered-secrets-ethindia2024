import { createFileRoute } from '@tanstack/react-router';

import { PhaserGame } from './$components/game';

const GameComponent = () => {
  return (
    <div className='absolute top-0'>
      <PhaserGame />
    </div>
  );
};

export const Route = createFileRoute('/game/$gameId')({
  component: GameComponent,
});
