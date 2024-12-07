import { useState } from 'react';

import {
  type PlayerType,
  generateKillerDetails,
  generatePlayers,
  generatePlot,
} from '~/lib/ai';
import { createRoom } from '~/lib/huddle';
import { cn } from '~/lib/utils';

import { GameButton } from '@repo/ui/components/ui/game-button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from '@repo/ui/ui/dialog';
import { useNavigate } from '@tanstack/react-router';
import { useMutation } from 'convex/react';
import retry from 'p-retry';
import BulletLogo from 'public/bullet.png';
import ShortUniqueId from 'short-unique-id';
import { useAccount } from 'wagmi';

import { api } from '../../../convex/_generated/api';

type GameGenerationStatus =
  | 'idle'
  | 'generating-plot'
  | 'generating-players'
  | 'generating-clues'
  | 'complete';

const message: Record<GameGenerationStatus, string> = {
  idle: 'Generate a new game',
  'generating-plot': 'Generating plot...',
  'generating-players': 'Generating players...',
  'generating-clues': 'Generating clues...',
  complete: 'Game generated!',
};

const NewGame = () => {
  const [hovered, setHovered] = useState<boolean>(false);

  const [status, setStatus] = useState<GameGenerationStatus>('idle');

  const [open, setOpen] = useState<boolean>(false);

  const [plot, setPlot] = useState<string>('');
  const [players, setPlayers] = useState<PlayerType[]>([]);
  const [killer, setKiller] = useState<PlayerType | null>(null);
  const [murderWeapon, setMurderWeapon] = useState<string | null>(null);
  const [murderLocation, setMurderLocation] = useState<string | null>(null);

  const mutate = useMutation(api.games.createGame);

  const navigate = useNavigate();

  const { address } = useAccount();

  const onOpenChange = (open: boolean) => {
    setOpen(open);
    setStatus('idle');
    setPlot('');
    setPlayers([]);
    setMurderWeapon(null);
    setMurderLocation(null);
  };

  const onGenerateGame = async () => {
    try {
      setOpen(open);
      console.log('Generating game');
      const reader = generatePlot();
      setStatus('generating-plot');
      let isStreaming = true;
      while (isStreaming) {
        const { done, value } = await reader.read();
        if (done) {
          isStreaming = false;
          continue;
        }
        setPlot((prev) => prev + value);
      }

      setStatus('generating-players');

      const genPlayers = async () => {
        const { players } = await generatePlayers(plot);
        setPlayers(players);

        return { players };
      };

      const { players } = await retry(genPlayers, {
        retries: 3,
      });

      const genClues = async () => {
        setStatus('generating-clues');
        const { killer, murderLocation, murderWeapon } =
          await generateKillerDetails(plot, players);
        setKiller(killer);
        setMurderWeapon(murderWeapon);
        setMurderLocation(murderLocation);
        setStatus('complete');
        return { killer, murderLocation, murderWeapon };
      };

      const { killer, murderLocation, murderWeapon } = await retry(genClues, {
        retries: 3,
      });

      setStatus('generating-clues');

      console.log({
        plot,
        players,
        killer,
        murderLocation,
        murderWeapon,
      });

      setStatus('complete');
    } catch (error) {
      setStatus('idle');
      console.error(error);
    }
  };

  const onCreateGame = async () => {
    if (status !== 'complete') {
      return;
    }

    if (!address) return;

    if (
      !players.length ||
      !plot ||
      !killer ||
      !murderWeapon ||
      !murderLocation
    ) {
      return;
    }

    try {
      const id = new ShortUniqueId({ length: 10 });
      const npcsWithId = players.map((p) => ({
        id: id.rnd(),
        npcName: p.playerName,
        npcIdentity: p.identity,
        npcPlan: p.plan,
        npcRelationWithVictim: p.relationWithVictim,
      }));

      const killerId = npcsWithId.find(
        (p) => p.npcName === killer.playerName
      )?.id;

      if (!killerId) {
        throw new Error('Killer not found');
      }

      const killerIdWithId = {
        npc_id: killerId,
      };

      const roomId = await createRoom(id.rnd(), address);

      const res = await mutate({
        address,
        details: {
          npcs: npcsWithId,
          players: [],
          plot,
          killer: killerIdWithId,
          murderWeapon,
          murderLocation,
          room_id: roomId,
        },
      });

      console.log(res);

      await navigate({
        to: '/game/$gameId',
        params: {
          gameId: res,
        },
      });

      await navigate({
        to: '/game/$gameId',
        params: { gameId: res },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button
          className='group w-full cursor-pointer'
          type='button'
          onClick={onGenerateGame}
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
            New Game
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className='font-body w-full max-w-5xl !rounded-none border-[10px] border-[rgb(23,20,33)] bg-[rgb(35,38,58)] text-neutral-100'>
        <DialogHeader>
          <DialogDescription className='flex flex-col gap-2'>
            {plot ? (
              <div className='flex flex-col gap-2'>
                <div className='font-display text-3xl text-neutral-200'>
                  Plot
                </div>
                <div>{plot}</div>
              </div>
            ) : null}
            {players.length ? (
              <div className='flex flex-col gap-2'>
                <div className='font-display text-3xl text-neutral-200'>
                  Players
                </div>
                <div>
                  {players.map((player) => (
                    <div key={player.playerName}>
                      <div>
                        <span className='text-neutral-100'>Name: </span>
                        {player.playerName}
                      </div>
                      <div>
                        <span className='text-neutral-100'>Relation: </span>
                        {player.relationWithVictim}
                      </div>
                      <div>
                        <span className='text-neutral-100'>Identity: </span>
                        {player.identity}
                      </div>
                      <br />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {murderWeapon ? (
              <div className='flex flex-col gap-2'>
                <div className='font-display text-3xl text-neutral-200'>
                  Murder Weapon
                </div>
                <div>{murderWeapon}</div>
                <div className='font-display text-3xl text-neutral-200'>
                  Murder Location
                </div>
                <div>{murderLocation}</div>
                <br />
              </div>
            ) : null}
            {status !== 'complete' && (
              <div className='font-display py-6 text-center text-3xl text-neutral-100'>
                {message[status]}
              </div>
            )}
            <div className='mx-auto w-fit py-6'>
              {status === 'complete' && (
                <GameButton onClick={onCreateGame}>Start Game</GameButton>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default NewGame;
