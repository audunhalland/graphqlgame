import {
  Action,
  Direction,
  GameObject,
  ObjectType,
  Room,
  RoomNeigbour,
  State,
  dispatchAction,
  getRoomDescription,
  getRoomNeighbours,
  getRoomObjects,
  getSubObjects,
  newGame,
} from './game/state';

const handleActionDispatch = (gameState: State, action: Action) => {
  const { ok, message, newState } = dispatchAction(gameState, action);

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
    currentRoom: (_: any, __: any, { gameState }: { gameState: State }) => ({
      id: gameState.currentRoom,
    }),
  },
  Room: {
    description: (parent: RoomObject, _: any, { gameState }: { gameState: State }) =>
      getRoomDescription(gameState, parent.id),
    objects: (parent: RoomObject, _: any, { gameState }: { gameState: State }) =>
      getRoomObjects(gameState, parent.id),
    neighbours: (parent: RoomObject, _: any, { gameState }: { gameState: State }) =>
      getRoomNeighbours(gameState, parent.id)
  },
  GameObject: {
    objects: (parent: GameObject, _: any, { gameState }: { gameState: State }) =>
      getSubObjects(gameState, parent),
  },
  RoomNeighbour: {
    room: (parent: RoomNeigbour) => ({
      id: parent.room,
    }),
  },
  Mutation: {
    move: (_: any, { direction }: { direction: Direction }, { gameState }: { gameState: State }) =>
      handleActionDispatch(gameState, { type: 'MOVE', direction }),
    push: (_: any, { objectType }: { objectType: ObjectType }, { gameState }: { gameState: State }) =>
      handleActionDispatch(gameState, { type: 'PUSH', objectType }),
    unlock: (_: any, { objectType, key }: { objectType: ObjectType, key: string }, { gameState }: { gameState: State }) =>
      handleActionDispatch(gameState, { type: 'UNLOCK', objectType, key }),
  },
};

export default resolvers;
