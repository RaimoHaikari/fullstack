/*
 * 2.16: puhelinluettelo step8
 * - Siirrä palvelimen kanssa kommunikoinnista vastaava toiminnallisuus omaan moduuliin tämän osan materiaalissa olevan esimerkin tapaan.
 */
import axios from "axios";

const baseUrl = "/api/persons"

/*
 * 2.15: puhelinluettelo step7
 * - Tällä hetkellä luetteloon lisättäviä uusia numeroita ei synkronoida palvelimelle. Korjaa tilanne.
 * 
 * Uuden objektin lisääminen tapahtuu käyttämällä Axiosin metodia: POST
 */
const create = newObjcet => {
    const request = axios.post(baseUrl, newObjcet)
    return request.then(response => response.data)
}

const deleteObj = id => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response.data)
}


const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
}

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
    create,
    deleteObj,
    getAll,
    update
}