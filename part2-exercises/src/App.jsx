import { useState, useEffect } from 'react'
import Notification from './components/Notification' 
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import axios from 'axios'

const App = () => {
  // 1. Initialize persons as an empty array; data will be hydrated from the server (Exercise 2.12)
  const [persons, setPersons] = useState([])
  // notification 
  const [notification, setNotification] = useState(null)


  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterText, setFilterText] = useState('')

  // Event Handlers
  const handleNameChange = (e) => setNewName(e.target.value)
  const handleNumberChange = (e) => setNewNumber(e.target.value)
  const handleFilterChange = (e) => setFilterText(e.target.value)

  // Fetch initial data from json-server
  useEffect(() => {
    console.log('effect executed')
    axios
      .get('http://localhost:3002/persons')
      .then(response => {
        console.log('promise fulfilled', response.data)
        setPersons(response.data) // 👈 CRITICAL: Hydrate persons state, not notes
      })
      .catch(error => {
        console.error('Error fetching persons:', error)
      })
  }, [])

  const toggleDeleteOf = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)) {
      axios
        .delete(`http://localhost:3002/persons/${id}`)
        .then(response => {
          // Reconcile state by filtering out the deleted resource
          setPersons(persons.filter(p => p.id !== id))
        })
        .catch(error => {
          alert(`The person '${name}' was already deleted from server`)
          setPersons(persons.filter(p => p.id !== id))

        setNotification({ 
          message: `Information of '${name}' has already been removed from server`, 
          type: 'error' 
        })
         setTimeout(() => { setNotification(null) }, 5000)

        })
    }
  }

 const addPerson = (event) => {
  event.preventDefault()
  if (newName.trim() === '' || newNumber.trim() === '') return

  // Buscamos si el contacto ya existe en el estado
  const existingPerson = persons.find(
    p => p.name.toLowerCase() === newName.trim().toLowerCase()
  )

  if (existingPerson) {
    const confirmMessage = `${existingPerson.name} is already added to phonebook, replace the old number with a new one?`
    
    if (window.confirm(confirmMessage)) {
      const changedPerson = { ...existingPerson, number: newNumber.trim() }

      axios
        .put(`http://localhost:3002/persons/${existingPerson.id}`, changedPerson)
        .then(response => {
          // Reconciliación de estado: reemplazamos el objeto antiguo por la respuesta del servidor
          setPersons(persons.map(p => p.id !== existingPerson.id ? p : response.data))
          setNewName('')
          setNewNumber('')
        })
       .catch(error => {
         setNotification({
           message: `Information of '${existingPerson.name}' has already been removed from server`,
           type: 'error'
         })
         setTimeout(() => {
           setNotification(null)
         }, 5000)
        
         setPersons(persons.filter(p => p.id !== existingPerson.id))
        })
    }
    return
  }

  // Si no existe, procedemos con la creación normal (POST)
  const personObject = {
    name: newName.trim(),
    number: newNumber.trim()
  }

  axios
    .post('http://localhost:3002/persons', personObject)
    .then(response => {
      setPersons(persons.concat(response.data))
      
      //  Here we active the notification
    setNotification({ message: `Added ${response.data.name}`, type: 'success' })
    setTimeout(() => {
      setNotification(null)
    }, 5000)


      setNewName('')
      setNewNumber('')
    })
}

  // Derived State (Real-time filtering)
  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filterText.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>


      <Notification notification={notification} />

      <Filter 
        filterText={filterText} 
        handleFilterChange={handleFilterChange} 
      />

      <h3>Add a new</h3>

      <PersonForm 
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>

      <Persons personsToShow={personsToShow} toggleDeleteOf={toggleDeleteOf} />
    </div>
  )
}

export default App