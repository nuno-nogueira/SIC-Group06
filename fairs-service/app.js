const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const pino = require('pino');
require('dotenv').config();

// Logger
const logger = pino({
  transport: {
    target: "pino-pretty",
    options: { colorize: true }
  }
});

// IMPORTA typeDefs / resolvers
const typeDefs = require('./schema.js');
const resolvers = {};

const GRAPHQL_PORT = process.env.GRAPHQL_PORT || 4001;

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

(async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: GRAPHQL_PORT }
  });

  logger.info(`GraphQL Fairs Service running at: ${url}`);
})();







































// const express = require("express");
// const swaggerUi = require("swagger-ui-express"); 
// const swaggerFile = require("../users-service/swagger-output.json"); 
// const jwt = require('jsonwebtoken');
// const pino = require("pino");
// const { ApolloServer, gql } = require("apollo-server");
// require('dotenv').config();


// const app = express();

// const logger = pino({
//   transport: {
//     target: "pino-pretty",
//     options: {colorize: true}
//   }
// }) 


// const GRAPHQL_PORT = process.env.GRAPHQL_PORT || 4001;

// // Create Apollo Server
// const server = new ApolloServer({
// typeDefs,
// resolvers
// });
// // Start the server
// server.listen({ port: GRAPHQL_PORT }).then(({ url }) => {
// console.log(`GrahpQL Fairs Service server running in ${url}`);
// });