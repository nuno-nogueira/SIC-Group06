import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import 'dotenv/config'; 

// IMPORT typeDefs / resolvers
import typeDefs from './src/schema.js'; 
import resolvers from './src/resolvers.js';

// Logger
import logger from './logger.js';




const GRAPHQL_PORT = process.env.GRAPHQL_PORT ;

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});


  const { url } = await startStandaloneServer(server, {
    listen: { port: GRAPHQL_PORT }
  });

  logger.info(`GraphQL Markets Service running at: ${url}`);