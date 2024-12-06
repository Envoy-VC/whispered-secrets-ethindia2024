import { v } from 'convex/values';

import { generateGame } from '../lib/ai/config';
import { action } from './_generated/server';

export const createGame = action({
  args: {
    players: v.array(v.id('users')),
  },
  handler: async (ctx, args) => {
    await generateGame();
    // const gameId = uuid();
    // const plot = '';
    // const killer = undefined;
    // const taskId = await ctx.db.insert('games', {
    //   id: gameId,
    //   players: [],
    //   plot,
    //   killer,
    // });
  },
});
