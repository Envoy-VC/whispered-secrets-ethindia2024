import { Outlet, createRootRoute } from '@tanstack/react-router';
import { ConvexClientProvider, Web3Provider } from '~/providers';

const RootComponent = () => {
  return (
    <ConvexClientProvider>
      <Web3Provider>
        <Outlet />
      </Web3Provider>
    </ConvexClientProvider>
  );
};

export const Route = createRootRoute({
  component: RootComponent,
});
