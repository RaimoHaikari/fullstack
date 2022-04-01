const mongoose = require('mongoose');
const supertest = require('supertest');

const bcrypt = require('bcrypt');

const helper = require('./testHelper');

const app = require('../app');

const api = supertest(app);

const Blog = require('../models/blog');
const User = require('../models/user');

const getToken = async (user = 'admin', pw = 'salainen') => {

    const loggedUser = await api
    .post('/api/login')
        .send({
            username: user,
            password: pw
        });

    const token = loggedUser.body.token;

    return token;
}


describe('when there are initially some blogs saved', () => {

    /*
    * Asetetaan testikannan tila ennen jokaista testiä.
    * - tyhjennys, jonka jälkeen oletusaineisto sisään
    * - huom. jotta toimii Mongoosen 6.x versioissa ilman vieheilmoituksia, 
    *   lisätään testit käynnistävän käskyyn: option --forceExit
    */
    beforeEach(async () => {

        await User.deleteMany({});

        const passwordHash = await bcrypt.hash('salainen', 10);
        const user = new User({username: 'admin', passwordHash});
        await user.save();
        const id = user._id;
        
        await Blog.deleteMany({});
        for(let blog of helper.initialBlogs){
            let blogObject = new Blog({
                ...blog,
                user: id
            });
            await blogObject.save();
        }
    
    });

    /*
    * OK: 04.03.2022
    */
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


    /*
     * OK: 04.03.2022
     */
    describe('blog data matches criteria', () => {

        /*
        * 4.9*: blogilistan testit, step2
        * - Tee testi, joka varmistaa että palautettujen blogien identifioivan kentän tulee olla nimeltään id.
        * - Huom! Testaa vain, että id -niminen kenttä löytyy.... 
        */
        test('identifying field is named id', async () => {

            const loggedUser = await api
                .post('/api/login')
                .send({
                    username: 'admin',
                    password:'salainen'
                });

            const token = await getToken();

            const addedBlog = await api
                .post('/api/blogs')
                .send({
                    title: "It is about time to change tires",
                    author: "I B Freely",
                    url: "http://flattires.com",
                    likes: 3,
                })
                .set({ Authorization: `bearer ${token}` })
                .expect(201)
                .expect('Content-Type', /application\/json/);

            expect(addedBlog.body.id).toBeDefined();

        })

    });


    
    /*
     * OK: 04.03.2022
     */
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

            const token = await getToken();
    
            await api
                .post('/api/blogs')
                .send(newBlog)
                .set({ Authorization: `bearer ${token}` })
                .expect(201)
                .expect('Content-Type', /application\/json/);
    
            const response = await api.get('/api/blogs');
    
            const titles = response.body.map(r => r.title);
    
            expect(response.body).toHaveLength(helper.initialBlogs.length + 1);
            expect(titles).toContain(newBlog.title);
        })

        test('fails it user data is not ok', async() => {

            const newBlog = {
                title: "It is about time to change tires",
                author: "I B Freely",
                url: "http://flattires.com",
                likes: 3,
            }
    
            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(401)
                .expect('Content-Type', /application\/json/);
    
            const response = await api.get('/api/blogs');
    
            const titles = response.body.map(r => r.title);
    
            expect(response.body).toHaveLength(helper.initialBlogs.length);
            expect(titles).not.toContain(newBlog.title);

        } )
    
        /* 
         * 4.11*: blogilistan testit, step4
         * - Tee testi, joka varmistaa, että jos kentälle likes ei anneta arvoa, asetetaan sen arvoksi 0.
         */
        test('likes is set to 0, if value is omitted', async() => {

            const token = await getToken();
    
            const withoutLikesValue = await api
                .post('/api/blogs')
                .send({
                    title: "It is about time to change tires",
                    author: "I B Freely",
                    url: "http://flattires.com"
                })
                .set({ Authorization: `bearer ${token}` })
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
                .set({ Authorization: `bearer ${token}` })
                .expect(201)
                .expect('Content-Type', /application\/json/);
    
            expect(likesValuePresent.body.likes).toBe(9);
    
        });



        /*
        * 4.12*: blogilistan testit, step5
        * -  jos uusi blogi ei sisällä kenttiä title ja url, pyyntöön vastataan statuskoodilla 400 Bad Request
        */
        test('title and url fields are required', async () => {

            const token = await getToken();

            await api
                .post('/api/blogs')
                .send({
                    song: "where'd you get those peepers",
                    author: "Louis Armstrong",
                    url: "http://jazz.org"
                })
                .set({ Authorization: `bearer ${token}` })
                .expect(400);

                await api
                .post('/api/blogs')
                .send({
                    title: "Who is the killer in W?",
                    author: "Zodiac",
                    homepage: "http://crime.info"
                })
                .set({ Authorization: `bearer ${token}` })
                .expect(400);

                const response = await api.get('/api/blogs')

                expect(response.body).toHaveLength(helper.initialBlogs.length);

        });
    });


    /*
     * OK: 05.03.2022
     */
    describe('deleting a blog', () => {

        /*
         * 4.13 blogilistan laajennus, step1
         * - Toteuta sovellukseen mahdollisuus yksittäisen blogin poistoon.
         * 
         * 4.21*: blogilistan laajennus, step9
         * - Muuta blogin poistavaa operaatiota siten, että poisto onnistuu ainoastaan
         *   jos poisto-operaation tekijä (eli se kenen token on pyynnön mukana) on sama 
         *   kuin blogin lisääjä.
         */


        test('logged owner is able to delete blog', async () => {


            const blogsAtStart = await helper.blogsInDb();
            const blogToDelete = blogsAtStart[0];

            const token = await getToken();

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .set({ Authorization: `bearer ${token}` })
                .expect(204);

            const blogsAtEnd = await helper.blogsInDb();

            expect(blogsAtEnd).toHaveLength(
                helper.initialBlogs.length - 1
            );

            const titles = blogsAtEnd.map(r => r.title);
            expect(titles).not.toContain(blogToDelete.title);

        });
        
    
        test('only creator can delete blog', async () => {

            // - luodaan uusi käyttäjä
            const passwordHash = await bcrypt.hash('nenialas', 10);
            const resu = new User({username: 'nimda', passwordHash});
            await resu.save();

            // - uusi käyttäjä kirjautuu sisään
            const token = await getToken('nimda', 'nenialas');

            // - valitaan poistettavaksi haluttu blogi
            const blogsAtStart = await helper.blogsInDb();
            const blogToDelete = blogsAtStart[0];

            // - yritetään poistaa em. blogi
            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .set({ Authorization: `bearer ${token}` })
                .expect(401);

            
            // - onko lukumäärä ennallaan?
            const blogsAtEnd = await helper.blogsInDb();

            expect(blogsAtEnd).toHaveLength(
                helper.initialBlogs.length
            );
            

        });
        

    });
    

    /*
     * OK 6.3.2022
     *
     * 4.14* blogilistan laajennus, step2
     * - Toteuta sovellukseen mahdollisuus yksittäisen blogin muokkaamiseen.
     * - Toteuttaa ominaisuudelle myös testit.
     */
    describe('updating a blog', () => {

        
        test('creator can update with valid id and data', async() => {

            const blogsAtStart = await helper.blogsInDb();

            const blogToUpdate = blogsAtStart[0];
            const modifiedBlog = {
                title: "Fiilaten ja höyläten",
                author: "Jarkko Laine",
                url: "https://badding.com/",
                likes: 10          
            };

            const token = await getToken();

            const updatedBlog = await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .send(modifiedBlog)
                .set({ Authorization: `bearer ${token}` })
                .expect(200)
                .expect('Content-Type', /application\/json/);

            // Tiputetaan vertailusta dokumentin omistajan id
            delete updatedBlog.body.user;

            expect(updatedBlog.body).toEqual({
                ...modifiedBlog,
                id: blogToUpdate.id,
            });

        });

        test(`'someone else' can like the blog, but can't update anything else`, async () => {
    
            // - luodaan uusi käyttäjä
            const passwordHash = await bcrypt.hash('nenialas', 10);
            const resu = new User({username: 'nimda', passwordHash});
            await resu.save();

            // - uusi käyttäjä kirjautuu sisään
            const token = await getToken('nimda', 'nenialas');   

            // - valitaan päivitettävä blogitietue
            const blogsAtStart = await helper.blogsInDb();

            /*
            * 1) tykkäys pitää onnistua, kun mihinkään muuhun ei ole koskettu
            */
            const blogToUpdate = blogsAtStart[0];

            const likedBlog = {
                ...blogToUpdate,
                likes: blogToUpdate.likes + 1     
            };

            await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .send(likedBlog)
                .set({ Authorization: `bearer ${token}` })
                .expect(200)
                .expect('Content-Type', /application\/json/);


            /*
            * 2) Jos yritetään muuttaa kaikkea muutakin, niin ainoastaan liken osalta
            *    muutos menee läpi
            */
            const updatedBlog = await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .send({
                    title: "Fiilaten ja höyläten",
                    author: "Jarkko Laine",
                    url: "https://badding.com/",
                    likes: 10          
                })
                .set({ Authorization: `bearer ${token}` })
                .expect(200)
                .expect('Content-Type', /application\/json/);

            /*
            * Vertaillaan päivitettyn blogin sisältöä alkuperäiseen
            * - likes pitää olla päivittynyt KAKSI kertaa
            * - tiputetaan omistajatieto vertailusta
            */

            const _updatedBlog = {
                ...(delete updatedBlog.body.user && updatedBlog.body)
            }

            const _orginalBlogLiked2Times = {
                ...(delete blogToUpdate.user && blogToUpdate),
                likes: blogToUpdate.likes + 2
            }

            expect(_updatedBlog).toEqual(_orginalBlogLiked2Times);

            /*
            * 3) Muuten kuin liken osalta muokattu dokumentti
            */
            
            const modifiedBlog = {
                title: "Fiilaten ja höyläten",
                author: "Jarkko Laine",
                url: "https://badding.com/",
            };

            await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .send(modifiedBlog)
                .set({ Authorization: `bearer ${token}` })
                .expect(401)
                .expect('Content-Type', /application\/json/);
        });
        
        
        test('fails if id is invalid', async () => {

            const invalidId = `${helper.nonExixtingId()}`;

            const modifiedBlog = {
                title: "Fiilaten ja höyläten",
                author: "Jarkko Laine",
                url: "https://badding.com/",
                likes: 10          
            }

            const token = await getToken();

            const updatedBlog = await api
                .put(`/api/blogs/${invalidId}`)
                .send(modifiedBlog)
                .set({ Authorization: `bearer ${token}` })
                .expect(400);
        });

        
        test('fails if likes value is not number', async () => {

            const blogsAtStart = await helper.blogsInDb();

            const blogToUpdate = blogsAtStart[0];

            const token = await getToken();

            await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .send({
                    titteli: "Fiilaten ja höyläten",
                    author: "Jarkko Laine",
                    url: "https://badding.com/",
                    likes: "Sikailija Sid"          
                })
                .set({ Authorization: `bearer ${token}` })
                .expect(400);

        });
        
    });

});


