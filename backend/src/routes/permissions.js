import express from 'express'
import { pool } from '../index.js'
import { requireAuth } from '../middleware/auth.js'
const router = express.Router()

router.get('/user/:user_id', requireAuth, async (req,res)=>{
  const up = await pool.query('select permission from user_permissions where user_id=$1',[req.params.user_id])
  res.json({ permissions: up.rows.map(r=>r.permission) })
})

export default router
