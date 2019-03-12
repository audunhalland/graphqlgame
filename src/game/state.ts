import * as GeneratePassword from 'generate-password';
import { start } from 'repl';

const NUMBER_OF_COMPUTER_FILES = 8;

enum Room {
  COMPUTER,
  VERY_DARK,
  BUTTON,
  START,
  PASSWORD,
  SLIGHTLY_NOISY,
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
  hasPressedLightSwitch: boolean;
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
        room: Room.VERY_DARK,
      }, {
        direction: Direction.SOUTH_SOUTH_EAST,
        room: Room.BUTTON,
      }, {
        direction: Direction.SOUTH_SOUTH_WEST,
        room: Room.PASSWORD,
      }, {
        direction: Direction.WEST_SOUTH_WEST,
        room: Room.SLIGHTLY_NOISY,
      }];
    }
    case Room.VERY_DARK: {
      return [{
        direction: Direction.SOUTH,
        room: Room.BUTTON,
      }, {
        direction: Direction.NORTH_WEST,
        room: Room.COMPUTER,
      }];
    }
    case Room.BUTTON: {
      return [{
        direction: Direction.NORTH,
        room: Room.VERY_DARK,
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
        room: Room.BUTTON,
      }, {
        direction: Direction.NORTH_WEST,
        room: Room.PASSWORD,
      }];
    }
    case Room.PASSWORD: {
      return [{
        direction: Direction.NORTH,
        room: Room.SLIGHTLY_NOISY,
      }, {
        direction: Direction.NORTH_EAST,
        room: Room.COMPUTER,
      }, {
        direction: Direction.EAST,
        room: Room.BUTTON,
      }, {
        direction: Direction.SOUTH_EAST,
        room: Room.START,
      }];
    }
    case Room.SLIGHTLY_NOISY: {
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

export const getRoomDescription = (state: State, room: Room): string => {
  switch (room) {
    case Room.COMPUTER:
      return state.currentRoom === room
        ? 'You are in a large and noisy room. In front of you is a big mainframe computer. The noise comes from its large cooling fans. There are four corridors behind you.'
        : 'The computer room.';
    case Room.VERY_DARK:
      return state.currentRoom === room
        ? 'You are in a very dark room. You cannot see anything but the light from the other ends of the two corridors connecting to the room. There is nothing else here.'
        : 'A very dark room';
    case Room.BUTTON:
      return state.currentRoom === room
        ? 'You are in a room with four connecting corridors. On the wall there is a button.'
        : 'A room with a button on the wall.';
    case Room.START:
      return state.currentRoom === room
        ? 'Oh no. You are trapped in a room. Is it part of a labyrinth? There are two corridors leading out of the room. Behind you is an enormous locked door.'
        : 'A room with an enormous locked door.';
    case Room.PASSWORD:
      return state.hasPressedLightSwitch
        ?
        (state.currentRoom === room
          ? 'You are in a lit room. You see something (a note?) lying on the floor.'
          : 'A lit room'
        )
        :
        (state.currentRoom === room
          ? 'You are in a dark room, and because there is no lighting, you cannot see anything.'
          : 'A dark room'
        );
    default:
      return 'Nothing of particular interest here.';
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
    hasPressedLightSwitch: false,
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
