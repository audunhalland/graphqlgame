import {
  Room, Direction, newGame, ObjectType, getRoomDescription, getRoomNeighbours, getRoomObjects, dispatchAction
} from './game/state';

let gameState = newGame();

const resolvers = {
  Query: {
    currentRoom: () => ({
      room: gameState.currentRoom,
      description: getRoomDescription(gameState, gameState.currentRoom),
      objects: getRoomObjects(gameState, gameState.currentRoom),
    }),
    roomNeighbours: () => getRoomNeighbours(gameState.currentRoom),
  },
  Mutation: {
    goToRoom: (_: any, { room }: { room: Room }) => {
      const { ok, message, newState } = dispatchAction(gameState, { type: "GOTO_ROOM", room });

      if (ok) {
        gameState = newState;
      }

      return {
        success: ok,
        message: message
      }
    }
  },
};

export default resolvers;
