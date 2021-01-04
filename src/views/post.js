import React, { useContext, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'

import { getPost } from '../utils/apiRequests'
import { Context } from '../components/application'
import FormattedDate from '../components/formattedDate'
import Tags from '../components/tags'

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

  return (
    <div className='blog'>
      <div className='container text-container mb-20'>
        <img className='object-cover w-full h-full mt-16'
             src={`http://localhost:3000/api/uploads/${post.titleImage}`} />

        <FormattedDate date={post.createdAt} className='mt-10' />

        <h2 className='text-2xl font-semibold'>{post.title}</h2>

        <Tags tags={post.tags} className='mt-4 mb-12' />

        <p className='mt-5'>{post.content}</p>
      </div>
    </div>
  )
}

export default Post
