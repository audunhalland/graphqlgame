const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    currentRoom: Room!
    roomNeighbours: [RoomNeighbour]!
  }

  type Room {
    room: RoomType!
    description: String!
    objects: [GameObject]
  }

  type GameObject {
    type: ObjectType!
    description: String!
  }

  type RoomNeighbour {
    direction: Direction!
    room: RoomType!
  }

  enum RoomType {
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
    goToRoom(room: RoomType!): ActionResponse!
    pushButton: ActionResponse!
  }

  type ActionResponse {
    success: Boolean!
    message: String
  }
`

export default typeDefs;
