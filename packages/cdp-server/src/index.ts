import { Hono } from "hono";

import { initializeAgent } from "./helpers/initialize";
import { z } from "zod";
import { HumanMessage } from "@langchain/core/messages";
import { cors } from "hono/cors";
import { AccessToken, Role } from "@huddle01/server-sdk/auth";

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

app.post("/create-huddle-room", async (c) => {
  const { title, hostWallets } = (await c.req.json()) as {
    title: string;
    hostWallets: string[];
  };

  console.log(title, hostWallets);

  const response = await fetch("https://api.huddle01.com/api/v1/create-room", {
    method: "POST",
    body: JSON.stringify({
      title,
      hostWallets,
    }),
    // @ts-expect-error safe to ignore
    headers: {
      "Content-type": "application/json",
      "x-api-key": process.env.HUDDLE_API_KEY,
    },
  });

  const data = (await response.json()) as
    | {
        message: string;
        data: { roomId: string };
      }
    | {
        success: false;
      };

  console.log(data);

  if ("success" in data) {
    return c.json({
      status: "error",
      message: data,
    });
  } else {
    return c.json({
      status: "success",
      message: data.data.roomId,
    });
  }
});

app.post("/get-huddle-token", async (c) => {
  const { roomId } = (await c.req.json()) as {
    roomId: string;
  };

  const accessToken = new AccessToken({
    apiKey: process.env.HUDDLE_API_KEY!,
    roomId: roomId as string,
    role: Role.HOST,
    permissions: {
      admin: true,
      canConsume: true,
      canProduce: true,
      canProduceSources: {
        cam: true,
        mic: true,
        screen: true,
      },
      canRecvData: true,
      canSendData: true,
      canUpdateMetadata: true,
    },
  });

  const token = await accessToken.toJwt();

  return c.json({
    status: "success",
    message: token,
  });
});

export default {
  port: 8787,
  fetch: app.fetch,
};
