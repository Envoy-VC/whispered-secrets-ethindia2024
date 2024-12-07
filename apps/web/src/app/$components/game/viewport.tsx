/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair -- safe */

/* eslint-disable @typescript-eslint/no-unsafe-assignment -- safe */

/* eslint-disable @typescript-eslint/no-unsafe-argument -- safe */

/* eslint-disable @typescript-eslint/no-explicit-any -- safe */

/* eslint-disable @typescript-eslint/no-unsafe-member-access -- safe */
import { type MutableRefObject, type ReactNode } from 'react';

import { PixiComponent } from '@pixi/react';
import { Viewport } from 'pixi-viewport';
import type { Application } from 'pixi.js';

export interface ViewportProps {
  app: Application;
  viewportRef?: MutableRefObject<Viewport | undefined>;
  screenWidth: number;
  screenHeight: number;
  worldWidth: number;
  worldHeight: number;
  children?: ReactNode;
}

export const PixiViewport = PixiComponent('Viewport', {
  create(props: ViewportProps) {
    const { viewportRef, ...viewportProps } = props;
    const viewport = new Viewport({
      passiveWheel: false,
      ...viewportProps,
    });
    if (viewportRef) {
      viewportRef.current = viewport;
    }
    viewport
      .drag()
      .pinch({})
      .wheel()
      .decelerate()
      .clamp({ direction: 'all', underflow: 'center' })
      .setZoom(-10)
      .clampZoom({
        minScale: (1.04 * props.screenWidth) / (props.worldWidth / 2),
        maxScale: 3.0,
      });
    return viewport;
  },
  applyProps(viewport, oldProps: any, newProps: any) {
    Object.keys(newProps).forEach((p) => {
      if (
        p !== 'app' &&
        p !== 'viewportRef' &&
        p !== 'children' &&
        oldProps[p] !== newProps[p]
      ) {
        // @ts-expect-error Ignoring TypeScript here
        viewport[p] = newProps[p];
      }
    });
  },
});
