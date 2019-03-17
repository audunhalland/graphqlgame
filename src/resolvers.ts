import {
  Action,
  Direction,
  GameObject,
  ObjectType,
  Room,
  RoomNeigbour,
  dispatchAction,
  getRoomDescription,
  getRoomNeighbours,
  getRoomObjects,
  getSubObjects,
  newGame,
} from './game/state';

let gameState = newGame();

const handleActionDispatch = (action: Action) => {
  const { ok, message, newState } = dispatchAction(gameState, action);

  if (ok) {
    gameState = newState;
    console.log("Gamestate: ", gameState);
  }
  return {
    success: ok,
    message,
    newState,
  }
}

interface RoomObject {
  id: Room;
  description: string;
  objects: GameObject[];
  neighbours: RoomNeigbour[];
}

const resolvers = {
  Query: {
    currentRoom: (_: any) => ({
      id: gameState.currentRoom,
    }),
  },
  Room: {
    description: (parent: RoomObject) =>
      getRoomDescription(gameState, parent.id),
    objects: (parent: RoomObject) =>
      getRoomObjects(gameState, parent.id),
    neighbours: (parent: any) =>
      getRoomNeighbours(gameState, parent.id)
  },
  GameObject: {
    objects: (parent: GameObject) =>
      getSubObjects(gameState, parent),
  },
  RoomNeighbour: {
    room: (parent: RoomNeigbour) => ({
      id: parent.room,
    }),
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
