import { useState } from 'react';

import { cn } from '@repo/ui/lib/utils';
import BulletLogo from 'public/bullet.png';

export const homeMenuItems = [
  {
    name: 'Continue Game',
    key: 'continue-game',
    action: () => {
      return true;
    },
  },
  {
    name: 'New Game',
    key: 'new-game',
    action: () => {
      return true;
    },
  },
  {
    name: 'Options',
    key: 'options',
    action: () => {
      return true;
    },
  },
  {
    name: 'About',
    key: 'about',
    action: () => {
      return true;
    },
  },
] as const;

type HomeMenuItem = (typeof homeMenuItems)[number]['key'];

export const HomeMenu = () => {
  const [hovered, setHovered] = useState<HomeMenuItem | null>(null);

  return (
    <div className='flex w-full max-w-xs flex-col items-end gap-3'>
      {homeMenuItems.map((item) => {
        return (
          <button
            key={item.key}
            className='group w-full cursor-pointer'
            type='button'
            onClick={item.action}
            onMouseEnter={() => setHovered(item.key)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className='w-full rounded p-2 text-2xl font-medium text-neutral-400 transition-all duration-300 ease-in-out group-hover:-translate-x-2 group-hover:scale-[104%] group-hover:text-neutral-200'>
              <img
                alt='Bullet Logo'
                height={32}
                src={BulletLogo}
                width={32}
                className={cn(
                  'mr-2 inline-block opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-100',
                  hovered === item.key ? 'visible' : 'invisible'
                )}
              />

              {item.name}
            </div>
          </button>
        );
      })}
    </div>
  );
};
