import { useSelector } from "react-redux"
import { useRef } from "react"
import Blog from "./Blog"
import Togglable from "./Togglable"
import NewBlog from "./NewBlog"

const BlogList = ({ handleCreate, handleVote, handleDelete }) => {
  const blogs = useSelector(state => state.blogs)
  const blogFormRef = useRef()
  const byLikes = (l1, l2) => l2.likes - l1.likes
  const createBlogWithRef = async (blog) => {
    await handleCreate(blog)
    blogFormRef.current.toggleVisibility()
  }

  return (
    <div>
      <h2>blogs</h2>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <NewBlog doCreate={createBlogWithRef} />
      </Togglable>
      <div className="blog-list">
        {[...blogs].sort(byLikes).map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            handleVote={handleVote}
            handleDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  )
}

export default BlogList