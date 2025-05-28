// src/components/Blog.jsx
import { useState } from 'react'

const Blog = ({ blog, handleLike }) => {
  const [infoVisible, setInfoVisible] = useState(false)

  const toggleInfoVisibility = () => {
    setInfoVisible(!infoVisible)
  }

  const buttonLabel = infoVisible ? 'hide' : 'view'

  return (
    <div className="blog-style">
      <div>
        {blog.title} {blog.author} &nbsp;
        <button onClick={toggleInfoVisibility}>{buttonLabel}</button>
      </div>
      {infoVisible && (
        <div className="p-row-spaces">
          <p>
            {blog.url}
          </p>
          <p>
            {blog.likes} likes
            <button onClick={handleLike}>like</button>
          </p>
          <p>
            {blog.user.name}
          </p>
        </div>
      )}
    </div>

  )
}

export default Blog