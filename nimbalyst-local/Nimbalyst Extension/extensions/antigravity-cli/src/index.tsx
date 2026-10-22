import React, { useEffect, useState } from 'react';
import type { ExtensionContext, SettingsPanelProps } from '@nimbalyst/extension-sdk';
import { defaults, normalizeSettings, record, text, type Settings } from './shared';
import { installProviderIcon } from './provider-icon';
import { initializeUsage, UsageHost, UsagePanel, UsageSetting } from './usage';

let extensionContext: ExtensionContext | undefined;
let removeProviderIcon: (() => void) | undefined;
let removeUsage: (() => void) | undefined;
export function activate(context:ExtensionContext) {
  extensionContext = context;
  removeProviderIcon?.();
  removeProviderIcon = installProviderIcon();
  removeUsage?.();removeUsage=initializeUsage(context);
  context.services.ui?.showInfo('Antigravity CLI extension loaded. Use the Antigravity CLI model group to start a session.');
}
export function deactivate() {
  extensionContext = undefined;
  removeUsage?.();removeUsage=undefined;
  removeProviderIcon?.();
  removeProviderIcon = undefined;
}
export interface AntigravitySettingsProps {
  storage?: SettingsPanelProps['storage'];
  callBackendTool?: SettingsPanelProps['callBackendTool'];
  theme?: string;
  config?: { backendModuleEnabled?: boolean };
  availableModels?: Array<{ id: string; name: string }>;
  onEnableBackendModule?: () => Promise<void>;
}
export function AntigravitySettings({storage,callBackendTool,config,availableModels,onEnableBackendModule}:AntigravitySettingsProps) {
  const [settings,setSettings]=useState<Settings>(()=>normalizeSettings(storage?.get('settings')??defaults));
  const [busy,setBusy]=useState(false),[message,setMessage]=useState('The CLI uses your existing agy login. Default mode is Normal (Accept Edits).');
  const [models,setModels]=useState<Array<{id:string;name:string}>>(()=>availableModels??[]);
  const [permissionRules,setPermissionRules]=useState('');
  const backendTool = callBackendTool ?? ((toolName: string, toolArgs?: Record<string, unknown>) => extensionContext?.services.ai?.callBackendTool(toolName, toolArgs));
  const field=<K extends keyof Settings>(key:K,value:Settings[K])=>setSettings(v=>({...v,[key]:value}));
  const invoke=async(method:string,args:Record<string,unknown>={})=>{
    setBusy(true);try {
      if(!backendTool)throw new Error('Backend tool bridge is unavailable in this Nimbalyst version.');
      const result=record(await backendTool(`antigravity-cli.${method}`,args));
      if(result.ok===false)throw new Error(text(result.error)||'CLI connection failed.');
      if(result.settings)setSettings(normalizeSettings(result.settings));
      if(result.permissions)setPermissionRules(JSON.stringify(result.permissions,null,2));
      if(Array.isArray(result.models))setModels(result.models.map(record).map(v=>({id:text(v.id),name:text(v.name)})));
      setMessage(text(result.message)||(method==='status'?`Connected to agy ${text(result.version)}.`:'Settings saved.'));
      return result;
    }catch(e){setMessage((e as Error).message+' If the backend is not active, start one Antigravity CLI session and approve Nimbalyst’s native-code consent first.');return null;}finally{setBusy(false);}
  };
  const save=async()=>{const result=await invoke('configure',{...settings});if(result)await storage?.set('settings',settings);};
  useEffect(()=>{if(!storage||callBackendTool||extensionContext?.services.ai){void invoke('status');}},[]);
  const style:React.CSSProperties={display:'flex',flexDirection:'column',gap:14,maxWidth:680,color:'var(--nim-text)',padding:16};
  const input:React.CSSProperties={padding:8,color:'var(--nim-text)',background:'var(--nim-bg-secondary)',border:'1px solid var(--nim-border)',borderRadius:5};
  return <div style={style}>
    <h3 style={{margin:0}}>Antigravity CLI</h3>
    {config?.backendModuleEnabled===false&&onEnableBackendModule&&(
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:'var(--nim-bg-secondary)',border:'1px solid var(--nim-border)',borderRadius:5,padding:10}}>
        <span>Backend module is not enabled. Grant permission to run Antigravity CLI.</span>
        <button onClick={()=>void onEnableBackendModule()}>Enable Backend Module</button>
      </div>
    )}
    <UsageSetting/>
    <p style={{margin:0}}>Run your signed-in CLI with its own tools and skills.</p>
    <label>CLI executable (blank uses the standard installation)<input style={{...input,display:'block',width:'100%',boxSizing:'border-box'}} value={settings.cliPath} onChange={e=>field('cliPath',e.target.value)} placeholder="agy"/></label>
    <label>Execution mode <select style={input} value={settings.mode} onChange={e=>field('mode',e.target.value==='plan'?'plan':'accept-edits')}><option value="accept-edits">Normal (Accept Edits)</option><option value="plan">Plan</option></select></label>
    <label><input type="checkbox" checked={settings.turbo} onChange={e=>field('turbo',e.target.checked)}/> Turbo mode — automatically approve all CLI tools</label>
    <label>Reasoning effort <select style={input} value={settings.effort} onChange={e=>setSettings(normalizeSettings({...settings,effort:e.target.value}))}>{['default','low','medium','high','xhigh','max'].map(v=><option key={v}>{v}</option>)}</select></label>
    <label><input type="checkbox" checked={settings.mcp} onChange={e=>field('mcp',e.target.checked)}/> Connect Nimbalyst tools through workspace MCP</label>
    <label>Turn timeout (seconds) <input type="number" min={30} max={3600} style={input} value={settings.timeoutSeconds} onChange={e=>field('timeoutSeconds',Number(e.target.value))}/></label>
    <div style={{display:'flex',gap:10,flexWrap:'wrap'}}><button disabled={busy} onClick={()=>void save()}>Save</button><button disabled={busy} onClick={()=>void invoke('status')}>Check connection</button><button disabled={busy} onClick={()=>void invoke('refresh_models')}>Refresh models</button></div>
    <p style={{margin:0}} role="status">{busy?'Checking…':message}</p>
    {models.length>0&&<ul>{models.map(v=><li key={v.id}>{v.name}</li>)}</ul>}
    <details><summary>CLI permission rules (global)</summary><p>Read existing rules before editing. Changes affect all Antigravity CLI projects; a backup is saved. Deny and Ask rules take precedence over Allow.</p><button disabled={busy} onClick={()=>void invoke('permissions')}>Read rules</button><textarea style={{...input,display:'block',width:'100%',minHeight:160,boxSizing:'border-box',fontFamily:'monospace'}} value={permissionRules} onChange={e=>setPermissionRules(e.target.value)} placeholder={'{"allow":[],"deny":[],"ask":[]}'}/><button disabled={busy||!permissionRules} onClick={()=>{try{void invoke('configure_permissions',record(JSON.parse(permissionRules)));}catch(e){setMessage((e as Error).message);}}}>Save global CLI rules</button><p>Examples: read_url(antigravity.google), command(git status), mcp(nimbalyst-antigravity-cli/get_session_summary).</p></details>
    <small>{settings.turbo?'Turbo is on: CLI tool permission checks are skipped, including commands and file changes. Turn off Turbo and Save to use CLI permission rules.':'Turbo is off: CLI permission rules apply. Tools requiring interactive approval are denied in headless mode.'}</small>
  </div>;
}
export const settingsPanel={AntigravitySettings:AntigravitySettings as React.ComponentType<SettingsPanelProps>};
export const components={};
export const panels={'account-usage':{component:UsagePanel}};
export const hostComponents={UsageHost};
