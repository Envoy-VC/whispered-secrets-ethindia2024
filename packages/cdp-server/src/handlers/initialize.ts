import { CdpAgentkit } from "@coinbase/cdp-agentkit-core";
import { CdpToolkit } from "@coinbase/cdp-langchain";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import * as dotenv from "dotenv";
import * as fs from "fs";

dotenv.config();

const WALLET_DATA_FILE = "wallet_data.txt";

async function initializeAgent() {
  ``;
  const llm = new ChatOpenAI({
    model: "gpt-4o-mini",
  });

  let walletDataStr: string | null = null;

  if (fs.existsSync(WALLET_DATA_FILE)) {
    try {
      walletDataStr = fs.readFileSync(WALLET_DATA_FILE, "utf8");
    } catch (error) {
      console.error("Error reading wallet data:", error);
    }
  }

  // Configure CDP AgentKit
  const config = {
    cdpWalletData: walletDataStr || undefined,
    networkId: process.env.NETWORK_ID || "base-sepolia",
  };

  // Initialize CDP AgentKit
  const agentkit = await CdpAgentkit.configureWithWallet(config);

  // Initialize CDP AgentKit Toolkit and get tools
  const cdpToolkit = new CdpToolkit(agentkit);
  const tools = cdpToolkit.getTools();

  // Store buffered conversation history in memory
  const memory = new MemorySaver();
  const agentConfig = {
    configurable: { thread_id: "CDP AgentKit Chatbot Example!" },
  };

  // Create React Agent using the LLM and CDP AgentKit tools
  const agent = createReactAgent({
    llm,
    tools,
    checkpointSaver: memory,
    messageModifier:
      "You are a helpful agent that can interact onchain using the Coinbase Developer Platform AgentKit...",
  });

  // Save wallet data
  const exportedWallet = await agentkit.exportWallet();
  fs.writeFileSync(WALLET_DATA_FILE, exportedWallet);

  return { agent, config: agentConfig };
}

initializeAgent();
