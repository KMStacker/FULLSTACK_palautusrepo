// src/components/BlogForm.jsx
import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()
    await createBlog({ 
      title: title,
      author: author,
      url: url 
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }
  
  return (
    <div className="small-space-after">
      <h2 className="create-a-new-blog">create a new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          title: &nbsp;
          <input
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author: &nbsp;
          <input
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div className="small-space-after">
          url: &nbsp;
          <input
            type="text"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm