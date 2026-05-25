import { useState } from 'react'

const Blog = ({ blog, user, updateBlog, removeBlog }) => {
  const [expanded, setExpanded] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLike = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id || blog.user
    }
    updateBlog(updatedBlog)
  }

  const handleRemove = () => {
    removeBlog(blog)
  }

  const isCreator = () => {
    if (!user || !blog.user) return false
    if (typeof blog.user === 'object') {
      return user.username === blog.user.username
    }
    return user.id === blog.user || user.id === blog.user.id
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setExpanded(!expanded)}>
          {expanded ? 'hide' : 'view'}
        </button>
      </div>
      {expanded && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}
            <button onClick={handleLike}>like</button>
          </div>
          <div>{blog.user?.name || blog.user?.username || 'unknown'}</div>
          {isCreator() && (
            <button onClick={handleRemove}>delete</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog