import { useEffect } from 'react';

import { getAccessToken } from '~/lib/huddle';

import { Audio } from '@huddle01/react/components';
import {
  useLocalAudio,
  usePeerIds,
  useRemoteAudio,
  useRoom,
} from '@huddle01/react/hooks';
import { GameButton } from '@repo/ui/components/ui/game-button';
import type { Doc } from 'convex/_generated/dataModel';

import { MicIcon, MicOffIcon } from 'lucide-react';

interface ControlProps {
  game: Doc<'games'>;
}

const Huddle01Controls = ({ game }: ControlProps) => {
  const roomId = game.details.room_id;

  const { joinRoom } = useRoom();

  const { enableAudio, disableAudio, isAudioOn } = useLocalAudio();
  const { peerIds } = usePeerIds();

  useEffect(() => {
    const join = async () => {
      const accessToken = await getAccessToken(roomId);
      console.log('Access token:', accessToken);
      await joinRoom({
        roomId,
        token: accessToken,
      });
    };

    void join();
  }, [joinRoom, roomId]);

  return (
    <div className='absolute top-24 right-6 py-4'>
      {peerIds.map((peerId) => (
        <RemotePeer key={peerId} peerId={peerId} />
      ))}
      <div className='flex flex-col gap-2'>
        <GameButton
          onClick={async () => {
            if (isAudioOn) {
              await disableAudio();
            } else {
              await enableAudio();
            }
          }}
        >
          {isAudioOn ? <MicIcon /> : <MicOffIcon />}
        </GameButton>
      </div>
    </div>
  );
};

const RemotePeer = ({ peerId }: { peerId: string }) => {
  const { stream: audioStream } = useRemoteAudio({ peerId });

  return <div>{audioStream ? <Audio stream={audioStream} /> : null}</div>;
};

export default Huddle01Controls;
