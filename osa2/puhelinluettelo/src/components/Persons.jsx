const Person = ({ person, deletePerson }) => {
  return (
    <p>
      {person.name} {person.number}
      <button onClick={deletePerson}>delete</button>
    </p>
  )
}

const Persons = ({ persons, handleDelete }) => {
  return (
    <div>
      {persons.map(person => (
        <Person
          key={person.id}
          person={person}
          deletePerson={() => handleDelete(person.id)}
        />
      ))}
    </div>
  )
}

export default Persons