import React, { useEffect, useRef, useState } from 'react';
import type { ExtensionContext, PanelHostProps } from '@nimbalyst/extension-sdk';
import { quotaColor, quotaGroupKey, selectedQuotaGroup, resetsIn, usageFailure, type QuotaGroup, type QuotaSnapshot } from './quota';

interface UsageState { data?:QuotaSnapshot; loading:boolean; waiting:boolean; notice:string; error:string; enabled:boolean; group:string }
let state:UsageState={loading:false,waiting:false,notice:'',error:'',enabled:true,group:'gemini'};
let context:ExtensionContext|undefined,pending:Promise<void>|undefined,generation=0;
let idleRetry:ReturnType<typeof setTimeout>|undefined;
const listeners=new Set<(value:UsageState)=>void>();
function publish(value:Partial<UsageState>) {state={...state,...value};for(const listener of listeners)listener(state);}
function useUsage() {const [value,setValue]=useState(state);useEffect(()=>{listeners.add(setValue);setValue(state);return()=>{listeners.delete(setValue);};},[]);return value;}
export function initializeUsage(ctx:ExtensionContext) {
  context=ctx;const current=++generation;
  publish({enabled:ctx.services.configuration?.get('usageIndicatorEnabled',true)??true,group:ctx.services.configuration?.get('usageGroup','gemini')??'gemini'});
  if(state.enabled)void refreshUsage();
  const timer=setInterval(()=>{if(state.enabled&&document.visibilityState==='visible')void refreshUsage();},5*60_000);
  return()=>{clearInterval(timer);clearTimeout(idleRetry);if(generation===current){generation++;context=undefined;pending=undefined;publish({loading:false});}};
}
export async function refreshUsage(force=false) {
  if(pending)return pending;
  const ctx=context,current=generation;
  if(!ctx?.services.ai){publish({error:'Nimbalyst backend bridge is unavailable.'});return;}
  publish({loading:true});
  pending=(async()=>{
    try {
      // An old backend's quota method can clear MCP schemas. A versioned RPC
      // prevents hot-reloaded renderers from calling that unsafe implementation.
      const result=await ctx.services.ai!.callBackendTool('antigravity-cli.quota_v2',{refresh:force}) as QuotaSnapshot;
      if(!Array.isArray(result.groups)||!result.groups.length||!Number.isFinite(result.fetchedAt))throw new Error('No quota data was returned.');
      if(current===generation){
        publish({data:result,error:'',waiting:Boolean(result.deferred),notice:result.deferred?'Usage will refresh automatically when the current Gemini turn finishes.':''});
        if(result.deferred)scheduleIdleRetry(current);else clearTimeout(idleRetry);
      }
    }catch(e){
      const failure=usageFailure(e);
      if(current===generation){
        publish({waiting:failure.waiting,notice:failure.waiting?failure.message:'',error:failure.waiting?'':failure.message});
        if(failure.retry)scheduleIdleRetry(current);
      }
    }finally{if(current===generation){pending=undefined;publish({loading:false});}}
  })();
  return pending;
}
function scheduleIdleRetry(current:number) {
  clearTimeout(idleRetry);idleRetry=setTimeout(()=>{if(current===generation&&state.enabled&&document.visibilityState==='visible')void refreshUsage();},15_000);
}
export async function setUsageEnabled(enabled:boolean) {
  try {await context?.services.configuration?.update('usageIndicatorEnabled',enabled,'user');publish({enabled});if(enabled)void refreshUsage();else clearTimeout(idleRetry);}
  catch(e){publish({error:(e as Error).message});}
}
async function selectGroup(group:string) {
  try{await context?.services.configuration?.update('usageGroup',group,'user');publish({group});}catch(e){publish({error:(e as Error).message});}
}
function selectedGroup(value:UsageState):QuotaGroup|undefined {
  return selectedQuotaGroup(value.data?.groups??[],value.group);
}
function groupLabel(key:string) {return key==='argon'?'Argon':key==='gemini'?'Gemini':'Claude / GPT';}
function GeminiStar() {return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2c.9 5.4 4.6 9.1 10 10-5.4.9-9.1 4.6-10 10-.9-5.4-4.6-9.1-10-10 5.4-.9 9.1-4.6 10-10z"/></svg>;}
const quiet:React.CSSProperties={border:0,background:'none',color:'var(--nim-text-muted)',cursor:'pointer',padding:4,fontSize:16};

function UsageCard({onClose}:{onClose?:()=>void}) {
  const value=useUsage(),group=selectedGroup(value),[now,setNow]=useState(Date.now());
  const groupKey=group?quotaGroupKey(group):value.group;
  const groupKeys=value.data?value.data.groups.map(quotaGroupKey):['gemini','other'];
  useEffect(()=>{const timer=setInterval(()=>setNow(Date.now()),30_000);return()=>clearInterval(timer);},[]);
  const age=value.data?Math.max(0,Math.floor((now-value.data.fetchedAt)/60_000)):undefined;
  return <div className="agy-usage-card" style={{color:'var(--nim-text)',fontSize:13,fontFamily:'var(--nim-font-family, system-ui)',width:'100%'}}>
    <div style={{display:'flex',alignItems:'center',gap:10,padding:'16px 18px',borderBottom:'1px solid var(--nim-border)'}}>
      <GeminiStar/><strong style={{flex:1,fontSize:15}}>{groupLabel(groupKey)} Usage</strong>
      <button style={quiet} title="Refresh usage" aria-label="Refresh usage" disabled={value.loading} onClick={()=>void refreshUsage(true)}>↻</button>
      {onClose&&<button style={quiet} title="Close" aria-label="Close usage" onClick={onClose}>×</button>}
    </div>
    <div style={{padding:'14px 18px 0',display:'flex',gap:8}}>
      {groupKeys.map(key=><button key={key} onClick={()=>void selectGroup(key)} style={{...quiet,fontSize:12,borderRadius:5,padding:'5px 9px',background:groupKey===key?'var(--nim-bg-hover)':'none',color:groupKey===key?'var(--nim-text)':'var(--nim-text-muted)'}}>{groupLabel(key)}</button>)}
    </div>
    <div style={{padding:'12px 18px'}}>
      <div style={{fontSize:11,color:'var(--nim-text-muted)',marginBottom:18}}>Antigravity account limits</div>
      {group?.buckets.slice().sort((a,b)=>(a.window==='5h'?0:1)-(b.window==='5h'?0:1)).map(bucket=><div key={bucket.id} style={{marginBottom:22}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:12}}>
          <div><strong>{bucket.window==='5h'?'Session':bucket.window==='weekly'?'Weekly':bucket.window}</strong><div style={{fontSize:11,color:'var(--nim-text-muted)',marginTop:4}}>{bucket.window==='5h'?'5-hour window':bucket.window==='weekly'?'7-day window':bucket.window}</div></div>
          <div style={{textAlign:'right',color:quotaColor(bucket.usedPercent)}}><strong style={{fontSize:17}}>{Math.round(bucket.usedPercent)}%</strong><div style={{fontSize:10,marginTop:2}}>used</div></div>
        </div>
        <div role="progressbar" aria-label={`${bucket.window} quota used`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(bucket.usedPercent)} style={{height:6,background:'var(--nim-bg-tertiary, #303033)',borderRadius:4,overflow:'hidden',margin:'9px 0 7px'}}><div style={{width:`${bucket.usedPercent}%`,height:'100%',background:quotaColor(bucket.usedPercent),borderRadius:4}}/></div>
        <div style={{fontSize:11,color:'var(--nim-text-muted)'}} title={bucket.resetAt?new Date(bucket.resetAt).toLocaleString():undefined}>◷ {resetsIn(bucket.resetAt,now)}</div>
      </div>)}
      {!group&&<p style={{color:'var(--nim-text-muted)'}}>{value.loading?'Reading account quota…':value.waiting?'Waiting for Gemini to finish…':'Usage unavailable'}</p>}
      {value.notice&&<p role="status" style={{color:'var(--nim-text-muted)',fontSize:12,lineHeight:1.5}}>{value.notice}</p>}
      {value.error&&<p role="alert" style={{color:'var(--nim-warning, #eab308)',fontSize:12,lineHeight:1.5}}>{value.error}</p>}
    </div>
    <div style={{padding:'12px 18px',borderTop:'1px solid var(--nim-border)',display:'flex',alignItems:'center',justifyContent:'space-between',fontSize:11,color:'var(--nim-text-muted)'}}>
      <span>{value.loading?'Updating…':value.waiting?(age===undefined?'Refresh queued':`Updated ${age}m ago · refresh queued`):age===undefined?'No reading yet':age===0?'Updated just now':`Updated ${age}m ago${age>=10?' · stale':''}`}</span>
      <button style={{...quiet,fontSize:11}} onClick={()=>void setUsageEnabled(false)}>Disable</button>
    </div>
  </div>;
}

