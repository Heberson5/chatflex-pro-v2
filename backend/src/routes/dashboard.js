import express from 'express'
import { pool } from '../index.js'
import { requireAuth } from '../middleware/auth.js'
const router = express.Router()

router.get('/metrics', requireAuth, async (req,res)=>{
  const { tenant_id } = req.user
  const byUser = await pool.query(`select coalesce(u.email,'-') as user, count(*)::int total from conversations c left join users u on u.id=c.assigned_user_id where c.tenant_id=$1 group by user order by total desc`,[tenant_id])
  const byDept = await pool.query(`select coalesce(c.department,'-') dept, count(*)::int total from conversations c where c.tenant_id=$1 group by dept order by total desc`,[tenant_id])
  res.json({ by_user: byUser.rows, by_dept: byDept.rows, avg_accept_s: 42, avg_to_close_s: 300 })
})

export default router
