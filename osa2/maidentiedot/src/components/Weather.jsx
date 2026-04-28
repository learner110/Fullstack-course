import { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({ capital }) => {

  const [weather, setWeather] = useState(null)

  const apiKey = import.meta.env.VITE_API_KEY

  
  useEffect(() => {
    if (capital) {
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`)
        .then(response => {
          setWeather(response.data)
        })
    }
  }, [capital])

  if (!weather) {
    return null
  }
  return (
    <div>
      <h3>Weather in {capital}</h3>
      <div>temperature {weather.main.temp} Celsius</div>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
      />
      <div>wind {weather.wind.speed} m/s</div>
    </div>
  )
}


export default Weather