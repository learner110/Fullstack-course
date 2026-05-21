import { useAnecdotes } from '../hooks/useAnecdotes'
import { useNotify } from '../contexts/NotificationContext'
import Anecdote from './Anecdote'

const AnecdoteList = () => {
  const { anecdotes, voteAnecdote } = useAnecdotes()
  const { showNotification } = useNotify()

  const handleVote = async (anecdote) => {
    const updated = { ...anecdote, votes: anecdote.votes + 1 }
    await voteAnecdote(updated)
    showNotification(`You voted '${anecdote.content}'`)
  }

  if (!anecdotes) return null

  return (
    <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
      {anecdotes.map(anecdote => (
        <Anecdote key={anecdote.id} anecdote={anecdote} handleVote={handleVote} />
      ))}
    </ul>
  )
}

export default AnecdoteList