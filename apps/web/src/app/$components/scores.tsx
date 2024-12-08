'use client';

import { useMemo, useState } from 'react';

import { whisperedConfig } from '~/lib/wagmi';

import type { Doc } from 'convex/_generated/dataModel';
import { useReadContract } from 'wagmi';

import { RefreshCcwIcon } from 'lucide-react';

export interface ScoreProps {
  game: Doc<'games'>;
}

const Scores = ({ game }: ScoreProps) => {
  const { data: scores, refetch } = useReadContract({
    ...whisperedConfig,
    functionName: 'getVotes',
    args: [game._id],
  });

  const [entries, setEntries] = useState<
    {
      type: Doc<'games'>['details']['npcs'][number];
      name: number;
    }[]
  >([]);

  useMemo(() => {
    const map = new Map<Doc<'games'>['details']['npcs'][number], number>();
    for (const score of scores ?? []) {
      const npc = game.details.npcs.find((npc) => npc.id === score);
      if (npc) {
        map.set(npc, (map.get(npc) ?? 0) + 1);
      }
    }

    const arr = Array.from(map, ([type, name]) => ({ type, name }));
    setEntries(arr);
    return true;
  }, [game.details.npcs, scores]);

  return (
    <div className='absolute top-4 right-1/2 translate-x-1/2'>
      <div className='flex flex-col items-center'>
        <div className='flex flex-row items-center gap-2'>
          <div className='font-display text-4xl text-neutral-900'>Accuses</div>
          <button
            className='cursor-pointer'
            type='button'
            onClick={async () => {
              const res = await refetch();
              console.log(res);
            }}
          >
            <RefreshCcwIcon size={18} strokeWidth={3} />
          </button>
        </div>
        <div className='flex flex-col items-center'>
          {entries.map(({ name, type }) => (
            <div key={type.id} className='flex flex-row items-center gap-2'>
              <span className='text-lg font-bold'>{type.npcName}: </span>
              <span className='text-lg font-bold'>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Scores;
