'use client';

import { useMemo } from 'react';

import { whisperedConfig } from '~/lib/wagmi';

import type { Doc } from 'convex/_generated/dataModel';
import { useReadContract } from 'wagmi';

export interface ScoreProps {
  game: Doc<'games'>;
}

const Scores = ({ game }: ScoreProps) => {
  const { data: scores } = useReadContract({
    ...whisperedConfig,
    functionName: 'getVotes',
    args: [game._id],
  });

  const data = useMemo(() => {
    const map = new Map<Doc<'games'>['details']['npcs'][number], number>();
    for (const score of scores ?? []) {
      const npc = game.details.npcs.find((npc) => npc.id === score);
      if (npc) {
        map.set(npc, (map.get(npc) ?? 0) + 1);
      }
    }

    return map.entries();
  }, [game.details.npcs, scores]);
  return (
    <div className='absolute top-4 right-1/2 translate-x-1/2'>
      <div className='flex flex-col items-center'>
        <h2 className='text-2xl font-bold'>Votes</h2>
        <div className='flex flex-col items-center'>
          {Array.from(data).map(([npc, score]) => (
            <div key={npc.id} className='flex flex-row items-center gap-2'>
              <span className='text-lg font-bold'>{npc.npcName}: </span>
              <span className='text-lg font-bold'>{score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Scores;
