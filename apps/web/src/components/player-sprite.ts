/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair -- safe */

/* eslint-disable @typescript-eslint/no-non-null-assertion -- safe */

/* eslint-disable @typescript-eslint/switch-exhaustiveness-check -- safe */
import Phaser from 'phaser';

import { key } from '../constants';

enum Animation {
  Left = 'player_left',
  Right = 'player_right',
  Up = 'player_up',
  Down = 'player_down',
}

type Cursors = Record<
  'w' | 'a' | 's' | 'd' | 'up' | 'left' | 'down' | 'right' | 'space',
  Phaser.Input.Keyboard.Key
>;

const Velocity = {
  Horizontal: 175,
  Vertical: 175,
} as const;

export class Player extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;
  cursors: Cursors;
  selector: Phaser.Physics.Arcade.StaticBody;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture = key.atlas.player,
    frame = 'misa-front'
  ) {
    super(scene, x, y, texture, frame);
    scene.add.existing(this);
    scene.physics.world.enable(this);
    this.setSize(32, 42).setOffset(0, 22);
    this.setCollideWorldBounds(true);

    scene.cameras.main.startFollow(this);
    scene.cameras.main.setZoom(1);

    this.cursors = this.createCursorKeys();

    this.createAnimations();

    this.selector = scene.physics.add.staticBody(x - 8, y + 32, 16, 16);
  }

  private createCursorKeys() {
    return this.scene.input.keyboard!.addKeys(
      'w,a,s,d,up,left,down,right,space'
    ) as Cursors;
  }

  private createAnimations() {
    const anims = this.scene.anims;

    if (!anims.exists(Animation.Left)) {
      anims.create({
        key: Animation.Left,
        frames: anims.generateFrameNames(key.atlas.player, {
          prefix: 'misa-left-walk.',
          start: 0,
          end: 3,
          zeroPad: 3,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }

    if (!anims.exists(Animation.Right)) {
      anims.create({
        key: Animation.Right,
        frames: anims.generateFrameNames(key.atlas.player, {
          prefix: 'misa-right-walk.',
          start: 0,
          end: 3,
          zeroPad: 3,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }

    if (!anims.exists(Animation.Up)) {
      anims.create({
        key: Animation.Up,
        frames: anims.generateFrameNames(key.atlas.player, {
          prefix: 'misa-back-walk.',
          start: 0,
          end: 3,
          zeroPad: 3,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }

    if (!anims.exists(Animation.Down)) {
      anims.create({
        key: Animation.Down,
        frames: anims.generateFrameNames(key.atlas.player, {
          prefix: 'misa-front-walk.',
          start: 0,
          end: 3,
          zeroPad: 3,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }
  }

  private moveSelector(animation: Animation) {
    const { body, selector } = this;

    switch (animation) {
      case Animation.Left:
        selector.x = body.x - 19;
        selector.y = body.y + 14;
        break;

      case Animation.Right:
        selector.x = body.x + 35;
        selector.y = body.y + 14;
        break;

      case Animation.Up:
        selector.x = body.x + 8;
        selector.y = body.y - 18;
        break;

      case Animation.Down:
        selector.x = body.x + 8;
        selector.y = body.y + 46;
        break;
    }
  }

  update() {
    const { anims, body, cursors } = this;
    const prevVelocity = body.velocity.clone();

    body.setVelocity(0);

    switch (true) {
      case cursors.left.isDown:
      case cursors.a.isDown:
        body.setVelocityX(-Velocity.Horizontal);
        break;

      case cursors.right.isDown:
      case cursors.d.isDown:
        body.setVelocityX(Velocity.Horizontal);
        break;
    }

    switch (true) {
      case cursors.up.isDown:
      case cursors.w.isDown:
        body.setVelocityY(-Velocity.Vertical);
        break;

      case cursors.down.isDown:
      case cursors.s.isDown:
        body.setVelocityY(Velocity.Vertical);
        break;
    }

    body.velocity.normalize().scale(Velocity.Horizontal);

    switch (true) {
      case cursors.left.isDown:
      case cursors.a.isDown:
        anims.play(Animation.Left, true);
        this.moveSelector(Animation.Left);
        break;

      case cursors.right.isDown:
      case cursors.d.isDown:
        anims.play(Animation.Right, true);
        this.moveSelector(Animation.Right);
        break;

      case cursors.up.isDown:
      case cursors.w.isDown:
        anims.play(Animation.Up, true);
        this.moveSelector(Animation.Up);
        break;

      case cursors.down.isDown:
      case cursors.s.isDown:
        anims.play(Animation.Down, true);
        this.moveSelector(Animation.Down);
        break;

      default:
        anims.stop();
        switch (true) {
          case prevVelocity.x < 0:
            this.setTexture(key.atlas.player, 'misa-left');
            this.moveSelector(Animation.Left);
            break;

          case prevVelocity.x > 0:
            this.setTexture(key.atlas.player, 'misa-right');
            this.moveSelector(Animation.Right);
            break;

          case prevVelocity.y < 0:
            this.setTexture(key.atlas.player, 'misa-back');
            this.moveSelector(Animation.Up);
            break;

          case prevVelocity.y > 0:
            this.setTexture(key.atlas.player, 'misa-front');
            this.moveSelector(Animation.Down);
            break;
        }
    }
  }
}
