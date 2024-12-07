import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { getGame } from './games';

export const getChats = query({
  args: {
    gameId: v.id('games'),
    ids: v.array(v.string()),
  },
  handler: async (ctx, { ids, gameId }) => {
    const conversation = await ctx.db
      .query('conversations')
      .filter((q) => q.eq(q.field('game_id'), gameId))
      .filter((q) => q.eq(q.field('npcs'), ids))
      .collect();

    if (!conversation[0]) {
      return null;
    }

    const messages = await ctx.db
      .query('messages')
      .filter((q) => q.eq(q.field('conversation_id'), conversation[0]?._id))
      .collect();

    return messages;
  },
});

export const sendChat = mutation({
  args: {
    gameId: v.id('games'),
    playerId: v.string(),
    npcId: v.string(),
    message: v.string(),
  },
  handler: async (ctx, { npcId, gameId, message, playerId }) => {
    const game = await getGame(ctx, { gameId });
    if (!game) {
      return null;
    }

    const isHuman = Boolean(
      game.details.players.find((p) => p.npc_id === npcId)
    );

    const conversation = await getOrCreateConversation(ctx, {
      gameId,
      playerId,
      npcId,
    });

    const messages = await ctx.db.insert('messages', {
      npc_id: npcId,
      conversation_id: conversation,
      content: message,
    });

    if (!isHuman) {
      // TODO: Make AI Response
      await ctx.db.insert('messages', {
        npc_id: playerId,
        conversation_id: conversation,
        content: 'Hello Back response',
      });
    }

    return messages;
  },
});

export const getOrCreateConversation = mutation({
  args: {
    gameId: v.id('games'),
    playerId: v.string(),
    npcId: v.string(),
  },
  handler: async (ctx, { npcId, gameId, playerId }) => {
    const game = await getGame(ctx, { gameId });
    if (!game) {
      throw new Error('Game not found');
    }

    const ids = [npcId, playerId];

    const conversation = await ctx.db
      .query('conversations')
      .filter((q) => q.eq(q.field('game_id'), gameId))
      .filter((q) => q.eq(q.field('npcs'), ids))
      .collect();

    if (!conversation[0]) {
      const conversation = await ctx.db.insert('conversations', {
        npcs: [npcId, playerId],
        game_id: gameId,
      });

      return conversation;
    }
    return conversation[0]._id;
  },
});
