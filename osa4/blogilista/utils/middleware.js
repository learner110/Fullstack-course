const jwt = require('jsonwebtoken')
const User = require('../models/user')

const tokenExtractor = (req, res, next) => {
  const auth = req.get('authorization')
  if (auth && auth.startsWith('Bearer ')) {
    req.token = auth.replace('Bearer ', '')
  }
  next()
}

const userExtractor = async (req, res, next) => {
  if (!req.token) {
    return res.status(401).json({ error: 'token missing' })
  }

  const decoded = jwt.verify(req.token, process.env.SECRET)

  if (!decoded.id) {
    return res.status(401).json({ error: 'token invalid' })
  }

  req.user = await User.findById(decoded.id)
  next()
}

const errorHandler = (error, req, res, next) => {
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'invalid token' })
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token expired' })
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }


  if (error.name === 'MongoServerError' && error.message.includes('E11000')) {
    return res.status(400).json({ error: 'expected `username` to be unique' })
  }

  next(error)
}

module.exports = {
  tokenExtractor,
  userExtractor,
  errorHandler
}