import { useMemo } from 'react';

import { createFileRoute, useParams } from '@tanstack/react-router';
import { useQuery } from 'convex/react';
import { useAccount } from 'wagmi';
import { Game } from '~/game/map';

import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';

const GameComponent = () => {
  const { gameId } = useParams({
    from: '/game/$gameId',
  });

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

  if (me && others) return <Game me={me} others={others} />;
};

export const Route = createFileRoute('/game/$gameId')({
  component: GameComponent,
});
