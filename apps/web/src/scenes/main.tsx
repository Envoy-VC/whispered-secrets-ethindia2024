/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair -- safe */

/* eslint-disable @typescript-eslint/no-unsafe-assignment -- safe  */

/* eslint-disable @typescript-eslint/no-unsafe-member-access -- safe */

/* eslint-disable @typescript-eslint/no-non-null-assertion -- safe */
import Phaser from 'phaser';
import { render } from 'phaser-jsx';

import { Player, Typewriter } from '../components';
import { Depth, TILESET_NAME, TilemapLayer, key } from '../constants';

interface PlayerConfig {
  x: number;
  y: number;
}

interface Sign extends Phaser.Physics.Arcade.StaticBody {
  text?: string;
}

export class Main extends Phaser.Scene {
  private player!: Player;
  private sign!: Sign;
  private tilemap!: Phaser.Tilemaps.Tilemap;
  private worldLayer!: Phaser.Tilemaps.TilemapLayer;

  constructor(players?: PlayerConfig[]) {
    super(key.scene.main);
    for (const player of players ?? []) {
      this.addPlayer(player);
    }
  }

  create() {
    this.tilemap = this.make.tilemap({ key: key.tilemap.tuxemon });
    const tileset = this.tilemap.addTilesetImage(
      TILESET_NAME,
      key.image.tuxemon
    )!;

    this.tilemap.createLayer(TilemapLayer.BelowPlayer, tileset, 0, 0);
    this.worldLayer = this.tilemap.createLayer(
      TilemapLayer.World,
      tileset,
      0,
      0
    )!;
    const aboveLayer = this.tilemap.createLayer(
      TilemapLayer.AbovePlayer,
      tileset,
      0,
      0
    )!;

    this.worldLayer.setCollisionByProperty({ collides: true });
    this.physics.world.bounds.width = this.worldLayer.width;
    this.physics.world.bounds.height = this.worldLayer.height;

    aboveLayer.setDepth(Depth.AbovePlayer);

    this.addPlayer();

    this.cameras.main.setBounds(
      0,
      0,
      this.tilemap.widthInPixels,
      this.tilemap.heightInPixels
    );

    this.input.keyboard!.on('keydown-ESC', () => {
      this.scene.pause(key.scene.main);
      this.scene.launch(key.scene.menu);
    });
  }

  private addPlayer(props?: PlayerConfig) {
    if (props) {
      this.player = new Player(this, props.x, props.y);
    } else {
      const spawnPoint = this.tilemap.findObject(
        TilemapLayer.Objects,
        ({ name }) => name === 'Spawn Point'
      )!;
      this.player = new Player(this, spawnPoint.x!, spawnPoint.y!);
    }

    this.addPlayerSignInteraction();
    this.physics.add.collider(this.player, this.worldLayer);
  }

  private addPlayerSignInteraction() {
    const sign = this.tilemap.findObject(
      TilemapLayer.Objects,
      ({ name }) => name === 'Sign'
    )!;

    this.sign = this.physics.add.staticBody(
      sign.x!,
      sign.y!,
      sign.width,
      sign.height
    );
    this.sign.text = sign.properties[0].value;

    type ArcadeColliderType = Phaser.Types.Physics.Arcade.ArcadeColliderType;

    this.physics.add.overlap(
      this.sign as unknown as ArcadeColliderType,
      this.player.selector as unknown as ArcadeColliderType,
      (sign) => {
        if (this.player.cursors.space.isDown) {
          render(<Typewriter text={(sign as unknown as Sign).text!} />, this);
        }
      },
      undefined,
      this
    );
  }

  update() {
    this.player.update();
  }
}
