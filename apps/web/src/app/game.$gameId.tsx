import { createFileRoute, useParams } from '@tanstack/react-router';
import { Game } from '~/game/map';

const GameComponent = () => {
  const { gameId } = useParams({
    from: '/game/$gameId',
  });
  return (
    <Game
      me={{
        playerName: 'Vedant',
      }}
      others={[
        {
          playerName: 'Raj',
        },
        {
          playerName: 'Raushan',
        },
        {
          playerName: 'Dishank',
        },
      ]}
    />
  );
};

export const Route = createFileRoute('/game/$gameId')({
  component: GameComponent,
});
