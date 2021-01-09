import React, { useState } from 'react'
import { Switch, Route } from 'react-router-dom'

import PostsIndex from '../views/postsIndex'
import PostNew from '../views/postNew'
import PostEdit from '../views/postEdit'
import Post from '../views/post'
import NotFound from '../views/notFound'

const Context = React.createContext({
  post: null,
  setPost: () => {}
})

const Application = () => {
  const [post, setPost] = useState(null)

  return (
    <Context.Provider value={{ post, setPost }}>
      <Switch>
        <Route exact path='/posts/new'>
          <PostNew />
        </Route>

        <Route exact path='/posts/:slug/edit'>
          <PostEdit />
        </Route>

        <Route exact path='/posts/:slug'>
          <Post />
        </Route>

        <Route exact path='/posts'>
          <PostsIndex />
        </Route>

        <Route exact path='/'>
          <PostsIndex />
        </Route>

        <Route>
          <NotFound />
        </Route>

      </Switch>
    </Context.Provider>
  )
}

export default Application
export { Context }
