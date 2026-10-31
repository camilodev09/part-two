import Weather from './Weather'

const CountryDetails = ({ country }) => {
  const languages = Object.values(country.languages || {})
  const capital = country.capital ? country.capital[0] : null

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital {capital || 'N/A'}</p>
      <p>Area {country.area}</p>

      <h3>Languages</h3>
      <ul>
        {languages.map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>

      <img 
        src={country.flags.svg || country.flags.png} 
        alt={`Flag of ${country.name.common}`} 
        width="150" 
        style={{ border: '1px solid #ccc', margin: '10px 0' }}
      />

      {capital && <Weather capital={capital} />}
    </div>
  )
}

export default CountryDetails