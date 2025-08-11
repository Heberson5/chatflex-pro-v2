import express from 'express'
import fetch from 'node-fetch'
import { pool } from '../index.js'
import { requireAuth } from '../middleware/auth.js'
const router = express.Router()
const EVO = () => process.env.EVOLUTION_API_URL || 'http://localhost:8080'
const DEFAULT_SESSION = () => process.env.EVOLUTION_DEFAULT_SESSION || 'default'

router.get('/', requireAuth, async (req,res)=>{
  const { tenant_id } = req.user
  const r = await pool.query("select * from conversations where tenant_id=$1 and status='open' order by coalesce(accepted_at, now()) desc limit 200",[tenant_id])
  res.json(r.rows)
})

router.get('/closed', requireAuth, async (req,res)=>{
  const { tenant_id } = req.user
  const r = await pool.query("select * from conversations where tenant_id=$1 and status='closed' order by closed_at desc limit 200",[tenant_id])
  res.json(r.rows)
})

router.get('/:id/messages', requireAuth, async (req,res)=>{
  const { id } = req.params
  const r = await pool.query('select * from messages where conversation_id=$1 order by created_at asc',[id])
  res.json(r.rows)
})

router.post('/accept', requireAuth, async (req,res)=>{
  const { sub } = req.user; const { conversation_id } = req.body
  await pool.query('update conversations set assigned_user_id=$2, accepted_by=$2, accepted_at=now() where id=$1',[conversation_id, sub])
  res.json({ ok:true })
})

router.post('/close', requireAuth, async (req,res)=>{
  const { sub } = req.user; const { conversation_id } = req.body
  await pool.query("update conversations set status='closed', closed_at=now(), closed_by=$2 where id=$1",[conversation_id, sub])
  res.json({ ok:true })
})

router.post('/:id/send', requireAuth, async (req,res)=>{
  const { id } = req.params
  const { text } = req.body
  if(!text) return res.status(400).json({error:'text required'})
  await pool.query('insert into messages(conversation_id,sender,body) values($1,$2,$3)',[id,'agent',text])
  try{
    const c = await pool.query('select customer_number, session from conversations where id=$1',[id])
    const number = (c.rows[0]?.customer_number || '').replace(/\D+/g,'') + '@c.us'
    const session = c.rows[0]?.session || DEFAULT_SESSION()
    await fetch(`${EVO()}/message/sendText`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ sessionName: session, number, text }) })
  }catch(e){}
  res.json({ ok:true })
})

export default router
