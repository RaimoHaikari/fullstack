const blogsRouter = require('express').Router();
const { response, request } = require('../app');

const jwt = require('jsonwebtoken');

const Blog = require('../models/blog');
const User = require('../models/user');


/*
 * Käyttöoikeuksien tarkistamisen apufunktio.
 */
const checkAuthentication = (request, ownerId) => {

    const token = request.token;
    const userId = request.user !== null
        ? request.user.id
        : null;

    /*
     * Autentikointitoken puuttuuu
     */
    if(token === null) {

        return {
            validUser: false,
            msg: 'Only logged user can delete blogs',
            errorCode: 401
        }

    } 

    /*
     *  Jotain mätää käyttäjätietojen selvittämiseesä
     */
    if(userId === null) { 

        return {
            validUser: false,
            msg: 'Only logged user can delete blogs',
            errorCode: 401
        }

    } 

    /*
     * Onko pyynnön esittäjä dokumentin omistaja
     *
     * - mikäli kyseessä on uuden dokumentin luominen, omistajaa ei ole vielä määritetty,
     *   eikä näin ollen tarvi tarkistaa
     */
    if(ownerId !== null && userId !== ownerId) { 

        return {
            validUser: false,
            msg: 'Only logged owner can update/remove blog',
            errorCode: 401
        }

    } 

    return {
        validUser: true,
        msg: null,
        errorCode: null
    };

}

/*
 * Napataan pyynnön header -tiedoista kirjautumistiedot sisältävä token
 */
const getTokenFrom = request => {

    const authorization = request.get('Authorization');

    if(authorization && authorization.toLowerCase().startsWith('bearer ')){
        return authorization.substring(7);
    }

    return null;
}

blogsRouter.get('/', async (req, res) => {

    const blogs =  await Blog
        .find({})
        .populate('user');
        
    res.json(blogs)
});

/*
 * 4.10: blogilistan testit, step3
 * - refaktoroi operaatio käyttämään promisejen sijaan async/awaitia
 * 
 * 4.19: blogilistan laajennus, step7
 * - Muuta blogien lisäämistä siten, että se on mahdollista vain, 
 *   jos lisäyksen tekevässä HTTP POST -pyynnössä on mukana validi token.
 * 
 * 4.20*: blogilistan laajennus, step8
 * - refaktoroi tokenin erottaminen middlewareksi
 */
blogsRouter.post('/', async (req, res, next) => {

    try {

        const body = req.body;

        // Voiko pyynnön esittäjä muokata dokumenttia
        const aut = checkAuthentication(req, null);

        if(aut.validUser === false) {

            return res.status(aut.errorCode).json({
                error: aut.msg
            });

        }
        
        // Haetaan käyttäjän tiedot
        const user = await User.findById(req.user.id);

        // Alustetaan ja talletetaan blogin tiedot kokoava objetkti
        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes,
            user: user._id
        });
    
        const savedBlog = await blog.save();

        /* Talletetaan tieto käyttäjän blogilistaan */
        user.blogs = user.blogs.concat(savedBlog._id);
        await user.save();
    
        res.status(201).json(savedBlog);

    } catch (exeption) {
        next(exeption);
    }

});

/*
 * 4.13 blogilistan laajennus, step1
 * - Toteuta sovellukseen mahdollisuus yksittäisen blogin poistoon.
 * 
 * 4.21*: blogilistan laajennus, step9
 * - Muuta blogin poistavaa operaatiota siten, että poisto onnistuu ainoastaan
 *   jos poisto-operaation tekijä (eli se kenen token on pyynnön mukana) on sama 
 *   kuin blogin lisääjä.
 */
blogsRouter.delete('/:id', async (req, res, next) => {

    try {

        // Tarkistetaan poistettavaksi haluttavan blogin omistaja
        const blogToBeRemoved = await Blog.findById(req.params.id);
        const ownerId = blogToBeRemoved.user.toString();

        // Voiko pyynnön esittäjä muokata dokumenttia
        const aut = checkAuthentication(req, ownerId);

        if(aut.validUser === false) {

            return res.status(aut.errorCode).json({
                error: aut.msg
            });

        }

        // All clear....
        await Blog.findByIdAndRemove(req.params.id);
        res.status(204).end();

    } catch (exeption) {
        next(exeption);
    }
});


/*
 * 4.14* blogilistan laajennus, step2
 * - Toteuta sovellukseen mahdollisuus yksittäisen blogin muokkaamiseen.
 */
blogsRouter.put('/:id', async (req, res, next) => {

    try {

        const body = req.body;

        // Tarkistetaan poistettavaksi haluttavan blogin omistaja
        const blogToBeUpdated = await Blog.findById(req.params.id);
        const ownerId = blogToBeUpdated.user.toString();

        // Voiko pyynnön esittäjä muokata dokumenttia
        const aut = checkAuthentication(req, ownerId);

        if(aut.validUser === false) {

            return res.status(aut.errorCode).json({
                error: aut.msg
            });

        }

        /*
         * Huomaa, että metodin findByIdAndUpdate parametrina tulee antaa normaali JavaScript-olio
         */
        const blog = {
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes
        };

        /*
         *
         */
        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {new: true});
        res.status(200).json(updatedBlog);

    } catch (exeption) {
        next(exeption);
    }
});
module.exports = blogsRouter;