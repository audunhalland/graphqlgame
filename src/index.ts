import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import cookieSession from 'cookie-session';

import { StateManager } from './StateManager';
import typeDefs from './schema';
import resolvers from './resolvers';

const app = express();

app.use(cookieSession({
  name: 'graphyrinth',
  keys: ['gjkfldjgfkdljgfkldjgfkld'],
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
}));

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    stateManager: new StateManager(req.session)
  }),
  introspection: true,
  playground: true,
});

apolloServer.applyMiddleware({ app });

const port = process.env.PORT || 4000;

app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}${apolloServer.graphqlPath}`)
);
