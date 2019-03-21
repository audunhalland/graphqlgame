const base64 = require('base-64');

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

const SELECTION_MAX_SIZE = 8;

const base64Encode = (data: string) =>
  base64.encode(data);

const base64Decode = (data: string) =>
  base64.decode(data);

const handleActionDispatch = (stateManager: StateManager, action: Action) => {
  const { ok, message, newState } = dispatchAction(stateManager.getState(), action);

  stateManager.updateState(newState);

  return {
    success: ok,
    message,
    newState,
  }
}

const PaginateResults = ({ after, first, results }: any) => {
  const selectionSize = first > SELECTION_MAX_SIZE ? SELECTION_MAX_SIZE : first;
  const cursorStart = parseInt(base64Decode(after), 10);
  const endCursor = cursorStart + parseInt(selectionSize, 10);

  return {
    totalCount: results.length,
    edges: results.slice(cursorStart, endCursor).map((result: GameObject, index: number) => ({
      node: result,
      cursor: base64Encode((cursorStart + index).toString()),
    })),
    pageInfo: {
      endCursor: base64Encode(endCursor.toString()),
      hasNextPage: endCursor < results.length,
    },
  };
};

interface RoomObject {
  id: Room;
  description: string;
  objects: GameObject[];
  corridors: RoomNeigbour[];
}

interface PageParams {
  after: string;
  first: number;
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
    objects: (
      parent: RoomObject,
      {
        first = SELECTION_MAX_SIZE,
        after = base64Encode('0')
      }: PageParams,
      { stateManager }: Context
    ) =>
      PaginateResults({
        after,
        first,
        results: getRoomObjects(stateManager.getState(), parent.id)
      }),
    corridors: (parent: RoomObject, _: any, { stateManager }: Context) =>
      getRoomNeighbours(stateManager.getState(), parent.id)
  },
  GameObject: {
    objects: (
      parent: GameObject,
      {
        first = SELECTION_MAX_SIZE,
        after = base64Encode('0')
      }: PageParams,
      { stateManager }: Context
    ) => (
        PaginateResults({
          after,
          first,
          results: getSubObjects(stateManager.getState(), parent)
        })
      ),
  },
  Corridor: {
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
