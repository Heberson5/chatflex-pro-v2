import React, { useState } from 'react'
const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
export default function Channels({ token }){
  const [session,setSession] = useState('univida01')
  const [qr,setQr] = useState(''); const [to,setTo]=useState('5565999990001'); const [text,setText]=useState('Olá 👋')
  async function create(){ await fetch(`${API}/channels/evolution/create`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`}, body: JSON.stringify({ session })}); alert('Sessão criada. Agora pegue o QR.') }
  async function qrcode(){ const r = await fetch(`${API}/channels/evolution/qrcode/${session}`,{headers:{Authorization:`Bearer ${token}`}}); const j = await r.json(); setQr(j?.qrcode||''); }
  async function send(){ await fetch(`${API}/channels/evolution/sendText`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`}, body: JSON.stringify({ session, number: to+'@c.us', text })}); alert('Enviado (Evolution).') }
  return (
    <div className="card" style={{padding:12}}>
      <strong>Canais WhatsApp</strong>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:8}}>
        <div className="card" style={{padding:12}}>
          <div><b>Evolution API</b></div>
          <input className="btn" value={session} onChange={e=>setSession(e.target.value)} placeholder="session" style={{marginTop:8}}/>
          <div style={{display:'flex', gap:8, marginTop:8}}>
            <button className="btn" onClick={create}>Criar sessão</button>
            <button className="btn" onClick={qrcode}>Ver QR</button>
          </div>
          {qr && <div style={{marginTop:8}}><img src={qr} alt="QR" style={{maxWidth:280}}/></div>}
        </div>
        <div className="card" style={{padding:12}}>
          <div><b>Envio rápido</b> (teste Evolution)</div>
          <input className="btn" value={to} onChange={e=>setTo(e.target.value)} placeholder="5565.." style={{marginTop:8}}/>
          <textarea className="btn" value={text} onChange={e=>setText(e.target.value)} style={{marginTop:8}}/>
          <button className="btn" onClick={send} style={{marginTop:8}}>Enviar</button>
        </div>
      </div>
      <div style={{fontSize:12, opacity:.7, marginTop:6}}>Opcional: configure Cloud API (Meta) no backend.</div>
    </div>
  )
}
