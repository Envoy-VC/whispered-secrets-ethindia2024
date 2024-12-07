import { CdpAgentkit } from "@coinbase/cdp-agentkit-core";
import { CdpTool, CdpToolkit } from "@coinbase/cdp-langchain";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatXAI } from "@langchain/xai";
import * as dotenv from "dotenv";
import * as fs from "fs";
import { signMessageConfig } from "../tools/sign-message";
import { callContractConfig } from "../tools";

dotenv.config();

const WALLET_DATA_FILE = "wallet_data.txt";

export async function initializeAgent() {
  const llm = new ChatXAI({
    apiKey: process.env.XAI_PK,
  });

  let walletDataStr: string | null = null;

  if (fs.existsSync(WALLET_DATA_FILE)) {
    try {
      walletDataStr = fs.readFileSync(WALLET_DATA_FILE, "utf8");
    } catch (error) {
      console.error("Error reading wallet data:", error);
    }
  }

  const config = {
    cdpWalletData: walletDataStr || undefined,
    networkId: process.env.NETWORK_ID || "base-sepolia",
  };

  const agentkit = await CdpAgentkit.configureWithWallet(config);

  const cdpToolkit = new CdpToolkit(agentkit);
  const tools = cdpToolkit.getTools();

  const signatureTool = new CdpTool(signMessageConfig, agentkit);
  const contractCallTool = new CdpTool(callContractConfig, agentkit);

  tools.push(signatureTool);
  tools.push(contractCallTool);

  const memory = new MemorySaver();
  const agentConfig = {
    configurable: { thread_id: "CDP AgentKit Chatbot Example!" },
  };

  const agent = createReactAgent({
    llm,
    tools,
    checkpointSaver: memory,
    messageModifier:
      "You are a helpful agent that can interact onchain using the Coinbase Developer Platform AgentKit...",
  });

  const exportedWallet = await agentkit.exportWallet();
  fs.writeFileSync(WALLET_DATA_FILE, exportedWallet);

  return { agent, config: agentConfig };
}
