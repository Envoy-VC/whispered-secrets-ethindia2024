import { useMemo, useState } from 'react';

import { GameButton } from '@repo/ui/components/ui/game-button';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { useQuery } from 'convex/react';
import { useAccount } from 'wagmi';
import { Game } from '~/game/map';

import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import ChatBox from './$components/chat-box';

const GameComponent = () => {
  const { gameId } = useParams({
    from: '/game/$gameId',
  });

  const [showChat, setShowChat] = useState<boolean>(false);

  const { address } = useAccount();

  const user = useQuery(api.users.getUser, {
    address: address ?? '',
  });

  const game = useQuery(api.games.getGame, {
    gameId: gameId as Id<'games'>,
  });

  const { me, others } = useMemo(() => {
    const me = game?.details.players.find((p) => p.player_id === user);
    const meNpc = game?.details.npcs.find((p) => p.id === me?.npc_id);
    const otherNpcs = game?.details.npcs.filter((p) => p.id !== me?.npc_id);

    return { me: meNpc, others: otherNpcs };
    // eslint-disable-next-line @tanstack/query/no-unstable-deps -- need this
  }, [game?.details.npcs, game?.details.players, user]);

  if (me && others)
    return (
      <>
        <div className='relative'>
          <div className='absolute top-4 right-4'>
            <GameButton
              imgUrl='/assets/ui/bubble-left.svg'
              onClick={() => {
                setShowChat((p) => !p);
              }}
            >
              Chat
            </GameButton>
          </div>

          <Game me={me} others={others} />
        </div>

        {showChat ? (
          <ChatBox
            isOpen={showChat}
            gameId={gameId}
            me={me}
            others={others}
            setOpen={setShowChat}
          />
        ) : null}
      </>
    );
};

export const Route = createFileRoute('/game/$gameId')({
  component: GameComponent,
});
