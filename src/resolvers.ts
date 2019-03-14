import {
  Room, Direction, newGame, ObjectType, getRoomDescription, getRoomNeighbours, getRoomObjects
} from './game/state';

const gameState = newGame();

const resolvers = {
  Query: {
    currentRoom: () => ({
      room: gameState.currentRoom,
      description: getRoomDescription(gameState, gameState.currentRoom),
      objects: getRoomObjects(gameState, gameState.currentRoom),
    }),
    roomNeighbours: () => getRoomNeighbours(gameState.currentRoom),
  },
};

export default resolvers;
