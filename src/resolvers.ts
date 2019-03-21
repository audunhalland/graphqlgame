const base64 = require('base-64');

import {
  Action,
  Direction,
  GameObject,
  ObjectType,
  Room,
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

const PaginateResults = ({
  after = base64Encode('0'),
  first = SELECTION_MAX_SIZE,
  results
}: any) => {
  const selectionSize = first > SELECTION_MAX_SIZE ? SELECTION_MAX_SIZE : first;
  const cursorStart = parseInt(base64Decode(after), 10);
  const endCursor = cursorStart + parseInt(selectionSize, 10);

  return {
    totalCount: results.length,
    edges: results.slice(cursorStart, endCursor).map((result: GameObject, index: number) => ({
      ...result,
      cursor: base64Encode((cursorStart + index).toString()),
    })),
    pageInfo: {
      endCursor: base64Encode(endCursor.toString()),
      hasNextPage: endCursor < results.length,
    },
  };
};

interface PageParams {
  after: string;
  first: number;
}

const resolvers = {
  Query: {
    currentRoom: (_: any, __: any, { stateManager }: Context) =>
      stateManager.getState().currentRoom,
  },
  Room: {
    description: (parent: Room, _: any, { stateManager }: Context) => (
      getRoomDescription(stateManager.getState(), parent)
    ),
    objects: (
      parent: Room, { first, after }: PageParams, { stateManager }: Context
    ) =>
      PaginateResults({
        after,
        first,
        results: getRoomObjects(stateManager.getState(), parent).map(gameObject => ({
          relation: gameObject.parentRelation,
          node: gameObject,
        })),
      }),
    corridors: (
      parent: Room, { first, after }: PageParams, { stateManager }: Context
    ) =>
      PaginateResults({
        after,
        first,
        results: getRoomNeighbours(stateManager.getState(), parent).map(({ direction, room }) => {
          const hasVisited = stateManager.getState().visitedRooms[room];
          return {
            direction,
            node: hasVisited ? room : null,
            relation: hasVisited
              ? 'A dark, creepy corridor leading from the room into a previously visited room.'
              : 'A dark, creepy corridor leading from the room into the unknown.'
          };
        }),
      }),
  },
  GameObject: {
    objects: (
      parent: GameObject, { first, after }: PageParams, { stateManager }: Context
    ) => (
        PaginateResults({
          after,
          first,
          results: getSubObjects(stateManager.getState(), parent).map(gameObject => ({
            relation: gameObject.parentRelation,
            node: gameObject,
          })),
        })
      ),
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
