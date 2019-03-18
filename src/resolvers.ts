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
} from './game/state';

import { Context } from './context';
import { StateManager} from './StateManager';

const handleActionDispatch = (stateManager: StateManager, action: Action) => {
  const { ok, message, newState } = dispatchAction(stateManager.getState(), action);

  stateManager.updateState(newState);

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
    currentRoom: (_: any, __: any, { stateManager }: Context) => ({
      id: stateManager.getState().currentRoom,
    }),
  },
  Room: {
    description: (parent: RoomObject, _: any, { stateManager }: Context) =>
      getRoomDescription(stateManager.getState(), parent.id),
    objects: (parent: RoomObject, _: any, { stateManager }: Context) =>
      getRoomObjects(stateManager.getState(), parent.id),
    neighbours: (parent: RoomObject, _: any, { stateManager }: Context) =>
      getRoomNeighbours(stateManager.getState(), parent.id)
  },
  GameObject: {
    objects: (parent: GameObject, _: any, { stateManager }: Context) =>
      getSubObjects(stateManager.getState(), parent),
  },
  RoomNeighbour: {
    room: (parent: RoomNeigbour) => ({
      id: parent.room,
    }),
  },
  Mutation: {
    move: (
      _: any,
      { direction }: { direction: Direction },
      { stateManager }: Context
    ) => handleActionDispatch(stateManager, { type: 'MOVE', direction }),
    push: (
      _: any,
      { objectType }: { objectType: ObjectType },
      { stateManager }: Context
    ) =>
      handleActionDispatch(stateManager, { type: 'PUSH', objectType }),
    unlock: (
      _: any,
      { objectType, key }: { objectType: ObjectType, key: string },
      { stateManager }: Context
    ) => handleActionDispatch(stateManager, { type: 'UNLOCK', objectType, key }),
  },
};

export default resolvers;
