import {
  Action, Room, newGame, getRoomDescription, getRoomNeighbours, getRoomObjects, dispatchAction, Direction, ObjectType,
} from './game/state';

let gameState = newGame();

console.log(gameState);

const handleActionDispatch = (action: Action) => {
  const { ok, message, newState } = dispatchAction(gameState, action);

  if (ok) {
    gameState = newState;
  }

  return {
    success: ok,
    message: message
  }
}

const resolvers = {
  Query: {
    currentRoom: () => ({
      room: gameState.currentRoom,
      description: getRoomDescription(gameState, gameState.currentRoom),
      objects: getRoomObjects(gameState, gameState.currentRoom),
    }),
    roomNeighbours: () => getRoomNeighbours(gameState, gameState.currentRoom),
  },
  Mutation: {
    move: (_: any, { direction }: { direction: Direction }) =>
      handleActionDispatch({ type: 'MOVE', direction }),
    push: (_: any, { objectType }: { objectType: ObjectType }) =>
      handleActionDispatch({ type: 'PUSH', objectType }),
    unlock: (_: any, { objectType, key }: { objectType: ObjectType, key: string }) =>
      handleActionDispatch({ type: 'UNLOCK', objectType, key }),
  },
};

export default resolvers;
