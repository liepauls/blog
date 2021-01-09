import React, { useContext, useState } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'

import { getPosts } from '../utils/apiRequests'
import { Context } from '../components/application'
import PostInfo from '../components/postInfo'
import Tags from '../components/tags'
import Image from '../components/image'

import splash from '../../images/splash.jpg'

const PostsIndex = () => {
  const { isLoading, error, data } = useQuery('posts', getPosts)

  const [shadow, setShadow] = useState(null)
  const { setPost }         = useContext(Context)

  return (
    <div className='blog'>
      <img className={`object-cover w-screen splash ${shadow && 'shadow-md'}`}
           src={splash}
           alt=''
           onLoad={() => setShadow(true)} />

      <div className='container text-container'>
        {data?.map((post, idx) => (
          <React.Fragment key={post.id}>
            {idx > 0 && <hr className='mx-auto w-4/5 border-gray-150' />}

            <div className='md:flex my-5 md:my-20'>
              <Link to={`/posts/${post.urlSlug}`} onClick={() => setPost(post)}>
                <div className='w-full md:h-44 md:w-44 rounded-lg overflow-hidden safari-scale-wrapper'>
                  <Image className='rounded-lg transform-gpu hover:scale-110 duration-150'
                         src={post.titleImage} />
                </div>
              </Link>

              <div className='md:ml-5'>
                <PostInfo date={post.createdAt} readTime={post.readTime} className='mt-2 md:mt-0' />

                <Link to={`/posts/${post.urlSlug}`} onClick={() => setPost(post)}>
                  <h2 className='text-2xl font-semibold mb-1 hover:text-blue-900'>{post.title}</h2>
                </Link>

                <p className='text-justify'>{post.preview}</p>

                <Tags tags={post.tags} className='mt-3' />
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default PostsIndex
