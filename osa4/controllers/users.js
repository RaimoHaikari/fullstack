/*
 * Käyttäjienhallinnasta vastaava Router
 */
const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();

const User = require('../models/user');
const Blog = require('../models/blog');

/*
 * Käyttäjälistan palauttava reitti
 */
usersRouter.get('/', async (req, res) => {

    const users = await User
        .find({})
        .populate('blogs')

    res.json(users);
    
})

/*
 * Uuden käyttäjän lisääminen
 */
usersRouter.post('/', async (req, res, next) => {

    try {

        const {username, name, password} = req.body;
        /*
         * (Lähtökohtaisesti) Mongoosen validoinnit eivät tarjoa valmista mahdollisuutta kentän arvon 
         * uniikkiuden tarkastamiseen.
         */
        const existingUser = await User.findOne({username});
        if(existingUser){
            return res.status(400).json({
                error: 'username must be unique'
            });
        }

        if(typeof password === "undefined"){
            return res.status(400).json({
                error: 'Password is required'
            });  
        } else if(password.length < 3){
            return res.status(400).json({
                error: 'Password is shorter than the minimum allowed length (3)'
            });            
        }
    
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
    
        const user = new User({
            username,
            name,
            passwordHash
        });
    
        const savedUser = await user.save();
    
        res
            .status(201)
            .json(savedUser);

    } catch (exeption) {
        next(exeption);
    }

});

module.exports = usersRouter;