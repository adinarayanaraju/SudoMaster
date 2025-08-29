const jsonServer = require('json-server')
const jwt = require('jsonwebtoken')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

const secret = 'your-secret-key' // You should use a more secure secret in a real application

server.use(middlewares)

server.post('/login', (req, res) => {
  const { email, password } = req.body
  const user = router.db.get('users').find({ email, password }).value()

  if (user) {
    const token = jwt.sign({ id: user.id, email: user.email }, secret, {
      expiresIn: '1h',
    })
    res.json({ token, user })
  } else {
    res.status(401).json({ message: 'Invalid credentials' })
  }
})

server.get('/auth/verify-token', (req, res) => {
  const token = req.headers.authorization
  if (token) {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' })
      }
      const user = router.db.get('users').find({ id: decoded.id }).value()
      if (user) {
        res.json({ success: true, user })
      } else {
        res.status(401).json({ message: 'User not found' })
      }
    })
  } else {
    res.status(401).json({ message: 'No token provided' })
  }
})

server.use(router)
server.listen(3001, () => {
  console.log('JSON Server is running')
})
