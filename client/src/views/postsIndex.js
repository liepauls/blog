import React, { useContext, useState } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'

import { getPosts } from '../utils/apiRequests'
import { Context } from '../components/application'
import PostInfo from '../components/postInfo'
import Tags from '../components/tags'
import Image from '../components/image'
import ContentWrapper from '../components/contentWrapper'

const PostsIndex = () => {
  const { data } = useQuery('posts', getPosts)

  const { setPost } = useContext(Context)
  const navProps    = (post) => ({ to: `/posts/${post.urlSlug}`, onClick: () => setPost(post) })

  return (
    <ContentWrapper>
      {data?.map((post, idx) => (
        <React.Fragment key={post.id}>
          {idx > 0 && <hr className='mx-auto w-2/5 block border-gray-100 my-10 md:my-0' />}

          <div className='md:flex my-20'>
            <Link {...navProps(post)}>
              <div className='w-full md:h-44 md:w-56 rounded-lg overflow-hidden safari-scale-wrapper'>
                <Image className='rounded-lg transform-gpu hover:scale-110 duration-150'
                       src={post.titleImage} />
              </div>
            </Link>

            <div className='md:ml-5'>
              <PostInfo date={post.publishedAt} readTime={post.readTime} className='mt-2 md:mt-0' />

              <Link {...navProps(post)}>
                <h2 className='text-2xl font-semibold mb-1 hover:text-blue-900'>{post.title}</h2>
              </Link>

              <p className='text-justify'>{post.preview}</p>

              <Tags tags={post.tags} className='mt-3' />
            </div>
          </div>
        </React.Fragment>
      ))}
    </ContentWrapper>
  )
}

export default PostsIndex
