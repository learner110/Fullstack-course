import { useState } from 'react'
import { TextField, Button, Paper, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useBlogStore } from '../stores/blogStore'

const BlogForm = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const navigate = useNavigate()
  const addBlog = useBlogStore((state) => state.addBlog)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const success = await addBlog({ title, author, url })
    if (success) {
      setTitle(''); setAuthor(''); setUrl('')
      navigate('/')
    }
  }

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>create new</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="author"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="url"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>create</Button>
      </form>
    </Paper>
  )
}

export default BlogForm