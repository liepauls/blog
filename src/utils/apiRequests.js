const BASE_URL = 'http://localhost:3000/api'

export const getPosts = async () => {
  const response = await fetch(`${BASE_URL}/posts`)
  const posts    = await response.json()

  return posts
}

export const getPost = async (slug) => {
  const response = await fetch(`${BASE_URL}/posts/${slug}`)
  const post     = await response.json()

  return post
}

export const createPost = async (data) => {
  const response = await fetch(`${BASE_URL}/posts`, { method: 'POST', body: data })

  if (response.ok) {
    return true
  } else {
    return response.json()
  }
}

export const updatePost = async ({ id, data }) => {
  const response = await fetch(`${BASE_URL}/posts/${id}`, { method: 'PUT', body: data })

  if (response.ok) {
    return true
  } else {
    return response.json()
  }
}
