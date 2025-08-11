import express from 'express'
import { pool } from '../index.js'
import { requireAuth } from '../middleware/auth.js'
const router = express.Router()

router.get('/', requireAuth, async (req,res)=>{
  const { tenant_id } = req.user
  const r = await pool.query('select id,name,config,version,published from entry_flows where tenant_id=$1 order by name',[tenant_id])
  res.json(r.rows)
})

router.post('/', requireAuth, async (req,res)=>{
  const { tenant_id } = req.user; const { name, config } = req.body
  const r = await pool.query('insert into entry_flows(tenant_id,name,config) values($1,$2,$3) returning id',[tenant_id,name,config||{}])
  res.json({ ok:true, id:r.rows[0].id })
})

router.post('/publish/:id', requireAuth, async (req,res)=>{
  await pool.query('update entry_flows set published=true, version=version+1 where id=$1',[req.params.id])
  res.json({ ok:true })
})

router.post('/ai/suggest', requireAuth, async (req,res)=>{
  const skeleton = { nodes:[ {id:'start',type:'start',data:{label:'Start'}}, {id:'menu',type:'menu',data:{options:['Financeiro','Suporte','Comercial']}} ], edges:[ {id:'e1',source:'start',target:'menu'} ] }
  res.json({ ok:true, flow: skeleton })
})

export default router
