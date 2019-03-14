const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    currentRoom: Room!
  }

  type Room {
    description: String!
    objects: [GameObject]
  }

  type GameObject {
    description: String!
  }
`

export default typeDefs;
