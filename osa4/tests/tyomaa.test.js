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


});



/*
 * Lopputoimenpiteenä katkaistaan Mongoosen käyttämä tietokantayhteys.
 */
afterAll(() => {
    mongoose.connection.close();
});