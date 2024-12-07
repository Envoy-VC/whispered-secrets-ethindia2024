import { Hono } from "hono";

import { initializeAgent } from "./helpers/initialize";
import { z } from "zod";
import { HumanMessage } from "@langchain/core/messages";
import { cors } from "hono/cors";

const app = new Hono();
app.use(
  "/*",
  cors({
    origin: "*",
  }),
);

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

  try {
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
  } catch (error) {
    return c.json({
      status: "error",
      message: error,
    });
  }
});

export default {
  port: 8787,
  fetch: app.fetch,
};
