import { useAnecdotes } from './hooks/useAnecdotes'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Notification from './components/Notification'

const App = () => {
  const { isLoading, isError, error } = useAnecdotes()

  if (isLoading) return <div>Loading anecdotes...</div>
  if (isError) {
    return <div>Anecdote service not available due to problems in server<br />{error.message}</div>
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App