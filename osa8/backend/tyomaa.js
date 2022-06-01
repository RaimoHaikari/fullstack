require('dotenv').config()

const { ApolloServer, gql } = require('apollo-server')
const { graphql } = require('graphql')

const mongoose = require('mongoose')

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

let users = [
  {
    username: 'kiekkoniilo',
    favoriteGenre: 'ylamummo'
  },
  {
    username: 'nokinena',
    favoriteGenre: 'taikuus'
  },  
]


let authors = [
  {
    name: 'Robert Martin',
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    born: 1821
  },
  { 
    name: 'Joshua Kerievsky'
  },
  { 
    name: 'Sandi Metz'
  },
]


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

const Task = {
  ALUSTA_KIRJAILIJAT: 'ALUSTA_KIRJAILIJAT',
  ALUSTA_KIRJAT: 'ALUSTA_KIRJAT',
  ALUSTA_KAYTTAJAT: 'ALUSTA_KAYTTAJAT',
  JOTAIN_AIVAN_MUUTA: 'JOTAIN_AIVAN_MUUTA'
};

/*
 * Muodostetaan yhteys tietokantaan
 */
const password = process.env.PASSWORD
const dbName = process.env.DB

const url = `mongodb+srv://fullstack_2020:${password}@cluster0-dkwjc.mongodb.net/${dbName}?retryWrites=true&w=majority`

/*
 *
 */
const addAuthor = (args) => {

  return new Promise(

    function(resolve, reject) {

        const author = new Author({...args})
        let res = author.save();

        res
            .then(result => {
                resolve(res);
            })
            .catch(err =>  {
                reject(err)
                //reject(`- ${args.name} LISÄYS EPÄONNISTUI`)
            })

    })
}

/*
 *
 */
const addBook = async (args) => {

  const authorName = args.author

  let author = await Author.findOne({ name: authorName })
  if(!author) {
    author = await addAuthor({name: authorName})
  }

  const book = new Book({
    ...args,
    author: author._id
  })

  let res = await book.save();

  return res;

}


/*
 *
 */
const addUser = async (args) => {

  const user = new User({...args})
  let res = await user.save();
  return res

}

const addAuthors = async () => {

  await Promise.all(
    authors.map(a => addAuthor(a))
  ).then((values) => {
    console.log(values);
  });

  mongoose.connection.close()

}

const addBooks = async () => {

  
  await Promise.all(
    books.map(b => addBook(b))
  ).then((values) => {
    console.log(values);
  });


  mongoose.connection.close()

}

const addUsers = async () => {

  await Promise.all(
    users.map(b => addUser(b))
  ).then((values) => {
    console.log(values);
  });


  mongoose.connection.close()

}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}


/*
const filter = { name: 'Jean-Luc Picard' };
const update = { age: 59 };

// `doc` is the document _before_ `update` was applied
let doc = await Character.findOneAndUpdate(filter, update);
*/
const fooBar = async (args) => {

  const books = await Book.find({})

  const distinctGenres = books
    .map(book => book.genres)
    .flat()
    .filter((value, index, self) => self.indexOf(value) === index)

    /*
  const gArrays = books.map(book => book.genres);
  const unique = gArrays
    .flat()
    .filter(onlyUnique)
    */



  console.log(distinctGenres)


  mongoose.connection.close()

}



const doSomething =  (task) => {

  switch (task) {
      case Task.ALUSTA_KIRJAILIJAT:
          console.log("- alustetaan kirjailija luettelo");
          addAuthors();
          break;
      case Task.ALUSTA_KIRJAT:
          console.log("- alustetaan KIRJALUETTELO");
          addBooks();
          break;
      case Task.ALUSTA_KAYTTAJAT:
          console.log("- alustetaan KÄYTTÄJÄluettelo");
          addUsers();
          break;
      case Task.JOTAIN_AIVAN_MUUTA:
        console.log("- tehdään jotain aivan muuta");
        fooBar({
          "title": "Pimeyden tango",
          "author": "Reijo Mäki",
          "published": 1997,
          "genres": ["crime"]
        });
        break;
      default:
          console.log("Tehtävän määrittely unohtui")
    }
}

console.log("...............................");
console.log("Yhdistetään: ", url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(res => {
        console.log("Yhteys muodostettu")
        doSomething(Task.JOTAIN_AIVAN_MUUTA);
    })
    .catch(err => {
        console.log("Yhteyttä ei saatu muodostettua", err.message)
        //logger.error("Yhteyttä ei saatu muodostettua", err.message)
    })
    