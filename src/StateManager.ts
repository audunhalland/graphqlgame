import * as State from './game/state';

export class StateManager {
  constructor(
    readonly session: any,
  ) {}

  gameState(): State.State {
    if (this.session.state) {
      this.session.state = State.newGame();
    }
    return this.session.state;
  }

  updateState(state: State.State) {
    this.session.state = state;
  }
}
