/**
 * @class       : common
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Monday Jan 07, 2019 18:44:19 IST
 * @description : common
 */

import { ActionStatus } from '../actions/action';
import { MessageType } from '../actions/MessageActions';
import { UserActionTypes } from '../actions/UserActions';

const defaultState = {
  pendingRequestCount: 0,
  taskInProgress: null,
  userMessage: null,
  action: null,
};

const api = (state = defaultState, action) => {
  if (action.type === UserActionTypes.REMOVE_USER &&
    action.actionStatus === ActionStatus.COMPLETE_WITH_SUCCESS) {
    return defaultState;
  }
  // handle message styling based on message type
  if (action.type === MessageType.SHOW_INFO_MESSAGE
    || action.type === MessageType.SHOW_ERROR_MESSAGE
    || action.type === MessageType.SHOW_WARNING_MESSAGE) {
    return Object.assign({}, state, { userMessage: action.payload });
  } else if (action.type === MessageType.CLEAR_MESSAGE) {
    return Object.assign({}, state, { userMessage: null });
  }

  if (action.actionStatus === ActionStatus.IN_PROGRESS) {
    return Object.assign({},
      state, {
        pendingRequestCount: state.pendingRequestCount + 1,
        userMessage: null,
        action: JSON.stringify(action),
        taskInProgress: action.message,
      });
  } else if (action.actionStatus === ActionStatus.COMPLETE_WITH_ERROR) {
    let errorMessage = null;
    if (action.error instanceof Error) {
      errorMessage = action.error.message;
    } else {
      errorMessage = action.error;
    }
    return Object.assign({}, state, {
      pendingRequestCount: state.pendingRequestCount > 0 ? state.pendingRequestCount - 1 : 0,
      userMessage: errorMessage ? { message: errorMessage, title: 'Error' } : null,
      action: JSON.stringify(action)
    });
  } else if (action.actionStatus === ActionStatus.COMPLETE_WITH_SUCCESS) {
    return Object.assign({}, state, {
      pendingRequestCount: state.pendingRequestCount > 0 ? state.pendingRequestCount - 1 : 0,
      action: JSON.stringify(action)
    });
  } else {
    return state;
  }
}

export default api;
