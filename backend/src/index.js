import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import http from 'http'
import { Server } from 'socket.io'
import pkg from 'pg'
import 'dotenv/config'
const { Pool } = pkg
export const pool = new Pool({ connectionString: process.env.DB_URL })

import authRouter from './routes/auth.js'
import chatsRouter from './routes/chats.js'
import uploadsRouter from './routes/uploads.js'
import flowsRouter from './routes/flows.js'
import channelsRouter from './routes/channels.js'
import dashboardRouter from './routes/dashboard.js'
import permissionsRouter from './routes/permissions.js'
import usersRouter from './routes/users.js'
import webhooksRouter from './routes/webhooks.js'

import { ensureSchema, seedMasterAdmin } from './schema.js'

const app = express()
app.use(cors())
app.use(express.json({limit:'15mb'}))
app.use(cookieParser())

const server = http.createServer(app)
const io = new Server(server, { cors:{ origin:'*' } })
app.set('io', io)
io.on('connection', s=> s.on('join', room => s.join(room)))

app.get('/api/health', (req,res)=> res.json({ ok:true, ts: Date.now() }))

app.use('/api/auth', authRouter)
app.use('/api/chats', chatsRouter)
app.use('/api/uploads', uploadsRouter)
app.use('/api/flows', flowsRouter)
app.use('/api/channels', channelsRouter)
app.use('/api/dashboard', dashboardRouter)
app.use('/api/permissions', permissionsRouter)
app.use('/api/users', usersRouter)
app.use('/api/webhooks', webhooksRouter)

const PORT = process.env.PORT || 3000
;(async()=>{
  await ensureSchema(pool)
  await seedMasterAdmin(pool)
  server.listen(PORT, ()=> console.log('Backend on', PORT))
})()
