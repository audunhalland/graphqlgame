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
import { StateManager } from './StateManager';

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

const PaginateResults = ({ after, pageSize, results }: any) => {
  const cursorEnd = after + pageSize;

  return {
    cursor: cursorEnd,
    results: results.slice(after, cursorEnd),
    hasMore: cursorEnd < results.length,
  };
};

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
    objects: (parent: GameObject, { pageSize = 8, after = 0 }: any, { stateManager }: Context) => {
      console.log(getSubObjects(stateManager.getState(), parent))
      const { cursor, hasMore, results } = PaginateResults({
        after,
        pageSize,
        results: getSubObjects(stateManager.getState(), parent)
      });

      return {
        objects: results,
        cursor,
        hasMore,
      };
    }
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
