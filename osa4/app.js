const config = require('./utils/config');

const express = require('express');
const app = express();

/*
 * DIY middleware
 */
const middleWare = require('./utils/middleWare');

/*
 * Voimme sallia muista origineista tulevat pyynnöt käyttämällä Noden cors-middlewarea.
 */
const cors = require('cors');


/*
 * - napataan käyttöön sovelluksen rajapinnan määrittävät routet
 */
const blogsRouter = require('./controllers/blogs');

/*
 * - käyttäjienhallintaan liittyvät routet
 */
const usersRouter = require('./controllers/users');

/*
 * - kirjautumiseen liittyvät routet
 */
const loginRouter = require('./controllers/login');


const logger = require('./utils/logger');

const mongoose = require('mongoose');

logger.info('connecting to mongoDB');
const mongoUrl = `mongodb+srv://${config.DB_USER}:${config.DB_PASSWORD}@cluster0.dkwjc.mongodb.net/${config.DB_NAME}?retryWrites=true&w=majority`;

mongoose.connect(mongoUrl)
    .then(() => {
        logger.info('connected to MongoDB');
    })
    .catch((error) => {
        logger.error('error connection to MongoDB:', error.message);
    });

app.use(cors());

app.use(express.json());

/*
 * - autentikoinnissa käytetyn tokenin käsittely
 */
app.use(middleWare.tokenExtractor);

/*
 * - kiinnitetään blogsRouter polkuun /api/blogs
 *
 * 4.22*: blogilistan laajennus, step10
 * - Tee nyt uusi middleware userExtractor, joka selvittää pyyntöön liittyvän käyttäjän
 *   ja sijoittaa sen request-olioon. 
 */
app.use('/api/blogs', middleWare.userExtractor, blogsRouter);

/*
 * - kiinnitetään usersRouter polkuun /api/users
 */
app.use('/api/users', usersRouter);

/*
 * - kiinnitetään loginRouter polkuun /api/login
 */
app.use('/api/login', loginRouter);

/*
 * - validointivirheiden käsittely
 */
app.use(middleWare.errorHandler);


module.exports = app;