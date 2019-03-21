const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    currentRoom: Room!
  }

  type Room {
    description: String!
    objects(
      first: Int,
      after: String,
    ): GameObjectConnection!
    corridors: [Corridor!]!
  }

  type GameObject {
    type: ObjectType!
    description: String!
    objects(
      first: Int,
      after: String,
    ): GameObjectConnection!
  }

  type GameObjectConnection {
    totalCount: Int!
    edges: [Edge]!
    pageInfo: PageInfo!
  }

  type Edge {
    node: GameObject!
    cursor: String!
  }

  type PageInfo {
    endCursor: String!
    hasNextPage: Boolean
  }

  type Corridor {
    room: Room!
    direction: Direction!
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
