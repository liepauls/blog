const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const fs = require('fs')

const app = express()

app.use(logger('dev'))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('./build'))

if (process.env.NODE_ENV !== 'production') {
  app.use(require('cors')())
}

const { router: postsRouter } = require('./routes/posts')

const { UPLOAD_DESTINATION } = require('./config/config')

app.use('/api/posts', postsRouter)

app.get('/api/uploads/:key', async (request, response) => {
  fs.readFile(`${UPLOAD_DESTINATION}/${request.params.key}`, (err, data) => {
    if (err) {
      response.sendStatus(404)
    } else {
      response.send(data)
    }
  })
})

app.get('/*', (request, response) => {
  response.sendFile('./build/index.html', { root: __dirname })
})

module.exports = app
