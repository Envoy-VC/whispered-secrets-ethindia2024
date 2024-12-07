/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair -- safe */

/* eslint-disable @typescript-eslint/restrict-plus-operands -- safe  */

/* eslint-disable @typescript-eslint/no-non-null-assertion -- safe  */
import type Phaser from 'phaser';
import { Text, createRef, useScene } from 'phaser-jsx';

import { Depth } from '../constants';

interface TypewriterProps {
  text: string;
  onEnd?: () => void;
}

export const Typewriter = (props: TypewriterProps) => {
  const scene = useScene();
  const ref = createRef<Phaser.GameObjects.Text>();
  let index = 0;

  const timer = scene.time.addEvent({
    callback() {
      ref.current!.text += props.text[index];
      index++;

      if (index >= props.text.length) {
        removeTimer(timer, scene);

        const oneshot = scene.time.delayedCall(1500, () => {
          ref.current!.destroy();
          removeTimer(oneshot, scene);
          if (typeof props.onEnd === 'function') {
            props.onEnd();
          }
        });
      }
    },

    delay: 100,
    repeat: props.text.length - 1,
  });

  return (
    <Text
      ref={ref}
      alpha={0.95}
      depth={Depth.AboveWorld}
      scrollFactorX={0}
      scrollFactorY={0}
      x={16}
      y={16}
      style={{
        color: '#000',
        fontFamily: 'monospace',
        fontSize: '18px',
        backgroundColor: '#fff',
        // @ts-expect-error padding  is not in the type
        padding: { x: 20, y: 10 },
      }}
    />
  );
};

function removeTimer(timer: Phaser.Time.TimerEvent, scene: Phaser.Scene) {
  timer.destroy();
  scene.time.removeEvent(timer);
}
