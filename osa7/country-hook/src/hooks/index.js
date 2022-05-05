import {useEffect, useState} from 'react';
import axios from 'axios';

/*
 * Maan tiedot hakeva custom hook
 */
export const useCountry = (name) => {

  const [country, setCountry] = useState(null)

  useEffect(() => {

      async function fetchData(){

          try {
              const endpointUrl = `https://restcountries.com/v3.1/name/${name}?fullText=true`;
              const response = await axios.get(endpointUrl);

              if(response.data.length > 0){
                  setCountry(response.data[0]);
              }

          } catch (e) {
              console.log(`Haku: ${name} epäonnistui hirvittävällä tavalla :(`)
          }
      }
      
      if(name.length > 0) {fetchData()}
    
  }, [name])

  return country
}

/*
 * Syöttökentän hoitava custom hook.
 */
export const useField = (type) => {

    const [value, setValue] = useState('')
  
    const onChange = (event) => {
      setValue(event.target.value)
    }
  
    return {
      type,
      value,
      onChange
    }
  }