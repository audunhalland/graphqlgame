const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    currentRoom: Room!
    room(id: ID!): Room
  }

  type Room {
    description: String!
    objects: [GameObject]
  }

  type GameObject {
    type: ObjectType!
    description: String!
  }

  enum ObjectType {
    BUTTON
    KEY_PAIR
    ESCAPE_DOOR
    SIGN
    PASSWORD
    COMPUTER
  }
`

export default typeDefs;
