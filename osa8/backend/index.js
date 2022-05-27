require('dotenv').config()

const { ApolloServer, UserInputError, gql, AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')

const Author =  require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

/*
 * Muodostetaan yhteys tietokantaan
 */
const password = process.env.PASSWORD
const dbName = process.env.DB
const JWT_SECRET = process.env.JWT_SECRET
const GENERAL_PW = 'qwerty'

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
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }
 
  type Query {
    allAuthors: [Author]!
    allBooks(name: String, genre: String): [Book!]!
    authorCount: Int!
    bookCount(name: String): Int!
    me: User
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
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
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

        let filteredBooks = await Book.find(queryObj).populate('author')

        return filteredBooks

      },
      authorCount: async () => {

        const allTheAuthors = await Author.find({})
        return allTheAuthors.length

      },
      bookCount: async (root, args) => {

        const lkm = await getBookCount(args.name)
        return lkm

      },
      me: (root, args, context) => {
        return context.currentUser
      }
  },
  Author: {
    bookCount: async (root) => {

        const lkm = await getBookCount(root.name)
        return lkm
       
    }
  },
  Mutation: {
    addBook: async  (root, args, context) => {

      const currentUser = context.currentUser;

      if(!currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      const authorName = args.author;

      let addedBook;
      let authorId = null;

      try {
    
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

        addedBook = await book.save().then(b => b.populate('author'))

      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }


      return addedBook

    },
    editAuthor: async (root, args, context) => {

      
      const currentUser = context.currentUser;

      if(!currentUser) {
        throw new AuthenticationError("not authenticated")
      }
    
      const filter = { name: args.name }
      const update = { born: args.setBornTo }

      let doc;

      /*
       * Tietojen päivitys
       */
      try {
        doc = await Author.findOneAndUpdate(filter, update, {
          new: true
        });
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }


      return doc

    },
    createUser: async (root, args) => {

      const user = new User({...args})


      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        })
    }, 
    login: async (root, args) => {

      const user = await User.findOne({username: args.username})

      if( !user || args.password !== GENERAL_PW){
        throw new UserInputError("wrong credentials")
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }

      return {
        value: jwt.sign(userForToken, JWT_SECRET)
      }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    
    const auth = req ? req.headers.authorization : null
    if(auth && auth.toLowerCase().startsWith('bearer ')){

      const decodedToken = jwt.verify(
        auth.substring(7),
        JWT_SECRET
      )

      const currentUser = await User
        .findById(decodedToken.id)

      return {
        currentUser
      }
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})