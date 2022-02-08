import axios from 'axios';
import React, {useEffect, useState} from 'react';

import CountrySheet from './components/CountrySheet';
import CountryList from './components/CountryList';
import TooManyCountries from './components/TooManyCountries';
import Search from './components/Search';
import Weather from './components/Weather';

const App = () => {

  const [countries, setCountries] = useState([])
  const [searchStr, setSearchStr] = useState('')
  const [weather, setWeather] = useState(null)
  const [selected, setSelected] = useState(null)

  const endpointUrl = "https://restcountries.com/v3.1/all"

  const api_key = process.env.REACT_APP_API_KEY

  useEffect(() => {

    //console.log("Ajetaan useEffect")
    axios
      .get(endpointUrl)
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  /*
   * 2.14*: maiden tiedot, step3
   * ----------------------------------------------------------
   * Chrome näyttää tähän hakuun liittyen herjaa:
   * "Indicate whether to send a cookie in a cross-site request by specifying its SameSite attribute"
   * 
   * Onko ongelma palvelimella vai asiakkaalla?
   * 
   * Why am I getting "Indicate whether to send a cookie in a cross-site request by specifying its SameSite attribute"?
   * https://stackoverflow.com/questions/63273838/why-am-i-getting-indicate-whether-to-send-a-cookie-in-a-cross-site-request-by-s?rq=1
   * 
   * - What I found is that this is not a client side issue, but on the server side, also if you are using an external api you have no control over this issue.
   */
  useEffect(() => {


    if(selected !== null) {

      const weatherUrl = `http://api.weatherstack.com/current?access_key=${api_key}&query=${selected}`

      axios
      .get(weatherUrl)
      .then(response => {
        setWeather(response.data)
      })    

    } else 
      setWeather(null)
    

  }, [selected, api_key])

  /* 
   * Suodatuksen syöttökentän tapahtumakäsittelijä
   */
  const searchHandler = (event) => {
        //event.preventDefault()
        const newSearchStr = event.target.value

        setSearchStr(newSearchStr)

        const x = countries.filter(country => country.name.common.toLowerCase().trim().includes(newSearchStr.toLocaleLowerCase().trim()))

        if(x.length === 1) 
          setSelected(x[0].name.common)
        else
          setSelected(null)
      
        
  }

  /*
   * 2.13*: maiden tiedot, step2
   * - kun sivulla näkyy useiden maiden nimiä, tulee maan nimen viereen nappi, jota klikkaamalla pääsee suoraan maan näkymää
   */
  const selectHandler = (id) => {

    let name = countries
      .filter(c => c.flag === id)[0]
      .name.common

    setSearchStr(name)
    setSelected(name)

  }

  /*
   * Valitaan voimassa olevan suodatuksen perusteella mitä tulostetaan
   */
  const displayCountries = (filteredCountries) => {

    //const countries = getFilteredCountries()
    const countries = filteredCountries

    if(countries.length > 10){
      return (
        <TooManyCountries 
          countries={countries}
        />
      )
    }

    if(countries.length === 1){

      return(
        <CountrySheet 
          country={countries[0]}
        />
      )
    }

    return (
      <CountryList 
        countries={countries}
        selectHandler={selectHandler}
      />
    )
  }



  const xList = countries.filter(country => country.name.common.toLowerCase().trim().includes(searchStr.toLocaleLowerCase().trim()))

  return (
    <div style={{maxWidth: '500px'}}>
      <Search 
        searchHandler = {searchHandler}
        searchStr={searchStr}
      />
      {
        displayCountries(xList)
      }
      {
        weather === null
          ? null 
          : <Weather weatherData={weather}/>
      }
    </div>
  )
}

export default App;
