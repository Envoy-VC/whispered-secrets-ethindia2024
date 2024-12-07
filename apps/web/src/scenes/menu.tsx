/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair -- safe  */

/* eslint-disable @typescript-eslint/unbound-method -- safe  */

/* eslint-disable @typescript-eslint/no-non-null-assertion -- safe  */
import { Scene } from 'phaser';
import { render } from 'phaser-jsx';

import { Overlay, PhasorButton } from '../components';
import { key } from '../constants';

export class Menu extends Scene {
  constructor() {
    super(key.scene.menu);
  }

  create() {
    this.input.keyboard!.on('keydown-ESC', this.exit, this);
    const { centerX, centerY } = this.cameras.main;

    render(
      <>
        <Overlay />
        <PhasorButton center fixed x={centerX} y={centerY} onClick={this.exit}>
          Resume
        </PhasorButton>
      </>,
      this
    );
  }

  private exit() {
    this.scene.resume(key.scene.main);
    this.scene.stop();
  }
}
