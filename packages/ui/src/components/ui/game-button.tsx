/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair -- safe */

/* eslint-disable jsx-a11y/alt-text -- safe  */
import { type MouseEventHandler, type ReactNode } from 'react';

import { clsx } from 'clsx';

export const GameButton = (props: {
  className?: string;
  href?: string;
  imgUrl?: string | ReactNode;
  onClick?: MouseEventHandler;
  title?: string;
  children?: ReactNode;
}) => {
  return (
    <a
      href={props.href}
      title={props.title}
      className={clsx(
        'button shadow-solid pointer-events-auto text-xl text-white',
        props.className
      )}
      onClick={props.onClick}
    >
      <div className='inline-block bg-[#3A4466]'>
        <div className='inline-flex h-full items-center gap-4'>
          {props.imgUrl && typeof props.imgUrl === 'string' ? (
            <img
              className='h-4 w-4 sm:h-[30px] sm:w-[30px]'
              src={props.imgUrl}
            />
          ) : null}
          {props.imgUrl && typeof props.imgUrl !== 'string'
            ? props.imgUrl
            : null}
          {props.children}
        </div>
      </div>
    </a>
  );
};
