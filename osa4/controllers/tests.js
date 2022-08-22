/*
 * Kuten yksikkö- integraatiotesteissä, on myös E2E-testeissä paras ratkaisu nollata tietokanta
 * ja mahdollisesti alustaa se sopivasti aina ennen testien suorittamista. E2E-testauksessa 
 * lisähaasteen tuo se, että testeistä ei ole mahdollista päästä suoraan käsiksi tietokantaan.
 * 
 * Ratkaistaan ongelma luomalla backendiin testejä varten API-endpoint, jonka avulla testit
 * voivat tarvittaessa nollata kannan.
 */
const testsRouter = require('express').Router()

const User = require('../models/user');
const Blog = require('../models/blog');

testsRouter.post('/reset', async(req, res) => {

    console.log("in testRouter reset")

    await Blog.deleteMany({});
    await User.deleteMany({});

    res.status(204).end();
})

module.exports = testsRouter;