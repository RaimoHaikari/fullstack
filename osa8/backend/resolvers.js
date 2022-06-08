require('dotenv').config();

const { UserInputError, AuthenticationError} = require('apollo-server');
const { PubSub } = require('graphql-subscriptions');

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const GENERAL_PW = 'qwerty';

const Author =  require('./models/author');
const Book = require('./models/book');
const User = require('./models/user');

const pubsub = new PubSub();


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
        distinctGenres: async () => {
  
          const books = await Book.find({})
  
          return books
            .map(book => book.genres)
            .flat()
            .filter((value, index, self) => self.indexOf(value) === index)
            
        },
        me: (root, args, context) => {
          return context.currentUser
        },
        myRecommendations: async (root, args, context) => {
  
          
          const currentUser = context.currentUser;
  
          if(!currentUser) {
            return []
          }
  
          const books = await Book.find({}).populate('author');
  
          let filteredBooks = books.filter(book => {
        
            let gInd = book.genres.indexOf(currentUser.favoriteGenre)
        
            return gInd !== -1
          })
  
          return filteredBooks
  
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

        pubsub.publish('BOOK_ADDED', { bookAdded: addedBook});
  
  
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
    },
    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
        }
    }
}

module.exports = resolvers