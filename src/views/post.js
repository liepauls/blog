import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'

import { getPost } from '../utils/apiRequests'
import { Context } from '../components/application'

const Post = () => {
  const { slug } = useParams()
  let   { post } = useContext(Context)

  const { isLoading, error, data } = useQuery('post', () => getPost(slug))

  post = data || post || {}

  return (
    <div>
      <h2>{post.title}</h2>
      <img src="uploads/8461443e187b83aa56bfd6bed2432d12" alt="" />
    </div>
  )
}

export default Post
