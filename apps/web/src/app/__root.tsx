import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { ConvexClientProvider, Web3Provider } from '~/providers';

const RootComponent = () => {
  return (
    <ConvexClientProvider>
      <Web3Provider>
        <Outlet />
        {import.meta.env.MODE === 'development' && (
          <TanStackRouterDevtools position='bottom-right' />
        )}
      </Web3Provider>
    </ConvexClientProvider>
  );
};

export const Route = createRootRoute({
  component: RootComponent,
});
