import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { LOGIN } from '../queries'

const LoginForm = ({ setToken, setError, onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [login] = useMutation(LOGIN, {
    onCompleted: (data) => {
      const token = data.login.value
      setToken(token)
      localStorage.setItem('library-user-token', token)
      if (onLogin) onLogin()
    },
    onError: (error) => {
      const msg = error.message.includes('wrong credentials') ? 'login failed' : error.message
      setError(msg)
    },
  })

  const submit = (event) => {
    event.preventDefault()
    login({ variables: { username, password } })
  }

  return (
    <form onSubmit={submit}>
      <div>
        <label htmlFor="username">username</label>
        <input id="username" value={username} onChange={({ target }) => setUsername(target.value)} />
      </div>
      <div>
        <label htmlFor="password">password</label>
        <input id="password" type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
      </div>
      <button type="submit">login</button>
    </form>
  )
}

export default LoginForm