import '@repo/ui/globals.css';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import {
  ConvexClientProvider,
  HuddleProvider,
  Web3Provider,
} from '~/providers';
import '~/styles/globals.css';

const RootComponent = () => {
  return (
    <ConvexClientProvider>
      <Web3Provider>
        <HuddleProvider>
          <Outlet />
        </HuddleProvider>
      </Web3Provider>
    </ConvexClientProvider>
  );
};

export const Route = createRootRoute({
  component: RootComponent,
});
