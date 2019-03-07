import express, * as Express from 'express';
import { ApolloServer, SchemaDirectiveVisitor } from 'apollo-server-express';
import { GraphQLField } from 'graphql';
import { createDataSources } from './serverContext';

import executableSchema from './executableSchema';

// TODO: Experiment; generated connection/pagination types?
class ConnectionDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: GraphQLField<any, any>) {
  }
}

const server = new ApolloServer({
  schema: executableSchema,
  context: ({ req } : { req: Express.Request }) => {
    const token = req.headers.authorization || '';
    return { token };
  }
});

const app = express();
server.applyMiddleware({ app });

const port = 4000;

app.listen({ port }, () => {
  console.log(`🚀 Server ready at port ${port}`);
});
