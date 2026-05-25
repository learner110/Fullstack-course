const app = require('./app')
const http = require('http')
const config = require('./utils/config')
const path = require('path')
const express = require('express')

const server = http.createServer(app)

app.use(express.static(path.join(__dirname, 'build')))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

server.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
  console.log('NODE_ENV:', process.env.NODE_ENV)
})