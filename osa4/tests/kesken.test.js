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
         * 4.23*: blogilistan laajennus, step11
         * - Tee testi, joka varmistaa, että sovellukseen voi lisätä blogeja
         *   osoitteeseen /api/blogs tapahtuvalla HTTP POST -pyynnöllä. 
         */
        test('blog will not be added if token is missing', async() => {

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
        
        })
    });
    
});



/*
 * Lopputoimenpiteenä katkaistaan Mongoosen käyttämä tietokantayhteys.
 */
afterAll(() => {
    mongoose.connection.close();
});