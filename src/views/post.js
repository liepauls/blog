import React, { useContext, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'

import { getPost } from '../utils/apiRequests'
import { Context } from '../components/application'
import { componentMap } from '../components/blogBlocks'
import FormattedDate from '../components/formattedDate'
import Tags from '../components/tags'
import Image from '../components/image'

const Post = () => {
  const { slug } = useParams()
  const context  = useContext(Context)
  const history  = useHistory()

  const { isLoading, error, data } = useQuery('post', () => getPost(slug))

  const post = data || context.post || {}

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

  const renderContent = ({ type, text, image }, i) => {
    const Component = componentMap[type]

    if (type === 'image') {
      return <Component key={i} src={image} />
    } else {
      return <Component key={i}>{text}</Component>
    }
  }

  return (
    <div className='blog'>
      <div className='container text-container'>
        <Image className='mt-5 md:mt-10' src={post.titleImage} />

        <FormattedDate date={post.createdAt} className='mt-10' />

        <h2 className='text-3xl font-semibold'>{post.title}</h2>

        <Tags tags={post.tags} className='mt-4 mb-12' />

        <div className='mt-5'>
          {post.content?.map(renderContent)}
        </div>
      </div>
    </div>
  )
}

export default Post
