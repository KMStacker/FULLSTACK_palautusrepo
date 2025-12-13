import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route, Link } from 'react-router-dom'
import { setNotification, clearNotification } from './reducers/notificationReducer'
import { initializeBlogs, createBlog, likeBlog, deleteBlog } from './reducers/blogReducer'
import { loginUser, logoutUser, checkLoggedUser } from './reducers/userReducer'

import useNotify from './hooks/useNotify'
import Login from './components/Login'
import Blog from './components/Blog'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import Users from './components/Users'
import BlogList from './components/BlogList'
import User from './components/User'
import SingleBlog from './components/SingleBlog'

const App = () => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const notify = useNotify()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    dispatch(checkLoggedUser())
  }, [dispatch])

  const handleLogin = async (credentials) => {
    try {
      await dispatch(loginUser(credentials))
      notify(`Welcome back, ${credentials.username}!`)
    } catch (error) {
      notify('Wrong credentials', 'error')
    }
  }

  const handleCreate = async (blog) => {
    dispatch(createBlog(blog))
    notify(`Blog created: ${blog.title}, ${blog.author}`)
  }

  const handleLogout = () => {
    dispatch(logoutUser())
    notify(`Bye, ${user.name}!`)
  }

  if (!user) {
    return (
      <div className='container'>
        <h2>blogs</h2>
        <Notification />
        <Login doLogin={handleLogin} />
      </div>
    )
  }
  
  const navBarStyle = {
    display: 'flex',
    gap: 5,
    backgroundColor: '#e0e0e0ff',
    marginTop: 5,
    padding: 5,
  }

  return (
    <div className='container'>
      <div className='nav'>
        <Link to="/">blogs</Link> | <Link to="/users">users</Link>
        <span style={{ marginLeft: 'auto' }}>
          {user.name} logged in &nbsp;
          <button className='btn logout' onClick={handleLogout}>logout</button>
        </span>
      </div>
      <Notification />
      <Routes>
        <Route path="/users/:id" element={<User />} />
        <Route path="/users" element={<Users />} />
        <Route path="/" element={
          <BlogList
            handleCreate={handleCreate}
          />
        } />
        <Route path="/blogs/:id" element={<SingleBlog />} />
      </Routes>
    </div>
  )
}

export default App
