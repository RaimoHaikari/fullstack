//import patientsData from '../../data/patientsData';
import patients from '../../data/patients';

import { v1 as uuid } from 'uuid';

// PatientEntry
import {NewPatientEntry, PatientEntry, NonSensitivePatientEntry, Entry} from '../types';

const addEntry = (patientId: string, _entry: Entry) : Entry => {

    const x = patients.filter(item => {
        return item.id === patientId;
    });

    /*
     * id:n avulla pitää löytyä yksi tietue...
     */
    if(x.length !== 1){
        throw new Error(`id didn't match any patient.`);
    }

    const entryId: string = uuid();

    const newEntry = {
        ..._entry,
        id: entryId
    };

    /*
     * Lisätään tieto asiakkaan käynnit sisältävään muuttujaan.
     */
    x[0].entries = x[0].entries.concat(newEntry);


    return newEntry;

};

/*
 * Lisätty tyhjän potilaskäyntitaulukon lisäys.....
 */
const addPatient = ( entry: NewPatientEntry ): PatientEntry => {

    const id: string = uuid();

    const newPatientEntry = {
        id,
        ...entry,
        entries: []
    };

    //patientsData.push(newPatientEntry);
    patients.push(newPatientEntry);

    return newPatientEntry;

};

/*
 * Palauttaa täydelliset potilastiedot
 */
const getEnries = (): Array<PatientEntry> => {
    return patients;
};

/*
    const x = patientsData.filter(item => {
        console.log(item.id);

        return item.id === id;
    });

    return x;
 */
const getPatientEntry = (id: string) : Array<PatientEntry> => {

    const x = patients.filter(item => {
        return item.id === id;
    });

    return x;
};

/*
 * Palattaa potilastiedot, joista sotu on poistettu
 *
 */
const getNonSensitiveEntries = (): NonSensitivePatientEntry[] => {

    console.log("Here we go");

    return patients.map(({id,name,dateOfBirth,gender, occupation}) => ({
        id,
        name,
        dateOfBirth,
        gender, 
        occupation
    }));
};

export default {
    addEntry,
    addPatient,
    getEnries,
    getNonSensitiveEntries,
    getPatientEntry
};