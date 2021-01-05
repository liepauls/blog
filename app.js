const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const fs = require('fs')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

if (process.env.NODE_ENV !== 'production') {
  app.use(require('cors')())
}

const { router: postsRouter } = require('./routes/posts')

const { UPLOAD_DESTINATION } = require('./config/config')

app.use('/api/posts', postsRouter)

app.get('/api/uploads/:key', async (request, response) => {
  fs.readFile(`${UPLOAD_DESTINATION}/${request.params.key}`, (err, data) => {
    if (err) {
      response.sendStatus(400)
    } else {
      response.send(data)
    }
  })
})

module.exports = app
