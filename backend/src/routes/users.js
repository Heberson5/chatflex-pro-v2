import express from 'express'
import { pool } from '../index.js'
import { requireAuth } from '../middleware/auth.js'
import bcrypt from 'bcryptjs'
const router = express.Router()

router.get('/', requireAuth, async (req,res)=>{
  const { tenant_id } = req.user
  const r = await pool.query('select id,email,role,department,active from users where tenant_id=$1 order by email',[tenant_id])
  res.json(r.rows)
})

router.post('/', requireAuth, async (req,res)=>{
  const { tenant_id } = req.user
  const { email, password, role='AGENT', department=null } = req.body
  const hpw = await bcrypt.hash(password, 10)
  await pool.query("insert into users(tenant_id,email,password_hash,role,department,active) values($1,$2,$3,$4,$5,true)",[tenant_id,email,hpw,role,department])
  res.json({ ok:true })
})

export default router
