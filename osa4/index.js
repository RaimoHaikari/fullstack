const app = require('./app');
const http = require('http');
const config = require('./utils/config');
const logger = require('./utils/logger');

/* 
 * - Express-sovellus on eristetty tiedostoon app.js
 * - index.js rooliksi jää sovelluksen käynnistäminen määriteltyyn 
 *   porttiin Noden http -olion avulla
 */
const server = http.createServer(app);

server.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`)
});