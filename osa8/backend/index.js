const { ApolloServer, gql } = require('apollo-server')
const { v1: uuid } = require('uuid')

let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  { 
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  { 
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
*/

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'The Demon ',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]


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
    genres: [String]!
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
      allAuthors: () => authors,
      allBooks: (root, args) => {

        const genre = args.genre === null ? null : args.genre
        const authorName = args.name === null ? null : args.name

        const genreFiltered = books.filter(book => {

          if(!genre)
            return true
  
          let x = book.genres.filter(b => b === genre);
          return x.length > 0;

        })

        const authorFiltered = books.filter(book => {

          if(!authorName)
            return true;
    
          return book.author === authorName
        })

        const intersection = genreFiltered.filter(book => {

          let b = authorFiltered.filter(a => a.id === book.id)
      
            return b.length > 0
        })

        return intersection

      },
      authorCount: () => authors.length,
      bookCount: (root, args) => {

        if(!args.name){
            return books.length
        }

        const filtered = books.filter(book => book.author === args.name)

        return filtered.length
      }
  },
  Author: {
    bookCount: (root) => {
        const filteredBooks = books.filter(book => book.author === root.name)
        return filteredBooks.length
    }
  },
  Mutation: {
    addBook: (root, args) => {
      const authorName = args.author;
      const authorBookAcount = authors.filter(a => a.name === authorName )

      const newBook = { ...args, id: uuid()}
      books = books.concat(newBook)

      console.log("in Mutation: addBook")
      console.log({...args})

      // Päivitetään tarvittaessa kirjailijaluetteloa
      if(authorBookAcount.length === 0){
        authors = authors.concat({
          name: authorName,
          id: uuid()
        })
      }

      return newBook

    },
    editAuthor: (root, args) => {

      const authorData = authors.filter(author => author.name === args.name)

      if(authorData.length !== 1){
        return null
      }

      const updatedAuthor = {
        ...authorData[0],
        born: args.setBornTo
      }

      authors = authors.map(a => {

        if(a.name === args.name)
          return updatedAuthor

        return a
      })

      return updatedAuthor

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