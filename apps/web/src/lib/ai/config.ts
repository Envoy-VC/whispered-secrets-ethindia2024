import { createOllama } from 'ollama-ai-provider';

export const ollama = createOllama({
  baseURL: 'http://localhost:8888/api',
});

export const model = ollama('llama3');
