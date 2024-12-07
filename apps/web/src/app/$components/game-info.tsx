import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
} from '@repo/ui/ui/sheet';

import type { Doc } from '../../../convex/_generated/dataModel';

export interface GameInfoProps {
  game: Doc<'games'>;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

export const GameInfo = ({ game, isOpen, setOpen }: GameInfoProps) => {
  const { details } = game;
  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent
        className='font-body !w-[40dvw] !rounded-none border-[10px] border-[rgb(23,20,33)] bg-[rgb(35,38,58)] text-neutral-100'
        side='left'
      >
        <SheetHeader>
          <SheetDescription className='flex flex-col gap-2'>
            <div className='flex flex-col gap-2'>
              <div className='font-display text-3xl text-neutral-200'>Plot</div>
              <div>{details.plot}</div>
            </div>
            {details.npcs.length ? (
              <div className='flex flex-col gap-2'>
                <div className='font-display text-3xl text-neutral-200'>
                  Players
                </div>
                <div>
                  {details.npcs.map((player) => (
                    <div key={player.id}>
                      <div>
                        <span className='text-neutral-100'>Name: </span>
                        {player.npcName}
                      </div>
                      <div>
                        <span className='text-neutral-100'>Relation: </span>
                        {player.npcRelationWithVictim}
                      </div>
                      <div>
                        <span className='text-neutral-100'>Identity: </span>
                        {player.npcIdentity}
                      </div>
                      <br />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            {details.murderWeapon ? (
              <div className='flex flex-col gap-2'>
                <div className='font-display text-3xl text-neutral-200'>
                  Murder Weapon
                </div>
                <div>{details.murderWeapon}</div>
                <div className='font-display text-3xl text-neutral-200'>
                  Murder Location
                </div>
                <div>{details.murderLocation}</div>
                <br />
              </div>
            ) : null}
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
