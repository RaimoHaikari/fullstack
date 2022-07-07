import dianoseEntries from '../../data/diagnosesData';

import { DiagnoseEntry } from '../types';

//const diagnoses: Array<DiagnoseEntry> = dianoseEntries;

const getEnries = (): Array<DiagnoseEntry> => {
    return dianoseEntries;
};

export default {
    getEnries
};