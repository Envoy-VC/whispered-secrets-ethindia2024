/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair -- safe  */

/* eslint-disable @typescript-eslint/no-non-null-assertion -- safe  */
import type Phaser from 'phaser';
import { Text, createRef } from 'phaser-jsx';

interface ButtonProps {
  center?: boolean;
  children: string;
  fixed?: boolean;
  onClick?: () => void;
  x?: number;
  y?: number;
}

export const PhasorButton = (props: ButtonProps) => {
  const { center, children, fixed, onClick, ...textProps } = props;
  const ref = createRef<Phaser.GameObjects.Text>();

  function onMouseOver() {
    ref.current!.setTint(0xdddddd);
  }

  function onMouseOut() {
    ref.current!.setTint(0xffffff);
  }

  return (
    <Text
      {...textProps}
      ref={ref}
      input={{ cursor: 'pointer' }}
      originX={center ? 0.5 : undefined}
      originY={center ? 0.5 : undefined}
      scrollFactorX={fixed ? 0 : undefined}
      scrollFactorY={fixed ? 0 : undefined}
      text={children}
      style={{
        color: '#000',
        fontFamily: 'monospace',
        fontSize: '18px',
        backgroundColor: '#fff',
        // @ts-expect-error padding is not in the Phaser types
        padding: { x: 20, y: 10 },
      }}
      onPointerDown={onClick}
      onPointerOut={onMouseOut}
      onPointerOver={onMouseOver}
    />
  );
};
