const config = require('./utils/config');

const express = require('express');
const app = express();

/*
 * Voimme sallia muista origineista tulevat pyynnöt käyttämällä Noden cors-middlewarea.
 */
const cors = require('cors');


/*
 * - napataan käyttöön sovelluksen rajapinnan määrittävät routet
 */
const blogsRouter = require('./controllers/blogs');

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
 * - kiinnitetään blogsRouter polkuun /api/blogs
 */
app.use('/api/blogs', blogsRouter);

module.exports = app;