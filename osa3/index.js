/*
 * dotenvissä määritettyjen ympäristömuuttujien luku
 */
require('dotenv').config();


const express = require('express');
var morgan = require('morgan');
const app = express();

const Person = require('./models/person');

const cors = require('cors');   /* same origin policy -ongleman ratkaisemikseksi */

/*
 * Jotta saamme Expressin näyttämään staattista sisältöä eli sivun index.html ja
 * sen lataaman JavaScriptin ym. tarvitsemme Expressiin sisäänrakennettua
 * middlewarea static.
 */
app.use(express.static('build'));


/*
 * - json-parserin avulla päästää näppärästi käsiksi pyynnön mukana tulevaan JSON -muotoiseen tietoon
 * - json-parseri on terminologiassa niin sanottu MIDDLEWARE.
 */
app.use(express.json());

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method);
    console.log('Path:', request.path);
    console.log('Body:', request.body);
    console.log('---');
    next();
};

app.use(requestLogger);

/*
 * 3.7: puhelinluettelon backend step7
 * Lisää sovellukseesi loggausta tekevä middleware morgan. Konfiguroi se logaamaan konsoliin tiny-konfiguraation mukaisesti.
 */
morgan.token('post-data', function (req, res) {// eslint-disable-line no-unused-vars

    //console.log("- in post-data", typeof req['body'])

    return JSON.stringify(req['body']);
});


app.use(
    morgan(function (tokens, req, res) {
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms',
            tokens['post-data'](req, res)
        ].join(' ');
    })
);

/*
 * Voimme sallia muista origineista tulevat pyynnöt käyttämällä Noden cors-middlewarea.
 */
app.use(cors());

app.get('/', (req, res) => {
    res.send('<h1>Havuja perkele!!</h1>');
});

/*
 * 3.2: puhelinluettelon backend step2

    Person
        .find({})
        .then(people => {
            res.json(people)
        })
        .catch(err => next(err))
 */
app.get('/info', (req, res, next) => {

    Person
        .find({})
        .then(people => {

            let infoStr = '<div>';
            infoStr += `<p>Puhelinluettelo sisältää ${people.length} henkilön tiedot</p>`;
            infoStr += `<p>${Date()}</p>`;
            infoStr += '</div>';

            res.send(infoStr);

        })
        .catch(err => next(err));
});

/*
 * 3.3: puhelinluettelon backend step3
 * - Toteuta toiminnallisuus yksittäisen puhelinnumerotiedon näyttämiseen.
 *
 * - virhetilanteiden käsittely siirretään eteenpäin FUNKTIOLLA NEXT,
 *   joka välitetään kolmantena parametrinä
 *
 * Huom. ero siinä, että id:tä vastaavaa henkilöä ei löydy kannasta
 *       vs. id-tunnus väärän muotoinen
 */
app.get('/api/persons/:id', (req, res, next) => {

    Person
        .findById(req.params.id)
        .then(person => {
            if(person){
                res.json(person);
            } else {
                res.status(404).end();
            }
        })
        .catch(err => next(err));

});

/*
 * 3.13: puhelinluettelo ja tietokanta, step1
 *
 * - mitä mahdollinen virhe voisi olla ei ole tässä vaiheessa vielä tiedossa,
 *   mutta välitetään eteenpäin & tulostetaan virheilmoitus
 */
app.get('/api/persons', (req, res, next) => {

    Person
        .find({})
        .then(people => {
            res.json(people);
        })
        .catch(err => next(err));
});

/*
 * 3.4: puhelinluettelon backend step4
 *
 * Toteuta toiminnallisuus, jonka avulla puhelinnumerotieto on mahdollista poistaa
 * numerotiedon yksilöivään URL:iin tehtävällä HTTP DELETE -pyynnöllä
 */
app.delete('/api/persons/:id', (req, res, next) => {

    Person
        .findByIdAndRemove(req.params.id)
        .then(result => {// eslint-disable-line no-unused-vars
            res.status(204).end();
        })
        .catch(err => next(err));

});

/*
 * 3.5: puhelinluettelon backend step5
 *
 * Laajenna backendia siten, että uusia puhelintietoja on mahdollista lisätä osoitteeseen
 * http://localhost:3001/api/persons tapahtuvalla HTTP POST -pyynnöllä.
 *
 * 3.19: Laajenna validaatiota siten, että tietokantaan talletettavan nimen on oltava
 *       pituudeltaan vähintään kolme merkkiä.
 *
 */
app.post('/api/persons', (req,res, next) => {
    const postedObject = req.body;

    const person = new Person({
        name: postedObject.name,
        number: postedObject.number
    });

    person
        .save()
        .then(savedPerson => {
            //console.log(".... OK .....")
            //console.log(savedPerson)
            //console.log(".............")
            res.json(savedPerson);
        })
        .catch(err => next(err));
});

/*
 * 3.17 Tietueen päivitys
 */
app.put('/api/persons/:id', (req, res, next) => {

    const body = req.body;

    // huom! normi javascript -objekti...
    const person = {
        name: body.name,
        number: body.number
    };

    Person
        .findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson);
        })
        .catch(err => next(err));
});

/*
 * Lisätään routejen jälkeen seuraava middleware, jonka ansiosta saadaan
 * routejen käsittelemättömistä virhetilanteista JSON-muotoinen virheilmoitus
 */
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

/*
 * 3.16 Virheenkäsittelijä MIDDLEWARE
 * - pitää lisätä viimeisenä middlewarena
 *
 * - 3.19: puhelinluettelo ja tietokanta, step7
 *   Laajenna validaatiota siten, että tietokantaan talletettavan nimen on oltava pituudeltaan vähintään kolme merkkiä.
 *
 * - 3.20*: puhelinluettelo ja tietokanta, step8
 *   Toteuta sovelluksellesi validaatio, joka huolehtii, että backendiin voi tallettaa ainoastaan oikeassa muodossa olevia puhelinnumeroita.
 */
const errorHandler = (err, req, res, next) => {

    //console.log("............. IN ERROR ...............")
    //console.log(err)
    //console.log(err.message)
    //console.log("......................................")

    if(err.name && err.name === 'CastError'){
        return res.status(400).send({ success:false, error: 'malformatted id' });
    }
    else if(err.code && err.code === 11000) {
        let _key = Object.keys(err.keyValue)[0];
        let _val = err.keyValue[_key];
        return res.status(400).send({ success: false, error: `${_key}: '${_val}' already in use` });
    } else if (err.name === 'ValidationError') {
        //console.log("... ValidationError ValidationError ValidationError ....")
        return res.status(400).json({ success: false, error: err.message });
    }

    next(err);
};

app.use(errorHandler);


/*
 * Otetaan käyttöön ympäristömuuttujassa PORT määritelty portti.
 *
 * - Heroku konfiguroi sovelluksen portin ympäristömuuttujan avulla.
 * - Koska Heroko ei pääse lukemaan .env -tiedostoa, pitää
 *   asetus käydä erikseen määrittämässä Herokun settingseissä!
 */
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});