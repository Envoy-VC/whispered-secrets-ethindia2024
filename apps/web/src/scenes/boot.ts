import { Scene } from 'phaser';

import * as assets from '../assets';
import { key } from '../constants';

export class Boot extends Scene {
  constructor() {
    super(key.scene.boot);
  }

  preload() {
    this.load.spritesheet(key.image.spaceman, assets.sprites.spaceman.src, {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.image(key.image.tuxemon, assets.tilesets.tuxemon.src);
    this.load.tilemapTiledJSON(key.tilemap.tuxemon, assets.tilemaps.tuxemon);
    this.load.atlas(
      key.atlas.player,
      assets.atlas.image.src,
      assets.atlas.data
    );
  }

  create() {
    this.scene.start(key.scene.main);
  }
}