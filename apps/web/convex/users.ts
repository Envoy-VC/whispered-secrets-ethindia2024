import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

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
    return user[0]._id;
  },
});

export const getUser = query({
  args: {
    address: v.string(),
  },
  handler: async (ctx, { address }) => {
    const user = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('address'), address))
      .collect();

    return user[0]?._id;
  },
});
