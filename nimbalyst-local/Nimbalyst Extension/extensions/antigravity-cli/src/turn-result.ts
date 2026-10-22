import {record,text} from './shared';

export interface ToolFailure { name:string; message:string; target?:string }
export function toolFailure(name:string,parameters:Record<string,unknown>,error:unknown):ToolFailure {
  const detail=record(error);
  const server=text(parameters.ServerName),tool=text(parameters.ToolName);
  return {name,message:text(detail.message)||text(error)||'Tool execution failed.',...(server&&tool?{target:`mcp(${server}/${tool})`}:{})};
}
export function finishTurn(result:Record<string,unknown>,streamed:string,failures:ToolFailure[],callCount:number) {
  const final=text(result.response),denied=Array.isArray(result.denied_actions)?result.denied_actions.map(record):[];
  const blocked=failures.filter(failure=>/permission check failed|user denied permission|soft.denied|requires?.*approval|permission.*required/i.test(failure.message));
  let notice='';
  if(denied.length||blocked.length){
    const targets=[...new Set(blocked.map(failure=>failure.target||failure.message.split('\n')[0]))];
    const actions=targets.length?targets:denied.map(action=>text(action.action)||text(action.display_name)).filter(Boolean);
    notice=`Antigravity CLI permission notice: blocked ${actions.join(', ')||'a tool action'}. Headless CLI cannot show its permission approval dialog. No automatic retry was performed. Add only the intended allow-rule in CLI settings before requesting this action again.`;
  }
  let response=final.trim()?final:streamed.trim()?streamed:'';
  let delta=streamed.trim()?(final.startsWith(streamed)?final.slice(streamed.length):''):response;
  if(!response){
    if(notice){response=notice;delta=notice;notice='';}
    else if(failures.length){response=`Antigravity CLI returned no answer after a tool failed: ${failures.at(-1)!.message.split('\n')[0]}`;delta=response;}
    else {response=callCount?'Antigravity CLI completed tool activity but returned no text reply. Review the tool results before repeating an action.':'Antigravity CLI finished without a reply or tool result. No automatic retry was performed.';delta=response;}
  }
  if(notice){response+=`\n\n${notice}`;delta+=`\n\n${notice}`;}
  return {response,delta,permissionNotice:Boolean(denied.length||blocked.length)};
}
