import jwt from 'jsonwebtoken'
export function requireAuth(req,res,next){
  const h = req.headers.authorization || ''
  const token = h.startsWith('Bearer ')? h.slice(7): null
  if(!token) return res.status(401).json({error:'no token'})
  try{ req.user = jwt.verify(token, process.env.JWT_SECRET || 'secret'); next() }catch(e){ res.status(401).json({error:'invalid token'}) }
}
