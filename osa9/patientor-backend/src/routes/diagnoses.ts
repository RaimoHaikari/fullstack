/*
 * Käsitellään pyynnöt, jotka kohdistuvat: '/api/diagnoses' resursseihin
 */
import express from 'express';

import diagnoseServices from '../services/diagnoseServices';

const router = express.Router();

router.get('/', (_req, res) => {
    res.send(diagnoseServices.getEnries());
});

router.post('/', (_req, res) => {
    res.send('Saving a diagnose!');
});

export default router;