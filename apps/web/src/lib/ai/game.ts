import { generateObject } from 'ai';
import { z } from 'zod';

import { model } from './config';

const playerSchema = z.object({
  playerName: z.string().describe('Player name in the game'),
  identity: z.string().optional().describe('Player identity'),
  plan: z.string().optional().describe('Player Plan in the entire game'),
  relationWithVictim: z
    .string()
    .describe('Player relation with victim')
    .optional(),
});

type PlayerType = z.infer<typeof playerSchema>;

const plotPrompt = `You need to create a plot for a unique and creative murder mystery game. Also there would be a hidden killer in the game. Also there will be a backstory to the murder and the person who was murdered. The plot of the game should be detailed about 5-6 lines. Plot should be unique and creative and should change every time you generate it. `;

export const generatePlot = async () => {
  const { object } = await generateObject({
    prompt: plotPrompt,
    system: `You are a mystery writer. You need to create a plot and a victim for a unique and creative murder mystery game. Also there would be a hidden killer in the game. Also there will be a backstory to the murder and the person who was murdered. The plot of the game should be detailed about 5-6 lines. Plot should be unique and creative and should change every time you generate it.`,
    schema: z.object({
      plot: z.string(),
      victim: playerSchema,
    }),
    model,
  });

  return object;
};

export const generatePlayers = async (plot: string) => {
  const prompt = `You need to create players for a murder mystery game. The plot of the game is: ${plot}. The game should be in the style of a mystery game, inspired from movies and web series. Make sure that you add this concept in the plot: you'll play as suspects with secrets to hide. I want about 5 players`;
  const { object } = await generateObject({
    model,
    system: `You are a mystery writer. You need to create players for a murder mystery game. The plot of the game is: ${plot}. The game should be in the style of a mystery game, inspired from movies and web series. Make sure that you add this concept in the plot: you'll play as suspects with secrets to hide. I want about 5 players`,
    schema: z.object({
      players: z.array(playerSchema),
    }),
    prompt,
  });

  return object;
};

export const generateKillerDetails = async (
  plot: string,
  players: PlayerType[]
) => {
  const prompt = `You need to create a killer for a murder mystery game. The plot of the game is: ${plot}. The game should be in the style of a mystery game, inspired from movies and web series. Make sure that you add this concept in the plot: you'll play as suspects with secrets to hide. I want about 5 players, and killer should be a character not in the players list.`;
  const { object } = await generateObject({
    model,
    system: `You are a mystery writer. You need to choose a killer for a murder mystery game from list of players. The plot of the game is: ${plot}. The players in the game are: ${players
      .map(
        (p) => `
        ${p.playerName}: \n\nPlan: ${p.plan ?? ''}\n\nRelation with victim: ${p.relationWithVictim ?? ''}\n\nIdentity: ${p.identity ?? ''}\n\n
      `
      )
      .join('\n')}. Also generate the murder weapon and location for the game.`,
    schema: z.object({
      killer: playerSchema,
      murderWeapon: z.string().describe('Murder weapon'),
      murderLocation: z.string().describe('Murder location'),
    }),
    prompt,
  });

  return object;
};
