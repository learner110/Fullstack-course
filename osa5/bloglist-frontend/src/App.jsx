import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import { Container, AppBar, Toolbar, Button, Alert } from '@mui/material'

import BlogList from './components/BlogList'
import BlogView from './components/BlogView'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
      blogService.getAll().then(blogs => {
        blogs.sort((a, b) => b.likes - a.likes)
        setBlogs(blogs)
      })
    }
  }, [])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      const blogs = await blogService.getAll()
      blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(blogs)
      showNotification('Login successful')
      return true
    } catch {
      showNotification('wrong username or password', 'error')
      return false
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
    showNotification('Logged out')
  }

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(prevBlogs => {
        const newBlogs = [...prevBlogs, returnedBlog]
        newBlogs.sort((a, b) => b.likes - a.likes)
        return newBlogs
      })
      showNotification(`a new blog "${returnedBlog.title}" by ${returnedBlog.author} added`)
      return true
    } catch {
      showNotification('failed to create blog', 'error')
      return false
    }
  }

  const updateBlog = async (updatedBlog) => {
    try {
      const result = await blogService.update(updatedBlog.id, updatedBlog)
      setBlogs(prevBlogs => {
        const newBlogs = prevBlogs.map(blog => blog.id === updatedBlog.id ? result : blog)
        newBlogs.sort((a, b) => b.likes - a.likes)
        return newBlogs
      })
    } catch {
      showNotification('failed to update blog', 'error')
    }
  }

  const removeBlog = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.remove(blog.id)
        setBlogs(prevBlogs => prevBlogs.filter(b => b.id !== blog.id))
        showNotification(`blog "${blog.title}" removed`)
      } catch {
        showNotification('failed to delete blog', 'error')
      }
    }
  }

  const navStyle = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  return (
    <Router>
      <Container>
        <AppBar position="static">
          <Toolbar>
            <Button color="inherit" component={Link} to="/" sx={navStyle}>blogs</Button>
            {user && (
              <Button color="inherit" component={Link} to="/create" sx={navStyle}>create new</Button>
            )}
            {!user && (
              <Button color="inherit" component={Link} to="/login" sx={navStyle}>login</Button>
            )}
            {user && (
              <Button color="inherit" onClick={handleLogout} sx={navStyle}>logout</Button>
            )}
          </Toolbar>
        </AppBar>

        <Notification notification={notification} />

        <Routes>
          <Route path="/" element={
            <BlogList blogs={blogs} user={user} />
          } />
          <Route path="/login" element={
            !user ? <LoginForm onLogin={handleLogin} /> : <Navigate replace to="/" />
          } />
          <Route path="/create" element={
            user ? <BlogForm createBlog={addBlog} /> : <Navigate replace to="/login" />
          } />
          <Route path="/blogs/:id" element={
            <BlogView
              blogs={blogs}
              user={user}
              updateBlog={updateBlog}
              removeBlog={removeBlog}
            />
          } />
        </Routes>
      </Container>
    </Router>
  )
}

export default App