import { useState } from 'react';

import { cn } from '~/lib/utils';

import { GameButton } from '@repo/ui/components/ui/game-button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/ui/dialog';
import { useMutation } from 'convex/react';
import BulletLogo from 'public/bullet.png';
import { useAccount } from 'wagmi';

import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';

export const JoinGame = () => {
  const [hovered, setHovered] = useState<boolean>(false);
  const { address } = useAccount();

  const [open, setOpen] = useState<boolean>(false);
  const [gameId, setGameId] = useState<string>('');

  const mutate = useMutation(api.games.joinGame);

  const onJoinGame = async () => {
    try {
      setOpen(open);
      if (!address) return;
      const res = await mutate({
        address,
        gameId: gameId as Id<'games'>,
      });
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className='group w-full cursor-pointer'
          type='button'
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div className='w-full rounded p-2 text-2xl font-medium text-neutral-400 transition-all duration-300 ease-in-out group-hover:-translate-x-2 group-hover:scale-[104%] group-hover:text-neutral-200'>
            <img
              alt='Bullet Logo'
              height={32}
              src={BulletLogo}
              width={32}
              className={cn(
                'mr-2 inline-block opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-100',
                hovered ? 'visible' : 'invisible'
              )}
            />
            Join Game
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className='font-body w-full max-w-5xl !rounded-none border-[10px] border-[rgb(23,20,33)] bg-[rgb(35,38,58)] text-neutral-100'>
        <DialogHeader>
          <DialogTitle>Join Game</DialogTitle>
          <DialogDescription className='flex flex-col gap-2'>
            <div className='flex flex-row items-center gap-4'>
              <input
                className='w-full rounded border-[2px] border-[rgb(23,20,33)] bg-[rgb(35,38,58)] px-4 py-3 font-mono text-neutral-100'
                placeholder='Game Id'
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
              />
              <GameButton className='inline-block w-fit' onClick={onJoinGame}>
                Join Game
              </GameButton>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
