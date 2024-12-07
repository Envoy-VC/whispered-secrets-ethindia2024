'use server';

import { env } from '~/env';

export const createRoom = async (roomName: string, hostWallet: string) => {
  const response = await fetch(
    'https://api.huddle01.com/api/v2/sdk/rooms/create-room',
    {
      method: 'POST',
      body: JSON.stringify({
        title: roomName,
        hostWallets: [hostWallet],
      }),
      headers: {
        'Content-type': 'application/json',
        'x-api-key': env.HUDDLE_API_KEY,
      },
    }
  );

  const result = (await response.json()) as
    | {
        success: true;
        data: {
          roomId: string;
        };
      }
    | {
        success: false;
        error: unknown;
      };

  if (!result.success) {
    throw new Error('Failed to create room');
  }

  return result.data.roomId;
};
