import { createFileRoute } from '@tanstack/react-router';
import { useElementSize } from '~/hooks';

const GameComponent = () => {
  const [gameWrapperRef, { width, height }] = useElementSize();

  return (
    <div className='game-frame bg-brown-900 h-screen w-full'>
      <div
        ref={gameWrapperRef}
        className='bg-brown-900 relative h-full overflow-hidden'
      >
        <div className='absolute inset-0'>hello</div>
      </div>
    </div>
  );
};

export const Route = createFileRoute('/game')({
  component: GameComponent,
});
