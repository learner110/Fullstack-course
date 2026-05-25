import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import { Container, AppBar, Toolbar, Button } from '@mui/material'
import ErrorBoundary from './components/ErrorBoundary'
import BlogList from './components/BlogList'
import BlogView from './components/BlogView'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import { useNotificationStore } from './stores/notificationStore'
import { useBlogStore } from './stores/blogStore'
import { useUserStore } from './stores/userStore'
import { useEffect } from 'react'

const App = () => {
  const notification = useNotificationStore((state) => state.notification)
  const initializeBlogs = useBlogStore((state) => state.initializeBlogs)
  const user = useUserStore((state) => state.user)
  const setUser = useUserStore((state) => state.setUser)
  const logout = useUserStore((state) => state.logout)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      initializeBlogs(user.token)
    }
  }, [setUser, initializeBlogs])

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
              <Button color="inherit" onClick={logout} sx={navStyle}>logout</Button>
            )}
          </Toolbar>
        </AppBar>

        <Notification notification={notification} />

        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<BlogList />} />
            <Route path="/login" element={!user ? <LoginForm /> : <Navigate replace to="/" />} />
            <Route path="/create" element={user ? <BlogForm /> : <Navigate replace to="/login" />} />
            <Route path="/blogs/:id" element={<BlogView />} />
            <Route path="*" element={<div style={{ marginTop: 20 }}>404 – Page not found</div>} />
          </Routes>
        </ErrorBoundary>
      </Container>
    </Router>
  )
}

export default App