import {
  Action, Room, newGame, getRoomDescription, getRoomNeighbours, getRoomObjects, dispatchAction
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
    roomNeighbours: () => getRoomNeighbours(gameState.currentRoom),
  },
  Mutation: {
    goToRoom: (_: any, { room }: { room: Room }) =>
      handleActionDispatch({ type: 'GOTO_ROOM', room }),
    pushButton: () =>
      handleActionDispatch({ type: 'PUSH_BUTTON' }),
    unlockComputer: (_: any, { password }: { password: string }) =>
      handleActionDispatch({ type: 'UNLOCK_COMPUTER', password }),
  },
};

export default resolvers;
