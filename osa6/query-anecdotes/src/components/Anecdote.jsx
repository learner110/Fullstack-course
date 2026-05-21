const Anecdote = ({ anecdote, handleVote }) => {
  return (
    <li style={{ marginBottom: '0.5rem' }}>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes} vote(s)
        <button onClick={() => handleVote(anecdote)} style={{ marginLeft: '0.5rem' }}>
          vote
        </button>
      </div>
    </li>
  )
}

export default Anecdote