// The 0.81.2 host registers custom gutter components but renders only its
// default button. Style only our SDK-created button and mount the popover
// through the supported host-component surface; no application files change.
export function UsageHost() {
  const value=useUsage(),[open,setOpen]=useState(false),[anchor,setAnchor]=useState({left:60,bottom:12});
  const container=useRef<HTMLDivElement>(null),button=useRef<HTMLButtonElement|null>(null),group=selectedGroup(value);
  const used=group?Math.max(...group.buckets.map(bucket=>bucket.usedPercent)):undefined;
  useEffect(()=>{if(!value.enabled)setOpen(false);},[value.enabled]);
  useEffect(()=>{
    const find=()=>document.querySelector<HTMLButtonElement>('button[data-panel-id="com.local.antigravity-cli.account-usage"]');
    const click=(event:MouseEvent)=>{
      event.preventDefault();event.stopPropagation();
      const rect=button.current?.getBoundingClientRect();if(rect)setAnchor({left:Math.max(8,Math.min(rect.right+12,window.innerWidth-300)),bottom:Math.max(12,window.innerHeight-rect.bottom)});
      setOpen(previous=>!previous);void refreshUsage();
    };
    const attach=()=>{const found=find();if(found===button.current)return;button.current?.removeEventListener('click',click,true);button.current=found;found?.addEventListener('click',click,true);};
    attach();const observer=new MutationObserver(attach);observer.observe(document.body,{subtree:true,childList:true});
    return()=>{observer.disconnect();button.current?.removeEventListener('click',click,true);button.current=null;};
  },[]);
  useEffect(()=>{
    const apply=()=>{
      const target=button.current;if(!target)return;
      if(!target.classList.contains('agy-native-usage'))target.classList.add('agy-native-usage');
      if(target.classList.contains('agy-usage-disabled')===value.enabled)target.classList.toggle('agy-usage-disabled',!value.enabled);
      target.style.setProperty('--agy-used',String(used??0));target.style.setProperty('--agy-color',used===undefined?'var(--nim-border)':quotaColor(used));
      target.setAttribute('data-usage-label',used===undefined?(value.loading||value.waiting?'…':'?'):`${Math.round(used)}%`);
      target.setAttribute('aria-haspopup','dialog');target.setAttribute('aria-expanded',String(open));
      target.title=group?`${group.name}: ${group.buckets.map(bucket=>`${bucket.window} ${Math.round(bucket.usedPercent)}% used`).join(', ')}${value.waiting?' · refresh queued':value.error?' · update failed':''}`:value.waiting?value.notice:'Antigravity account usage';
    };
    apply();const observer=new MutationObserver(apply);observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
    return()=>observer.disconnect();
  },[value,used,group,open]);
  useEffect(()=>()=>{const target=document.querySelector<HTMLButtonElement>('.agy-native-usage');if(!target)return;target.classList.remove('agy-native-usage','agy-usage-disabled');target.style.removeProperty('--agy-used');target.style.removeProperty('--agy-color');target.removeAttribute('data-usage-label');target.removeAttribute('aria-haspopup');target.removeAttribute('aria-expanded');target.title='Gemini Usage';},[]);
  useEffect(()=>{
    if(!open)return;
    const outside=(event:PointerEvent)=>{if(!container.current?.contains(event.target as Node)&&!button.current?.contains(event.target as Node))setOpen(false);};
    const escape=(event:KeyboardEvent)=>{if(event.key==='Escape')setOpen(false);};
    document.addEventListener('pointerdown',outside);document.addEventListener('keydown',escape);
    return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',escape);};
  },[open]);
  return <><style>{`.agy-native-usage {position:relative!important}.agy-native-usage > * {visibility:hidden}.agy-native-usage::before {content:'';position:absolute;width:30px;height:30px;left:50%;top:50%;transform:translate(-50%,-50%);border-radius:50%;background:conic-gradient(var(--agy-color) calc(var(--agy-used)*1%),var(--nim-border,#45454b) 0);mask:radial-gradient(farthest-side,transparent calc(100% - 2.5px),#000 0)}.agy-native-usage::after {content:attr(data-usage-label);position:absolute;inset:0;display:grid;place-items:center;font-size:10px;font-weight:600;color:var(--nim-text)}.agy-usage-disabled {display:none!important}`}</style>
    {open&&value.enabled&&<div ref={container} role="dialog" aria-label="Antigravity account usage" style={{position:'fixed',...anchor,width:288,maxHeight:`calc(100vh - ${anchor.bottom+12}px)`,overflowY:'auto',zIndex:10000,border:'1px solid var(--nim-border)',borderRadius:12,background:'var(--nim-bg-secondary, #242424)',boxShadow:'0 10px 35px #0006'}}><UsageCard onClose={()=>setOpen(false)}/></div>}
  </>;
}
export function UsagePanel(_props:PanelHostProps) {return <UsageCard/>;}
export function UsageSetting() {
  const value=useUsage();
  return <label><input type="checkbox" checked={value.enabled} onChange={event=>void setUsageEnabled(event.target.checked)}/> Show account usage indicator (refreshes every 5 minutes)</label>;
}
