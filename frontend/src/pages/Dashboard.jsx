import React, { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
export default function Dashboard({ token }){
  const [data,setData] = useState({ by_user:[], by_dept:[], avg_accept_s:0, avg_to_close_s:0 })
  useEffect(()=>{ (async()=>{ const r = await fetch(`${API}/dashboard/metrics`, { headers:{ Authorization:`Bearer ${token}` } }); if(r.ok) setData(await r.json()) })() },[])
  return (
    <div className="card" style={{padding:12}}>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
        <div className="card" style={{padding:12}}>
          <b>Atendimentos por usuário</b>
          <div style={{height:260}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.by_user}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="user"/><YAxis allowDecimals={false}/><Tooltip/><Bar dataKey="total" /></BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card" style={{padding:12}}>
          <b>Atendimentos por departamento</b>
          <div style={{height:260}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.by_dept}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="dept"/><YAxis allowDecimals={false}/><Tooltip/><Bar dataKey="total" /></BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:12}}>
        <div className="card" style={{padding:16}}><div>Tempo médio para aceitar</div><div style={{fontSize:28, fontWeight:700}}>{data.avg_accept_s}s</div></div>
        <div className="card" style={{padding:16}}><div>Tempo médio até encerrar</div><div style={{fontSize:28, fontWeight:700}}>{data.avg_to_close_s}s</div></div>
      </div>
    </div>
  )
}
