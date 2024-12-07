'use server';

import { CdpAgentkit } from '@coinbase/cdp-agentkit-core';
import { CdpToolkit } from '@coinbase/cdp-langchain';

export const getTools = async () => {
  const agentkit = await CdpAgentkit.configureWithWallet();

  const toolkit = new CdpToolkit(agentkit);

  const tools = toolkit.getTools();

  console.log(tools);
};
