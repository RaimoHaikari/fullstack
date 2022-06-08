import React, { useEffect, useState } from 'react'

import contactServices from "./services/contacts"

import FilterForm from './components/FilterForm'
import AddNewContactForm from './components/AddNewContactForm'
import ContactList from './components/ContactList'
import Notification from './components/Notification'

const App = () => {
  
  const [persons, setPersons] = useState([]) 

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterStr, setFilterStr] = useState('')
  const [errorMsg, setErrorMsg] = useState({msg: null, success: null})

  /* 
   * 2.11: puhelinluettelo step6
   * - Muuta sovellusta siten, että datan alkutila haetaan axios-kirjaston avulla palvelimelta. Hoida datan hakeminen Effect-hookilla
   * 
   * {    
          "name": "Edvard von Boxis",
          "number": "08-122017",
          "id": 999
        }
   */
  useEffect(() => {

    contactServices
      .getAll()
      .then(initialPersons => {

        setPersons(initialPersons)

        displayErrorMessage({
          msg: `Puhelinluettolon tiedot luettu`,
          success: true
        }) 

      })
      .catch(error => {
        displayErrorMessage({
          msg: `Aineiston luku palvelimelta epäonnistui`,
          success: false
        })        
      })      

  }, [])

  /*
   * 2.10: puhelinluettelo step5
   * - niputetaan yhteystiedon lisäämiseen käytettävien tietojen asettamiseen käytettävien input-kenttien asetukset 
   *   taulukon sisään, jolloin kenttien alustus onnistuu silmukan avulla
   */
  const addNewContactFormFields = [
    {
      id: 1,
      text: "name",
      handler: function(event) {
        nameHandler(event)
      },
      value: newName,
    },
    {
      id: 2,
      text: "number",
      handler: function(event){
        numberHandler(event)
      },
      value: newNumber
    }
  ]

  /*
   * Lisätään palvelimelle uuden henkilön tiedot
   */
  const addNewContact = (newContact) => {

    contactServices
    .create(newContact)
    .then(addedContact => {
      displayErrorMessage({
        msg: `${addedContact.name} added`,
        success: true
      })
      setPersons(persons.concat(addedContact))
      setNewName('')
      setNewNumber('')
    })
    .catch(error => {

      console.log(".... in error .....")
      console.log(error.response.data)
      console.log("...................")

      displayErrorMessage({
        msg: `Cound not add ${newContact.name} to phonebook. [${error.response.data.error}]`,
        success: false
      })

      setNewName('')
      setNewNumber('')  

    })

  }

  /*
   * 2.6: puhelinluettelo step1
   * - henkilön lisäys puhelinluetteloon
   * 2.18*: puhelinluettelo step10
   * - Muuta toiminnallisuutta siten, että jos jo olemassa olevalle henkilölle lisätään numero, korvaa lisätty numero aiemman numeron.
   */
  const addContactHandler = (event) => {

    // muista estää lomakkeen lähetyksen oletusarvoinen toiminta...
    event.preventDefault()

    const newContact = {
      name: newName,
      number: newNumber
    }

    let nameTest = getPersonByName(newName.trim())
    let numberTest = getPersonByNumber(newNumber.trim())

    // VE1: Ollaan päivittämässä vanhaa tietoa
    if(nameTest !== null && numberTest === null) 
      updateContactData(nameTest)
    // VE2: Numero on jo käytössä 
    else if (numberTest !== null) {

      displayErrorMessage({
        msg: `${newNumber.trim()} is already in use. Pick another...`,
        success: false
      })

      return  
    } 
    // VE3: Ollaan lisäämässä uutta henkilöä
    else if (nameTest === null && numberTest === null)
      addNewContact(newContact)
  }

  /*
   * 2.19: puhelinluettelo step11
   * - Toteuta osan 2 esimerkin parempi virheilmoitus tyyliin ruudulla muutaman sekunnin näkyvä ilmoitus
   */
  const displayErrorMessage = (msgObj) => {
    setErrorMsg(msgObj)

    setTimeout(() => {
      setErrorMsg({msg: null, success: null})
    }, 5000);
  }

  /*
   * 2.9*: puhelinluettelo step4
   * Tee lomakkeeseen hakukenttä, jonka avulla näytettävien nimien listaa voidaan rajata:
   */
  const getFilteredContacts = () => {

    const filteredPersons = persons.filter(person => {

      return person.name.toLowerCase().includes(filterStr.toLowerCase().trim())
    })

    return filteredPersons
  }

  /*
   * Etsitään henkilön tietoja puhelinluettelosta
   * (Oletuksena, että saa olla vain yksi saman niminen henkilö)
   * - jos henkilö löytyy, palauttaa henkilön tiedot 
   * - jos henkilöä ei löydy, palauttaa arvon null
   */
  const getPersonByName = (name) => {

    let val = persons.filter(person => person.name.toLowerCase() === name.toLowerCase())

    if(val.length === 0)
      return null

    return val[0] // oletus, että kaimoja ei löydy..
  }

  /*
   * Etsitään henkilön tietoja puhelinluettelosta NUMERON perusteella
   * - jos henkilö löytyy, palauttaa henkilön tiedot 
   * - jos henkilöä ei löydy, palauttaa arvon null
   */
  const getPersonByNumber = (phoneNumber) => {

    let val = persons.filter(person => person.number.toLowerCase() === phoneNumber.toLowerCase())

    if(val.length === 0)
      return null

    return val[0] // Ajatus, että vain yhdellä voi olla sama numero
  }

  /*
   * Nimi löytyy jo tietokannasta, mutta numeroa ollaan muuttamassa
   */
  const updateContactData = (person) => {

    if (window.confirm(`${person.name} is already added to phonebook, replace the old number with a new one?`)) {

      const oldNumber = person.number

      const updatedContact = {
        ...person,
        number: newNumber
      }

      contactServices
        .update(person.id, updatedContact)
        .then(returnedContact => {
          
          displayErrorMessage({
            msg: `${returnedContact.name}: number ${oldNumber} updated to ${returnedContact.number}`,
            success: true
          })

          setPersons(persons.map(p => p.id === person.id ? returnedContact : p))
          setNewName('')
          setNewNumber('')
        })

    }    

  }

  const nameHandler = (event) => {
    event.preventDefault()
    setNewName(event.target.value)
  }

  /*
   * 2.8: puhelinluettelo step3
   * - Lisää sovellukseen mahdollisuus antaa henkilöille puhelinnumero
   */
  const numberHandler = (event) => {
    event.preventDefault()
    setNewNumber(event.target.value)
  }

  const filterStrHandler = (event) => {
    event.preventDefault()
    setFilterStr(event.target.value)
  }

  /*
   * 2.17 puhelinluettelo step9
   * - Tee ohjelmaan mahdollisuus yhteystietojen poistamiseen.
   */
  const deleteHandler = (id) => {

    const contact = persons.filter(p => p.id === id)

    if(contact.length !== 1)
      return

    if (window.confirm(`Delete ${contact[0].name}?`)) {

      contactServices
        .deleteObj(contact[0].id)
        .then(deletedPerson => {
          setPersons(persons.filter(p => p.id !== id))
          displayErrorMessage({
            msg: `${contact[0].name} successfully deleted`,
            success: true
          })
        })
        .catch(error => {

          // Oletetaan, että ongelma johtui siirä, että henkilö oli jo poistettu
          setPersons(persons.filter(p => p.id !== contact[0].id))

          // .... virhe....
          displayErrorMessage({
            msg: `${contact[0].name} was already probably already deleted from server. Please refresh the page.`,
            success: false
          })          
        })
    }
  }

  

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification 
        message={errorMsg.msg}
        success={errorMsg.success}
      />
      <FilterForm 
        text = "filter shown with"
        value = {filterStr}
        changeHandler = {filterStrHandler}
      />
      <AddNewContactForm 
        fields = {addNewContactFormFields}
        submitHandler = {addContactHandler}
        submitBtnText = "add"
      />
      <h2>Numbers</h2>
      <ContactList 
        contacts={getFilteredContacts()}
        deleteHandler = {deleteHandler}
      />

      <div><small><strong>Toimintoihin liittyviä viestejä pidetään näytöllä 5 sek ajan.</strong></small></div>
    </div>
  )

}

export default App