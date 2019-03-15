import * as State from '../state';

const verify = (result: State.ActionResult): State.State => {
  if (!result.ok) {
    console.log('NOT OK: ', result.message);
  }
  expect(result.ok).toBe(true);
  return result.newState;
};

describe('game state', () => {
  test('can complete the game', () => {
    let state = State.newGame();

    const door = State.getRoomObjects(state, state.currentRoom)[0];
    expect(door.type).toEqual(State.ObjectType.ESCAPE_DOOR);

    const sign = State.getSubObjects(state, door)[0];
    expect(sign.type).toEqual(State.ObjectType.SIGN);
    expect(sign.description).toContain(State.getDoorPublicKey(state));

    state = verify(State.dispatchAction(state, { type: 'MOVE', direction: State.Direction.NORTH_WEST }));
    expect(State.getRoomObjects(state, state.currentRoom)).toEqual([]);

    state = verify(State.dispatchAction(state, { type: 'MOVE', direction: State.Direction.EAST }));
    state = verify(State.dispatchAction(state, { type: 'MOVE', direction: State.Direction.NORTH_WEST }));
    state = verify(State.dispatchAction(state, { type: 'PUSH_BUTTON' }));
    state = verify(State.dispatchAction(state, { type: 'MOVE', direction: State.Direction.SOUTH_SOUTH_WEST }));

    const password = State.getRoomObjects(state, state.currentRoom)[0];

    expect(password.type).toEqual(State.ObjectType.PASSWORD);
    expect(password.description).toContain(State.getComputerPassword(state));

    state = verify(State.dispatchAction(state, { type: 'MOVE', direction: State.Direction.EAST }));
    state = verify(State.dispatchAction(state, { type: 'MOVE', direction: State.Direction.NORTH }));
    state = verify(State.dispatchAction(state, { type: 'UNLOCK_COMPUTER', password: State.getComputerPassword(state) }));

    const computer = State.getRoomObjects(state, state.currentRoom)[0];
    const keys = State.getSubObjects(state, computer);
    expect(keys).toHaveLength(State.NUMBER_OF_COMPUTER_FILES);

    const doorPublicKeys = keys.filter(key => key.description.includes(State.getDoorPublicKey(state)));
    expect(doorPublicKeys).toHaveLength(1);
    const doorPublicKey = doorPublicKeys[0];
    const doorPrivateKey = [...Array(State.NUMBER_OF_COMPUTER_FILES).keys()]
      .map(index => State.getPrivateKey(state, index))
      .filter(privateKey => doorPublicKey.description.indexOf(privateKey) >= 0)[0];

    state = verify(State.dispatchAction(state, { type: 'MOVE', direction: State.Direction.NORTH_WEST }));
    state = verify(State.dispatchAction(state, { type: 'MOVE', direction: State.Direction.WEST_SOUTH_WEST }));
    state = verify(State.dispatchAction(state, { type: 'MOVE', direction: State.Direction.SOUTH }));
    state = verify(State.dispatchAction(state, { type: 'MOVE', direction: State.Direction.SOUTH_EAST }));
    state = verify(State.dispatchAction(state, { type: 'UNLOCK_DOOR', privateKey: doorPrivateKey }));

    expect(state.hasUnlockedDoor).toEqual(true);
  });
});
