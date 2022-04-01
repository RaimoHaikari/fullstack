// const jwt = require('jsonwebtoken');
const jwt = require('jsonwebtoken');

const extractToken = request => {

    const authorization = request.get('Authorization');
    
    let tokenVal = null;

    if(typeof authorization !== 'undefined' && authorization.toLowerCase().startsWith('bearer ')) {
        tokenVal = authorization.substring(7);
    } 

    return tokenVal;
}

const errorHandler = (err, req, res, next) => {

    console.log("............. IN ERROR ...............");
    console.log(err)
    console.log(err.name)
    console.log("......................................");

    if(err.name === 'ValidationError') {
        return res.status(400).json({error: err.message});
    } else if(err.name === 'CastError') {
        return res.status(400).json({error: err.message});
    } else if(err.name === 'JsonWebTokenError') {
        return res.status(400).json({error: `It's obvious from your actions that you don't know jack squat about computers or software.`});
    }

    next(err);

}

const requestLogger = (req, res, next) => {
    
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    console.log('Body', req.body);
    console.log('---');
    
    next();
};

/*
 * 4.20*: blogilistan laajennus, step8
 *
 * - refaktoroi tokenin erottaminen middlewareksi, joka ottaa tokenin Authorization-headerista 
 *   ja sijoittaa sen request-olion kenttään token.
 */
const tokenExtractor = (req, res, next) => {

    const authorization = req.get('Authorization');
    
    let tokenVal = null;

    if(typeof authorization !== 'undefined' && authorization.toLowerCase().startsWith('bearer ')) {
        tokenVal = authorization.substring(7);
    } 

    req.token = tokenVal;

    next();

}

/*
 * 4.22*: blogilistan laajennus, step10
 *
 * - Tee nyt uusi middleware userExtractor, joka selvittää pyyntöön liittyvän käyttäjän 
 *   ja sijoittaa sen request-olioon. 
 */
const userExtractor = (req, res, next) => {

    let tokenVal = (typeof req.token !== 'undefined' && req.token !== null)
        ? req.token
        : extractToken(req);

    let decodedToken = (tokenVal !== null) 
        ? jwt.verify(tokenVal, process.env.SECRET) 
        : null;

    let userVal = (decodedToken !== null)
        ? {username: decodedToken.username,id: decodedToken.id}
        : null;

    req.user = userVal;
        
    next();

}

module.exports = {
    errorHandler,
    requestLogger,
    tokenExtractor,
    userExtractor
}