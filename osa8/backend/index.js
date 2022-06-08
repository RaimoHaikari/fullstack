require('dotenv').config();

const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const { makeExecutableSchema } = require('@graphql-tools/schema');

const express = require('express');
const mongoose = require('mongoose');

const http = require('http');

const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const typeDefs = require('./schema');
const resolvers = require('./resolvers')

const Author =  require('./models/author');
const Book = require('./models/book');
const User = require('./models/user');

/*
 * Muodostetaan yhteys tietokantaan
 */
const password = process.env.PASSWORD;
const dbName = process.env.DB;
const GENERAL_PW = 'qwerty';

const url = `mongodb+srv://fullstack_2020:${password}@cluster0-dkwjc.mongodb.net/${dbName}?retryWrites=true&w=majority`;

console.log("...............................");
console.log("Yhdistetään: ", url);


mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(res => {
        console.log("Yhteys muodostettu")
    })
    .catch(err => {
        console.log("Yhteyttä ei saatu muodostettua", err.message)
    })

/*
 * palvelimen alustava funktio
 */
const start = async () => {

  const app = express();
  const httpServer = http.createServer(app);

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers
  });

  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe
    },
    {
      server: httpServer,
      path: ''
    }
  )

  const server = new ApolloServer({
    schema,
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

    },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close()
            }
          }
        }
      }
    ]
  });

  await server.start();

  server.applyMiddleware({
    app,
    path: '/'
  });

  const PORT = 4000;

  httpServer.listen(PORT, () => {
    console.log(`Server ready at ${PORT}`)
  });

}

start();