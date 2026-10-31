// src/components/Persons.jsx
import Person from './Person'

const Persons = ({ personsToShow, toggleDeleteOf }) => {
  return (
    <ul>
      {personsToShow.map(person => (
        <Person
          key={person.id}
          name={person.name}
          number={person.number}
          toggleDelete={() => toggleDeleteOf(person.id, person.name)}
        />
      ))}
    </ul>
  )
}

export default Persons