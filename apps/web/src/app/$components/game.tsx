'use client';

import type React from 'react';
import { useEffect, useRef } from 'react';

import Phaser from 'phaser';
import * as scenes from '~/scenes';

export const PhaserGame: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (gameRef.current) {
      return;
    }

    gameRef.current = new Phaser.Game({
      width: 1024,
      height: 640,
      title: 'Phaser RPG',
      scene: [scenes.Boot, scenes.Main, scenes.Menu],
      physics: {
        default: 'arcade',
      },
      backgroundColor: '#000',
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      pixelArt: true,
    });

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return <div className='absolute top-0' id='phaser-game' />;
};
