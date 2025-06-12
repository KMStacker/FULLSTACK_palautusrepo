// src/App.jsx
import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotification({ message: `Login successful, welcome ${user.name}!`, type: 'notificationGood' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (exception) {
      setNotification({ message: 'Wrong credentials!', type: 'notificationBad' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
      console.log(exception)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    setNotification({ message: `Goodbye and be good, ${user.name}!`, type: 'notificationGood' })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleCreateBlog = async (blogObject) => {

    try {
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog))

      setNotification({ message: 'A new blog named as ' + newBlog.title + ' has been created!', type: 'notificationGood' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)

      blogFormRef.current.toggleVisibility()

    } catch (exception) {
      setNotification({ message: 'Error occured while trying to create blog', type: 'notificationBad' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
      console.log(exception)
    }
  }

  const handleLike = async (idOfBlog) => {
    const blogToUpdate = blogs.find(blog => blog.id === idOfBlog)
    if (!blogToUpdate) {
      console.error('Blog not found')
      setNotification({ message: 'Blog not found', type: 'notificationBad' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
      return
    }

    const likedBlog = {
      user: blogToUpdate.user.id,
      likes: blogToUpdate.likes + 1,
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url
    }

    try {
      let likedBlogUpdate = await blogService.update(idOfBlog, likedBlog)
      likedBlogUpdate = { ...likedBlogUpdate, user: blogToUpdate.user }

      setBlogs(blogs.map(blog =>
        blog.id !== idOfBlog ? blog : likedBlogUpdate))
      setNotification({
        message: 'You liked a blog named as ' + likedBlogUpdate.title + '!', type: 'notificationGood' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (exception) {
      setNotification({ message: 'Error occured while trying to like blog', type: 'notificationBad' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
      console.log(exception)
    }
  }

  const handleDeleteBlog = async (idOfBlog) => {
    const blogToDelette = blogs.find(blog => blog.id === idOfBlog)
    if (!blogToDelette) {
      console.error('Blog not found')
      setNotification({ message: 'Blog not found', type: 'notificationBad' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
      return
    }

    if (window.confirm(`Delete ${blogToDelette.title}?`)) {
      try {
        await blogService.remove(idOfBlog)
        setBlogs(blogs.filter(blog => blog.id !== idOfBlog))
        setNotification({
          message: 'You deleted a blog named as ' + blogToDelette.title + '!', type: 'notificationGood' })
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      } catch (exception) {
        setNotification({ message: 'Error occured while trying to delete blog', type: 'notificationBad' })
        setTimeout(() => {
          setNotification(null)
        }, 5000)
        console.log(exception)
      }
    }
  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Notification notification={notification} />
      {!user && loginForm()}
      {user && <div>
        <h2 className= "BIG-blogs">Blogs</h2>
        <p>{user.name} logged in &nbsp;
          <button onClick={handleLogout}>logout</button>
        </p>
        <Togglable buttonLabel="create a new blog" ref={blogFormRef}>
          <BlogForm createBlog={handleCreateBlog} />
        </Togglable>
        <br />
        <h4 className="list-of-all-blogs">list of all blogs</h4>
        {blogs
          .sort((a, b) => b.likes - a.likes)
          .map(blog =>
            <Blog
              key={blog.id}
              blog={blog}
              handleLike={() => handleLike(blog.id)}
              handleDeleteBlog={() => handleDeleteBlog(blog.id)}
              user={user}
            />
          )}
      </div>
      }
    </div>
  )
}

export default App
