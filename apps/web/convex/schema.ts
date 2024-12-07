import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export const npcDetails = v.object({
  id: v.string(),
  npcName: v.string(),
  npcIdentity: v.optional(v.string()),
  npcPlan: v.optional(v.string()),
  npcRelationWithVictim: v.optional(v.string()),
});

export const gamePlayerDetails = v.object({
  player_id: v.id('users'),
  npc_id: v.string(),
});

export const killerDetails = v.object({
  npc_id: v.string(),
});

export const gameDetails = v.object({
  plot: v.string(),
  players: v.array(gamePlayerDetails),
  npcs: v.array(npcDetails),
  killer: killerDetails,
  murderWeapon: v.string(),
  murderLocation: v.string(),
  room_id: v.string(),
});

export const conversationDetails = v.object({
  game_id: v.id('games'),
  npcs: v.array(v.string()),
});

const schema = defineSchema(
  {
    users: defineTable({
      address: v.string(),
    }).index('address', ['address']),
    games: defineTable({
      details: gameDetails,
    }),
    conversations: defineTable({
      game_id: v.id('games'),
      npcs: v.array(v.string()),
    }).index('id', ['game_id']),
    messages: defineTable({
      conversation_id: v.id('conversations'),
      npc_id: v.string(),
      content: v.string(),
    }).index('conversation_id', ['conversation_id', 'npc_id']),
  },
  { strictTableNameTypes: true, schemaValidation: true }
);

// eslint-disable-next-line import/no-default-export -- needed by convex
export default schema;
