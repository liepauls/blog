const app  = require('./app')
const http = require('http')

let port = 3000

if (process.env.PORT) {
  port = Number.parseInt(process.env.PORT)
}

app.set('port', port)

http.createServer(app).listen(port)
