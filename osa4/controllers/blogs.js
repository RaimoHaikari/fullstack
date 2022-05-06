const blogsRouter = require('express').Router();
const { response, request } = require('../app');

const jwt = require('jsonwebtoken');

const Blog = require('../models/blog');
const User = require('../models/user');
const Comment = require('../models/comment');


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
        .populate('user')
        .populate('comments', 'content');
        
    res.json(blogs)
});


/*
 * Haetaan id-tunnusta vastaava blogitietue
 */
blogsRouter.get('/:id', async (req, res, next) => {

    try {
        const blog = await Blog
            .findById(req.params.id)
            .populate('user')
            .populate('comments', 'content');

        /*
         * Löytyikö id:tä vastaava tietue
         */
        if(blog)
            res.json(blog)
        else
            res.status(404).end();

    } catch(e) {
        next(e)
    } 
    
})


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

        /* Palautetaa luotu blogi käyttäjätiedoilla terästettynä */
        const finalBlog = await Blog
            .findById(savedBlog._id)
            .populate('user')

        res.status(201).json(finalBlog);

    } catch (exeption) {
        next(exeption);
    }

});


/*
 * Uuden kommentin tallennus kantaan
 */
blogsRouter.post('/:id/comments', async (req, res, next) => {

    try {

        const body = req.body;

        // Haetaan kommentoitava blogi
        const blogToBeCommented = await Blog.findById(req.params.id);
console.log(blogToBeCommented)

        // Luodaan ja talletetaan kommentti
        const comment = new Comment({
            content: body.content,
            blog: blogToBeCommented._id
        });

        const savedComment = await comment.save();
console.log(savedComment)

        // Liitetään blogitietueeseen tieto lisätystä kommentista
        blogToBeCommented.comments = blogToBeCommented.comments.concat(savedComment._id);
        await blogToBeCommented.save()

        /*
         * luetaan juuri lisätty merkintä, jotta saadaan käyttäjätiedot
         * mukaan
         */
        const updatedBlog = await Blog
            .findById(req.params.id)
            .populate('comments', 'content')
            .populate('user');

        res.status(201).json(updatedBlog);

    } catch (e) {
        next(e)
    }

})


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
 * 
 * Blogin omistaja voi mukata mitä tahansa kenttää.
 * Kuka tahansa voi tykätä.
 * - jos joku "muu" yrittää muokata blogia, niin mikäli kyseessä on tilanne
 *   jossa pyynnön esittävän objektin likes arvo on suurempi kuin kannassa
 *   oleva tilanne, niin sallitaan päivitys tältä osin.
 */
blogsRouter.put('/:id', async (req, res, next) => {

    try {

        const body = req.body;

        // Tarkistetaan poistettavaksi haluttavan blogin omistaja
        const blogToBeUpdated = await Blog.findById(req.params.id);

        const ownerId = blogToBeUpdated.user.toString();

        /*
         * Blogin omistaja voi päivittää mitä tahansa.
         * - kuka tahansa voi tykätä
         */
        const currentLikeCount = blogToBeUpdated.likes
        const newLikeCount = typeof body.likes !== 'undefined' ? body.likes: -1 
        const increaseLikeCount = newLikeCount > currentLikeCount ? true : false

        // Voiko pyynnön esittäjä muokata dokumenttia
        const aut = checkAuthentication(req, ownerId);

        /*
         * Mikäli pyynnön esittäjä ei ole dokumentin omistaja eikä
         * kyseessä ole tykkääminen, on kyseessä kielletty operaatio
         */
        if(aut.validUser === false && increaseLikeCount === false) {

            console.log("Täällä sitä mennään...")
            console.log("X", increaseLikeCount, newLikeCount)
            console.log(".......................")
            //updateLikeCount(req)

            return res.status(aut.errorCode).json({
                error: aut.msg
            });

        }

        const newTitle = aut.validUser ? body.title : blogToBeUpdated.title
        const newAuthor = aut.validUser ? body.author : blogToBeUpdated.author
        const newUrl = aut.validUser ? body.url : blogToBeUpdated.url
        const newLikes = aut.validUser ? body.likes : (blogToBeUpdated.likes + 1)

        /*
         * Huomaa, että metodin findByIdAndUpdate parametrina tulee antaa normaali JavaScript-olio
         */
        const blog = {
            title: newTitle,
            author: newAuthor,
            url: newUrl,
            likes: newLikes
        };

        /*
         *
         */
        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {new: true});

        /* Palautetaa luotu blogi käyttäjätiedoilla terästettynä */
        const finalBlog = await Blog
            .findById(req.params.id)
            .populate('user')

        //res.status(200).json(updatedBlog);
        res.status(200).json(finalBlog);

    } catch (exeption) {
        next(exeption);
    }
});
module.exports = blogsRouter;