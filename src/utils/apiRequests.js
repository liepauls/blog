const BASE_URL = 'http://localhost:3000/api'

const handleRequest = async (url, data = {}) => {
  if (data.method) {
    const secret = document.querySelector('#secret').value

    if (!data.body) {
      data.body    = JSON.stringify({ secret })
      data.headers = { 'Content-Type': 'application/json' }
    } else {
      data.body.append('secret', secret)
    }
  }

  const response = await fetch(`${BASE_URL}${url}`, data)
  const json     = await response.json()

  if (response.ok) {
    return json
  } else {
    throw json
  }
}

export const getPosts = async () => handleRequest('/posts')

export const getPost = async (slug) => handleRequest(`/posts/${slug}`)

export const createPost = async (data) => handleRequest('/posts', { method: 'POST', body: data })

export const updatePost = async ({ id, data }) => handleRequest(`/posts/${id}`, { method: 'PUT', body: data })

export const publishPost = async (id) => handleRequest(`/posts/${id}/publish`, { method: 'PUT' })

export const unpublishPost = async (id) => handleRequest(`/posts/${id}/unpublish`, { method: 'PUT' })

export const deletePost = async (id) => handleRequest(`/posts/${id}`, { method: 'DELETE' })
