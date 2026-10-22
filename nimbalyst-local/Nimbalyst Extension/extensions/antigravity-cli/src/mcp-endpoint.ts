import { readFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import path from 'node:path';
import { record, text, count } from './shared';

export interface McpEndpoint { port: number; token: string }
function validateEndpoint(value:unknown):McpEndpoint {
  const descriptor=record(value),port=count(descriptor.port),token=text(descriptor.token);
  if(!Number.isInteger(port)||port<1||port>65535||!token)throw new Error('Nimbalyst MCP connection information is invalid. Reopen Nimbalyst, then retry this session.');
  return {port,token};
}
export function inheritedMcpEndpoint(env:NodeJS.ProcessEnv):McpEndpoint|undefined {
  if(!env.NIMBALYST_MCP_PORT&&!env.NIMBALYST_MCP_TOKEN)return;
  return validateEndpoint({port:Number(env.NIMBALYST_MCP_PORT),token:env.NIMBALYST_MCP_TOKEN});
}
export function endpointFile(env:NodeJS.ProcessEnv=process.env) {
  const appData=env.APPDATA||path.join(homedir(),'Library','Application Support');
  return path.join(appData,'@nimbalyst','electron','mcp-endpoint.json');
}
export async function loadMcpEndpoint(file=endpointFile()):Promise<McpEndpoint> {
  let data:unknown;
  try {data=JSON.parse(await readFile(file,'utf8'));}
  catch {throw new Error('Nimbalyst MCP connection information is missing or unreadable. Reopen Nimbalyst, then retry this session. Chat cannot provide Nimbalyst tools until the MCP connection is restored.');}
  return validateEndpoint(data);
}
