import { v } from 'convex/values';

import type { Id } from './_generated/dataModel';
import { mutation, query } from './_generated/server';
import { gameDetails } from './schema';
import { getOrCreateUser } from './users';

export const createGame = mutation({
  args: v.object({
    details: gameDetails,
    address: v.string(),
  }),
  handler: async (ctx, args) => {
    const details = args.details;
    const userId = await getOrCreateUser(ctx, { address: args.address });
    const gameId = await ctx.db.insert('games', {
      details: {
        plot: details.plot,
        players: [
          {
            player_id: userId,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- should be defined
            npc_id: details.npcs[0]!.id,
          },
        ],
        npcs: details.npcs,
        killer: details.killer,
        murderWeapon: details.murderWeapon,
        murderLocation: details.murderLocation,
        room_id: details.room_id,
      },
    });

    return gameId;
  },
});

export const joinGame = mutation({
  args: {
    gameId: v.id('games'),
    address: v.string(),
  },
  handler: async (ctx, { gameId, address }) => {
    const game = await ctx.db.get(gameId);

    if (!game) {
      throw new Error('Game not found');
    }

    if (game.details.npcs.length === game.details.players.length) {
      throw new Error('Game Full');
    }

    const userId = await getOrCreateUser(ctx, { address });

    const newPlayers = game.details.players;
    if (newPlayers.some((p) => p.player_id === userId)) {
      throw new Error('Already in game');
    } else {
      newPlayers.push({
        player_id: userId,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- should be defined
        npc_id: game.details.npcs[game.details.players.length]!.id,
      });
    }

    const res = ctx.db.patch(gameId, {
      ...game,
      details: {
        ...game.details,
        players: newPlayers,
      },
    });

    return res;
  },
});

export const getGame = query({
  handler: async (
    ctx,
    args: {
      gameId: Id<'games'>;
    }
  ) => {
    const game = await ctx.db.get(args.gameId);
    return game;
  },
});
