import { INotificationReducer } from "interfaces/commonInterfaces";
import { ACTION_TYPES } from "constants/actionTypes";

const initialState: INotificationReducer = {
  messages: [],
};

export function notificationReducer(state = initialState, action: any) {
  switch (action.type) {
    case ACTION_TYPES.SET_NOTIFICATIONS:
      return {
        messages: action.payload,
      };
    case ACTION_TYPES.SET_NOTIFICATION:
      return {
        messages: [
          ...state.messages,
          {
            message: action.payload.message,
            severity: action.payload.severity,
            key: new Date().getTime(),
            duration: action.payload.duration
          },
        ],
      };
    default:
      return state;
  }
}
