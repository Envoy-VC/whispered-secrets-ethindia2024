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

        <PhasorButton center fixed onClick={this.exit} x={centerX} y={centerY}>
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
