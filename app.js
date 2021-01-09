const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const fs = require('fs')

const app = express()

app.use(logger('dev'))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('./client/build'))

if (process.env.NODE_ENV !== 'production') {
  app.use(require('cors')())
}

const { router: postsRouter } = require('./routes/posts')

app.use('/api/posts', postsRouter)

app.get('/*', (request, response) => {
  response.sendFile('./client/build/index.html', { root: __dirname })
})

module.exports = app
