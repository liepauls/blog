import React, { useContext } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import splash from '../../images/splash.jpg'

import { getPosts } from '../utils/apiRequests'
import { Context } from '../components/application'

const PostsIndex = () => {
  const { isLoading, error, data } = useQuery('posts', getPosts)

  const { setPost } = useContext(Context)

  return (
    <div>
      <img className='splash' src={splash} alt='splash' hidden={true} />

      <div className='posts'>
        {data?.map(post => (
          <div className='post' key={post.id}>
            <Link to={`/posts/${post.urlSlug}`} onClick={() => setPost(post)}>
              <h2>{post.title}</h2>
            </Link>

            <div>{post.content}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PostsIndex
