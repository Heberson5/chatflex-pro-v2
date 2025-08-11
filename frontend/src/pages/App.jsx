import React, { useState } from 'react'
import { MessageSquare, Workflow, Settings, BarChart3, Phone, Moon, Sun } from 'lucide-react'
import Chat from './Chat.jsx'
import FlowBuilder from './FlowBuilder.jsx'
import Dashboard from './Dashboard.jsx'
import Channels from './Channels.jsx'
import Login from './Login.jsx'

export default function App(){
  const [token,setToken] = useState(null)
  const [tab,setTab] = useState('chat')
  const [theme,setTheme] = useState(()=> document.documentElement.classList.contains('dark') ? 'dark':'light')
  function toggleTheme(){ const n = theme==='dark'?'light':'dark'; setTheme(n); document.documentElement.classList.toggle('dark', n==='dark'); localStorage.setItem('theme',n) }

  if(!token) return <Login onAuthed={(t)=>setToken(t)} onToggleTheme={toggleTheme} theme={theme} />

  return (
    <div className="min-h-screen" style={{padding:16}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between', marginBottom:16}}>
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <div style={{width:32,height:32, borderRadius:12, background:'linear-gradient(135deg,#0ea5e9,#6366f1)'}}/>
          <strong>Chatflex Pro</strong>
          <span style={{fontSize:12, opacity:.6, marginLeft:8}}>UI moderna</span>
        </div>
        <button className="btn" onClick={toggleTheme}>{theme==='dark'? <Sun size={16}/> : <Moon size={16}/>} Tema</button>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'240px 1fr', gap:16}}>
        <aside>
          <Nav label="Atendimentos" icon={<MessageSquare size={16}/>} active={tab==='chat'} onClick={()=>setTab('chat')}/>
          <Nav label="Fluxos" icon={<Workflow size={16}/>} active={tab==='flows'} onClick={()=>setTab('flows')}/>
          <Nav label="Canais (WhatsApp)" icon={<Phone size={16}/>} active={tab==='channels'} onClick={()=>setTab('channels')}/>
          <Nav label="Dashboard" icon={<BarChart3 size={16}/>} active={tab==='dash'} onClick={()=>setTab('dash')}/>
          <Nav label="Configurações" icon={<Settings size={16}/>} active={tab==='settings'} onClick={()=>setTab('settings')}/>
        </aside>
        <main>
          {tab==='chat' && <Chat token={token}/>}
          {tab==='flows' && <FlowBuilder token={token}/>}
          {tab==='channels' && <Channels token={token}/>}
          {tab==='dash' && <Dashboard token={token}/>}
          {tab==='settings' && <div className="card" style={{padding:16}}>Configurações (branding, permissões…)</div>}
        </main>
      </div>
    </div>
  )
}

function Nav({label, icon, active, onClick}){
  return <button onClick={onClick} className="btn" style={{width:'100%', display:'flex', gap:8, alignItems:'center', justifyContent:'flex-start', marginBottom:8, background: active ? 'linear-gradient(135deg,#111,#222)' : undefined, color: active ? '#fff' : undefined}}>{icon} {label}</button>
}
