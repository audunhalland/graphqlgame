import * as State from './game/state';

export class StateManager {
  constructor(
    readonly session: any,
  ) {
  }

  getState(): State.State {
    console.log('Game state in session: ', this.session.gameState);

    if (!this.session.gameState) {
      console.log('Creating new game');
      const state = State.newGame();
      this.session.gameState = state;
      console.log('Stored state: ', this.session.gameState);
      return state;
    } else {
      return this.session.gameState;
    }
  }

  updateState(state: State.State) {
    this.session.gameState = state;
  }
}
