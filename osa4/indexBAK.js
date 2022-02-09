const config = require('./utils/config');
const logger = require('./utils/logger');

const http = require('http');
const express = require('express');

const app = express();

/*
 * Jotta pääsisimme POST pyynnön mukana lähetettyyn dataan helposti käsiksi, 
 * tarvitsemme Expressin tarjoaman json-parserin apua. 
 */
app.use(express.json())

/*
 * Voimme sallia muista origineista tulevat pyynnöt käyttämällä Noden cors-middlewarea.
 */
const cors = require('cors');


const mongoose  =require('mongoose');

const blogSchema = mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
});

const Blog = mongoose.model('Blog', blogSchema);

const user = 'fullstack_2020';
const pw = 'NHnuTcAizlUzePwL';
const dbName = '2021BlogDB';


const mongoUrl = `mongodb+srv://${user}:${pw}@cluster0.dkwjc.mongodb.net/${dbName}?retryWrites=true&w=majority`;

console.log('connecting to:', mongoUrl);

mongoose.connect(mongoUrl)
    .then(res => {// eslint-disable-line no-unused-vars
        console.log('connected to MongoDB');
    })
    .catch((error) => {
        console.log('error connecting to MongoDB', error.message);
    });

app.use(cors());
app.use(express.json());


app.get('/api/blogs', (req, res) => {
    Blog
        .find({})
        .then(blogs => {
            res.json(blogs)
        })
})

app.post('/api/blogs', (req, res) => {

    const blog = new Blog(req.body);

    blog
        .save()
        .then(response => {
            res.status(201).json(response)
        });
        
})

const PORT = 3003;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
