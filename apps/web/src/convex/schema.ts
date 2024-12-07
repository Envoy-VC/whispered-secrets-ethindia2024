import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

const playerDetails = v.object({
  playerName: v.string(),
  identity: v.optional(v.string()),
  plan: v.optional(v.string()),
  relationWithVictim: v.optional(v.string()),
});

const gameDetails = v.object({
  plot: v.string(),
  players: v.array(playerDetails),
  killer: playerDetails,
  victim: playerDetails,
  murderWeapon: v.string(),
  murderLocation: v.string(),
});

const schema = defineSchema(
  {
    users: defineTable({
      id: v.string(),
      is_human: v.boolean(),
      address: v.optional(v.string()),
      name: v.string(),
      character: v.string(),
      identity: v.string(),
      plan: v.string(),
    }).index('id', ['id']),
    games: defineTable({
      id: v.string(),
      players: v.array(v.id('players')),
      details: gameDetails,
    }).index('id', ['id']),
    conversations: defineTable({
      id: v.string(),
      game_id: v.id('games'),
      players: v.array(v.id('users')),
      messages: v.array(
        v.object({
          id: v.string(),
          from: v.string(),
          content: v.string(),
        })
      ),
    }).index('id', ['id', 'game_id']),
  },
  { strictTableNameTypes: true, schemaValidation: true }
);

// eslint-disable-next-line import/no-default-export -- needed by convex
export default schema;
