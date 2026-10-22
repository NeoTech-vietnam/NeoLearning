import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, type CallToolResult, type Tool } from '@modelcontextprotocol/sdk/types.js';
import { record, text, count } from './shared';
import { loadMcpEndpoint, inheritedMcpEndpoint } from './mcp-endpoint';

async function main() {
  const sid=process.env.NIMBALYST_SESSION_ID,workspace=process.env.NIMBALYST_WORKSPACE_PATH;
  const server=new Server({name:'nimbalyst-antigravity-cli',version:'0.1.0'},{capabilities:{tools:{}}});
  if(!sid||!workspace||process.env.NIMBALYST_MCP_DISABLED==='1') {server.setRequestHandler(ListToolsRequestSchema,async()=>({tools:[]}));await server.connect(new StdioServerTransport());return;}
  const descriptor=inheritedMcpEndpoint(process.env)??await loadMcpEndpoint();
  const port=count(descriptor.port);if(!port||!text(descriptor.token))throw new Error('Nimbalyst MCP endpoint is unavailable.');
  const clients:Client[]=[];const owners=new Map<string,Client>();const definitions=new Map<string,Tool>();
  const connect=async(endpoint:string)=>{
    const url=new URL(`http://127.0.0.1:${port}${endpoint}`);url.searchParams.set('workspacePath',workspace);url.searchParams.set('sessionId',sid);
    const client=new Client({name:'antigravity-cli-bridge',version:'0.1.0'},{capabilities:{}});
    await client.connect(new StreamableHTTPClientTransport(url,{requestInit:{headers:{Authorization:`Bearer ${text(descriptor.token)}`}}}));
    const listed=await client.listTools();clients.push(client);
    for(const tool of listed.tools){if(!owners.has(tool.name)){owners.set(tool.name,client);definitions.set(tool.name,tool);}}
    return client;
  };
  let host:Client|undefined;
  const primary=await Promise.all(['/mcp/core','/mcp/host','/mcp/trackers','/mcp/situational'].map(connect));
  host=primary[1];
  if(host){
    const inventory=await host.callTool({name:'extensions_list',arguments:{includeAvailable:false}});
    const blocks=Array.isArray(inventory.content)?inventory.content:[];
    for(const block of blocks){if(record(block).type!=='text')continue;try{
      const data=record(JSON.parse(text(record(block).text)));
      if(Array.isArray(data.installed))await Promise.allSettled(data.installed.map(async item=>{const extension=record(item);if(extension.enabled!==true)return;const short=text(extension.id).split('.').pop();if(short)await connect('/mcp/ext/'+encodeURIComponent(short));}));
    }catch{/* First-party tools remain available if an optional extension endpoint fails. */}}
  }
  server.setRequestHandler(ListToolsRequestSchema,async()=>({tools:[...definitions.values()]}));
  server.setRequestHandler(CallToolRequestSchema,async request=>{
    const owner=owners.get(request.params.name);if(!owner)throw new Error('Unknown Nimbalyst tool.');
    return await owner.callTool(request.params) as CallToolResult;
  });
  await server.connect(new StdioServerTransport());
  process.stdin.on('end',()=>{for(const client of clients)void client.close();void server.close();});
}
main().catch(e=>{console.error(`Antigravity/Nimbalyst MCP: ${(e as Error).message}`);process.exitCode=1;});
