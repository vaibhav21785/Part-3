import { useState, useEffect } from 'react'
import personService from './services/persons'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState(null)

  // FETCH DATA
  useEffect(() => {

    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })

  }, [])

  // ADD PERSON
  const addPerson = (event) => {

    event.preventDefault()

    const existingPerson = persons.find(
      person => person.name === newName
    )

    // UPDATE EXISTING PERSON
    if (existingPerson) {

      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook. Replace the old number with a new one?`
      )

      if (confirmUpdate) {

        const changedPerson = {
          ...existingPerson,
          number: newNumber
        }

        personService
          .update(existingPerson.id, changedPerson)
          .then(returnedPerson => {

            setPersons(
              persons.map(person =>
                person.id !== existingPerson.id
                  ? person
                  : returnedPerson
              )
            )

            setMessage(`Updated ${newName}`)

            setTimeout(() => {
              setMessage(null)
            }, 5000)

            setNewName('')
            setNewNumber('')
          })
          .catch(error => {

            setMessage(error.response.data.error)

            setTimeout(() => {
              setMessage(null)
            }, 5000)

          })
      }

      return
    }

    // CREATE NEW PERSON
    const personObject = {
      name: newName,
      number: newNumber
    }

    personService
      .create(personObject)
      .then(response => {

        setPersons(persons.concat(response.data))

        setMessage(`Added ${newName}`)

        setTimeout(() => {
          setMessage(null)
        }, 5000)

        setNewName('')
        setNewNumber('')

      })
      .catch(error => {

        setMessage(error.response.data.error)

        setTimeout(() => {
          setMessage(null)
        }, 5000)

      })

  }

  // DELETE PERSON
  const deletePerson = (id, name) => {

    const confirmDelete = window.confirm(
      `Delete ${name}?`
    )

    if (confirmDelete) {

      personService
        .remove(id)
        .then(() => {

          setPersons(
            persons.filter(person => person.id !== id)
          )

        })
    }
  }

  // INPUT HANDLERS
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  // FILTER PERSONS
  const personsToShow = Array.isArray(persons)

    ? persons.filter(person =>

        person.name &&
        person.name
          .toLowerCase()
          .includes(search.toLowerCase())

      )

    : []

  return (
    <div>

      <h2>Phonebook</h2>

      <Notification message={message} />

      <Filter
        search={search}
        handleSearchChange={handleSearchChange}
      />

      <h3>Add a New</h3>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>

      <Persons
        persons={personsToShow}
        deletePerson={deletePerson}
      />

    </div>
  )
}

export default App