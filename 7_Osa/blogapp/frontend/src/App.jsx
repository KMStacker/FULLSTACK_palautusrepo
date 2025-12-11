import { useState, useEffect, createRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setNotification, clearNotification } from './reducers/notificationReducer'
import { initializeBlogs, createBlog, likeBlog, deleteBlog } from './reducers/blogReducer'
import { loginUser, logoutUser, checkLoggedUser } from './reducers/userReducer'

import blogService from './services/blogs'
import loginService from './services/login'
import storage from './services/storage'
import Login from './components/Login'
import Blog from './components/Blog'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    dispatch(checkLoggedUser())
  }, [dispatch])

  const blogFormRef = createRef()

  const notify = (message, type = 'success') => {
    dispatch(setNotification({ message, type }))
    setTimeout(() => {
      dispatch(clearNotification())
    }, 5000)
  }

  const handleLogin = async (credentials) => {
    try {
      await dispatch(loginUser(credentials))
      notify(`Welcome back, ${credentials.username}!`)
    } catch (error) {
      notify('Wrong credentials', 'error')
    }
  }

  const handleCreate = (blog) => {
    dispatch(createBlog(blog))
    notify(`Blog created: ${blog.title}, ${blog.author}`)
    blogFormRef.current.toggleVisibility()
  }

  const handleVote = async (blog) => {
    console.log('updating', blog)
    dispatch(likeBlog(blog))

    notify(`You liked ${blog.title} by ${blog.author}`)
  }

  const handleLogout = () => {
    dispatch(logoutUser())
    notify(`Bye, ${user.name}!`)
  }

  const handleDelete = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      dispatch(deleteBlog(blog.id))
      notify(`Blog ${blog.title}, by ${blog.author} removed`)
    }
  }

  if (!user) {
    return (
      <div>
        <h2>blogs</h2>
        <Notification />
        <Login doLogin={handleLogin} />
      </div>
    )
  }

  const byLikes = (a, b) => b.likes - a.likes

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <div>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </div>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <NewBlog doCreate={handleCreate} />
      </Togglable>
      {[...blogs].sort(byLikes).map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          handleVote={handleVote}
          handleDelete={handleDelete}
        />
      ))}
    </div>
  )
}

export default App
