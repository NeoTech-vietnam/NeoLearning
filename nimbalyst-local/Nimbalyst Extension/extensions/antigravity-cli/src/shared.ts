export type Json = null | boolean | number | string | Json[] | { [key:string]:Json };
export type Mode = 'plan' | 'accept-edits';
export type Effort = 'default' | 'low' | 'medium' | 'high' | 'xhigh' | 'max';
export interface Settings { cliPath:string; mode:Mode; effort:Effort; mcp:boolean; turbo:boolean; timeoutSeconds:number }
export const defaults:Settings = { cliPath:'', mode:'accept-edits', effort:'default', mcp:true, turbo:true, timeoutSeconds:600 };
export interface Usage { input_tokens:number; output_tokens:number; total_tokens:number; cache_read_tokens?:number; thinking_tokens?:number }
export interface Link { conversationId?:string; usage?:Usage; model?:string; workspacePath:string }
export interface HostChunk { type:string; content?:string; error?:string; toolCall?:Record<string,unknown>; toolResult?:Record<string,unknown>; usage?:Record<string,number>; metadata?:Record<string,unknown>; preEditSnapshot?:Record<string,unknown>; postEditSnapshot?:Record<string,unknown> }
export function record(value:unknown):Record<string,unknown> { return value!==null && typeof value==='object' && !Array.isArray(value) ? value as Record<string,unknown> : {}; }
export function text(value:unknown):string { return typeof value==='string' ? value : ''; }
export function count(value:unknown):number { return typeof value==='number' && Number.isFinite(value) && value>=0 ? value : 0; }
export function parseModels(output:string):Array<{id:string;name:string;default?:boolean}> {
  const rows=output.split(/\r?\n/).map(line=>line.match(/^([a-z0-9][a-z0-9._-]*-[a-z0-9._-]+)\s+(.+)$/i)).filter((v):v is RegExpMatchArray=>v!==null);
  return rows.map(m=>({id:`antigravity-cli:${m[1]}`,name:m[2].trim(),...(m[1]==='gemini-3.8-flash-medium'?{default:true}:{})}));
}
export function modelKey(id:string):string { const key=id.startsWith('antigravity-cli:')?id.slice('antigravity-cli:'.length):id; if (!/^[a-z0-9][a-z0-9._-]*$/i.test(key)) throw new Error('Invalid CLI model ID.'); return key; }
export function normalizeSettings(value:unknown):Settings {
  const v=record(value);
  const effort=['default','low','medium','high','xhigh','max'].includes(text(v.effort))?text(v.effort) as Effort:defaults.effort;
  return {cliPath:text(v.cliPath),mode:v.mode==='plan'?'plan':'accept-edits',effort,mcp:v.mcp!==false,turbo:v.turbo===undefined?defaults.turbo:v.turbo===true,timeoutSeconds:Math.min(3600,Math.max(30,count(v.timeoutSeconds)||600))};
}
export function usageOf(value:unknown):Usage { const v=record(value); return {input_tokens:count(v.input_tokens),output_tokens:count(v.output_tokens),total_tokens:count(v.total_tokens),cache_read_tokens:count(v.cache_read_tokens),thinking_tokens:count(v.thinking_tokens)}; }
export function usageDelta(now:Usage,previous?:Usage):Record<string,number> {
  const delta=(key:keyof Usage)=>Math.max(0,(now[key]??0)-(previous?.[key]??0));
  const input=delta('input_tokens'),output=delta('output_tokens'),cache=delta('cache_read_tokens');
  return {input_tokens:input,output_tokens:output,total_tokens:input+output+cache,cache_read_input_tokens:cache};
}
export class Queue<T> {
  private items:T[]=[]; private wake:(()=>void)|undefined; private ended=false; private failure:Error|undefined;
  push(item:T) { if(this.ended)return; this.items.push(item); this.wake?.(); this.wake=undefined; }
  end(error?:Error) { this.ended=true;this.failure=error;this.wake?.();this.wake=undefined; }
  async *read():AsyncGenerator<T> { while(true) { if(this.items.length){yield this.items.shift()!;continue;}if(this.ended){if(this.failure)throw this.failure;return;}await new Promise<void>(r=>{this.wake=r;}); } }
}