describe('when there is initially one user at db', () => {

    beforeEach(async () => {

        await User.deleteMany({});

        const passwordHash = await bcrypt.hash('salainen', 10);
        const user = new User({username: 'admin', passwordHash});

        await user.save();
    });

    test('creation succeeds with a fresh username', async () => {

        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'tumppi',
            name: 'Tuomo Turskanpää',
            password: 'maitipuoli'
        };

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

        const usernames = usersAtEnd.map(u => u.username);
        expect(usernames).toContain(newUser.username);
    });

    test('creation fails with proper statuscode and message if username is alredy in use', async () => {
        
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'admin',
            name: 'Sirpa Silakka',
            password: 'abba'
        };    
        
        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        expect(result.body.error).toContain('username must be unique');

    });

    test('username is required and has to have atleast three characters', async () => {

        const usersAtStart = await helper.usersInDb();
        
        const resultA = await api
            .post('/api/users')
            .send({
                username: 'u2',
                name: 'Yeah Yeah',
                password: 'bono'
            })
            .expect(400)
            .expect('Content-Type', /application\/json/);

        expect(resultA.body.error.toLowerCase()).toContain('is shorter than the minimum allowed length');

        const resultB = await api
            .post('/api/users')
            .send({
                usernamePP: 'uTwo',
                name: 'Rock Rock Rock',
                passwoord: 'u2OOO'
            })
            .expect(400)
            .expect('Content-Type', /application\/json/);
    });

    test('password is required and has to have atleast three characters', async () => {

        const usersAtStart = await helper.usersInDb();

        const resultA = await api
            .post('/api/users')
            .send({
                username: 'uTwo',
                name: 'Rock Rock Rock',
                password: 'u2'
            })
            .expect(400)
            .expect('Content-Type', /application\/json/);

        expect(resultA.body.error).toContain('Password is shorter than the minimum allowed length (3)');

        const resultB = await api
            .post('/api/users')
            .send({
                username: 'uTwo',
                name: 'Rock Rock Rock',
                passwoordi: 'u2OOO'
            })
            .expect(400)
            .expect('Content-Type', /application\/json/);

        expect(resultB.body.error).toContain('Password is required');
    });
});

/*
 * Lopputoimenpiteenä katkaistaan Mongoosen käyttämä tietokantayhteys.
 */
afterAll(() => {
    mongoose.connection.close();
});