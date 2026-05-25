import { useState, useEffect, createContext, useContext, createElement } from 'react'
import { getAll, createNew, deleteAnecdote } from '../services/anecdotes'

const AnecdoteContext = createContext()

export const AnecdoteProvider = ({ children }) => {
  const [anecdotes, setAnecdotes] = useState([])

  useEffect(() => {
    getAll().then(setAnecdotes)
  }, [])

  const addAnecdote = async (newAnecdote) => {
    const created = await createNew(newAnecdote)
    setAnecdotes(prev => [...prev, created])
  }

  const deleteAnecdoteById = async (id) => {
    await deleteAnecdote(id)
    setAnecdotes(prev => prev.filter(a => a.id !== id))
  }

  return createElement(
    AnecdoteContext.Provider,
    { value: { anecdotes, addAnecdote, deleteAnecdote: deleteAnecdoteById } },
    children
  )
}

export const useAnecdotes = () => {
  const context = useContext(AnecdoteContext)
  if (!context) throw new Error('useAnecdotes must be used inside AnecdoteProvider')
  return context
}

export const useField = (type) => {
  const [value, setValue] = useState('')
  const onChange = (e) => setValue(e.target.value)
  const reset = () => setValue('')
  return {
    inputProps: { type, value, onChange },
    reset,
  }
}