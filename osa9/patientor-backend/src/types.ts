export enum Gender {
    Male = 'male',
    Female = 'female'
}

export enum HealthCheckRating {
    "Healthy" = 0,
    "LowRisk" = 1,
    "HighRisk" = 2,
    "CriticalRisk" = 3
}

export interface DiagnoseEntry {
    code: string,
    name: string,
    latin?: string
}

export interface PatientEntry {
    id: string,
    name: string,
    dateOfBirth: string,
    ssn: string,
    gender: Gender,
    occupation: string
}

/* 
 * - auttaa pitämään uuden potilastiedon lisäävän palvelun koodin helpommin luettavana
 * - lisättävän potilasitietueen kentistä puuttuu id 
 */
export type NewPatientEntry = Omit<PatientEntry, 'id'>;

export type NonSensitivePatientEntry = Omit<PatientEntry,'ssn'>;

/* 
 * 9.16: patientor, step1
 */
//eslint-disable-next-line @typescript-eslint/no-empty-interface
//export interface Entry {}

export interface Patient {
    id: string;
    name: string;
    ssn: string;
    occupation: string;
    gender: Gender;
    dateOfBirth: string;
    entries: Entry[]
}

export type PublicPatient = Omit<Patient, 'ssn' | 'entries' >;

/* 
 * - HealthCheckEntry
 * - OccupationalHealthcareEntry
 * - HospitalEntry
 */
export interface Discharge {
    date: string;
    criteria: string
}

export interface SickLeave {
    startDate: string;
    endDate?: string;
}

export interface BaseEntry {
    id: string;
    description: string;
    date: string;
    specialist: string;
    diagnosisCodes?: Array<DiagnoseEntry['code']>;
}

export interface HealthCheckEntry extends BaseEntry {
    type: "HealthCheck";
    healthCheckRating: HealthCheckRating;
}

export interface HospitalEntry extends BaseEntry {
    type: "Hospital";
    discharge: Discharge
}

export interface OccupationalHealthcareEntry extends BaseEntry {
    type: "OccupationalHealthcare";
    employerName: string;
    sickLeave?: SickLeave;
}

export type Entry = HealthCheckEntry | HospitalEntry | OccupationalHealthcareEntry;