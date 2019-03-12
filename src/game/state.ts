import * as GeneratePassword from 'generate-password';

const NUMBER_OF_COMPUTER_FILES = 8;

enum Room {
  COMPUTER,
  TULL_1,
  TULL_2,
  START,
  PASSWORD,
  TULL_3,
}

enum Direction {
  NORTH,
  NORTH_EAST,
  EAST,
  EAST_SOUTH_EAST,
  SOUTH_EAST,
  SOUTH_SOUTH_EAST,
  SOUTH,
  SOUTH_SOUTH_WEST,
  SOUTH_WEST,
  WEST_SOUTH_WEST,
  WEST,
  NORTH_WEST,
}

interface RoomNeigbour {
  direction: Direction;
  room: Room;
}

enum ObjectType {
  KEY_PAIR,
  ESCAPE_DOOR,
  SIGN,
  PASSWORD,
  COMPUTER,
}

interface GameObject {
  type: ObjectType,
  description: string;
}

interface KeyPair {
  public: string;
  private: string;
}

export interface State {
  currentRoom: Room;
  computerPassword: string;
  doorKey: KeyPair;
  computerFiles: KeyPair[];
  hasUnlockedComputer: boolean;
  hasUnlockedDoor: boolean;
}

interface UnlockComputerAction {
  type: "UNLOCK_COMPUTER";
  password: string;
};

interface UnlockDoorAction {
  type: "UNLOCK_DOOR";
  privateKey: string;
};

interface GotoRoomAction {
  type: "GOTO_ROOM";
  room: Room;
};

type Action = UnlockComputerAction | UnlockDoorAction | GotoRoomAction;

interface ActionResult {
  newState: State;
  ok: boolean;
  message: string;
};

// Everything listed in clockwise direction, starting out at noon
export const getRoomNeighbours = (room : Room): RoomNeigbour[] => {
  switch (room) {
    case Room.COMPUTER: {
      return [{
        direction: Direction.EAST_SOUTH_EAST,
        room: Room.TULL_1,
      }, {
        direction: Direction.SOUTH_SOUTH_EAST,
        room: Room.TULL_2,
      }, {
        direction: Direction.SOUTH_SOUTH_WEST,
        room: Room.PASSWORD,
      }, {
        direction: Direction.WEST_SOUTH_WEST,
        room: Room.TULL_3,
      }];
    }
    case Room.TULL_1: {
      return [{
        direction: Direction.SOUTH,
        room: Room.TULL_2,
      }, {
        direction: Direction.NORTH_WEST,
        room: Room.COMPUTER,
      }];
    }
    case Room.TULL_2: {
      return [{
        direction: Direction.NORTH,
        room: Room.TULL_1,
      }, {
        direction: Direction.SOUTH_WEST,
        room: Room.START,
      }, {
        direction: Direction.WEST,
        room: Room.PASSWORD,
      }, {
        direction: Direction.NORTH_WEST,
        room: Room.COMPUTER,
      }];
    }
    case Room.START: {
      return [{
        direction: Direction.NORTH_EAST,
        room: Room.TULL_2,
      }, {
        direction: Direction.NORTH_WEST,
        room: Room.PASSWORD,
      }];
    }
    case Room.PASSWORD: {
      return [{
        direction: Direction.NORTH,
        room: Room.TULL_3,
      }, {
        direction: Direction.NORTH_EAST,
        room: Room.COMPUTER,
      }, {
        direction: Direction.EAST,
        room: Room.TULL_2,
      }, {
        direction: Direction.SOUTH_EAST,
        room: Room.START,
      }];
    }
    case Room.TULL_3: {
      return [{
        direction: Direction.NORTH_EAST,
        room: Room.COMPUTER,
      }, {
        direction: Direction.SOUTH,
        room: Room.PASSWORD,
      }];
    }
  }
}

export const getRoomObjects = (state: State, room : Room): GameObject[] => {
  switch (room) {
    case Room.COMPUTER:
      return [{
        type: ObjectType.COMPUTER,
        description: state.hasUnlockedComputer
          ? 'A large mainframe computer. It is currently locked.'
          : 'A large mainframe computer. You have successfully unlocked it!',
      }];
    case Room.START:
      return [{
        type: ObjectType.ESCAPE_DOOR,
        description: "A big, locked door. It's blocking your exit from the labyrinth. On the door is a big sign with a code on it.",
      }];
    case Room.PASSWORD:
      return [{
        type: ObjectType.PASSWORD,
        description: `A root password. It says "${state.computerPassword}".`,
      }]
    default:
      return [];
  }
}

export const getSubObjects = (state: State, object: GameObject): GameObject[] => {
  switch (object.type) {
    case ObjectType.COMPUTER:
      if (state.hasUnlockedComputer) {
        return state.computerFiles.map(
          (keyPair) => ({
            type: ObjectType.KEY_PAIR,
            description: `A key pair. It says PUBLIC "${keyPair.public}", PRIVATE "${keyPair.private}".`,
          })
        );
      } else {
        return [];
      }
    case ObjectType.ESCAPE_DOOR:
      return [{
        type: ObjectType.SIGN,
        description: `A big sign on the door. It reads "public key: ${state.doorKey.public}"`,
      }];
    default:
      return [];
  }
}

export const newGame = (): State => {
  const computerFiles = [...Array(NUMBER_OF_COMPUTER_FILES).keys()].map(index => {
    return {
      public: GeneratePassword.generate({
        length: 20,
        numbers: true,
      }),
      private: GeneratePassword.generate({
        length: 40,
        numbers: true,
      }),
    }
  });
  return {
    currentRoom: Room.START,
    computerPassword: GeneratePassword.generate({
      length: 10,
      numbers: true,
    }),
    computerFiles: computerFiles,
    doorKey: computerFiles[Math.floor(Math.random()*computerFiles.length)],
    hasUnlockedComputer: false,
    hasUnlockedDoor: false,
  };
}

export const dispatchAction = (state: State, action: Action): ActionResult => {
  switch (action.type) {
    case 'UNLOCK_COMPUTER': {
      if (action.password === state.computerPassword) {
        return {
          newState: {
            ...state,
            hasUnlockedComputer: true,
          },
          ok: true,
          message: 'Computer unlocked!',
        };
      } else {
        return {
          newState: state,
          ok: false,
          message: 'Wrong password!',
        };
      }
    }
    case 'UNLOCK_DOOR': {
      if (action.privateKey === state.doorKey.private) {
        return {
          newState: {
            ...state,
            hasUnlockedDoor: true,
          },
          ok: true,
          message: 'Door unlocked! You finished the game!',
        };
      } else {
        return {
          newState: state,
          ok: false,
          message: 'Wrong private key!!',
        };
      }
    }
    case 'GOTO_ROOM': {
      if (getRoomNeighbours(state.currentRoom).filter(neighbour => neighbour.room === action.room).length > 0) {
        return {
          newState: {
            ...state,
            currentRoom: action.room,
          },
          ok: true,
          message: 'You moved to the room.',
        };
      } else {
        return {
          newState: state,
          ok: false,
          message: 'Cannot move directly to that room, because it is too far away. Try moving to an immediate neighbouring room instead.',
        };
      }
    }
  }
};
