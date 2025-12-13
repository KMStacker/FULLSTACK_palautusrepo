import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { useState } from "react"
import { likeBlog, deleteBlog, addComment } from "../reducers/blogReducer"
import useNotify from "../hooks/useNotify"

const SingleBlog = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const notify = useNotify()
  const [comment, setComment] = useState('')
  const blog = useSelector(state => state.blogs.find(b => b.id === id))
  const user = useSelector(state => state.user)

  if (!blog) {
    return null
  }

  const handleVote = () => {
    dispatch(likeBlog(blog))
    notify(`You liked ${blog.title} by ${blog.author}`)
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      dispatch(deleteBlog(blog.id))
      notify(`Blog ${blog.title}, by ${blog.author} removed`)
      navigate('/')
    }
  }

  const handleCommentSubmit = (event) => {
    event.preventDefault()
    dispatch(addComment(blog.id, comment))
    setComment('')
    notify(`Comment added to ${blog.title}`)
  }

  const canRemove = user && blog.user && blog.user.username === user.username

  return (
    <div>
      <h2>{blog.title} by {blog.author}</h2>
      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>
    <div>
    <div>
      {blog.likes} likes <button className='btn primary' onClick={handleVote}>like</button>
    </div>
    <div>
      added by {blog.user.name}
    </div>
    {canRemove && (
      <button className='danger'  onClick={handleDelete}>remove</button>
    )}
    <h3>Comments</h3>
    <form onSubmit={handleCommentSubmit}>
      <input
        value={comment}
        onChange={({ target }) => setComment(target.value)}
      />
      <button type="submit">add comment</button>
    </form>
    <ul>
      {(blog.comments || []).map((c, i) => (
        <li key={i}>{c}</li>
      ))}
    </ul>
    </div>
    </div>
  )
}

export default SingleBlog