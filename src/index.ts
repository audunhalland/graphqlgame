import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cookieSession from 'cookie-session';

import { setupContext } from './context';
import typeDefs from './schema';
import resolvers from './resolvers';

const app = express();

app.set('trust proxy', 1);

app.use(cookieSession({
  name: 'session',
  keys: ['gjkfldjgfkdljgfkldjgfkld'],
  sameSite: true,
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
}));

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: setupContext,
  introspection: true,
  playground: true,
});

apolloServer.applyMiddleware({ app });

const port = process.env.PORT || 4000;

app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}${apolloServer.graphqlPath}`)
);
