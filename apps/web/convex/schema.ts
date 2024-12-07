import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export const playerDetails = v.object({
  id: v.string(),
  playerName: v.string(),
  identity: v.optional(v.string()),
  plan: v.optional(v.string()),
  relationWithVictim: v.optional(v.string()),
});

export const gameDetails = v.object({
  plot: v.string(),
  players: v.array(playerDetails),
  killer: playerDetails,
  murderWeapon: v.string(),
  murderLocation: v.string(),
});

const schema = defineSchema(
  {
    users: defineTable({
      address: v.string(),
    }).index('address', ['address']),
    games: defineTable({
      id: v.string(),
      players: v.array(v.id('users')),
      details: gameDetails,
      room_id: v.string(),
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
    }).index('id', ['id', 'game_id', 'players']),
  },
  { strictTableNameTypes: true, schemaValidation: true }
);

// eslint-disable-next-line import/no-default-export -- needed by convex
export default schema;
