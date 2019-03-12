
enum Room {
  COMPUTER,
  TULL_1,
  TULL_2,
  START,
  PASSWORD,
  TULL_3,
}

interface RoomNeigbour {
  direction: string;
  room: Room;
};

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
};

interface KeyPair {
  public: string;
  private: string;
}

interface State {
  currentRoom: Room;
  computerPassword: string;
  doorKey: KeyPair;
  computerFiles: KeyPair[];
  hasUnlockedComputer: boolean;
  hasUnlockedDoor: boolean;
};

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

export const getRoomNeighbours = (room : Room) => {
  return [{
    direction: 'N',
    room: Room.COMPUTER,
  }];
}

export const getRoomObjects = (state: State, room : Room): GameObject[] => {
  switch (room) {
    case Room.COMPUTER:
      return [{
        type: ObjectType.COMPUTER,
        description: 'A large computer',
      }];
    case Room.START:
      return [{
        type: ObjectType.ESCAPE_DOOR,
        description: 'A big, closed door.'
      }];
    case Room.PASSWORD:
      return [{
        type: ObjectType.PASSWORD,
        description: `A root password. The password is "${state.computerPassword}"`,
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
        description: `A sign. It prints "${state.doorKey.public}"`,
      }];
    default:
      return [];
  }
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
        }
      } else {
        return {
          newState: state,
          ok: false,
          message: 'Wrong password!',
        }
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
          message: 'You moved to the new location',
        };
      } else {
        return {
          newState: state,
          ok: false,
          message: 'Cannot move to this location because it is not a neighbour',
        }
      }
    }
  }
};
