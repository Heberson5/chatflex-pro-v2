import express from 'express'
import { pool } from '../index.js'
const router = express.Router()

// Evolution inbound webhook (configure Evolution para POSTar aqui)
router.post('/evolution', async (req,res)=>{
  try{
    const { from, to, name, text, session } = req.body || {}
    if(!from) return res.json({ ok:true })
    const t = await pool.query("select id from tenants where slug='univida'")
    const tenant_id = t.rows[0].id
    let conv = await pool.query("select id from conversations where tenant_id=$1 and customer_number=$2 and status='open' order by created_at desc limit 1",[tenant_id, from])
    if(!conv.rowCount){
      conv = await pool.query("insert into conversations(tenant_id,customer_name,customer_number,status,source_number,session) values($1,$2,$3,'open',$4,$5) returning id",[tenant_id, name||null, from, to||null, session||null])
    }
    const cid = conv.rows[0].id
    await pool.query('insert into messages(conversation_id,sender,body) values($1,$2,$3)',[cid,'customer', text||''])
    res.json({ ok:true })
  }catch(e){ res.json({ ok:true }) }
})

export default router
