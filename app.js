const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const fs = require('fs')
const cheerio = require('cheerio')

const app = express()

const { Post } = require('./models')

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

app.get('/posts/:slug', async (request, response) => {
  const post = await Post.findOne({ where: { urlSlug: request.params.slug } })

  if (post) {
    const $ = cheerio.load(fs.readFileSync('./client/build/index.html', 'utf8'))

    $('[property="og:title"]').attr('content', post.title)
    $('[property="og:description"]').attr('content', post.preview)
    $('[property="article:tag"]').attr('content', post.tags.join(', '))
    $('[property="og:image"]').attr('content', post.titleImage.getSignedUrl())
    $('[property="article:published_time"]').attr('content', post.createdAt.toISOString())

    response.send($.html())
  } else {
    response.sendFile('./client/build/index.html', { root: __dirname })
  }
})

app.get('/*', (request, response) => {
  response.sendFile('./client/build/index.html', { root: __dirname })
})

module.exports = app
