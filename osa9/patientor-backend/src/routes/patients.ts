/*
 * Käsitellään pyynnöt, jotka kohdistuvat: '/api/diagnoses' resursseihin
 */
import express from 'express';

import patientServices from '../services/patientServices';

// import toNewPatientEntry, { toPatient } from '../utils';
import toNewPatientEntry, { isString, toNewHealthCheckEntry, toNewHospitalEntry, toNewOccupationalHealthcareEntry } from '../utils';

const router = express.Router();

/*
 * Palautetaan potilastiedot, joista ssn -kenttä on poistettu
 */
router.get('/', (_req, res) => {
    res.send(patientServices.getNonSensitiveEntries());
});

/*
 * Palautetaan potilastiedot, joista ssn -kenttä on poistettu
 */
router.get('/:id', (_req, res) => {

    try {

        const x = patientServices.getPatientEntry(_req.params.id);

        const val = x.length === 1
            ? x[0] // toPatient(x[0])
            : {};
           
        res.send(val);
        
    } catch (error: unknown) {

        let errorMessage = 'Something went wrong.';
        if (error instanceof Error) {
          errorMessage += ' Error: ' + error.message;
        }
        res.status(400).send(errorMessage);

    }


        
});


/*
 * Huom. kommentin eslint-disable-next-line @typescript-eslint/no-unsafe-argument poisto
 * ei onnistu, vaikka utils tsekkaa, että aineisto on oikean muotoista ja palauttaa
 * vaaditun tyyppisen objektin...
 */
router.post('/', (req, res) => {

    try {

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const newPatientEntry = toNewPatientEntry(req.body);

        const addedPatientEntry = patientServices.addPatient(newPatientEntry);

        res.json(addedPatientEntry);
        
    } catch (error: unknown) {

        let errorMessage = 'Something went wrong.';
        if (error instanceof Error) {
          errorMessage += ' Error: ' + error.message;
        }
        res.status(400).send(errorMessage);

    }

});


/*
 * 9.23: patientor, step8
 */
router.post('/:id', (req, res) => {

    let addedEntry;

    try {

        const x:unknown = req.body.type;
        const eType:string = isString(x) ? x : '';

        switch (eType) {

            case 'HealthCheck':
                console.log("HealthCheck");
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                const newEntry = toNewHealthCheckEntry(req.body);
                addedEntry = patientServices.addEntry(req.params.id, newEntry);
                break;
            case 'Hospital':
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                const newHospitalEntry = toNewHospitalEntry(req.body);
                addedEntry = patientServices.addEntry(req.params.id, newHospitalEntry);
                break;
            case 'OccupationalHealthcare':
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                const newOccupationalHealthcareEntry = toNewOccupationalHealthcareEntry(req.body);
                addedEntry = patientServices.addEntry(req.params.id, newOccupationalHealthcareEntry);
                break;
            default:
                throw new Error('Incorrect or missing type');
        }

        res.json(addedEntry);
        
    } catch (error: unknown) {

        let errorMessage = 'Something went wrong.';
        if (error instanceof Error) {
          errorMessage += ' Error: ' + error.message;
        }
        res.status(400).send(errorMessage);

    }

});

export default router;