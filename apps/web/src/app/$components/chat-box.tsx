import { useState } from 'react';

import { cn } from '~/lib/utils';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@repo/ui/ui/sheet';
import { useMutation, useQuery } from 'convex/react';
import type { NPC } from '~/types';

import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';

export interface ChatBoxProps {
  me: NPC;
  others: NPC[];
  gameId: string;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

const ChatBox = ({ me, others, isOpen, setOpen, gameId }: ChatBoxProps) => {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetTrigger>Open</SheetTrigger>
      <SheetContent className='font-body !w-[40dvw] !rounded-none border-[10px] border-[rgb(23,20,33)] bg-[rgb(35,38,58)] text-neutral-100'>
        <SheetHeader>
          <SheetTitle>Chat with other Suspects</SheetTitle>
          <SheetDescription className='flex flex-col gap-2'>
            <div className='flex cursor-pointer flex-row items-center gap-2 py-4'>
              {others.map((o) => {
                return (
                  <button
                    key={o.id}
                    type='button'
                    className={cn(
                      'rounded-xl px-2 py-[2px] text-lg duration-300 ease-in-out',
                      activeChatId === o.id
                        ? 'bg-black text-[#8B9BB4]'
                        : 'bg-[#8B9BB4] text-black'
                    )}
                    onClick={() => {
                      setActiveChatId(o.id);
                    }}
                  >
                    {o.npcName}
                  </button>
                );
              })}
            </div>
            {activeChatId ? (
              <ChatContainer
                gameId={gameId}
                npcId={activeChatId}
                playerId={me.id}
              />
            ) : null}
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

const ChatContainer = ({
  playerId,
  npcId,
  gameId,
}: {
  playerId: string;
  npcId: string;
  gameId: string;
}) => {
  const [message, setMessage] = useState<string>('');
  const messages = useQuery(api.chat.getChats, {
    gameId: gameId as Id<'games'>,
    ids: [npcId, playerId],
  });

  const mutation = useMutation(api.chat.sendChat);
  return (
    <div className='flex flex-col gap-2'>
      {messages?.map((m) => {
        return <div key={m._id}>{m.content}</div>;
      })}
      <div className='flex flex-row gap-2'>
        <input value={message} onChange={(e) => setMessage(e.target.value)} />
        <button
          type='button'
          onClick={async () => {
            console.log('sending');
            await mutation({
              gameId: gameId as Id<'games'>,
              playerId,
              npcId,
              message,
            });
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
