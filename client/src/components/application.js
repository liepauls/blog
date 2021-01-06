import React, { useState } from 'react'
import { Switch, Route } from 'react-router-dom'

import PostsIndex from '../views/postsIndex'
import PostNew from '../views/postNew'
import PostEdit from '../views/postEdit'
import Post from '../views/post'

const Context = React.createContext({
  post: null,
  setPost: () => {}
})

const Application = () => {
  const [post, setPost] = useState(null)

  return (
    <Context.Provider value={{ post, setPost }}>
      <Switch>
        <Route path='/posts/new'>
          <PostNew />
        </Route>

        <Route path='/posts/:slug/edit'>
          <PostEdit />
        </Route>

        <Route path='/posts/:slug'>
          <Post />
        </Route>

        <Route path='/posts'>
          <PostsIndex />
        </Route>

        <Route path='/'>
          <PostsIndex />
        </Route>
      </Switch>
    </Context.Provider>
  )
}

export default Application
export { Context }
