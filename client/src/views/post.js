import React, { useContext, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import NotFound from './notFound'
import { getPost } from '../utils/apiRequests'
import { Context } from '../components/application'
import { componentMap } from '../components/blogBlocks'
import PostInfo from '../components/postInfo'
import Tags from '../components/tags'
import Image from '../components/image'

const Post = () => {
  const { slug } = useParams()
  const context  = useContext(Context)
  const history  = useHistory()

  const { isLoading, error, data } = useQuery('post', () => getPost(slug), { retry: false })

  const post = data || context.post || {}

  useEffect(() => {
    // if (!post.title) return
    // const ogTitle = document.createElement('meta')
    // ogTitle.setAttribute('property', 'og:title')
    // ogTitle.setAttribute('content', post.title)
    // document.querySelector('head').appendChild(ogTitle)

    // const ogDescription = document.createElement('meta')
    // ogDescription.setAttribute('property', 'og:description')
    // ogDescription.setAttribute('content', post.preview)
    // document.querySelector('head').appendChild(ogDescription)

    // const ogType = document.createElement('meta')
    // ogType.setAttribute('property', 'og:type')
    // ogType.setAttribute('content', 'article')
    // document.querySelector('head').appendChild(ogType)

    // const ogUrl = document.createElement('meta')
    // ogUrl.setAttribute('property', 'og:url')
    // ogUrl.setAttribute('content', window.location)
    // document.querySelector('head').appendChild(ogUrl)

    // const ogImage = document.createElement('meta')
    // ogImage.setAttribute('property', 'og:image')
    // ogImage.setAttribute('content', post.titleImage)
    // document.querySelector('head').appendChild(ogImage)

    // const ogPublishedAt = document.createElement('meta')
    // ogPublishedAt.setAttribute('property', 'article:published_time')
    // ogPublishedAt.setAttribute('content', post.createdAt)
    // document.querySelector('head').appendChild(ogPublishedAt)

    // const ogAuthor = document.createElement('meta')
    // ogAuthor.setAttribute('property', 'article:author')
    // ogAuthor.setAttribute('content', 'Pauls Liepa')
    // document.querySelector('head').appendChild(ogAuthor)

    // const ogTag = document.createElement('meta')
    // ogTag.setAttribute('property', 'article:tag')
    // ogTag.setAttribute('content', post.tags.join(','))
    // document.querySelector('head').appendChild(ogTag)
  }, [post.title])

  let unlisten
  useEffect(() => (
    () => {
      if (unlisten) return

      unlisten = history.listen((_location, action) => {
        if (action === 'POP') {
          context.setPost(null)
          unlisten()
          unlisten = undefined
        }
      })
    }
  ), [])

  const renderBackButton = (margin) => (
    <div className={`text-center ${margin}`}>
      <Link to='/posts'
            onClick={() => context.setPost(null)}
            className={`hover:text-blue-900 text-2xl`}>
        ← back to list
      </Link>
    </div>
  )

  const renderContent = ({ type, text, image }, i) => {
    const Component = componentMap[type]

    if (type === 'image') {
      return <Component key={i} src={image} />
    } else {
      return <Component key={i}>{text}</Component>
    }
  }

  if (error === 404) {
    return <NotFound />
  } else if (!isLoading) {
    return (
      <div className='blog'>
        <Helmet>
          <meta property='og:title' content={post.title} />
          <meta property='og:type' content='article' />
          <meta property='og:url' content={window.location} />
          <meta property='og:image' content={post.titleImage} />
          <meta property='article:published_time' content={post.createdAt} />
          <meta property='article:author' content='Pauls Liepa' />
          <meta property='article:tag' content={post.tags.join(', ')} />
        </Helmet>

        <div className='container text-container'>
          {renderBackButton('my-3 md:my-5')}

          <Image src={post.titleImage} />

          <PostInfo date={post.createdAt} readTime={post.readTime} className='mt-10 mb-1' />

          <h2 className='text-4xl font-semibold'>{post.title}</h2>

          <Tags tags={post.tags} className='mt-2 mb-12' />

          <div className='mt-5 flex flex-col'>
            {post.content?.map(renderContent)}
          </div>

          {renderBackButton('mt-8 md:mt-12')}
        </div>
      </div>
    )
  } else {
    return null
  }
}

export default Post
