'use strict'

const clr = {
  red: text => `\u001b[031m${text}\u001b[0m`,
  green: text => `\u001b[032m${text}\u001b[0m`,
  lightGreen: text => `\u001b[92m${text}\u001b[0m`,
  lightBlue: text => `\u001b[34m${text}\u001b[0m`,
  yellow: text => `\u001b[33m${text}\u001b[0m`
}
const io = require('socket.io-client')
const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
let socket
let sessionMsg = new Array()
rl.setPrompt(clr.lightGreen('-> '))

//clear all
console.clear()

const startConn = async () => {
  rl.question('Set server: ', function (server) {
    socket = io.connect(server == 'test' ? 'http://localhost:3000' : server)

    socket.on('connect', () => {
      //set user before enter chat
      process.stdout.write(clr.green('Chat connected!\n'))

      rl.question('Set your username: ', user => {
        startService(user, socket)
      })
    })

    if (server) {
      socket.on('connect_error', () => {
        socket.disconnect()
        process.stdout.write(clr.red('Try Again.\n'))
        startConn()
      })
    } else {
      process.stdout.write(clr.yellow('You need enter a server.\n'))
      startConn()
    }
  })
}
startConn()

const startService = (user, socket) => {
  rl.setPrompt(clr.lightGreen(`${user} >> `))
  process.stdout.write('\x1bc')

  const addmsg = (msgData, from) => {
    process.stdout.write('\x1bc')

    sessionMsg.push({ ...msgData, from })

    sessionMsg.forEach(message => {
      if (message.from == 'local') {
        process.stdout.write(
          clr.lightBlue(`${message.user} >> ${message.text}`)
        )
      } else {
        process.stdout.write(
          clr.lightGreen(`${message.user} << ${message.text}`)
        )
      }
      process.stdout.write('\n')
    })
  }

  socket.on('receive', data => {
    addmsg(data, 'remote')
    rl.prompt()
  })

  rl.on('line', function (text) {
    let msgData = { text, user }

    socket.emit('send', msgData)
    addmsg(msgData, 'local')
    rl.prompt()
  })

  rl.prompt()
}
