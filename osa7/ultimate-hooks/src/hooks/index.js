import {useEffect, useState} from 'react';
import axios from 'axios';

export const useField = (type) => {

    const [value, setValue] = useState('')

    const onChange = (event) => {
        setValue(event.target.value)
    }

    const clear = () => {
        setValue('')
    }

    return {
        clear,
        type,
        value,
        onChange
    }
}

export const useResource = (baseUrl) => {

    const [resources, setResources] = useState([])

    async function fetchData(baseUrl){

        try {
            const response = await axios.get(baseUrl);
            setResources(response.data);

        } catch (e) {
            console.log(`Haku: ${baseUrl} epäonnistui hirvittävällä tavalla :(`)
        }
    }

    useEffect(() => {
        fetchData(baseUrl);
    }, [baseUrl])

    const create = (newObject) => {

        async function createNew(){

            try {

                await axios.post(baseUrl, newObject);
                fetchData(baseUrl);

            } catch (e) {
                console.log(`Objektin: ${newObject} luominen epäonnistui. Ei ole mitään mieltä yrittää uudelleen :(`)
            }

        }

        createNew()

    }

    const service = {
        create
    }

    return [
        resources, service
    ]
}