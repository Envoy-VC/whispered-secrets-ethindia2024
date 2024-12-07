import { Rectangle, useScene } from 'phaser-jsx';

export const Overlay = () => {
  const scene = useScene();
  const { width, height } = scene.cameras.main;

  return (
    <Rectangle
      width={width * 2}
      height={height * 2}
      fillColor={0x000000}
      alpha={0.5}
      scrollFactorX={0}
      scrollFactorY={0}
    />
  );
};
