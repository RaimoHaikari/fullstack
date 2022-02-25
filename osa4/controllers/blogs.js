const blogsRouter = require('express').Router();
const { response, request } = require('../app');
const Blog = require('../models/blog');

blogsRouter.get('/', (req, res) => {
    Blog
        .find({})
        .then(blogs => {
            res.json(blogs)
        })
});

/*
 * 4.10: blogilistan testit, step3
 * - refaktoroi operaatio käyttämään promisejen sijaan async/awaitia
 */
blogsRouter.post('/', async (req, res, next) => {

    try {

        const body = req.body;

        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes
        });
    
        const savedBlog = await blog.save();
        res.status(201).json(savedBlog);

    } catch (exeption) {
        next(exeption);
    }

});

/*
 * 4.13 blogilistan laajennus, step1
 * - Toteuta sovellukseen mahdollisuus yksittäisen blogin poistoon.
 */
blogsRouter.delete('/:id', async (req, res, next) => {

    try {
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