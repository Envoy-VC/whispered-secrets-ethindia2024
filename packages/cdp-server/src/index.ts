import { Hono } from "hono";

import { initializeAgent } from "./helpers/initialize";
import { z } from "zod";
import { HumanMessage } from "@langchain/core/messages";
import { serve } from "bun";

const app = new Hono();

const promptSchema = z.object({
  message: z.string(),
});

app.get("/ping", (c) => {
  return c.text("pong");
});

app.post("/invoke-agent", async (c) => {
  const body = await c.req.json();
  const { message } = promptSchema.parse(body);

  const { agent, config } = await initializeAgent();

  const res = await agent.invoke(
    {
      messages: [new HumanMessage(message)],
    },
    config,
  );

  return c.json({
    status: "success",
    message: res.messages[0].content,
  });
});

export default {
  port: 8787,
  fetch: app.fetch,
};
