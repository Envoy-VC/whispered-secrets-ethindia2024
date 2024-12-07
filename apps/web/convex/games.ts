import { v } from 'convex/values';
import ShortUniqueId from 'short-unique-id';

import type { Id } from './_generated/dataModel';
import { mutation } from './_generated/server';
import { playerDetails } from './schema';

export const createGame = mutation({
  args: {
    plot: v.string(),
    players: v.array(playerDetails),
    killer: playerDetails,
    murderWeapon: v.string(),
    murderLocation: v.string(),
  },
  handler: async (
    ctx,
    { players, plot, killer, murderWeapon, murderLocation }
  ) => {
    const uid = new ShortUniqueId({ length: 10 });
    const id = uid.rnd();
    const taskId = await ctx.db.insert('games', {
      id,
      players: [],
      details: {
        plot,
        players,
        killer,
        murderWeapon,
        murderLocation,
      },
    });

    return taskId;
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

    const player = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('address'), address))
      .collect();

    let playerId: Id<'users'>;
    if (player[0]) {
      playerId = player[0]._id;
    } else {
      const id = await ctx.db.insert('users', {
        address,
      });
      playerId = id;
    }

    const newPlayers = game.players;
    if (!newPlayers.includes(playerId)) {
      newPlayers.push(playerId);
    }

    const taskId = ctx.db.patch(gameId, {
      ...game,
      players: newPlayers,
    });

    return taskId;
  },
});
