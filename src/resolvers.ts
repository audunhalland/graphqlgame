import { State, Room, newGame, getRoomDescription, getRoomObjects } from './game/state';

const gameState = newGame();

const getRoom = (state: State, id: Room) => ({
  description: getRoomDescription(state, id),
  objects: getRoomObjects(state, id),
});

const resolvers = {
  Query: {
    currentRoom: () =>
      getRoom(gameState, gameState.currentRoom),
    room: (_: any, { id }: { id: Room }) =>
      getRoom(gameState, id),
  },
};

export default resolvers;
