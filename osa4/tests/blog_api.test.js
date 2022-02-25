const mongoose = require('mongoose');
const supertest = require('supertest');

const helper = require('./testHelper');

const app = require('../app');

const api = supertest(app);

const Blog = require('../models/blog');

describe('when there are initially some blogs saved', () => {

    /*
    * Asetetaan testikannan tila ennen jokaista testiä.
    * - tyhjennys, jonka jälkeen oletusaineisto sisään
    * - huom. jotta toimii Mongoosen 6.x versioissa ilman vieheilmoituksia, 
    *   lisätään testit käynnistävän käskyyn: option --forceExit
    */
    beforeEach(async () => {

        await Blog.deleteMany({});

        for(let blog of helper.initialBlogs){
            let blogObject = new Blog(blog);
            await blogObject.save();
        }
    });

    describe('data form and amounth match', () => {

        /*
        * 4.8: blogilistan testit, step 1
        * - Testaa, että sovellus palauttaa oikean määrän JSON-muotoisia blogeja.
        */
        test('blogs are returned as json', async () => {
            await api
                .get('/api/blogs')
                .expect(200)
                .expect('Content-Type',  /application\/json/)
        });

        test('number of blogs match', async () => {

            const response = await api.get('/api/blogs');
            expect(response.body).toHaveLength(helper.initialBlogs.length);
        });

    });

    describe('blog data matches criteria', () => {

        /*
        * 4.9*: blogilistan testit, step2
        * - Tee testi, joka varmistaa että palautettujen blogien identifioivan kentän tulee olla nimeltään id.
        * - Huom! Testaa vain, että id -niminen kenttä löytyy.... 
        */
        test('identifying field is named id', async () => {

            const addedBlog = await api
                .post('/api/blogs')
                .send({
                    title: "It is about time to change tires",
                    author: "I B Freely",
                    url: "http://flattires.com",
                    likes: 3,
                })
                .expect(201)
                .expect('Content-Type', /application\/json/);

            expect(addedBlog.body.id).toBeDefined();


        });
    });

    describe('adding a new blog', () => {

        /*
         * 4.10: blogilistan testit, step3
         * - Tee testi, joka varmistaa, että sovellukseen voi lisätä blogeja
         *   osoitteeseen /api/blogs tapahtuvalla HTTP POST -pyynnöllä. 
         */
        test('a valid blog can be added', async() => {

            const newBlog = {
                title: "It is about time to change tires",
                author: "I B Freely",
                url: "http://flattires.com",
                likes: 3,
            }
    
            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/);
    
            const response = await api.get('/api/blogs');
    
            const titles = response.body.map(r => r.title);
    
            expect(response.body).toHaveLength(helper.initialBlogs.length + 1);
            expect(titles).toContain(newBlog.title);
        })
    
        /* 
         * 4.11*: blogilistan testit, step4
         * - Tee testi, joka varmistaa, että jos kentälle likes ei anneta arvoa, asetetaan sen arvoksi 0.
         */
        test('likes is set to 0, if value is omitted', async() => {
    
            const withoutLikesValue = await api
                .post('/api/blogs')
                .send({
                    title: "It is about time to change tires",
                    author: "I B Freely",
                    url: "http://flattires.com"
                })
                .expect(201)
                .expect('Content-Type', /application\/json/);
    
            expect(withoutLikesValue.body.likes).toBe(0);
    
    
            const likesValuePresent = await api
                .post('/api/blogs')
                .send({
                    title: "Something strange in the neighbourhood",
                    author: "Ray Parker JR",
                    url: "http://ghostbusters.com",
                    likes: 9           
                })
                .expect(201)
                .expect('Content-Type', /application\/json/);
    
            expect(likesValuePresent.body.likes).toBe(9);
    
        });



        /*
        * 4.12*: blogilistan testit, step5
        * -  jos uusi blogi ei sisällä kenttiä title ja url, pyyntöön vastataan statuskoodilla 400 Bad Request
        */
        test('title and url fields are required', async () => {

            await api
                .post('/api/blogs')
                .send({
                    song: "where'd you get those peepers",
                    author: "Louis Armstrong",
                    url: "http://jazz.org"
                })
                .expect(400);

                await api
                .post('/api/blogs')
                .send({
                    title: "Who is the killer in W?",
                    author: "Zodiac",
                    homepage: "http://crime.info"
                })
                .expect(400);

                const response = await api.get('/api/blogs')

                expect(response.body).toHaveLength(helper.initialBlogs.length);

        });
    });

    describe('deleting a blog', () => {

        /*
         * 4.13 blogilistan laajennus, step1
         * - Toteuta sovellukseen mahdollisuus yksittäisen blogin poistoon.
         */
        test('succeeds with status code 204 if id is valid', async () => {

            const blogsAtStart = await helper.blogsInDb();
            const blogToDelete = blogsAtStart[0];

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .expect(204);

            const blogsAtEnd = await helper.blogsInDb();

            expect(blogsAtEnd).toHaveLength(
                helper.initialBlogs.length - 1
            );

            const titles = blogsAtEnd.map(r => r.title);
            expect(titles).not.toContain(blogToDelete.title);

        });

    });

    /*
     * 4.14* blogilistan laajennus, step2
     * - Toteuta sovellukseen mahdollisuus yksittäisen blogin muokkaamiseen.
     * - Toteuttaa ominaisuudelle myös testit.
     */
    describe('updating a blog', () => {

        test('succeeds with valid id and data', async() => {

            const blogsAtStart = await helper.blogsInDb();

            const blogToUpdate = blogsAtStart[0];
            const modifiedBlog = {
                title: "Fiilaten ja höyläten",
                author: "Jarkko Laine",
                url: "https://badding.com/",
                likes: 10          
            }

            const updatedBlog = await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .send(modifiedBlog)
                .expect(200)
                .expect('Content-Type', /application\/json/);

            expect(updatedBlog.body).toEqual({
                ...modifiedBlog,
                id: blogToUpdate.id
            });

        });

        test('fails if id is invalid', async () => {

            const invalidId = `${helper.nonExixtingId()}XXX`;

            const modifiedBlog = {
                title: "Fiilaten ja höyläten",
                author: "Jarkko Laine",
                url: "https://badding.com/",
                likes: 10          
            }

            const updatedBlog = await api
                .put(`/api/blogs/${invalidId}`)
                .send(modifiedBlog)
                .expect(400);
        });

        test('fails if likes value is not number', async () => {

            const blogsAtStart = await helper.blogsInDb();

            const blogToUpdate = blogsAtStart[0];

            await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .send({
                    titteli: "Fiilaten ja höyläten",
                    author: "Jarkko Laine",
                    url: "https://badding.com/",
                    likes: "Sikailija Sid"          
                })
                .expect(400);



        });


    });


});


/*
 * Lopputoimenpiteenä katkaistaan Mongoosen käyttämä tietokantayhteys.
 */
afterAll(() => {
    mongoose.connection.close();
});