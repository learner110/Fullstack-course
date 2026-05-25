const baseUrl = 'http://localhost:3001/anecdotes'

export const getAll = () => fetch(baseUrl).then((res) => res.json())

export const createNew = (anecdote) =>
  fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(anecdote),
  }).then((res) => res.json())

export const deleteAnecdote = (id) =>
  fetch(`${baseUrl}/${id}`, { method: 'DELETE' }).then((res) => res.json())