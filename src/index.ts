import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';

import typeDefs from './schema';
import resolvers from './resolvers';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
});

const app = express();
server.applyMiddleware({ app });

const port = process.env.PORT || 4000;

app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)
);
