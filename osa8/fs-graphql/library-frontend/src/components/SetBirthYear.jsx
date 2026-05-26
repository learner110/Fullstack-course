import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries'

const SetBirthYear = ({ authors }) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      alert('Failed to set birth year: ' + error.message)
    },
  })

  const submit = (event) => {
    event.preventDefault()
    const setBornTo = parseInt(born, 10)
    if (isNaN(setBornTo)) return
    editAuthor({ variables: { name, setBornTo } })
    setName('')
    setBorn('')
  }

  return (
    <div>
      <h3>Set birthyear</h3> 
      <form onSubmit={submit}>
        <div>
          <label htmlFor="name">name</label>
          <select
            id="name"
            name="name"
            value={name}
            onChange={({ target }) => setName(target.value)}
          >
            <option value="">Select author</option>
            {authors.map(a => (
              <option key={a.id} value={a.name}>{a.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="born">born</label>
          <input id="born" type="number" value={born} onChange={({ target }) => setBorn(target.value)} />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default SetBirthYear