import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('success')

  useEffect(() => {

    personService.getAll().then(data => {
      setPersons(data)
    })

  }, [])

  const showMessage = (text, type) => {

    setMessage(text)
    setMessageType(type)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }



  const addPerson = (event) => {
    event.preventDefault()

    const existing = persons.find(p => p.name === newName)


    if (existing) {
      
      if (window.confirm(`${newName} is already added, replace number?`)) {
        const changedPerson = { ...existing, number: newNumber }

        
        personService
          .update(existing.id, changedPerson)
          .then(returned => {
            setPersons(persons.map(p => p.id !== existing.id ? p : returned))
            setNewName('')
            setNewNumber('')
            showMessage(`Updated ${returned.name}`, 'success')
          })

          .catch(() => {
            showMessage(
              `Information of ${existing.name} has already been removed from server`,
              'error'
            )
            setPersons(persons.filter(p => p.id !== existing.id))
          })
      }


      return
    }


    const newPerson = { name: newName,number: newNumber}

    personService

      .create(newPerson)
      .then(returned => {
        setPersons(persons.concat(returned))
        setNewName('')
        setNewNumber('')
        showMessage(`Added ${returned.name}`, 'success')
      })
  }

  const handleDelete = (id) => {
    const person = persons.find(p => p.id === id)


    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          showMessage(`Deleted ${person.name}`, 'error')
        })
        .catch(() => {
          showMessage(
            `Information of ${person.name} has already been removed from server`,
            'error'
          )
          setPersons(persons.filter(p => p.id !== id))
        })
    }


  }

  const personsToShow = persons.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>

      <h2>Phonebook</h2>

      <Notification message={message} type={messageType} />

      <Filter
        filter={filter}
        handleFilterChange={(e) => setFilter(e.target.value)}
      />

      <h3>Add a new</h3>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={(e) => setNewName(e.target.value)}
        newNumber={newNumber}
        handleNumberChange={(e) => setNewNumber(e.target.value)}
      />

      <h3>Numbers</h3>
      <Persons persons={personsToShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App