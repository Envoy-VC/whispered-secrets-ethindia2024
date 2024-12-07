'use client';

import { useEffect, useRef } from 'react';

import type { Infer } from 'convex/values';
import { Direction } from 'grid-engine';
import Phaser from 'phaser';

import type { npcDetails } from '../../convex/schema';
import { type PhaserWithGridEngine, config } from './config';

type NPC = Infer<typeof npcDetails>;

interface GameProps {
  me: NPC;
  others: NPC[];
}

export const Game = ({ me, others }: GameProps) => {
  const gameContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const game = new Phaser.Game(
      config(preload, create, update, gameContainerRef)
    );

    function preload(this: Phaser.Scene) {
      this.load.image('tiles', '../../public/assets/cloud-tileset.png');
      this.load.tilemapTiledJSON(
        'cloud-city-map',
        '../../public/assets/cloud_city.json'
      );
      this.load.spritesheet('player', '../../public/assets/characters.png', {
        frameWidth: 52,
        frameHeight: 72,
      });
    }

    function create(this: PhaserWithGridEngine) {
      const cloudCityTilemap = this.make.tilemap({ key: 'cloud-city-map' });
      cloudCityTilemap.addTilesetImage('Cloud City', 'tiles');

      cloudCityTilemap.layers.forEach((layer, i) => {
        const createdLayer = cloudCityTilemap.createLayer(
          i,
          'Cloud City',
          0,
          0
        );
        if (createdLayer) {
          createdLayer.scale = 3;
        }
      });

      const playerSprite = this.add.sprite(0, 0, 'player');
      playerSprite.scale = 1.5;

      const text = this.add.text(0, -10, me.npcName);
      text.setColor('#000000');
      const container = this.add.container(0, 0, [playerSprite, text]);
      this.cameras.main.startFollow(container, true);
      this.cameras.main.setFollowOffset(
        -playerSprite.width,
        -playerSprite.height
      );

      const otherSprites: Phaser.GameObjects.Sprite[] = [];

      // eslint-disable-next-line @typescript-eslint/prefer-for-of -- need
      for (let i = 0; i < others.length; i++) {
        const otherSprite = this.add.sprite(0, 0, 'player');
        otherSprite.scale = 1.5;
        otherSprites.push(otherSprite);
      }

      const gridEngineConfig = {
        characters: [
          {
            id: 'me',
            sprite: playerSprite,
            container,
            walkingAnimationMapping: 6,
            walkingAnimationEnabled: true,
            startPosition: { x: 8, y: 8 },
          },
          ...others.map((other, i) => ({
            id: `other-${String(i)}`,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we know it would be defined
            sprite: otherSprites[i]!,
            walkingAnimationMapping: Math.floor(Math.random() * 4 + 2),
            walkingAnimationEnabled: true,
            startPosition: {
              x: 13,
              y: 8,
            },
          })),
        ],
      };

      this.gridEngine?.create(cloudCityTilemap, gridEngineConfig);

      for (let i = 0; i < others.length; i++) {
        this.gridEngine?.moveRandomly(
          `other-${String(i)}`,
          Math.floor(Math.random() * 3000) + 1000
        );
      }
    }

    function update(this: PhaserWithGridEngine) {
      const cursors = this.input.keyboard?.createCursorKeys();
      if (cursors) {
        if (cursors.left.isDown) {
          this.gridEngine?.move('me', Direction.LEFT);
        } else if (cursors.right.isDown) {
          this.gridEngine?.move('me', Direction.RIGHT);
        } else if (cursors.up.isDown) {
          this.gridEngine?.move('me', Direction.UP);
        } else if (cursors.down.isDown) {
          this.gridEngine?.move('me', Direction.DOWN);
        }
      }
    }

    return () => {
      game.destroy(true);
    };
  }, [me.npcName, others]);

  return <div ref={gameContainerRef} className='h-screen w-full' />;
};
