const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const {Server} = require('socket.io')
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})
const port = process.env.PORT || 4000
const index = require('./routes/index')
let interval
io.on('connection', (socket) => {
  console.log('listening new client')
  if (interval) {
    clearInterval(interval)
  }
  interval = setInterval(() => sendMessage(socket), 2000)
  socket.on('disconnect', () => {
    console.log('Client disconnected')
    clearInterval(interval)
  })
})
const sendMessage = (socket) => {
  const message = {
    id: new Date(),
    title: 'from socket',
    description: 'message from socket',
  }
  socket.emit('newMessage', message)
}
app.use(index)

server.listen(port, () => {
  console.log('server running')
})
