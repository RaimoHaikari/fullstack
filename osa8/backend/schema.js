const { gql } = require('apollo-server');


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
    distinctGenres: [String]!
    me: User
    myRecommendations: [Book]!
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

  type Subscription {
    bookAdded: Book!
  }
`

module.exports = typeDefs;