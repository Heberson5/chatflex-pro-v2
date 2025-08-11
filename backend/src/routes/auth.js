import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from '../index.js'
import { requireAuth } from '../middleware/auth.js'
const router = express.Router()

router.post('/login', async (req,res)=>{
  const { email, password } = req.body
  const r = await pool.query('select id,email,password_hash,role,tenant_id from users where email=$1',[email])
  if(!r.rowCount) return res.status(401).json({error:'invalid'})
  const ok = await bcrypt.compare(password, r.rows[0].password_hash)
  if(!ok) return res.status(401).json({error:'invalid'})
  const token = jwt.sign({ sub:r.rows[0].id, email, role:r.rows[0].role, tenant_id:r.rows[0].tenant_id }, process.env.JWT_SECRET||'secret')
  res.json({ token })
})

router.get('/me', requireAuth, (req,res)=> res.json(req.user))

export default router
