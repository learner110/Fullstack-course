import { useState, useEffect } from 'react'
import axios from 'axios'
import CountryList from './components/CountryList'
import Country from './components/Country'
import Weather from './components/Weather'

const App = () => {

  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {

    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])


  const handleChange = (event) => {
    setFilter(event.target.value)
    setSelected(null)
  }


  const handleShow = (country) => {
    setSelected(country)
  }

  const filtered = countries.filter(country =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    
    <div>
      find countries{' '}
      <input value={filter} onChange={handleChange} />

      {selected && (
        <div>
          <Country country={selected} />
          <Weather capital={selected.capital[0]} />
        </div>
      )}

      {!selected && filtered.length > 10 && (
        <div>Too many matches, specify another filter</div>
      )}

      {!selected && filtered.length <= 10 && filtered.length > 1 && (
        <CountryList countries={filtered} handleShow={handleShow} />
      )}

      {!selected && filtered.length === 1 && (
        <div>
          <Country country={filtered[0]} />
          <Weather capital={filtered[0].capital[0]} />
        </div>
      )}

    </div>

  )

}



export default App