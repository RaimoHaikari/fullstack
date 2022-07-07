import { 
    HealthCheckEntry,
    HospitalEntry,
    OccupationalHealthcareEntry,
    NewPatientEntry,
    Gender, 
    Patient, 
    PatientEntry,
    HealthCheckRating,
    DiagnoseEntry,
    Discharge,
    SickLeave
} from './types';


import dianoseEntries from '../data/diagnosesData';

//import { DiagnoseEntry } from '../types';

type Fields = {name: unknown, dateOfBirth: unknown, ssn: unknown, gender: unknown, occupation: unknown};
type HealthCheckFields = {description: unknown, date: unknown, specialist: unknown, diagnosisCodes: unknown, healthCheckRating: unknown};
type HospitalFields = {description: unknown, date: unknown, specialist: unknown, diagnosisCodes: unknown, discharge: unknown};
type OccupationalHealthcareFields = { description: unknown, date: unknown, specialist: unknown, diagnosisCodes: unknown, employerName: unknown, sickLeave: unknown};

/*
 * Tarkistaa onko parametrin välittämä objekti merkkijono
 *
 * ... function is a so-called type guard. That means it is a function 
 *     which returns a boolean and which has a type predicate as the return type.
 */ 
export const isString = (text: unknown): text is string => {
    return typeof text === 'string' || text instanceof String;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (param: any): param is Gender => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return Object.values(Gender).includes(param);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isDischarge = (param: any): param is Discharge => {

    if(!param.date || !isString(param.date)){
        throw new Error('Incorrect or missing discharge date');
    }
    
    if(!param.criteria || !isString(param.criteria)){
        throw new Error('Incorrect or missing discharge criteria');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return true;
};

/*
 * export interface SickLeave {
    startDate: string;
    endDate?: string;
   }
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isSickleave = (param: any): param is SickLeave => {

    if(!param.startDate || !isString(param.startDate)){
        throw new Error('Incorrect or missing sickleave startDate');
    }

    return true;

};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isHealthCheckRating = (param: any): param is HealthCheckRating => {

    const haystack = Object.keys(HealthCheckRating).filter(StringIsNumber).map(o => parseInt(o));

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return haystack.includes(param); 

};

const parseDateOfBirth =  (dateOfBirth: unknown): string => {

    if(!dateOfBirth || !isString(dateOfBirth)){
        throw new Error('Incorrect or missing dateOfBirth');
    }

    return dateOfBirth;
};


const parseString = (text: unknown, errMsg: string): string => {

    if(!text || !isString(text)){
        throw new Error(errMsg);
    }

    return text;
};

const parseGender = (gender: unknown): Gender => {

    if(!gender || !isGender(gender)){
        throw new Error('Incorrect or missing gender');
    }

    return gender;
};

const parseHealthCheckRating = (healthCheckRating: unknown): HealthCheckRating => {

    if(typeof healthCheckRating === 'undefined' || !isHealthCheckRating(healthCheckRating)){
        throw new Error('Incorrect or missing healthCheckRating');
    }

    return healthCheckRating;
};

/*
 * Tsekataan onko merkkijonomuuttuja olemassa & sisältää tekstiä.
 * - kentän ollessa vapaaehtoinen, puuttuminen ei ole ongelma
 * - esim. Sickleave endDate
 */
const stringExists = (text: unknown): boolean => {

    if(!text || !isString(text))
        return false;    

    return true;
};

/*
 * Tsekataan löytyykö diagnosisCode järjestelmään tallennettujen koodien joukosta.
 */
const isDiagnoseCode = (x:string): boolean => {

    const codelist = dianoseEntries.map((item:DiagnoseEntry) => item.code);
    const index = codelist.indexOf(x);

    return index !== -1;
};

const parseDiagnoseCodes = (x: unknown): string[] => {

    if(!x) return [];
  
    if (Array.isArray(x)) {
  
      const a = x.map((val:string) => {

        if(isDiagnoseCode(val) === false)
            throw new Error(`unidentified diagnosisCode`);

        return val;
      });
  
      return a;
  
    }
  
    return [];
};

/*
 * Tutkitaan onko discharge -kenttä olemassa & sisältää haluttua tietoa
 */
const parseDischarge = (obj: unknown): Discharge => {

    if(typeof obj === 'undefined' || !isDischarge(obj)) {
        throw new Error('missing discharge');
    }
    
    const dateOk:string = parseString(obj.date, 'Incorrect or missing discharge date');
    const criteriaOk:string = parseString(obj.criteria, 'Incorrect or missing discharge criteria');

    const z:Discharge = {
        date: dateOk,
        criteria: criteriaOk
    };

    return z;

};

/*
 *  startDate: string;
    endDate?: string;
 */
const parseSickleave = (obj: unknown) : SickLeave | undefined => {

    let val:SickLeave;

    if(typeof obj === 'undefined')
        return undefined;

    if(!isSickleave(obj)){
        throw new Error('incorrect Sickleave type, at start date field is required');
    }

    const startDateOk:string = parseString(obj.startDate, 'Incorrect or missing discharge date');

    /* Päättymispäivää ei välttättä ole */
    if(stringExists(obj.endDate)){

        const endDateOk:string = parseString(obj.endDate, '');
        val = {
            startDate: startDateOk,
            endDate: endDateOk
        };

    } else {

        val = {
            startDate: startDateOk,
        };

    }

    return val;
};

/*
 *
 */
const parseName = (name: unknown): string => {

    if(!name || !isString(name)){
        throw new Error('Incorrect or missing name');
    }

    return name;
};

const parseOccupation = (occupation: unknown): string => {

    if(!occupation || !isString(occupation)){
        throw new Error('Incorrect or missing occupation');
    }

    return occupation;
};

const parseSSN = (ssn: unknown): string => {

    if(!ssn || !isString(ssn)){
        throw new Error('Incorrect or missing ssn');
    }

    return ssn;
};

export const StringIsNumber = (value:unknown) => isNaN(Number(value)) === false;

/*
 * Valitoidaan käyttäjän lähettämä potilasdata ja
 * mikäli kaikki tiedot ovat asianmukaiset, palautetaan
 * niitä vastaava NewPatientEntry tyyppinen objekti
 */
const toNewPatientEntry = ({ name,dateOfBirth,ssn,gender,occupation }: Fields): NewPatientEntry => {

    const newEntry: NewPatientEntry = {
        name: parseName(name),
        dateOfBirth: parseDateOfBirth(dateOfBirth),
        ssn: parseSSN(ssn),
        gender: parseGender(gender),
        occupation: parseOccupation(occupation)
    };

    return newEntry;
};

export default toNewPatientEntry;

/*
 * @todo: voi varmaankin poistaa, kun tehtävän '9.19: patientor, step4'
 * jälkeen palautetaan todelliset käynnit
 */
export const toPatient = ( obj : PatientEntry): Patient => {

    console.log(obj);

    const val: Patient = {
        ...obj,
        entries: []
    };

    return val;

};

/*

    description: string;
    date: string;
    specialist: string;
    diagnosisCodes?: Array<DiagnoseEntry['code']>;
    healthCheckRating: HealthCheckRating;
*/
export const toNewHealthCheckEntry = ({ description, date, specialist, diagnosisCodes, healthCheckRating}: HealthCheckFields): HealthCheckEntry => {

    const newEntry: HealthCheckEntry = {
        id: 'placeholder-of-id',
        description: parseString(description, 'Incorrect or missing description'),
        date: parseString(date, 'Incorrect or missing date of entry'),
        type: "HealthCheck",
        specialist: parseString(specialist, 'Incorrect or missing specialist field'),
        diagnosisCodes: parseDiagnoseCodes(diagnosisCodes),
        healthCheckRating: parseHealthCheckRating(healthCheckRating)
    };

    return newEntry;
};

export const toNewHospitalEntry = ({ description, date, specialist, diagnosisCodes, discharge}: HospitalFields): HospitalEntry => {

    const newEntry: HospitalEntry = {
        id: 'placeholder-of-id',
        description: parseString(description, 'Incorrect or missing description'),
        date: parseString(date, 'Incorrect or missing date of entry'),
        type: "Hospital",
        specialist: parseString(specialist, 'Incorrect or missing specialist field'),
        diagnosisCodes: parseDiagnoseCodes(diagnosisCodes),
        discharge: parseDischarge(discharge)
    };

    return newEntry;
};

/*
    employerName: string;
    sickLeave?: SickLeave;
*/
export const toNewOccupationalHealthcareEntry = ({ description, date, specialist, diagnosisCodes, employerName, sickLeave}: OccupationalHealthcareFields): OccupationalHealthcareEntry => {

    const newEntry: OccupationalHealthcareEntry = {
        id: 'placeholder-of-id',
        description: parseString(description, 'Incorrect or missing description'),
        date: parseString(date, 'Incorrect or missing date of entry'),
        type: "OccupationalHealthcare",
        specialist: parseString(specialist, 'Incorrect or missing specialist field'),
        diagnosisCodes: parseDiagnoseCodes(diagnosisCodes),
        employerName: parseString(employerName, 'Incorrect or missing employerName field'),
        sickLeave: parseSickleave(sickLeave)
    };

    return newEntry;
};

