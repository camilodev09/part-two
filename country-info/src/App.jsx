import { useState, useEffect } from 'react'
import axios from 'axios'
import CountryDetails from './components/CountryDetails'

const App = () => {
  const [countries, setCountries] = useState([])
  const [query, setQuery] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
      .catch(error => {
        console.error('Error fetching countries:', error)
      })
  }, [])

  const handleQueryChange = (e) => {
    setQuery(e.target.value)
    setSelectedCountry(null) // Reseteamos la selección manual al cambiar el filtro
  }

 
  const filteredCountries = query.trim() === ''
    ? []
    : countries.filter(country =>
        country.name.common.toLowerCase().includes(query.toLowerCase())
      )

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <div>
        find countries <input value={query} onChange={handleQueryChange} />
      </div>

      <div style={{ marginTop: '20px' }}>

        {selectedCountry ? (
          <CountryDetails country={selectedCountry} />
        ) : (
          
          <>
            {filteredCountries.length > 10 && (
              <p>Too many matches, specify another filter</p>
            )}

            {filteredCountries.length <= 10 && filteredCountries.length > 1 && (
              <div>
                {filteredCountries.map(country => (
                  <div key={country.cca3 || country.name.common} style={{ margin: '5px 0' }}>
                    {country.name.common}{' '}
                    <button onClick={() => setSelectedCountry(country)}>
                      show
                    </button>
                  </div>
                ))}
              </div>
            )}

            {filteredCountries.length === 1 && (
              <CountryDetails country={filteredCountries[0]} />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default App