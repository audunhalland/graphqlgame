import * as State from '../state';

describe('game state', () => {
  test('can complete the game', () => {
    let state = State.newGame();

    const door = State.getRoomObjects(state, state.currentRoom)[0];
    expect(door.type).toEqual(State.ObjectType.ESCAPE_DOOR);
    
    const sign = State.getSubObjects(state, door)[0];
    expect(sign.type).toEqual(State.ObjectType.SIGN);
    expect(sign.description).toContain(state.doorKey.public);

    state = State.dispatchAction(state, { type: 'GOTO_ROOM', room: State.Room.PASSWORD }).newState;
    expect(State.getRoomObjects(state, state.currentRoom)).toEqual([]);

    state = State.dispatchAction(state, { type: 'GOTO_ROOM', room: State.Room.VERYDARK }).newState;
    state = State.dispatchAction(state, { type: 'GOTO_ROOM', room: State.Room.LIGHTSWITCH }).newState;
    state = State.dispatchAction(state, { type: 'PUSH_BUTTON' }).newState;
    state = State.dispatchAction(state, { type: 'GOTO_ROOM', room: State.Room.PASSWORD }).newState;

    const password = State.getRoomObjects(state, state.currentRoom)[0];

    expect(password.type).toEqual(State.ObjectType.PASSWORD);
    expect(password.description).toContain(state.computerPassword);

    state = State.dispatchAction(state, { type: 'GOTO_ROOM', room: State.Room.VERYDARK }).newState;
    state = State.dispatchAction(state, { type: 'GOTO_ROOM', room: State.Room.COMPUTER }).newState;
    state = State.dispatchAction(state, { type: 'UNLOCK_COMPUTER', password: state.computerPassword }).newState;

    const computer = State.getRoomObjects(state, state.currentRoom)[0];
    const keys = State.getSubObjects(state, computer);
    const doorKey = keys.filter(key => key.description.indexOf(state.doorKey.public) >= 0)[0];
    const doorKeyPair = state.computerFiles.filter(keyPair => doorKey.description.indexOf(keyPair.private) >= 0)[0];

    state = State.dispatchAction(state, { type: 'GOTO_ROOM', room: State.Room.LIGHTSWITCH }).newState;
    state = State.dispatchAction(state, { type: 'GOTO_ROOM', room: State.Room.WIRE }).newState;
    state = State.dispatchAction(state, { type: 'GOTO_ROOM', room: State.Room.PASSWORD }).newState;
    state = State.dispatchAction(state, { type: 'GOTO_ROOM', room: State.Room.START }).newState;

    state = State.dispatchAction(state, { type: 'UNLOCK_DOOR', privateKey: doorKeyPair.private }).newState;

    expect(state.hasUnlockedDoor).toEqual(true);
  });

  test('cannot go directly to nonconnected room', () => {
    const state = State.newGame();

    const result = State.dispatchAction(state, { type: 'GOTO_ROOM', room: State.Room.LIGHTSWITCH });
    expect(result.ok).toBe(false);
  });
});
