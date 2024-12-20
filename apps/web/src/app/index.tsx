import { createFileRoute } from '@tanstack/react-router';
import BackgroundImage from 'public/background.jpg';
import LogoText from 'public/logo-text.svg';

import { ConnectButton, HomeMenu } from './$components';

const HomeComponent = () => {
  return (
    <div className='relative'>
      <div className='absolute top-8 right-8 z-[3]'>
        <ConnectButton />
      </div>
      <div className='absolute top-0 right-0 z-[2] flex h-screen w-full max-w-md flex-col items-start justify-evenly'>
        <img
          alt='Logo Text'
          className='w-84'
          height={100}
          src={LogoText as unknown as string}
          width={100}
        />
        <HomeMenu />
      </div>
      <img
        alt='Background'
        className='z-[-1] h-screen w-full'
        height={1080}
        src={BackgroundImage}
        width={1920}
      />
    </div>
  );
};

export const Route = createFileRoute('/')({
  component: HomeComponent,
});
