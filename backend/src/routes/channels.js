import express from 'express'
import fetch from 'node-fetch'
import { requireAuth } from '../middleware/auth.js'
const router = express.Router()
const EVO = () => process.env.EVOLUTION_API_URL || 'http://localhost:8080'

router.post('/evolution/create', requireAuth, async (req,res)=>{
  const { session } = req.body
  const r = await fetch(`${EVO()}/sessions/add`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ sessionName: session }) })
  res.json(await r.json().catch(()=>({ ok:false })))
})

router.get('/evolution/qrcode/:session', requireAuth, async (req,res)=>{
  const r = await fetch(`${EVO()}/sessions/qrcode/${req.params.session}`)
  res.json(await r.json().catch(()=>({ qrcode:null })))
})

router.post('/evolution/sendText', requireAuth, async (req,res)=>{
  const { session, number, text } = req.body
  const r = await fetch(`${EVO()}/message/sendText`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ sessionName: session, number, text }) })
  res.json(await r.json().catch(()=>({ ok:false })))
})

export default router
