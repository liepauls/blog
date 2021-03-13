import React, { useContext, useEffect,  } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'

import NotFound from './notFound'
import { getPost } from '../utils/apiRequests'
import { Context } from '../components/application'
import { componentMap } from '../components/contentBlocks'
import PostInfo from '../components/postInfo'
import Tags from '../components/tags'
import Image from '../components/image'
import ContentWrapper from '../components/contentWrapper'

const Post = () => {
  const { slug } = useParams()
  const context  = useContext(Context)
  const history  = useHistory()

  const { isLoading, error, data } = useQuery('post', () => getPost(slug), { retry: false })

  const post = data || context.post

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

  useEffect(() => {
    context.setPost(post)
  }, [post])

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
      <ContentWrapper>
        {renderBackButton('my-3 md:my-5')}

        <Image src={post.titleImage} />

        <PostInfo date={post.publishedAt} readTime={post.readTime} className='mt-10 mb-1' />

        <h2 className='text-4xl font-semibold'>{post.title}</h2>

        <Tags tags={post.tags} className='mt-2 mb-12' />

        <div className='mt-5 flex flex-col'>
          {post.content?.map(renderContent)}
        </div>

        {renderBackButton('mt-10 pb-8 md:mt-16 md:pb-12')}
      </ContentWrapper>
    )
  } else {
    return null
  }
}

export default Post
