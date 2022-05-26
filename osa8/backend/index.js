require('dotenv').config()

const { ApolloServer, UserInputError, gql } = require('apollo-server')

const mongoose = require('mongoose')

const Author =  require('./models/author')
const Book = require('./models/book')

/*
 * Muodostetaan yhteys tietokantaan
 */
const password = process.env.PASSWORD
const dbName = process.env.DB

const url = `mongodb+srv://fullstack_2020:${password}@cluster0-dkwjc.mongodb.net/${dbName}?retryWrites=true&w=majority`

console.log("...............................");
console.log("Yhdistetään: ", url)

/*
 * Selvitetään kirjojen määrä
 * - mikäli kirjailijan nimeä ei ole määritetty palautetaan kaikkien talletettujen kirjojen lkm
 * - mikäli nimi on määritetty, palautetaan ko. kirjailijan kirjojen lkm
 */
const getBookCount = async (name) => {

  let books;

  // - mikäli kirjailijaa ei ole määritelty, palautetaan kaikkien kirjojen määrä
  if(typeof name === 'undefined'){
    books = await Book.find({});
    return books.length
  }

  const author = await Author.findOne({name: name});

  // - mikäli kirjailijan tietoja ei löydy kannasta, palautetaan nolla
  if(!author) return 0;

  // - palautetaan kirjailijan kirjoittamien kirjojen määrä
  const authorBooks = await Book.find({author: author._id});
  return authorBooks.length;

}

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(res => {
        console.log("Yhteys muodostettu")
    })
    .catch(err => {
        console.log("Yhteyttä ei saatu muodostettua", err.message)
    })
    

/*
 * Skeema
 *
 * - Jokaisen GraphQL-sovelluksen ytimessä on skeema, joka määrittelee minkä muotoista dataa sovelluksessa vaihdetaan clientin ja palvelimen välil
 */
const typeDefs = gql`
  type Author {
    id: ID!
    name: String!
    bookCount: Int!
    born: Int
  }

  type Book  {
    title: String!
    published: Int!
    author: String!
    id: ID!
    genres: [String!]!
  }
 
  type Query {
    allAuthors: [Author]!
    allBooks(name: String, genre: String): [Book!]!
    authorCount: Int!
    bookCount(name: String): Int!
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
`

const resolvers = {
  Query: {
      allAuthors: async (root, args) => {
        return Author.find({})
      },
      allBooks: async (root, args) => {

        const genre = args.genre === null ? null : args.genre

        const authorName = args.name === null ? null : args.name
        let authorObj = null;
        let authorId = null;

        let queryObj = {}

        /*
         * Kirjailijatietojen selvittäminen
         */
        if(authorName) 
          authorObj = await Author.findOne({name: authorName})

        if(authorObj) 
          authorId = authorObj._id

        /*
         * Viimeistellään hakuobjekti
         */
        if(authorId)
          queryObj['author'] = authorId

        if(genre)
          queryObj['genres'] = genre

        let filteredBooks = await Book.find(queryObj)

        return filteredBooks

      },
      authorCount: async () => {

        const allTheAuthors = await Author.find({})
        return allTheAuthors.length

      },
      bookCount: async (root, args) => {

        const lkm = await getBookCount(args.name)
        return lkm

      }
  },
  Author: {
    bookCount: async (root) => {

        const lkm = await getBookCount(root.name)
        return lkm
       
    }
  },
  Mutation: {
    addBook: async  (root, args) => {

      const authorName = args.author;
      let authorId = null;
    
      /*
      * Kirjailijatietojen selvittäminen
      */
      authorObj = await Author.findOne({name: authorName})
    
      // - luodaan tarvittaessa uusi kirjailija
      if(!authorObj){
        let author = new Author({name: authorName})
        authorObj = await author.save();
      }
    
      authorId = authorObj._id

      /*
      * Luodaan ja talletetaan uusi kirja
      */
      let book = new Book({
        title: args.title,
        published: args.published,
        author: authorId,
        genres: args.genres
      })

      let res = await book.save()

      return res

    },
    editAuthor: async (root, args) => {
    
      const filter = { name: args.name }
      const update = { born: args.setBornTo }
    
      /*
      * tietojen päivitys
      */
      let doc = await Author.findOneAndUpdate(filter, update, {
        new: true
      });

      return doc

    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})