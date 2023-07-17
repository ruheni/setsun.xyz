import {
  createContext,
  createRef,
  useMemo,
  useRef,
  useCallback,
  useReducer,
  useEffect,
  Dispatch,
  RefObject,
} from "react";
import { Mesh } from "three";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";

interface Player {
  id: number;
  meshRef: RefObject<Mesh>;
}

interface PlayerMetadata {
  position: [number, number, number];
}

interface MultiplayerState {
  players: Player[];
}

enum MultiplayerActionTypes {
  ADD_PLAYER = "ADD_PLAYER",
  REMOVE_PLAYER = "REMOVE_PLAYER",
  UPDATE_PLAYER_METADATA = "UPDATE_PLAYER_METADATA",
}

type MultiplayerAction =
  | {
      type: MultiplayerActionTypes.ADD_PLAYER;
      payload: number[];
    }
  | {
      type: MultiplayerActionTypes.REMOVE_PLAYER;
      payload: number[];
    };

type MultiplayerReducer = (
  state: MultiplayerState,
  action: MultiplayerAction
) => MultiplayerState;

const initialState: MultiplayerState = {
  players: [],
};

const multiplayerReducer: MultiplayerReducer = (state, action) => {
  switch (action.type) {
    case MultiplayerActionTypes.ADD_PLAYER: {
      // todo: check if there is a better way to check duplicates
      const existingPlayerIds = new Set(state.players.map(({ id }) => id));
      const newPlayerIds = action.payload.filter(
        (id) => !existingPlayerIds.has(id)
      );

      const newPlayers = newPlayerIds.map((id) => ({
        id,
        meshRef: createRef<Mesh>(),
      }));

      return {
        ...state,
        players: [...state.players, ...newPlayers],
      };
    }
    case MultiplayerActionTypes.REMOVE_PLAYER: {
      const removedPlayerIds = new Set(action.payload);

      return {
        ...state,
        players: state.players.filter(({ id }) => !removedPlayerIds.has(id)),
      };
    }
    default: {
      return state;
    }
  }
};

const MultiplayerContext = createContext<{
  state: MultiplayerState;
  dispatch: Dispatch<MultiplayerAction>;
  onBroadcastLocalPlayerState: (data: PlayerMetadata) => void;
  getPlayerStates: () => Map<number, any>;
}>(null!);

interface Props {
  children: React.ReactNode;
  roomName: string;
  signalingServerUrl: string;
}

// todo: still in progress
const MultiplayerContextProvider = ({
  children,
  roomName,
  signalingServerUrl,
}: Props) => {
  const [state, dispatch] = useReducer<MultiplayerReducer>(
    multiplayerReducer,
    initialState
  );

  const { yDoc, yNetworkProvider } = useMemo(() => {
    const yDoc = new Y.Doc();
    const yNetworkProvider = new WebrtcProvider(roomName, yDoc, {
      signaling: [signalingServerUrl],
    });

    return { yDoc, yNetworkProvider };
  }, [roomName, signalingServerUrl]);

  useEffect(() => {
    // add the current player to the state
    const currentClientId = yDoc.clientID;
    dispatch({
      type: MultiplayerActionTypes.ADD_PLAYER,
      payload: [currentClientId],
    });

    yNetworkProvider.awareness.on("change", (changes) => {
      const { added, removed } = changes;

      if (added.length > 0) {
        dispatch({ type: MultiplayerActionTypes.ADD_PLAYER, payload: added });
      }

      if (removed.length > 0) {
        dispatch({
          type: MultiplayerActionTypes.REMOVE_PLAYER,
          payload: removed,
        });
      }
    });
  }, [yDoc, yNetworkProvider]);

  const onBroadcastLocalPlayerState = useCallback(
    (data: PlayerMetadata) => {
      yNetworkProvider.awareness.setLocalStateField("user", {
        position: data.position,
      });
    },
    [yNetworkProvider]
  );

  const getPlayerStates = useCallback(() => {
    return yNetworkProvider.awareness.getStates();
  }, [yNetworkProvider]);

  return (
    <MultiplayerContext.Provider
      value={{ state, dispatch, onBroadcastLocalPlayerState, getPlayerStates }}
    >
      {children}
    </MultiplayerContext.Provider>
  );
};

export { MultiplayerContext, MultiplayerContextProvider };