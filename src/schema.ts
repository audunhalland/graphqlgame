const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    currentRoom: Room!
  }

  type Room {
    description: String!
    objects: [GameObject]!
    neighbours: [RoomNeighbour!]!
  }

  type GameObject {
    type: ObjectType!
    description: String!
    objects: [GameObject]!
  }

  type RoomNeighbour {
    room: Room!
    direction: Direction!
  }

  enum RoomId {
    LIGHTSWITCH
    COMPUTER
    VERYDARK
    START
    PASSWORD
    WIRE
  }

  enum Direction {
    NORTH
    NORTH_EAST
    EAST
    EAST_SOUTH_EAST
    SOUTH_EAST
    SOUTH_SOUTH_EAST
    SOUTH
    SOUTH_SOUTH_WEST
    SOUTH_WEST
    WEST_SOUTH_WEST
    WEST
    NORTH_WEST
  }

  enum ObjectType {
    BUTTON
    KEY_PAIR
    ESCAPE_DOOR
    SIGN
    PASSWORD
    COMPUTER
  }

  type Mutation {
    move(direction: Direction!): ActionResponse!
    push(objectType: ObjectType): ActionResponse!
    unlock(objectType: ObjectType, key: String!): ActionResponse!
  }

  type ActionResponse {
    success: Boolean!
    message: String
  }
`

export default typeDefs;
