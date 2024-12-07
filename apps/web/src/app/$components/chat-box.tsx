import { useState } from 'react';

import { generateNextMessage } from '~/lib/ai/generate-completion';
import { invokeContract } from '~/lib/cdp';
import { cn } from '~/lib/utils';

import { GameButton } from '@repo/ui/components/ui/game-button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
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
  const mutationCallback = useMutation(api.chat.npcCallback);

  const [invoking, setInvoking] = useState<boolean>(false);

  const onSend = async () => {
    const res = await mutation({
      gameId: gameId as Id<'games'>,
      playerId,
      npcId,
      message,
    });
    setMessage('');

    if (typeof res === 'object' && res) {
      console.log('Waiting for response');
      const message = await generateNextMessage(
        res.game,
        res.messages,
        res.npcId
      );
      console.log('Message:', message);
      await mutationCallback({
        content: message ?? '',
        gameId: gameId as Id<'games'>,
        conversationId: res.conversationId,
        playerNPCId: playerId,
      });
    }
  };
  return (
    <div className='hide-scrollbar flex h-[80dvh] flex-col justify-between gap-2 overflow-y-scroll'>
      <div className='flex w-full flex-col gap-2 px-4'>
        {messages?.map((m) => {
          return (
            <div
              key={m._id}
              className={cn(
                'flex',
                m.npc_id === npcId ? 'justify-start' : 'justify-end'
              )}
            >
              <div
                className={cn(
                  'w-fit rounded-lg bg-[#3A4466] p-2 font-mono',
                  m.npc_id === npcId ? 'text-[#8B9BB4]' : 'text-black'
                )}
              >
                {m.content}
              </div>
            </div>
          );
        })}
      </div>
      <div className='flex flex-row gap-2'>
        <input
          className='w-full rounded-2xl bg-[#3A4466] p-3 font-mono outline-none'
          placeholder='Type your message here'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              void onSend();
            }
          }}
        />
        <div className='flex flex-row items-center gap-2'>
          <GameButton onClick={onSend}>Send</GameButton>
          <GameButton
            onClick={async () => {
              try {
                setInvoking(true);
                const res = await invokeContract(gameId, npcId);
                console.log(res);
                if (res.status === 'success') {
                  // eslint-disable-next-line no-alert -- need this
                  alert('Contract invoked successfully');
                }
              } catch (error: unknown) {
                console.error(error);
                setInvoking(false);
              } finally {
                setInvoking(false);
              }
            }}
          >
            {invoking ? 'Invoking...' : 'Invoke'}
          </GameButton>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
