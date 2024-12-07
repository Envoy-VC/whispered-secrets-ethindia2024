import { GameButton } from '@repo/ui/components/ui/game-button';
import { ConnectKitButton } from 'connectkit';

export const ConnectButton = () => {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress, ensName }) => {
        return (
          <GameButton onClick={show}>
            {isConnected ? (ensName ?? truncatedAddress) : 'Connect Wallet'}
          </GameButton>
        );
      }}
    </ConnectKitButton.Custom>
  );
};
