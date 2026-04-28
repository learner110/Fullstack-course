const CountryList = ({ countries, handleShow }) => {
  return (
    <div>
      {countries.map(country => (
        <div key={country.cca3}>
          {country.name.common}
          <button onClick={() => handleShow(country)}>
            show
          </button>
        </div>
      ))}
    </div>
  )
}

export default CountryList