const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8010 })
const code2ws = new Map()

wss.on('connection', function connection(ws, request) {
  console.log('成功')
  // ws => 端
  let code = Math.floor(Math.random() * (999999 - 10000)) + 100000
  code2ws.set(code, ws)

  ws.sendData = (event, data) => {
    ws.send(JSON.stringify({ event, data }))
  }
  ws.sendError = msg => {
    ws.sendData('error', {msg})
  }
  ws.on('message',function incoming (message) {
    let parseMessage = {}
    try {
      parseMessage = JSON.parse(message)
    } catch(e) {
      ws.sendError('message Invalid')
      return
    }
    let { event, data } = parseMessage
    if (event === 'login') {
      ws.sendData('logined', {code})
    } else if (event === 'control') {
      let remote = +data.remote
      if(code2ws.has(remote)) {
        ws.sendData('controlled', {remote})
        let remoteWS = code2ws.get(remote)
        ws.sendRemote = remoteWS.sendData
        remoteWS.sendRemote = ws.sendData
        ws.sendRemote('be-controlled', { remote: code })
      }
    } else if(event === 'forward') {
      console.log(data.event, data.data)
      ws.sendRemote(data.event, data.data)
    } else if (event === 'hide-be-control') {
      ws.sendRemote('hide-be-control')
    } else if (event === 'close-control-window') {
      console.log('close-control-window')
      ws.sendRemote('close-control-window')
      ws.sendData('close-control-window')
    } else if (event === 'control-quit-fresh') {
      if (ws.sendRemote) {
        ws.sendRemote('control-quit-fresh')
      }
    }
  })

  ws.on('close', () => {
    code2ws.delete(code)
    clearTimeout(ws.clearTimeout)
  })
  ws.closeTimeout = setTimeout(() => {
    ws.terminate()
  },20 * 10 * 1000)
})
