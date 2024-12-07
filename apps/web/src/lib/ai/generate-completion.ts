import { type TextPart, generateText } from 'ai';

import type { Doc } from '../../../convex/_generated/dataModel';
import { model } from './config';

type Game = Doc<'games'>;

export const generateNextMessage = async (
  game: Game,
  messages: { role: 'system' | 'user'; content: string }[],
  npcId: string
) => {
  const npc = game.details.npcs.find((npc) => npc.id === npcId);

  if (!npc) return;

  console.log(messages);

  const systemPrompt = `You are a player in a murder mystery game, the plot of the game is ${game.details.plot}. And you are the player ${npc.npcName}. You are in a conversation with the other players. You have been given the following messages from the other players. Respond to the messages as if you were the player ${npc.npcName}. You guys are in a murder mystery game and finding the killer. you have some clues such as Murder Location: ${game.details.murderLocation}, and Murder Weapon: ${game.details.murderWeapon}. You are ${game.details.killer.npc_id === npcId ? '' : 'not'} the killer in the game, so play accordingly.`;

  const { response } = await generateText({
    model,
    system: systemPrompt,
    prompt: messages.at(messages.length - 1)?.content,
  });

  const message =
    (response.messages.at(0)?.content as TextPart[]).at(0)?.text ?? '';

  return message;
};
