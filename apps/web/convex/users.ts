import { v } from 'convex/values';

import { mutation } from './_generated/server';

export const getOrCreateUser = mutation({
  args: {
    address: v.string(),
  },
  handler: async (ctx, { address }) => {
    const user = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('address'), address))
      .collect();

    if (!user[0]) {
      const taskId = await ctx.db.insert('users', {
        address,
      });

      return taskId;
    }
    return user[0];
  },
});
