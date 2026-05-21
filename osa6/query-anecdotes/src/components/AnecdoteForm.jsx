import { useAnecdotes } from '../hooks/useAnecdotes'
import { useNotify } from '../contexts/NotificationContext'

const AnecdoteForm = () => {
  const { addAnecdote } = useAnecdotes()
  const { showNotification } = useNotify()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value.trim()
    if (content === '') {
      showNotification('Anecdote cannot be empty')
      return
    }
    try {
      await addAnecdote({ content, votes: 0 })
      showNotification(`Added: "${content}"`)
      e.target.reset()
    } catch (error) {
      showNotification(error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="anecdote" />
      <button type="submit">create new</button>
    </form>
  )
}

export default AnecdoteForm