import { record, text } from './shared';

export interface QuotaBucket { id:string; window:string; usedPercent:number; resetAt?:string }
export interface QuotaGroup { name:string; description:string; buckets:QuotaBucket[] }
export interface QuotaSnapshot { fetchedAt:number; groups:QuotaGroup[]; deferred?:boolean }

export function quotaGroupKey(group:QuotaGroup):string {
  if(/argon/i.test(group.name))return 'argon';
  return /gemini/i.test(group.name)?'gemini':'other';
}
export function selectedQuotaGroup(groups:QuotaGroup[],key:string):QuotaGroup|undefined {
  return groups.find(group=>quotaGroupKey(group)===key)??groups[0];
}

export function usageFailure(error:unknown):{waiting:boolean;message:string;retry:boolean} {
  const raw=error instanceof Error?error.message:typeof error==='string'?error:text(record(error).message);
  if(/paused while a CLI turn/i.test(raw))return {waiting:true,message:'Usage will refresh automatically when the current Gemini turn finishes.',retry:true};
  if(/Start an Antigravity CLI session before/i.test(raw))return {waiting:true,message:'Send a message in an Antigravity CLI session to enable account usage.',retry:false};
  if(/unknown|not found|not registered|not running|not available|unavailable/i.test(raw))return {waiting:false,message:'If the extension was just updated, reopen Nimbalyst once. Send a message in an Antigravity CLI session to start its backend, then refresh here.',retry:false};
  return {waiting:false,message:raw.split('Error: ').at(-1)||'Could not read account usage.',retry:false};
}

export function parseQuota(output:string,now=Date.now()):QuotaSnapshot {
  const result=record(JSON.parse(output)),command=record(result.command),data=record(command.data);
  if(result.status!=='SUCCESS'||!['usage','quota'].includes(text(command.name))||!Array.isArray(data.groups))throw new Error('The CLI did not return account quota data. Sign in with agy and retry.');
  const groups:QuotaGroup[]=data.groups.map(raw=>{
    const group=record(raw);
    const buckets:QuotaBucket[]=(Array.isArray(group.buckets)?group.buckets:[]).map(rawBucket=>{
      const bucket=record(rawBucket),remaining=bucket.remaining_fraction;
      if(typeof remaining!=='number'||!Number.isFinite(remaining)||remaining<0||remaining>1)throw new Error('The CLI returned an unknown quota value. Refresh after updating or signing in to agy.');
      const reset=text(bucket.reset_time);
      return {id:text(bucket.id),window:text(bucket.window),usedPercent:(1-remaining)*100,...(reset&&Number.isFinite(Date.parse(reset))?{resetAt:reset}:{})};
    });
    return {name:text(group.name),description:text(group.description),buckets};
  }).filter(group=>group.name&&group.buckets.length);
  if(!groups.length)throw new Error('No account quota groups are available for this login.');
  return {fetchedAt:now,groups};
}
export function quotaColor(percent:number):string {return percent>=90?'#ef4444':percent>=75?'#eab308':'#22c55e';}
export function resetsIn(resetAt:string|undefined,now=Date.now()):string {
  if(!resetAt)return 'Reset time unavailable';
  const ms=Date.parse(resetAt)-now;
  if(ms<=0)return 'Reset due; refresh to update';
  const minutes=Math.ceil(ms/60000),days=Math.floor(minutes/1440),hours=Math.floor(minutes%1440/60),mins=minutes%60;
  return `Resets in ${days?`${days}d `:''}${hours?`${hours}h `:''}${!days&&mins?`${mins}m`:''}`.trim();
}
