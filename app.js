const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const fs = require('fs')

const { findPost, setMetaAndRender } = require('./helpers/postHelpers')
const { router: postsRouter } = require('./routes/posts')

const app = express()

app.use(logger('dev'))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('./client/build'))

if (process.env.NODE_ENV !== 'production') {
  app.use(require('cors')())
}

const serveStatic = (response) => response.sendFile('./client/build/index.html', { root: __dirname })

app.use('/api/posts', postsRouter)

app.get('/posts/:slug', async (request, response) => {
  const post = await findPost(request.params.slug)

  if (post) {
    setMetaAndRender(response, post)
  } else {
    serveStatic(response)
  }
})

app.get('/*', (request, response) => serveStatic(response))

module.exports = app
