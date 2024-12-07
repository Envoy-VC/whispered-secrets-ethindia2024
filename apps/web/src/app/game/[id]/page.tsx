import { useElementSize } from '~/hooks';

export const GamePage = () => {
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
