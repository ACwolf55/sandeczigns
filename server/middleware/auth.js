const jwt = require('jsonwebtoken')
const { JWT_SECRET } = process.env

// Protects a route: only lets the request through if it carries a valid admin JWT.
// The frontend sends the token in the header: "Authorization: Bearer <token>"
function requireAdmin(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) return res.status(401).send('Not authorized — please log in')

  try {
    const decoded = jwt.verify(token, JWT_SECRET)  // throws if invalid/expired
    req.admin = decoded                             // e.g. { id, username }
    next()
  } catch (e) {
    return res.status(401).send('Invalid or expired session — please log in again')
  }
}

module.exports = { requireAdmin }
