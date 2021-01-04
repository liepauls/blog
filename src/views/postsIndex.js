import React, { useContext } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import splash from '../../images/splash.jpg'

import { getPosts } from '../utils/apiRequests'
import { Context } from '../components/application'
import FormattedDate from '../components/formattedDate'
import Tags from '../components/tags'

const PostsIndex = () => {
  const { isLoading, error, data } = useQuery('posts', getPosts)

  const { setPost } = useContext(Context)

  return (
    <div className='blog'>
      <img className='object-cover w-screen splash shadow-md' src={splash} alt='splash' />

      <div className='container text-container'>
        <div className='posts'>
          {data?.map((post, idx) => (
            <React.Fragment key={post.id}>
              {idx > 0 && <hr className='mx-auto w-4/5 border-gray-150' />}

              <div className='md:flex my-10 md:my-20'>
                <Link to={`/posts/${post.urlSlug}`} onClick={() => setPost(post)}>
                  <div className='w-full md:h-44 md:w-44 rounded-lg overflow-hidden'>
                    <img className='object-cover rounded-lg w-full h-full transform-gpu hover:scale-110 duration-150'
                         src={`http://localhost:3000/api/uploads/${post.titleImage}`} />
                  </div>
                </Link>

                <div className='md:ml-5'>
                  <FormattedDate date={post.createdAt} className='mt-3 md:mt-1' />

                  <Link to={`/posts/${post.urlSlug}`} onClick={() => setPost(post)}>
                    <h2 className='text-2xl font-semibold mb-1 hover:text-blue-900'>{post.title}</h2>
                  </Link>

                  <p className='text-justify'>{post.content.slice(0, 200)}...</p>

                  <Tags tags={post.tags} className='mt-3' />
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PostsIndex
