import React, { useState } from 'react'
import ReactFlow, { Background, MiniMap, Controls } from 'reactflow'
import 'reactflow/dist/style.css'
const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

export default function FlowBuilder({ token }){
  const [nodes,setNodes] = useState([{ id:'start', position:{x:50,y:80}, data:{ label:'Start' }, type:'input' }])
  const [edges,setEdges] = useState([])
  const [name,setName] = useState('Fluxo Principal')

  async function suggest(){
    const r = await fetch(`${API}/flows/ai/suggest`, { method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${token}`}, body: JSON.stringify({ brief: 'financeiro, suporte, comercial' }) })
    const j = await r.json()
    if(j.flow){
      const nn = (j.flow.nodes||[]).map((n,i)=> ({ id:n.id, position:{x:80+i*160,y:120}, data:{label:n.data?.label || n.id}, type: n.type==='start'?'input':(n.type==='route'?'output':undefined) }))
      const ee = (j.flow.edges||[]).map(e=> ({ id:e.id, source:e.source, target:e.target, label:e.label }))
      setNodes(nn); setEdges(ee)
    }
  }

  async function save(){
    await fetch(`${API}/flows`, { method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${token}`}, body: JSON.stringify({ name, config:{ nodes, edges } }) })
    alert('Fluxo salvo!')
  }

  return (
    <div className="card" style={{padding:12}}>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
        <div><strong>Fluxos</strong> <input className="btn" value={name} onChange={e=>setName(e.target.value)} style={{marginLeft:8}}/></div>
        <div style={{display:'flex', gap:8}}>
          <button className="btn" onClick={suggest}>IA: sugerir</button>
          <button className="btn" onClick={save}>Salvar</button>
        </div>
      </div>
      <div style={{height:'60vh'}}>
        <ReactFlow nodes={nodes} edges={edges} onNodesChange={setNodes} onEdgesChange={setEdges} fitView>
          <MiniMap /><Controls /><Background gap={12} />
        </ReactFlow>
      </div>
      <div style={{fontSize:12, opacity:.7, marginTop:6}}>Arraste, conecte e publique. Estilo Bizagi/Take Blip.</div>
    </div>
  )
}
