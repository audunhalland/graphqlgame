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
    corridors(
      first: Int,
      after: String,
    ): CorridorConnection!
  }

  type GameObjectConnection {
    totalCount: Int!
    edges: [GameObjectEdge]!
    pageInfo: PageInfo!
  }

  type GameObjectEdge {
    relation: String!
    node: GameObject!
    cursor: String!
  }

  type GameObject {
    type: ObjectType!
    description: String!
    objects(
      first: Int,
      after: String,
    ): GameObjectConnection!
  }

  type CorridorConnection {
    totalCount: Int!
    edges: [CorridorEdge]!
    pageInfo: PageInfo!
  }

  type CorridorEdge {
    cursor: String!
    direction: Direction!
    relation: String!
    node: Room
  }

  type PageInfo {
    endCursor: String!
    hasNextPage: Boolean
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
