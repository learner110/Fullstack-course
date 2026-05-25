import { useState } from 'react'
import { TextField, Button, Paper, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../stores/userStore'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const login = useUserStore((state) => state.login)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const success = await login(username, password)
    if (success) navigate('/')
  }

  return (
    <Paper sx={{ p: 3, mt: 3, maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h5" component="h2" gutterBottom>Log in to application</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="username"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="password"
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          margin="normal"
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>login</Button>
      </form>
    </Paper>
  )
}

export default LoginForm