import { useCallback, useEffect, useLayoutEffect, useState } from 'react';

export interface Size {
  width: number;
  height: number;
}

function useElementSize(): [(node: HTMLElement | null) => void, Size] {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  const handleSize = useCallback(() => {
    if (ref) {
      setSize({
        width: ref.offsetWidth,
        height: ref.offsetHeight,
      });
    }
  }, [ref]);

  const useEnviromentEffect =
    typeof window !== 'undefined' ? useLayoutEffect : useEffect;

  useEnviromentEffect(() => {
    if (!ref) return;

    handleSize();

    const resizeObserver = new ResizeObserver(handleSize);
    resizeObserver.observe(ref);

    return () => resizeObserver.disconnect();
  }, [ref, handleSize]);

  return [setRef, size];
}

export { useElementSize };
