import React, { useState } from 'react'
const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
export default function Login({ onAuthed, onToggleTheme, theme }){
  const [email,setEmail] = useState('hebersohas@gmail.com')
  const [password,setPassword] = useState('Guga430512')
  const [err,setErr] = useState('')
  async function login(){
    const r = await fetch(`${API}/auth/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) })
    const j = await r.json()
    if(r.ok){ onAuthed(j.token) } else { setErr(j.error||'erro') }
  }
  return (
    <div className="min-h-screen" style={{display:'grid', placeItems:'center', padding:16}}>
      <button className="btn" onClick={onToggleTheme} style={{position:'fixed', top:8, right:8}}>{theme==='dark'?'☀️ Claro':'🌙 Escuro'}</button>
      <div className="card" style={{padding:24, width:360}}>
        <h3>Entrar</h3>
        <input className="btn" style={{width:'100%', marginTop:8}} value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email"/>
        <input className="btn" style={{width:'100%', marginTop:8}} type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Senha"/>
        {err && <div style={{color:'#ef4444', fontSize:12, marginTop:8}}>{err}</div>}
        <button className="btn" style={{width:'100%', marginTop:12}} onClick={login}>Entrar</button>
      </div>
    </div>
  )
}
