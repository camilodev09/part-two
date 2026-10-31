// src/components/Person.jsx
const Person = ({ name, number, toggleDelete }) => {
  return (
    <li>
      {name} {number} <button onClick={toggleDelete}>delete</button>
    </li>
  )
}

export default Person