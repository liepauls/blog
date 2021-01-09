const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const fs = require('fs')
const sentry = require('@sentry/node')

const { findPost, setMetaAndRender } = require('./helpers/postHelpers')
const { router: postsRouter } = require('./routes/posts')

const app  = express()
const prod = process.env.NODE_ENV === 'production'

sentry.init({ dsn: 'https://cef620f22b8c4d1d94a6d6a69b26a9fd@o502416.ingest.sentry.io/5584774' })

if (prod) {
  app.use(sentry.Handlers.requestHandler())
}

if (prod) {
  app.use((request, response, next) => {
    if (request.get('X-Forwarded-Proto') !== 'https') {
      return response.redirect(`https://${request.get('host')}${request.url}`)
    }

    next()
  })
}

if (!prod) {
  app.use(require('cors')())
}

app.use(logger('dev'))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('./client/build'))

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

if (prod) {
  app.use(sentry.Handlers.errorHandler())
}

module.exports = app
