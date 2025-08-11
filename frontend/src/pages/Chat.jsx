import React, { useEffect, useState } from 'react'
const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
export default function Chat({ token }){
  const [convs,setConvs] = useState([]); const [closed,setClosed] = useState([]); const [current,setCurrent] = useState(null); const [msgs,setMsgs]=useState([]); const [text,setText]=useState('')
  async function load(){ const a = await fetch(`${API}/chats`,{headers:{Authorization:`Bearer ${token}`}}); if(a.ok) setConvs(await a.json()); const b = await fetch(`${API}/chats/closed`,{headers:{Authorization:`Bearer ${token}`}}); if(b.ok) setClosed(await b.json()); }
  async function loadMsgs(){ if(!current) return; const r = await fetch(`${API}/chats/${current.id}/messages`,{headers:{Authorization:`Bearer ${token}`}}); if(r.ok) setMsgs(await r.json()); }
  useEffect(()=>{ load() },[])
  useEffect(()=>{ loadMsgs() },[current])
  async function accept(){ if(!current) return; await fetch(`${API}/chats/accept`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify({conversation_id:current.id})}); load() }
  async function closeC(){ if(!current) return; await fetch(`${API}/chats/close`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify({conversation_id:current.id})}); setCurrent(null); load() }
  async function send(){ if(!current||!text.trim()) return; const r=await fetch(`${API}/chats/${current.id}/send`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify({text})}); if(r.ok){ setText(''); loadMsgs() } }
  return (<div className="grid" style={{gridTemplateColumns:'320px 1fr', gap:16}}>
    <div className="card" style={{padding:8}}>
      <div style={{display:'flex',gap:8, marginBottom:8}}><strong>Conversas</strong></div>
      <div>{convs.map(c=> <div key={c.id} className="btn" style={{width:'100%', marginBottom:6}} onClick={()=>setCurrent(c)}>{c.customer_name||c.customer_number||c.id}</div>)}</div>
      <div style={{marginTop:8, fontSize:12, opacity:.7}}>Encerradas</div>
      <div>{closed.map(c=> <div key={c.id} className="btn" style={{width:'100%', marginBottom:6}} onClick={()=>setCurrent(c)}>{c.customer_name||c.customer_number||c.id}</div>)}</div>
    </div>
    <div className="card" style={{padding:8}}>
      <div style={{display:'flex', justifyContent:'space-between', marginBottom:8}}>
        <div><strong>{current? (current.customer_name||current.customer_number): 'Selecione'}</strong></div>
        <div style={{display:'flex', gap:8}}>
          <button className="btn" onClick={accept}>Aceitar</button>
          <button className="btn" onClick={closeC}>Encerrar</button>
        </div>
      </div>
      <div style={{height:'45vh', overflow:'auto', padding:8, border:'1px dashed var(--border)', borderRadius:12}}>
        {msgs.map(m=> <div key={m.id} style={{display:'flex', justifyContent: m.sender==='agent'?'flex-end':'flex-start', marginBottom:6}}><div className="btn" style={{background: m.sender==='agent'?'#111':'#fff', color: m.sender==='agent'?'#fff':'inherit'}}>{m.body||m.media_url}</div></div>)}
      </div>
      <div style={{display:'flex', gap:8, marginTop:8}}>
        <textarea rows={1} style={{flex:1, padding:8, border:'1px solid var(--border)', borderRadius:12}} value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); send() } }}/>
        <button className="btn" onClick={send}>Enviar</button>
      </div>
      <div style={{fontSize:12, opacity:.7, marginTop:6}}>Shift+Enter = nova linha • Anexos/Áudio disponíveis (UI)</div>
    </div>
  </div>)
}
