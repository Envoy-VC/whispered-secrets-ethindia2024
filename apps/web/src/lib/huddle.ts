export const createRoom = async (roomName: string, hostWallet: string) => {
  const res = await fetch('http://localhost:8787/create-huddle-room', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title: roomName, hostWallets: [hostWallet] }),
  });

  const data = (await res.json()) as {
    status: 'success' | 'error';
    message: string;
  };

  if (data.status === 'error') {
    throw new Error(data.message);
  } else {
    return data.message;
  }
};
