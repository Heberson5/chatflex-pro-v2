import express from 'express'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import { requireAuth } from '../middleware/auth.js'
const router = express.Router()
const dir = './storage/uploads'; fs.mkdirSync(dir, { recursive: true })
const storage = multer.diskStorage({ destination:(req,f,cb)=>cb(null,dir), filename:(req,f,cb)=>cb(null, Date.now()+'-'+f.originalname.replace(/\s+/g,'_')) })
const upload = multer({ storage })
router.post('/send', requireAuth, upload.single('file'), async (req,res)=>{ res.json({ ok:true, url:`/api/uploads/file/${encodeURIComponent(req.file.filename)}` }) })
router.get('/file/:name', requireAuth, (req,res)=>{ const p = path.join(dir, req.params.name); if(!fs.existsSync(p)) return res.status(404).end(); res.sendFile(p, { root: process.cwd() }) })
export default router
