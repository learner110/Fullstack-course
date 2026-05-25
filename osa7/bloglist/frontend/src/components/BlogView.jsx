import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, Typography, Button, Box } from '@mui/material'
import { useBlogStore } from '../stores/blogStore'
import { useUserStore } from '../stores/userStore'

const BlogView = () => {
  const id = useParams().id
  const navigate = useNavigate()
  const blogs = useBlogStore((state) => state.blogs)
  const updateBlog = useBlogStore((state) => state.updateBlog)
  const removeBlog = useBlogStore((state) => state.removeBlog)
  const user = useUserStore((state) => state.user)

  const blog = blogs.find(b => b.id === id)
  if (!blog) return <div>Blog not found</div>

  const handleLike = () => {
    const updatedBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id || blog.user }
    updateBlog(updatedBlog)
  }

  const handleRemove = () => {
    removeBlog(blog)
    navigate('/')
  }

  const isCreator = user && blog.user && user.username === (blog.user.username || blog.user)

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h4">{blog.title}</Typography>
        <Typography variant="subtitle1">by {blog.author}</Typography>
        <Typography><a href={blog.url} target="_blank" rel="noreferrer">{blog.url}</a></Typography>
        <Typography>likes {blog.likes}</Typography>
        {user && <Button variant="outlined" onClick={handleLike} sx={{ mt: 1, mr: 1 }}>like</Button>}
        {isCreator && <Button variant="contained" color="error" onClick={handleRemove}>delete</Button>}
        <Typography sx={{ mt: 2 }}>Added by {blog.user?.name || blog.user?.username || 'unknown'}</Typography>
      </CardContent>
    </Card>
  )
}

export default BlogView