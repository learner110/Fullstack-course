import { useQuery } from '@apollo/client/react'
import { ALL_AUTHORS } from '../queries'
import SetBirthYear from './SetBirthYear'

const Authors = ({ token }) => {
  const result = useQuery(ALL_AUTHORS)

  if (result.loading) return <div>loading authors...</div>
  if (result.error) return <div>Error: {result.error.message}</div>

  const authors = result.data.allAuthors

  return (
    <div>
      <h2>authors</h2> 
      <table>
        <tbody>
          <tr>
            <th>name</th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map(a => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born ?? '—'}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {token && <SetBirthYear authors={authors} />}
    </div>
  )
}

export default Authors