import { type npcDetails } from 'convex/schema';
import { type Infer } from 'convex/values';

import type { Doc, Id } from '../../convex/_generated/dataModel';

export interface AnimatedSprite {
  x: number;
  y: number;
  w: number;
  h: number;
  layer: number;
  sheet: string;
  animation: string;
}

type TileLayer = number[][];

export interface WorldMap {
  width: number;
  height: number;
  tileSetUrl: string;
  tileSetDimX: number;
  tileSetDimY: number;
  tileDim: number;
  bgTiles: number[][][];
  objectTiles: TileLayer[];
  animatedSprites: AnimatedSprite[];
}

export type GameId = Id<'games'>;
export type ServerGame = Doc<'games'>;

export type NPC = Infer<typeof npcDetails>;
